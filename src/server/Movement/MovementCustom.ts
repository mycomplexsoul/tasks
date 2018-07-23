// import { IncomingMessage, ServerResponse } from "http";
import { Category } from "../../crosscommon/entities/Category";
import { Place } from "../../crosscommon/entities/Place";
import { Account } from "../../crosscommon/entities/Account";
import { Movement } from "../../crosscommon/entities/Movement";
import { Catalog } from "../../crosscommon/entities/Catalog";
import * as movementsImport from '../movements-import';
import { MoSQL } from "../MoSQL";
import iConnection from "../iConnection";
import { iEntity } from "../../crosscommon/iEntity";
import { Utils } from "../../crosscommon/Utility";
import { Entry } from "../../crosscommon/entities/Entry";
import { Balance } from "../../crosscommon/entities/Balance";
import { iNode } from "../iNode";
import { BalanceModule } from "../BalanceModule";
import ConnectionService from "../ConnectionService";
import { ApiModule } from "../ApiModule";

export class MovementCustom {
    findIn = <T>(arr: T[], findCriteria: (e: T) => boolean, returnField: string) => {
        const f = arr.filter((e) => findCriteria(e));
        if (f.length) {
            return f[0][returnField];
        } else {
            return undefined;
        }
    }

    stringDateToDate = (date: string) => {
        if(/\d{4}-\d{2}-\d{2}/.test(date)){ // looks like a date
            const s: Array<string> = date.split('-');
            return new Date(parseInt(s[0]),parseInt(s[1])-1,parseInt(s[2]));
        }
        return undefined;
    }

