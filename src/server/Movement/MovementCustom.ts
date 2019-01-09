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
import { DateUtils } from "../../crosscommon/DateUtility";
import EmailModule from "../EmailModule";
import { configModule } from "../ConfigModule";
import { Preset } from "../../crosscommon/entities/Preset";

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

        api.list({ q: node.request.query['q'] }).then((response) => {
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

        api.create({ body: node.request.body }, hooks).then((response) => {
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

        api.update({ body: node.request.body, pk: node.request.params }, hooks).then((response) => {
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

    accountsWithBalance = (node: iNode) => {
        let m: iEntity = new Account();
        let connection: iConnection = ConnectionService.getConnection();
        let params: string = node.request.query['q'];
        let sqlMotor: MoSQL = new MoSQL(m);
        let sql: string = `select account.*, bal_final from account inner join balance on (bal_year * 100 + bal_month = (select max(bal_year * 100 + bal_month) from balance) and bal_id_account = acc_id)`;
        if (params){
            sql += ` where ${sqlMotor.criteriaToSQL(sqlMotor.parseSQLCriteria(params), m)}`;
        }
        let array: iEntity[] = [];
        
        return connection.runSql(sql).then((response) => {
            if (!response.err){
                array = response.rows;
                console.log(`api list query returned ${array.length} rows`);
            }
            connection.close();
            return array;
        }).then((response) => {
            node.response.end(JSON.stringify(response));
        });
    };

    averageBalance = (node: iNode) => {
        const idAccount: string = node.request.query['account'];
        const useCheckDay: boolean = node.request.query['checkday'] === 'true';
        const year: number = Number.parseInt(node.request.query['year']);
        const month: number = Number.parseInt(node.request.query['month']);

        this.averageBalancePerAccount(idAccount, useCheckDay, year, month).then(result => {
            node.response.end(JSON.stringify(result));
        });
    }

    averageBalancePerAccount = (idAccount: string, useCheckDay: boolean, year: number, month: number): Promise<{
        operationOk: boolean,
        averageBalance: number,
        message: string,
        checkDay: number,
        initialBalance: number,
        startingDate: Date,
        finalDate: Date,
        averageMinBalance: number,
        dailyBalance: number[]
    }> => {
        let dailyBalance: number[] = [];
        let result: {
            operationOk: boolean,
            averageBalance: number,
            accountName: string,
            message: string,
            checkDay: number,
            initialBalance: number,
            startingDate: Date,
            finalDate: Date,
            averageMinBalance: number,
            dailyBalance: number[]
        } = {
            operationOk: false,
            averageBalance: 0,
            accountName: null,
            message: null,
            checkDay: 0,
            initialBalance: 0,
            startingDate: null,
            finalDate: null,
            averageMinBalance: 0,
            dailyBalance: []
        };
        let startingDate: Date = new Date(year, month-1, 1, 0, 0, 0);
        const iterablePreviousMonth = DateUtils.getIterablePreviousMonth(year, month);

        // [SQL] get current initial balance, as well as account check day starting date if it's based on check day
        // if we're using check day we need to get initial balance from past month because we need to calculate balance at check day
        const sqlBalance: string = `select bal_initial, acc_check_day, acc_average_min_balance, acc_name from vibalance
            inner join account on (bal_id_account = acc_id)
            where bal_id_account = '${idAccount}'
            and bal_year = ${iterablePreviousMonth.year}
            and bal_month = ${useCheckDay ? iterablePreviousMonth.month : month}`;

        const connection = ConnectionService.getConnection();
        return connection.runSql(sqlBalance).then((balanceResponse) => {
            if (balanceResponse.err){
                result.message = 'Could not fetch balance for account';
                return {};
            }
            const response = balanceResponse.rows[0];
            console.log('balance', response);
            return {
                currentBalance: response['bal_initial'],
                checkDay: response['acc_check_day'],
                averageMinBalance: response['acc_average_min_balance'],
                accountName: response['acc_name']
            };
        }).then(({currentBalance, checkDay, averageMinBalance, accountName}) => {
            if (result.message){
                return result;
            }
            const iterableTwoMonthsBehind = DateUtils.getIterablePreviousMonth(iterablePreviousMonth.year, iterablePreviousMonth.month);
            if (useCheckDay) {
                startingDate = new Date(iterableTwoMonthsBehind.year, iterableTwoMonthsBehind.month, checkDay+1, 0, 0, 0);
            }
            // final date should be in 1 month
            const finalDate: Date = DateUtils.addDays(DateUtils.addMonths(startingDate, 1), -1);
            const previousMonthDayOne: Date = new Date(iterableTwoMonthsBehind.year, iterableTwoMonthsBehind.month, 1, 0, 0, 0);
            // [SQL] Get total amount spent each day for this account within the range
            const sqlEntryAcumulation: string = `SELECT ent_date, SUM(CASE WHEN ent_ctg_type = 1
                THEN -1 * ent_amount
                ELSE ent_amount
                END) as Amount
                FROM vientry
                where ent_id_account = '${idAccount}'
                and ent_date >= '${useCheckDay ? previousMonthDayOne.toISOString().slice(0,10) : startingDate.toISOString().slice(0,10)}'
                and ent_date <= '${finalDate.toISOString().slice(0,10)}'
                GROUP BY ent_date
                ORDER BY ent_date desc`;
            
            result.averageMinBalance = averageMinBalance;
            result.startingDate = startingDate;
            result.finalDate = finalDate;
            result.checkDay = checkDay;
            result.accountName = accountName;
            
            return connection.runSql(sqlEntryAcumulation).then(entryResponse => {
                if (entryResponse.err){
                    result.message = 'Could not fetch entries for account';
                    return result;
                }
                const entrySums: any[] = entryResponse.rows;
                console.log('entries', entrySums);

                let dateCounter: Date = useCheckDay ? previousMonthDayOne : startingDate;
                if (useCheckDay) { // should iterate to rebuild from day 1 of previous month to startingDate
                    while(dateCounter.getTime() < startingDate.getTime()) { // iterates each day within the range
                        const daySum: any = entrySums.find(e => (new Date(e['ent_date'])).toISOString().slice(0,10) === dateCounter.toISOString().slice(0,10));
                        if (daySum){
                            currentBalance += daySum['Amount'];
                        }
                        dateCounter = DateUtils.addDays(dateCounter, 1);
                    } // now currenBalance has all movements from day 1 to startingDate and is the correct balance that day
                }
                result.initialBalance = currentBalance;

                while(dateCounter.getTime() <= finalDate.getTime()) { // iterates each day within the range
                    const daySum: any = entrySums.find(e => (new Date(e['ent_date'])).toISOString().slice(0,10) === dateCounter.toISOString().slice(0,10));
                    if (daySum){
                        if (dailyBalance.length){ // following days use last day balance
                            dailyBalance.push(Math.round((dailyBalance[dailyBalance.length-1] + daySum['Amount']) * 100) / 100);
                        } else { // first day uses currentBalance
                            dailyBalance.push(currentBalance + daySum['Amount']);
                        }
                    } else { // no movements means same balance for this day or currentBalance
                        if (dailyBalance.length){
                            dailyBalance.push(dailyBalance[dailyBalance.length-1]);
                        } else {
                            dailyBalance.push(currentBalance);
                        }
                    }

                    dateCounter = DateUtils.addDays(dateCounter, 1);
                }

                // calculate the average
                result.averageBalance = dailyBalance.reduce((prev, curr) => prev + curr, 0) / dailyBalance.length;
                result.operationOk = true;
                result.dailyBalance = dailyBalance;
                console.log('result for average-balance process', result);
                return result;
            })
        }).catch(err => {
            result.message = err;
            return result;
        });
    }

    emailAccountMovements = (req: any, res: any) => {
        const {
            account,
            year,
            month
        } = req.query;
        
        this._emailAccountMovements(account, year, month).then(result => {
            res.end(JSON.stringify(result));
        });
    }
    
    _emailAccountMovements = async (account: string, year: number, month: number): Promise<any> => {
        let html: string = '';

        const connection: iConnection = ConnectionService.getConnection();
        // get balance information
        const sqlBalance: string = `select * from vibalance where bal_id_account = '${account}' and bal_year = ${year} and bal_month = ${month}`;
        const {
            rows: BalanceList
        } = await connection.runSql(sqlBalance);
        const balance: Balance = new Balance(BalanceList[0]);

        // get period movements
        const initialDate: Date = new Date(year, month-1, 1);
        const finalDate: Date = new Date(year, month-1, DateUtils.lastDayInMonth(year, month-1));
        const sqlMovements: string = `select * from vimovement where (mov_id_account = '${account}' or mov_id_account = '${account}') and mov_date >= '${DateUtils.formatDate(initialDate)}' and mov_date <= '${DateUtils.formatDate(finalDate)}'`;
        const {
            rows: MovementList
        } = await connection.runSql(sqlMovements);
        const movements: Movement[] = MovementList.map((m: any) => new Movement(m));

        const currencyFormatHelper = (amount: number) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currencyDisplay: 'symbol',
                currency: 'USD'
            }).format(amount);
        };
        // build html
        const styleAmount = `style="padding: 5px; text-align: right;"`;
        html += `Listing ${movements.length} movements for account <strong>${balance.bal_txt_account}</strong> for period ${year} ${DateUtils.getMonthName(month)}.`;
        html += `<br/><br/>
        <table>
            <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Place</th>
                <th>Description</th>
            </tr>
            <tr style="background-color: lightgrey;">
                <td></td>
                <td ${styleAmount}><strong>${currencyFormatHelper(balance.bal_initial)}</strong></td>
                <td></td>
                <td><strong>INITIAL BALANCE</strong></td>
            </tr>
            ${movements.map((item, index) => {
                return `
                <tr ${index % 2 !== 0 ? 'style="background-color: lightgrey"' : ''}>
                    <td>${DateUtils.formatDate(item.mov_date)}</td>
                    <td ${styleAmount}>${currencyFormatHelper((item.mov_ctg_type === 1 || (item.mov_ctg_type === 3 && balance.bal_id_account === item.mov_id_account)) ? -1 * item.mov_amount : item.mov_amount)}</td>
                    <td>${item.mov_ctg_type === 3 ? 'TRANSFER' : item.mov_txt_place}</td>
                    <td>${item.mov_desc}</td>
                </tr>`;
            }).join('')}
            <tr ${movements.length % 2 !== 0 ? 'style="background-color: lightgrey"' : ''}>
                <td></td>
                <td ${styleAmount}><strong>${currencyFormatHelper(balance.bal_final)}</strong></td>
                <td></td>
                <td><strong>FINAL BALANCE</strong></td>
            </tr>
        </table>`;
        html = html.replace(new RegExp('<td>', 'g'), '<td style="padding: 5px;">');

        const subject: string = `Account Balance ${year} ${DateUtils.getMonthName(month)}`;
        const to: string = configModule.getConfigValue('money-mail-to');
        EmailModule.sendHTMLEmail(subject, html, to);

        return Promise.resolve({operationResult: true, message: 'email sent'});
    }

    /**
     * Copies initial data from backup to default db.
     * [accounts, place, category, preset, movement, entry, balance]
     * - Deletes all table records from default.
     * - Inserts all table records from backup into default.
     */
    async initializeDataFromBackup(){
        const tables: iEntity[] = [
            new Account(),
            new Place(),
            new Category(),
            new Preset(),
            new Movement(),
            new Entry(),
            new Balance()
        ];
        const sqlMotor: MoSQL = new MoSQL();

        const sqlSelect: string[] = tables.map(t => `select * from ${t.metadata.tableName}`);
        const sqlDelete: string[] = tables.map(t => `delete from ${t.metadata.tableName}`);

        const defaultCon: iConnection = ConnectionService.getConnection();
        const backupCon: iConnection = ConnectionService.getConnection('backup');

        const sqlInsert: string[] = await Promise.all(backupCon.runSqlArray(sqlSelect)).then((response: any) => {
            const sqlList: string[] = [];
            response.forEach((entResp: any, index: number) => {
                sqlList.push(sqlMotor.toInsertSQL(Object.getPrototypeOf(tables[index]).prototype.constructor(entResp)));
            });
            return sqlList;
        });
        const deleteResponse: any = await defaultCon.runSqlArray(sqlDelete);
        const insertResponse: any = await Promise.all(defaultCon.runSqlArray(sqlInsert));

        return [deleteResponse, insertResponse];
    }

}


