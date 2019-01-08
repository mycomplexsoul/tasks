import ConnectionService from "./ConnectionService";
import { MoSQL } from "./MoSQL";
import { Entry } from "../crosscommon/entities/Entry";
import iConnection from "./iConnection";
import { Balance } from "../crosscommon/entities/Balance";
import { iEntity } from "../crosscommon/iEntity";
import { DateUtils } from "../crosscommon/DateUtility";

export class BalanceModule {
    getAllForMonth(balanceList: Balance[], year: number, month: number) : Balance[]{
        return balanceList.filter((b) => b.bal_year === year && b.bal_month === month);
    }

    rebuild(year: number, month: number, user: string): Promise<any>{
        const connection: iConnection = ConnectionService.getConnection();
        const entryModel: Entry = new Entry();
        const balanceModel: Balance = new Balance();
        const sqlMotor: MoSQL = new MoSQL();
        const models: iEntity[] = [entryModel, balanceModel];
        console.log(`--rebuild balance for ${year}-${month}`);
        
        return Promise.all(connection.runSqlArray(models.map((model: iEntity) => {
            return sqlMotor.toSelectSQL(JSON.stringify({ cont:[{f: '_id_user', op: 'eq', val: user }]}), model);
        }))).then((response) => {
            let entryList: Entry[] = response[0].rows;
            let balanceList: Balance[] = response[1].rows.map((r: any) => new Balance(r));
            let originalBalanceList: Balance[] = response[1].rows.map((r: any) => new Balance(r));
            console.log(`entries fetched`, entryList.length);

            let newBalanceList: Balance[] = [];
            let updateBalanceList: Balance[] = [];
            let found: number;
            let isNew: number;
            
            let monthEntryList: Entry[] = entryList.filter((e) => e.ent_date.getFullYear() === year && e.ent_date.getMonth()+1 === month);
            let balance: Array<Balance> = [...this.getAllForMonth(balanceList, year, month)];
            
            balance.forEach((b: Balance) => {
                b.bal_charges = 0;
                b.bal_withdrawals = 0;
                b.bal_final = b.bal_initial;
            });
    
            // add up
            monthEntryList.forEach((e: Entry) => {
                let b: Balance = balance.find(b => b.bal_id_account === e.ent_id_account);
    
                if (b) { // exists a balance, add entry amount
                    b.bal_charges += e.ent_ctg_type === 2 ? e.ent_amount : 0;
                    b.bal_withdrawals += e.ent_ctg_type === 1 ? e.ent_amount : 0;
                    b.bal_final += e.ent_ctg_type === 1 ? -1 * e.ent_amount : e.ent_amount;
                    b.bal_date_mod = new Date();

                    found = updateBalanceList.findIndex(balance => balance.bal_id_account === b.bal_id_account);
                    isNew = newBalanceList.findIndex(nb => nb.bal_year === b.bal_year && nb.bal_month === b.bal_month && nb.bal_id_account === b.bal_id_account);
                    // if a record in newBalance exists in updateBalance, move the one in updateBalance to newBalance
                    if (isNew === -1){
                        if (found === -1){
                            updateBalanceList.push(b);
                        } else {
                            updateBalanceList[found] = b;
                        }
                    } else {
                        newBalanceList[isNew] = b;
                    }
                } else { // balance does not exist, create one with amount and add it to list
                    b = new Balance();
                    b.bal_year = year;
                    b.bal_month = month;
                    b.bal_id_account = e.ent_id_account;
                    b.bal_ctg_currency = 1;
                    b.bal_initial = 0;
                    b.bal_charges = e.ent_ctg_type === 2 ? e.ent_amount : 0;
                    b.bal_withdrawals = e.ent_ctg_type === 1 ? e.ent_amount : 0;
                    b.bal_final = b.bal_charges - b.bal_withdrawals;
                    b.bal_id_user = e.ent_id_user;
                    b.bal_date_add = new Date();
                    b.bal_date_mod = new Date();
                    b.bal_ctg_status = 1;
                    b.bal_txt_account = e.ent_txt_account;
    
                    newBalanceList.push(b);
                    balance.push(b);
                }
            });

            console.log(`previous, new balance`, newBalanceList.length);
            console.log(`previous, update balance`, updateBalanceList.length);
            
            const all_sql: string[] = [
                ...newBalanceList.map((bal) => sqlMotor.toInsertSQL(bal))
                , ...updateBalanceList.map((bal) => sqlMotor.toUpdateSQL(bal, originalBalanceList.find(b => {
                    return b.bal_year === bal.bal_year && b.bal_month === bal.bal_month && b.bal_id_account === bal.bal_id_account;
                })))
            ];
            return Promise.all(connection.runSqlArray(all_sql)).then(response => {
                console.log(`inserted ${newBalanceList.length}, updated ${updateBalanceList.length}`);
                return true;
            }).catch(err => {
                console.log(`error ${err}`);
                return false;
            });
        }).catch(err => {
            console.log(`error ${err}`);
            return false;
        });
    }