    import = (node: iNode) => {
        let connection: iConnection = ConnectionService.getConnection();
        const user: string = 'anon';

        let categoryModel: Category = new Category();
        let placeModel: Place = new Place();
        let accountModel: Account = new Account();
        let movementModel: Movement = new Movement();
        let catalogModel: Catalog = new Catalog();

        let categoryList: Array<Category>;
        let placeList: Array<Place>;
        let accountList: Array<Account>;
        let movementList: Array<Movement>;
        let catalogList: Array<Catalog>;

        let sqlMotor: MoSQL;
        const models: Array<iEntity> = [categoryModel, placeModel, accountModel, movementModel, catalogModel];

        Promise.all(connection.runSqlArray(models.map((model: iEntity) => {
            sqlMotor = new MoSQL(model);
            return sqlMotor.toSelectSQL(JSON.stringify({ cont:[{f: '_id_user', op: 'eq', val: user }]})); // TODO: criteria with underscore should add prefix, if field is not in entity ignore criteria
        }))).then(response => {
            // We have all data from database now
            categoryList = response[0].rows;
            placeList = response[1].rows;
            accountList = response[2].rows;
            movementList = response[3].rows;
            catalogList = response[4].rows;

            const catalogTypesList: Array<Catalog> = catalogList.filter((elem: Catalog) => elem.ctg_id === 'MOVEMENT_TYPES');
            const catalogStatusList: Array<Catalog> = catalogList.filter((elem: Catalog) => elem.ctg_id === 'RECORD_STATUS'); // TODO: confirm if these status are ok or create a new one

            let m: Movement;
            let transferFlag: boolean = false;
            let yearInitial: number = 9999;
            let monthInitial: number = 0;
            let yearFinal: number = (new Date()).getFullYear();
            let monthFinal: number = (new Date()).getMonth() + 1;

            /*let sqlCategory = new MoSQL(categoryModel);
            let sqlPlace = new MoSQL(placeModel);
            let sqlMovement = new MoSQL(movementModel);*/

            let newCategoriesList: Array<Category> = [];
            let newPlacesList: Array<Place> = [];
            let newMovementList: Array<Movement> = [];

            const newCategoryHelper = (name: string): Category => { // TODO: move this to MoOperaSQL
                const d = new Date();
                let elem = new Category({
                    mct_id: Utils.hashId(categoryModel.metadata.prefix) // TODO: Change id definition to length 32
                    , mct_name: name
                    , mct_id_user: user
                    , mct_date_add: d
                    , mct_date_mod: d
                    , mct_ctg_status: 1
                });
                return elem;
            };

            const newPlaceHelper = (name: string): Place => { // TODO: move this to MoOperaSQL
                const d = new Date();
                let elem = new Place({
                    mpl_id: Utils.hashId(placeModel.metadata.prefix) // TODO: Change id definition to length 32
                    , mpl_name: name
                    , mpl_id_user: user
                    , mpl_date_add: d
                    , mpl_date_mod: d
                    , mpl_ctg_status: 1
                });
                return elem;
            };

            movementsImport.movements.forEach((rawMov: string) => {
                // Get individual values for current movement
                let values: Array<string> = rawMov.split('|');

                // If category does not exist, create it
                if (!this.findIn(categoryList, (e: Category) => e.mct_name === values[5], 'mct_id') &&
                    !this.findIn(newCategoriesList, (e: Category) => e.mct_name === values[5], 'mct_id')){
                    newCategoriesList.push(newCategoryHelper(values[5]));
                }

                // If place does not exist, create it
                if (!this.findIn(placeList, (e: Place) => e.mpl_name === values[6], 'mpl_id') &&
                    !this.findIn(newPlacesList, (e: Place) => e.mpl_name === values[6], 'mpl_id')){
                    newPlacesList.push(newPlaceHelper(values[6]));
                }
            });

            const all_sql = [
                ...newCategoriesList.map((elem: Category) => sqlMotor.toInsertSQL(elem))
                , ...newPlacesList.map((elem: Place) => sqlMotor.toInsertSQL(elem))
            ];

            // save categories to storage
            Promise.all(connection.runSqlArray(all_sql)).then(response => {
                // all new categories are saved now
                // append new categories to current listing
                categoryList = categoryList.concat(newCategoriesList);
                placeList = placeList.concat(newPlacesList);

                // iterate again over movements
                movementsImport.movements.forEach((rawMov: string, index: number, arr: String[]) => {
                    try {
                        // raw data
                        let values: Array<string> = rawMov.split('|');

                        // Reads transfer flag to skip this record because the previous one already took care of the transfer
                        if (transferFlag && values[5] === 'Traspaso'){
                            transferFlag = false;
                            return;
                        }
                        m = new Movement();
                        
                        m.mov_desc = values[7];
                        m.mov_amount = parseFloat(values[3]);
                        if (this.findIn(accountList, (e: Account) => e.acc_name === values[1], 'acc_id')){
                            m.mov_id_account = this.findIn(accountList, (e: Account) => e.acc_name == values[1], 'acc_id');
                        } else {
                            console.log('Account not found', values[1], rawMov); // TODO: use intern logger
                        }
                        m.mov_date = this.stringDateToDate(values[0]);
                        m.mov_id = Utils.hashId(movementModel.metadata.prefix, 32, m.mov_date);
                        m.mov_ctg_currency = 1; // fixed

                        // Here we are getting from all movements' dates the lowest pair (year, month) to be used for Rebuild and Transfer processes
                        if (yearInitial * 100 + monthInitial > m.mov_date.getFullYear() * 100 + (m.mov_date.getMonth() + 1)){
                            yearInitial = m.mov_date.getFullYear();
                            monthInitial = m.mov_date.getMonth() + 1;
                        }

                        // Transfer flow
                        // The ones flagged as Transfer whose next record is also a Transfer
                        // Also the amounts/description between the two must be the same
                        if (values[5] === 'Traspaso' && arr[index+1] && arr[index+1].split('|')[5] === "Traspaso" && arr[index+1].split('|')[7] === values[7] && arr[index+1].split('|')[3] === values[3]){
                            transferFlag = true; // Sets transfer flag to skip next record on next iteration
                            m.mov_ctg_type = 3;
                            // peek next item to get the destination Account
                            m.mov_id_account_to = this.findIn(accountList, (e: Account) => e.acc_name == arr[index+1].split('|')[1], 'acc_id');
                            
                            // Transfers always have to be expense first, income later, fix when provided the other way around
                            if (values[2] === 'CARGO'){
                                // swap accounts
                                let temp = m.mov_id_account;
                                m.mov_id_account = m.mov_id_account_to;
                                m.mov_id_account_to = temp;
                            }

                            // Transfers do not use these
                            m.mov_id_category = '0'; // TODO: what can we assign here, because value can't be null
                            m.mov_id_place = '0';
                        } else { // Not a transfer
                            m.mov_ctg_type = values[2] === 'ABONO' ? 1 : 2; // TODO: set from types catalog
                            m.mov_budget = '' + ((m.mov_date.getFullYear() * 100) + (m.mov_date.getMonth() + 1)); // TODO: is this ok?
                            m.mov_id_category = this.findIn(categoryList, (e: Category) => e.mct_name === values[5], 'mct_id');
                            m.mov_id_place = this.findIn(placeList, (e: Place) => e.mpl_name === values[6], 'mpl_id');
                        }

                        m.mov_notes = '';
                        m.mov_id_user = user;
                        m.mov_ctg_status = 1;
                        let date = new Date();
                        m.mov_date_add = date;
                        m.mov_date_mod = date;

                        // Sets view fields
                        m.mov_txt_account = this.findIn(accountList,(e: Account) => e.acc_id === m.mov_id_account,'acc_name');
                        if (m.mov_id_account_to){
                            m.mov_txt_account_to = this.findIn(accountList,(e: Account) => e.acc_id === m.mov_id_account_to,'acc_name');
                        }
                        m.mov_txt_type = this.findIn(catalogTypesList,(e: Catalog) =>  e.ctg_sequential === m.mov_ctg_type,'ctg_name');
                        //m.mov_txt_budget = m.mov_budget;
                        m.mov_txt_category = this.findIn(categoryList,(e: Category) => e.mct_id === m.mov_id_category,'mct_name');
                        m.mov_txt_place = this.findIn(placeList,(e: Place) => e.mpl_id === m.mov_id_place,'mpl_name');
                        m.mov_txt_status = this.findIn(catalogStatusList,(e: Catalog) =>  e.ctg_sequential === m.mov_ctg_status,'ctg_name');
                        
                        newMovementList.push(m);
                    } catch(err) {
                        // TODO: Use intern logger
                    }
                });

                Promise.all(connection.runSqlArray(newMovementList.map((elem: Movement) => sqlMotor.toInsertSQL(elem)))).then(response => {
                    // All new movements inserted
                    connection.close();
                    node.response.end(JSON.stringify({operationOk: true, message: `Batch finished, inserted ok: ${movementList.length}, errors: ${0}`}));
                });
            }).catch(err => {
                // TODO: Some category/place had an error on inserting, abort until that is fixed
                node.response.end(JSON.stringify({operationOk: false, message: `error ${err}`}));
            });
        }).catch(err => {
            console.log(`An error ocurred while fetching initial data from database, error is: ${err}`);
            node.response.end(JSON.stringify({operationOk: false, message: `error ${err}`}));
        });

        // TODO: generate entries and balance (should be in another route?)
        return true;
    }

    generateEntries = (movementList: Movement[]): Promise<any> => {
        const connection: iConnection = ConnectionService.getConnection();
        const sqlMotor: MoSQL = new MoSQL();
        console.log('movements to process', movementList.length);
        
        // iterate movements
        let entryList: Array<Entry> = [];
        movementList.forEach((m: Movement, index: number, arr: any[]) => {
            // generate entry 1
            entryList.push(new Entry({
                ent_id: m.mov_id
                , ent_sequential: 1
                , ent_date: m.mov_date
                , ent_desc: m.mov_desc
                , ent_ctg_currency: 1 // static until Multi-currency
                , ent_amount: m.mov_amount
                , ent_id_account: m.mov_id_account
                , ent_ctg_type: m.mov_ctg_type === 3 ? 1 : m.mov_ctg_type
                , ent_budget: m.mov_budget
                , ent_id_category: m.mov_id_category
                , ent_id_place: m.mov_id_place
                , ent_notes: m.mov_notes
                , ent_id_user: m.mov_id_user
                , ent_date_add: m.mov_date_add
                , ent_date_mod: m.mov_date_mod
                , ent_ctg_status: m.mov_ctg_status
            }));
            // generate entry 2
            entryList.push(new Entry({
                ent_id: m.mov_id
                , ent_sequential: 2
                , ent_date: m.mov_date
                , ent_desc: m.mov_desc
                , ent_ctg_currency: 1
                , ent_amount: m.mov_amount
                , ent_id_account: m.mov_ctg_type === 3 ? m.mov_id_account_to : '1' // TODO: Fix capital account per user
                , ent_ctg_type: m.mov_ctg_type === 3 ? 2 : m.mov_ctg_type
                , ent_budget: m.mov_budget
                , ent_id_category: m.mov_id_category
                , ent_id_place: m.mov_id_place
                , ent_notes: m.mov_notes
                , ent_id_user: m.mov_id_user
                , ent_date_add: m.mov_date_add
                , ent_date_mod: m.mov_date_mod
                , ent_ctg_status: m.mov_ctg_status
            }));
        });
        // insert entries
        const responsesPromises = entryList.map(e => sqlMotor.toInsertSQL(e));
        return Promise.all(connection.runSqlArray(responsesPromises)).then(values => {
            // all inserted ok
            connection.close();
            console.log(`Batch finished, inserted ok: ${entryList.length}`);
            return {operationOk: true, message: `Batch finished, inserted ok: ${entryList.length}`, data: entryList};
        }).catch(reason => {
            // some failed
            console.log('err on inserting entries',reason);
            return {operationOk: false, message: `error ${reason}`};
        });
    };
    