    transfer(year: number, month: number, user: string): Promise<any>{
        const connection: iConnection = ConnectionService.getConnection();
        const balanceModel: Balance = new Balance();
        const sqlMotor: MoSQL = new MoSQL();
        const models: iEntity[] = [balanceModel];
        console.log(`--- Transfer balance for month ${year}-${month}`);
        
        return Promise.all(connection.runSqlArray(models.map((model: iEntity) => {
            return sqlMotor.toSelectSQL(JSON.stringify({ cont:[{f: '_id_user', op: 'eq', val: user }]}), model);
        }))).then((response) => {
            let balanceList: Balance[] = response[0].rows.map((r: any) => new Balance(r));;
            console.log(`balance records found as baseline: ${balanceList.length}`);

            let newBalanceList: Balance[] = [];
            let updateBalanceList: Balance[] = [];
            let found: number;
            
            let currentDate = new Date();
            if (year * 100 + month >= currentDate.getFullYear() * 100 + currentDate.getMonth() + 1){
                // cannot transfer current month
                console.log('can not transfer because this is current month');
                return;
            }
            let balanceCurrent: Array<Balance> = this.getAllForMonth(balanceList, year, month);
            let nextMonth = this.getNextMonth(year, month);
            let balanceNext: Array<Balance> = this.getAllForMonth(balanceList, nextMonth.year, nextMonth.month);

            balanceCurrent.forEach((bc: Balance) => {
                let bn: Balance = new Balance(balanceNext.find(b => b.bal_id_account === bc.bal_id_account));

                if(bn){
                    if (bn.bal_initial !== bc.bal_final) {
                        bn.bal_initial = bc.bal_final;
                        bn.bal_final = bn.bal_initial + bn.bal_charges - bn.bal_withdrawals;
    
                        found = updateBalanceList.findIndex(balance => balance.bal_id_account === bn.bal_id_account);
                        if (found === -1){
                            updateBalanceList.push(bn);
                        } else {
                            updateBalanceList[found] = bn;
                        }
                    } else {
                        // no need to update
                    }
                } else {
                    bn = new Balance();
                    bn.bal_year = nextMonth.year;
                    bn.bal_month = nextMonth.month;
                    bn.bal_id_account = bc.bal_id_account;
                    bn.bal_ctg_currency = bc.bal_ctg_currency;
                    bn.bal_initial = bc.bal_final;
                    bn.bal_charges = 0;
                    bn.bal_withdrawals = 0;
                    bn.bal_final = bc.bal_final;
                    bn.bal_id_user = user;
                    bn.bal_date_add = bc.bal_date_add;
                    bn.bal_date_mod = new Date();
                    bn.bal_ctg_status = bc.bal_ctg_status;
                    bn.bal_txt_account = bc.bal_txt_account;
                    
                    newBalanceList.push(bn);
                }
            });
            console.log(`new balance to insert: ${newBalanceList.length}`);
            console.log(`balance to update: ${updateBalanceList.length}`);

            const all_sql: string[] = [
                ...newBalanceList.map((balance) => sqlMotor.toInsertSQL(balance))
                , ...updateBalanceList.map((balance) => {
                    const baseBalance: Balance = balanceList.find(b => {
                        return b.bal_year === balance.bal_year && b.bal_month === balance.bal_month && b.bal_id_account === balance.bal_id_account;
                    });
                    const changesObject = sqlMotor.toChangesObject(balance, baseBalance);
                    if (!changesObject.length) {
                        return null;
                    }
                    return sqlMotor.toUpdateSQL(balance, baseBalance);
                })
            ];
            return Promise.all(connection.runSqlArray(all_sql)).then(response => {
                console.log(`inserted ${newBalanceList.length}, updated ${updateBalanceList.length}`);
                return true;
            }).catch(err => {
                console.error(`error ${err}`);
                return false;
            });
        }).catch(err => {
            console.error(`error ${err}`);
            return false;
        });
    }

    rebuildAndTransfer(year: number, month: number, user: string){
        this.rebuild(year, month, user);
        this.transfer(year, month, user);
    }