    _generateEntries = (node: iNode) => {
        const connection: iConnection = ConnectionService.getConnection();
        const movementModel: Movement = new Movement();
        const sqlMotor: MoSQL = new MoSQL(movementModel);

        connection.runSql(sqlMotor.toSelectSQL()).then(response => {
            const list: Movement[] = response.rows.map((r: any) => new Movement(r));
            this.generateEntries(list).then(result => {
                node.response.end(JSON.stringify(result));
            });
        });
    };

    generateBalance = (entryList: Entry[]): Promise<any> => {
        const connection: iConnection = ConnectionService.getConnection();
        const sqlMotor: MoSQL = new MoSQL();
        let balanceList: Balance[] = [];
            
        entryList.forEach(e => {
            let b: Balance = balanceList.find(b => b.bal_year === e.ent_date.getFullYear() && b.bal_month === e.ent_date.getMonth()+1 && b.bal_id_account === e.ent_id_account && b.bal_id_user === e.ent_id_user);

            if (b) { // exists a balance, add entry amount
                b.bal_charges += e.ent_ctg_type === 2 ? e.ent_amount : 0;
                b.bal_withdrawals += e.ent_ctg_type === 1 ? e.ent_amount : 0;
                b.bal_final += e.ent_ctg_type === 1 ? -1 * e.ent_amount : e.ent_amount;
            } else { // balance does not exist, create one with amount and add it to list
                b = new Balance();
                b.bal_year = e.ent_date.getFullYear();
                b.bal_month = e.ent_date.getMonth() + 1;
                b.bal_ctg_currency = 1;
                b.bal_id_account = e.ent_id_account;
                b.bal_initial = 0;
                b.bal_charges = e.ent_ctg_type === 2 ? e.ent_amount : 0;
                b.bal_withdrawals = e.ent_ctg_type === 1 ? e.ent_amount : 0;
                b.bal_final = b.bal_charges - b.bal_withdrawals;
                b.bal_id_user = e.ent_id_user;
                b.bal_date_add = e.ent_date_add;
                b.bal_date_mod = e.ent_date_mod;
                b.bal_ctg_status = 1;
                
                balanceList.push(b);
            }
        });
        // insert balance
        let responsesPromises = balanceList.map(b => sqlMotor.toInsertSQL(b));
        return Promise.all(connection.runSqlArray(responsesPromises)).then(values => {
            // all inserted ok
            connection.close();
            return {operationOk: true, message: `Batch finished, inserted ok: ${balanceList.length}`};
        }).catch(reason => {
            // some failed
            console.log('err on inserting balance',reason);
            return {operationOk: false, message: `error ${reason}`};
        });
    };

    _generateBalance = (node: iNode) => {
        const connection: iConnection = ConnectionService.getConnection();
        const entryModel: Entry = new Entry();
        const sqlMotor: MoSQL = new MoSQL(entryModel);

        connection.runSql(sqlMotor.toSelectSQL()).then(response => {
            let entryList: Entry[] = response.rows.map((r: any) => new Entry(r));
            console.log('entries to process', response.rows.length);

            this.generateBalance(entryList).then(result => {
                node.response.end(JSON.stringify(result));
            });
        });
    };

    rebuildAndTransfer(): Promise<any>{
        // get first month
        let balanceMotor: BalanceModule = new BalanceModule();
        const user: string = 'anon';

        let sql: string = `select min(ent_date) as min, max(ent_date) as max from entry where ent_id_user = '${user}'`;
        const connection: iConnection = ConnectionService.getConnection();
        return connection.runSql(sql).then(response => {
            if (response) {
                let yearInitial = (new Date(response.rows[0].min)).getFullYear();
                let monthInitial = (new Date(response.rows[0].min)).getMonth() + 1;
                let yearFinal = (new Date(response.rows[0].max)).getFullYear();
                let monthFinal = (new Date(response.rows[0].max)).getMonth() + 1;
    
                return balanceMotor.rebuildAndTransferRange(yearInitial, monthInitial, yearFinal, monthFinal, user).then(resp => {
                    return resp;
                });
            }
        });
    };

    list = (node: iNode) => {
        let api: ApiModule = new ApiModule(new Movement());

        api.list(node).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };

    create = (node: iNode) => {
        const api: ApiModule = new ApiModule(new Movement());
        const balanceModule: BalanceModule = new BalanceModule();

        const hooks: any = {
            afterInsertOK: (response: any, model: Movement) => {
                // generate entities
                return this.generateEntries([model]).then(result => {
                    console.log(`entry generation for movement result`, result);
                    if (result.operationOk) {
                        // generate balance
                        return balanceModule.applyEntriesToBalance(result.data, 'anon').then(res => {
                            console.log(`balance generation for movement result`, res);
                            return {message: `entries: ${result.message}`};
                        });
                    }
                });
            }
        };

        api.create(node, hooks).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };

    update = (node: iNode) => {
        let api: ApiModule = new ApiModule(new Movement());
        const balanceModule: BalanceModule = new BalanceModule();

        const hooks: any = {
            afterUpdateOK: (response: any, model: Movement) => {
                // generate entities
                return this.updateEntries([model]).then(result => {
                    console.log(`entries updated for movement result`, result);
                    if (result.operationOk) {
                        // generate balance
                        const date: Date = new Date(model.mov_date);
                        const initialYear = date.getFullYear();
                        const initialMonth = date.getMonth() + 1;
                        const finalYear = (new Date()).getFullYear();
                        const finalMonth = (new Date()).getMonth() + 1;
                        return balanceModule.rebuildAndTransferRange(initialYear, initialMonth, finalYear, finalMonth, 'anon').then(res => {
                            return {message: `entries: ${result.message}`};
                        });
                    }
                });
            }
        };

        api.update(node, hooks).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };

    updateEntries = (movementList: Movement[]): Promise<any> => {
        const connection: iConnection = ConnectionService.getConnection();
        const sqlMotor: MoSQL = new MoSQL();
        console.log('movements to update', movementList.length);
        
        const entryModel: Entry = new Entry();
        let entryOriginList: Entry[] = [];
        return connection.runSql(sqlMotor.toSelectSQL(JSON.stringify({
            gc: 'AND'
            , cont: [{
                f: 'ent_id'
                , op: 'in'
                , val: movementList.map(m => `'${m.mov_id}'`).join(', ')
            }]
        }), entryModel)).then(entryResponse => {
            entryOriginList = entryResponse.rows.map((r: any) => new Entry(r));

            // iterate movements
            let entryList: Array<Entry> = [];
            movementList.forEach((m: Movement, index: number, arr: any[]) => {
                // generate entry 1
                entryList.push(new Entry({
                    ent_id: m.mov_id
                    , ent_sequential: 1
                    , ent_date: m.mov_date
                    , ent_desc: m.mov_desc
                    , ent_ctg_currency: 1 // static until Multi-currency
                    , ent_amount: m.mov_amount
                    , ent_id_account: m.mov_id_account
                    , ent_ctg_type: m.mov_ctg_type === 3 ? 1 : m.mov_ctg_type
                    , ent_budget: m.mov_budget
                    , ent_id_category: m.mov_id_category
                    , ent_id_place: m.mov_id_place
                    , ent_notes: m.mov_notes
                    , ent_id_user: m.mov_id_user
                    , ent_date_add: m.mov_date_add
                    , ent_date_mod: m.mov_date_mod
                    , ent_ctg_status: m.mov_ctg_status
                }));
                // generate entry 2
                entryList.push(new Entry({
                    ent_id: m.mov_id
                    , ent_sequential: 2
                    , ent_date: m.mov_date
                    , ent_desc: m.mov_desc
                    , ent_ctg_currency: 1
                    , ent_amount: m.mov_amount
                    , ent_id_account: m.mov_ctg_type === 3 ? m.mov_id_account_to : '1' // TODO: Fix capital account per user
                    , ent_ctg_type: m.mov_ctg_type === 3 ? 2 : m.mov_ctg_type
                    , ent_budget: m.mov_budget
                    , ent_id_category: m.mov_id_category
                    , ent_id_place: m.mov_id_place
                    , ent_notes: m.mov_notes
                    , ent_id_user: m.mov_id_user
                    , ent_date_add: m.mov_date_add
                    , ent_date_mod: m.mov_date_mod
                    , ent_ctg_status: m.mov_ctg_status
                }));
            });
            // update entries
            const responsesPromises = entryList.map(e => sqlMotor.toUpdateSQL(e, entryOriginList.find(o => o.ent_id === e.ent_id && o.ent_sequential === e.ent_sequential)));
            return Promise.all(connection.runSqlArray(responsesPromises)).then(values => {
                // all updated ok
                connection.close();
                console.log(`Batch finished, updated ok: ${entryList.length}`);
                return {operationOk: true, message: `Batch finished, updated ok: ${entryList.length}`, data: entryList};
            }).catch(reason => {
                // some failed
                console.log('err on updating entries',reason);
                return {operationOk: false, message: `error ${reason}`};
            });
        });
    };
}