    async rebuildAndTransferRange(yearInitial: number, monthInitial: number, yearFinal: number, monthFinal: number, user: string){
        let control = {
            year: yearInitial
            , month: monthInitial
            , iterable: yearInitial * 100 + monthInitial
        }
        while(control.iterable <= yearFinal * 100 + monthFinal){
            await this.rebuild(control.year, control.month, user);
            await this.transfer(control.year, control.month, user);
            control = this.getNextMonth(control.year, control.month);
        }
    }

    getNextMonth(year: number, month: number){
        if (month === 12){
            return {
                year: year + 1
                , month: 1
                , iterable: (year + 1) * 100 + 1
            };
        } else {
            return {
                year
                , month: month + 1
                , iterable: (year * 100) + month + 1
            };
        }
    }

    rebuildWithSQL(year: number, month: number, user: string){ // TODO: complete all sql flow
        const connection: iConnection = ConnectionService.getConnection();
        let sql: string = `update balance set bal_charges = 0, bal_withdrawals = 0, bal_final = 0
            where bal_year = ${year} and bal_month = ${month} and bal_id_user = '${user}'`;
        
        connection.runSql(sql).then(response => {
            sql = `select sum(*) from entry where ... group by account`;
        });
    }

    applyEntriesToBalance(entryList: Entry[], user: string): Promise<any>{
        console.log(`--- Apply Entries to Balance, user: ${user}, entries: `, entryList);
        const connection: iConnection = ConnectionService.getConnection();
        const balanceModel: Balance = new Balance();
        const sqlMotor: MoSQL = new MoSQL();
        const models: iEntity[] = [balanceModel];
        let year: number = (new Date(entryList.map(e => e.ent_date.getTime()).sort()[0])).getFullYear();
        let month: number = (new Date(entryList.map(e => e.ent_date.getTime()).sort()[0])).getMonth() + 1;
        let iterable: {
            year: number,
            month: number,
            iterable: number
        } = {
            year,
            month,
            iterable: (year * 100) + month
        };
        
        const finalYear: number = (new Date()).getFullYear(); //(new Date(entryList.map(e => e.ent_date.getTime()).sort().reverse()[0])).getFullYear();
        const finalMonth: number = (new Date()).getMonth() + 1;//(new Date(entryList.map(e => e.ent_date.getTime()).sort().reverse()[0])).getMonth() + 1;
        const finalIterable: number = finalYear * 100 + finalMonth;

        console.log(`found oldest entry to be from month: ${year}/${month}`);
        console.log(`and found latest entry from month: ${finalYear}/${finalMonth}`);
        
        return Promise.all(connection.runSqlArray(models.map((model: iEntity) => {
            return sqlMotor.toSelectSQL(JSON.stringify({ cont:[{f: '_id_user', op: 'eq', val: user }]}), model);
        }))).then((response) => {
            let balanceList: Balance[] = response[0].rows.map((r: any) => new Balance(r));
            let originalBalanceList: Balance[] = response[0].rows.map((r: any) => new Balance(r));
            console.log(`Balance records found as baseline: ${balanceList.length}`);

            let newBalanceList: Balance[] = [];
            let updateBalanceList: Balance[] = [];
            let found: number;
            let isNew: number;
            const round = (obj: any, fieldName: string) => {
                obj[fieldName] = Math.round(obj[fieldName] * 100) / 100;
            }
            
            while (iterable.iterable <= finalIterable){
                console.log(`-- Applying entries to balance iteration: ${iterable.iterable}, limit: ${finalIterable}`);
                let monthEntryList: Entry[] = entryList.filter((e) => e.ent_date.getFullYear() === iterable.year && e.ent_date.getMonth()+1 === iterable.month);
                let balance: Array<Balance> = [...this.getAllForMonth(balanceList, iterable.year, iterable.month)];

                console.log(`Entries to be processed in this iteration: ${monthEntryList.length}`);
                // add up
                monthEntryList.forEach((e: Entry) => {
                    console.log(`Entry to be processed`, e);
                    let b: Balance = balance.find(b => b.bal_id_account === e.ent_id_account);
        
                    if (b) { // exists a balance, add entry amount
                        console.log(`Balance found for entry`, b);
                        b.bal_charges += e.ent_ctg_type === 2 ? e.ent_amount : 0;
                        b.bal_withdrawals += e.ent_ctg_type === 1 ? e.ent_amount : 0;
                        b.bal_final += e.ent_ctg_type === 1 ? -1 * e.ent_amount : e.ent_amount;
                        b.bal_date_mod = new Date();
                        round(b, 'bal_charges');
                        round(b, 'bal_withdrawals');
                        round(b, 'bal_final');
    
                        found = updateBalanceList.findIndex(balance => balance.bal_id_account === b.bal_id_account);
                        isNew = newBalanceList.findIndex(nb => nb.bal_year === b.bal_year && nb.bal_month === b.bal_month && nb.bal_id_account === b.bal_id_account);
                        // if a record in newBalance exists in updateBalance, move the one in updateBalance to newBalance
                        if (isNew === -1){
                            if (found === -1){
                                console.log(`Balance pushed for update with new values`, b);
                                updateBalanceList.push(b);
                            } else {
                                console.log(`Balance updated in updateArray for update with new values`, b);
                                updateBalanceList[found] = b;
                            }
                        } else {
                            console.log(`Balance pushed as new for update flow with new values`, b);
                            newBalanceList[isNew] = b;
                        }
                    } else { // balance does not exist, create one with amount and add it to list
                        b = new Balance();
                        b.bal_year = year;
                        b.bal_month = month;
                        b.bal_id_account = e.ent_id_account;
                        b.bal_ctg_currency = 1;
                        b.bal_initial = 0;
                        b.bal_charges = e.ent_ctg_type === 2 ? e.ent_amount : 0;
                        b.bal_withdrawals = e.ent_ctg_type === 1 ? e.ent_amount : 0;
                        b.bal_final = b.bal_charges - b.bal_withdrawals;
                        b.bal_id_user = e.ent_id_user;
                        b.bal_date_add = new Date();
                        b.bal_date_mod = new Date();
                        b.bal_ctg_status = 1;
                        b.bal_txt_account = e.ent_txt_account;
        
                        newBalanceList.push(b);
                        balance.push(b);
                    }
                });

                // transfer if iterable allows another iteration
                if (iterable.iterable < finalIterable){
                    const nextIterable = this.getNextMonth(iterable.year, iterable.month);
                    // transfer current month balance to the next month
                    newBalanceList = [
                        ...newBalanceList
                        , ...newBalanceList.filter(nb =>
                            nb.bal_year === iterable.year && nb.bal_month === iterable.month
                        ).map(nb => {
                            let n: Balance = new Balance(nb);
                            n.bal_year = nextIterable.year;
                            n.bal_month = nextIterable.month;
                            n.bal_initial = n.bal_final;
                            n.bal_charges = 0;
                            n.bal_withdrawals = 0;
                            return n;
                        })
                    ];

                    // add up current month existing balance to the next month
                    updateBalanceList = [
                        ...updateBalanceList
                        , ...updateBalanceList.filter(ub => 
                            ub.bal_year === iterable.year && ub.bal_month === iterable.month
                        ).map(u => {
                            const n: Balance = new Balance(u);
                            const ob: Balance = new Balance(originalBalanceList.find(ob => 
                                ob.bal_year === nextIterable.year && ob.bal_month === nextIterable.month && ob.bal_id_account === u.bal_id_account
                            ));
                            ob.bal_initial = n.bal_final;
                            ob.bal_final = ob.bal_initial + ob.bal_charges - ob.bal_withdrawals;
                            console.log('transfered balance is:', ob);
                            return ob;
                        })
                    ];
                }

                iterable = this.getNextMonth(iterable.year, iterable.month);
            }

            console.log(`previous, new balance`, newBalanceList.length);
            console.log(`previous, update balance`, updateBalanceList.length);
            console.log(`update balance details:`, updateBalanceList);
            
            const all_sql: string[] = [
                ...newBalanceList.map((bal) => sqlMotor.toInsertSQL(bal))
                , ...updateBalanceList.map((bal) => {
                    const baseBalance: Balance = originalBalanceList.find(b => {
                        return b.bal_year === bal.bal_year && b.bal_month === bal.bal_month && b.bal_id_account === bal.bal_id_account;
                    });
                    return sqlMotor.toUpdateSQL(bal, baseBalance);
                })
            ];
            console.log(`this is all sql to update`, all_sql);
            return Promise.all(connection.runSqlArray(all_sql)).then(response => {
                console.log(`inserted ${newBalanceList.length}, updated ${updateBalanceList.length}`);
                return true;
            }).catch(err => {
                console.error(`error on running sql for balance: ${err}`);
                return false;
            });
        }).catch(err => {
            console.error(`error ${err}`);
            return false;
        });
    }
}