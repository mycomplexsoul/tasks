import iConnection from './iConnection';
import ConnectionService from './ConnectionService';
import { MoSQL } from './MoSQL';
import { MoInstallSQL } from './MoInstallSQL';
import { iEntity } from '../crosscommon/iEntity';

import { Catalog } from '../crosscommon/entities/Catalog';
import { User } from '../crosscommon/entities/User';
import { Logger } from '../crosscommon/entities/Logger';

import { Task } from '../crosscommon/entities/Task';
import { TaskTimeTracking } from '../crosscommon/entities/TaskTimeTracking';
import { TaskSchedule } from '../crosscommon/entities/TaskSchedule';

import { Account } from '../crosscommon/entities/Account';
import { Category } from '../crosscommon/entities/Category';
import { Place } from '../crosscommon/entities/Place';
import { Movement } from '../crosscommon/entities/Movement';
import { Entry } from '../crosscommon/entities/Entry';
import { Balance } from '../crosscommon/entities/Balance';
import { LastTime } from '../crosscommon/entities/LastTime';
import { LastTimeHistory } from '../crosscommon/entities/LastTimeHistory';
import { Preset } from '../crosscommon/entities/Preset';

import { Multimedia } from '../crosscommon/entities/Multimedia';
import { MultimediaDet } from '../crosscommon/entities/MultimediaDet';
import { MultimediaView } from '../crosscommon/entities/MultimediaView';

export class InstallModule {
    install = () => {
        const connection: iConnection = ConnectionService.getConnection();
        const models: iEntity[] = [
            new Catalog()
            , new User()
            , new Logger()
            , new Task(), new TaskTimeTracking(), new TaskSchedule()
            , new Account(), new Category(), new Place(), new Movement(), new Entry(), new Balance(), new Preset()
            , new LastTime(), new LastTimeHistory()
            , new Multimedia(), new MultimediaDet(), new MultimediaView()
        ];
        const method = (msgOk: string) => {
            return (err: any) => {
                if (err){
                    console.log(err);
                } else {
                    if (msgOk){
                        console.log(msgOk);
                    }
                }
            };
        };
        const installMotor: MoInstallSQL = new MoInstallSQL();

        models.forEach((model) => {
            connection.runSyncSql(`drop view if exists ${model.metadata.viewName}`, method(`view ${model.metadata.viewName} droped`));
            connection.runSyncSql(`drop table if exists ${model.metadata.tableName}`, method(`table ${model.metadata.tableName} droped`));
            connection.runSyncSql(installMotor.createTableSQL(model), method(`table ${model.metadata.tableName} created`));
            connection.runSyncSql(installMotor.createPKSQL(model), method(`PK created`));
            connection.runSyncSql(installMotor.createViewSQL(model), method(`view ${model.metadata.viewName} created`));
        });

        this.populateInitialData();
        connection.close();
        console.log('installation finished');
    };

    populateInitialData = () => {
        const connection: iConnection = ConnectionService.getConnection();
        let inserts: string[] = [];
        let t: iEntity;
        let sqlMotor: MoSQL = new MoSQL();

        console.log('populate initial data start...');
        
        // Catalog
        t = new Catalog();
        let addCatalog = (
            ctg_id: string,
            ctg_sequential: number,
            ctg_name: string,
            ctg_description: string,
            ctg_ctg_permissions: number,
            ctg_date_add: Date,
            ctg_date_mod: Date,
            ctg_ctg_status: number
        ) => {
            t = new Catalog({
                ctg_id,
                ctg_sequential,
                ctg_name,
                ctg_description,
                ctg_meta1: '',
                ctg_meta2: '',
                ctg_ctg_permissions,
                ctg_date_add,
                ctg_date_mod,
                ctg_ctg_status
            });
            inserts.push(sqlMotor.toInsertSQL(t));
        };

        addCatalog("CATALOGS",1,"LIST OF ALL CATALOGS","A LIST OF ALL CATALOGS, EACH CATALOG SHOULD BE LISTED HERE FOR PERMISSION CONFIGURATION",1,new Date(),new Date(),1);
        addCatalog("CATALOGS",2,"CATALOG_PERMISSIONS","PERMISSIONS ON CATALOG AND PERMISSIONS ON RECORD",4,new Date(),new Date(),1);
        addCatalog('CATALOGS',3,'RECORD_STATUS','STATUS FOR RECORD ITEM',4,new Date(),new Date(),1);
        addCatalog('CATALOGS',4,'BOOLEAN','A YES/NO PARSE',4,new Date(),new Date(),1);
        addCatalog('CATALOGS',5,'USER_TYPES','USER TYPES FOR USER CLASSIFICATION',4,new Date(),new Date(),1);
        addCatalog('CATALOGS',6,'ACCOUNT_TYPES','ACCOUNT TYPES FOR ACCOUNT CLASIFICATION',4,new Date(),new Date(),1);
        addCatalog('CATALOGS',7,'MOVEMENT_TYPES','MOVEMENT TYPES FOR HANDLING MONEY',4,new Date(),new Date(),1);
        //#region CATALOG_PERMISSIONS
        addCatalog("CATALOG_PERMISSIONS",1,"ADD AND EDIT RECORDS","USERS CAN ADD RECORDS AND CAN EDIT RECORDS ON THIS CATALOG",8,new Date(),new Date(),1);
        addCatalog("CATALOG_PERMISSIONS",2,"ADD AND NOT EDIT RECORDS","USERS CAN ADD RECORDS AND CAN NOT EDIT RECORDS ON THIS CATALOG",8,new Date(),new Date(),1);
        addCatalog("CATALOG_PERMISSIONS",3,"NOT ADD AND EDIT RECORDS","USERS CAN NOT ADD RECORDS AND CAN EDIT RECORDS ON THIS CATALOG",8,new Date(),new Date(),1);
        addCatalog("CATALOG_PERMISSIONS",4,"NOT ADD AND NOT EDIT RECORDS","USERS CAN NOT ADD RECORDS AND CAN NOT EDIT RECORDS ON THIS CATALOG",8,new Date(),new Date(),1);
        addCatalog('CATALOG_PERMISSIONS',5,'EDIT AND DELETE THIS RECORD','USERS CAN EDIT AND CAN DELETE THIS RECORD',8,new Date(),new Date(),1);
        addCatalog('CATALOG_PERMISSIONS',6,'EDIT AND NOT DELETE THIS RECORD','USERS CAN EDIT AND CAN NOT DELETE THIS RECORD',8,new Date(),new Date(),1);
        addCatalog('CATALOG_PERMISSIONS',7,'NOT EDIT AND DELETE THIS RECORD','USERS CAN NOT EDIT AND CAN DELETE THIS RECORD',8,new Date(),new Date(),1);
        addCatalog('CATALOG_PERMISSIONS',8,'NOT EDIT AND NOT DELETE THIS RECORD','USERS CAN NOT EDIT AND CAN NOT DELETE THIS RECORD',8,new Date(),new Date(),1);
        //#endregion
        addCatalog('RECORD_STATUS',1,'ACTIVE','THE RECORD IS ACTIVE AND CAN BE USED IN THE APPLICATION',8,new Date(),new Date(),1);
        addCatalog('RECORD_STATUS',2,'CANCELLED','THE RECORD IS CANCELLED AND IT CAN NOT BE USED BY THE APPLICATION',8,new Date(),new Date(),1);

        addCatalog('BOOLEAN',1,'NO','NO, MEANING IT DOES NOT APPLY THE PROPERTY OR DESCRIPTION',8,new Date(),new Date(),1);
        addCatalog('BOOLEAN',2,'YES','YES, MEANING IT APPLIES THE DESCRIPTION RELATED',8,new Date(),new Date(),1);
        
        addCatalog('USER_TYPES',1,'END USER','THE END USER OF THE APPLICATION',8,new Date(),new Date(),1);
        addCatalog('USER_TYPES',2,'ADMINISTRATOR','AN ADMINISTRATOR OF THE APPLICATION',8,new Date(),new Date(),1);

        addCatalog('ACCOUNT_TYPES',1,'DEBIT','ACCOUNT WITH DEBIT BALANCE ONLY',8,new Date(),new Date(),1);
        addCatalog('ACCOUNT_TYPES',2,'CREDIT','ACCOUNT WITH CREDIT BALANCE',8,new Date(),new Date(),1);
        addCatalog('ACCOUNT_TYPES',3,'LOAN','ACCOUNT TO KEEP BALANCE OF A LOAN',8,new Date(),new Date(),1);
        addCatalog('ACCOUNT_TYPES',4,'OTHER','SPECIAL ACCOUNT',8,new Date(),new Date(),1);

        addCatalog('MOVEMENT_TYPES',1,'EXPENSE','INDICATES THIS IS AN EXPENSE MOVEMENT',8,new Date(),new Date(),1);
        addCatalog('MOVEMENT_TYPES',2,'INCOME','INDICATES THIS IS AN INCOME MOVEMENT',8,new Date(),new Date(),1);
        //#region TASK_REPETITION_TYPE
        addCatalog('TASK_REPETITION_TYPE',1,'DAILY','INDICATES THIS TASK REPEATS ON A DAILY BASIS',8,new Date(),new Date(),1);
        addCatalog('TASK_REPETITION_TYPE',2,'WEEKLY','INDICATES THIS TASK REPEATS ONCE A WEEK',8,new Date(),new Date(),1);
        addCatalog('TASK_REPETITION_TYPE',3,'BI-WEEKLY','INDICATES THIS TASK REPEATS ONCE EACH TWO WEEKS',8,new Date(),new Date(),1);
        addCatalog('TASK_REPETITION_TYPE',4,'MONTHLY','INDICATES THIS TASK REPEATS ONCE A MONTH',8,new Date(),new Date(),1);
        addCatalog('TASK_REPETITION_TYPE',5,'YEARLY','INDICATES THIS TASK REPEATS ONCE A YEAR',8,new Date(),new Date(),1);
        addCatalog('TASK_REPETITION_TYPE',6,'CUSTOM FREQUENCY','INDICATES THIS TASK REPEATS WITH A GIVEN CUSTOM FREQUENCY',8,new Date(),new Date(),1);
        addCatalog('TASK_REPETITION_TYPE',7,'SOME DAYS OF THE WEEK','INDICATES THIS TASK REPEATS SOME DAYS OF THE WEEK',8,new Date(),new Date(),1);
        addCatalog('TASK_REPETITION_TYPE',8,'A DAY OF EACH MONTH','INDICATES THIS TASK REPEATS ONCE EACH MONTH WITH A SPECIAL RULE',8,new Date(),new Date(),1);
        //#endregion
        addCatalog('TASK_REPETITION_END_AT',1,'FOREVER','INDICATES THIS TASK REPEATS ON A DAILY BASIS',8,new Date(),new Date(),1);
        addCatalog('TASK_REPETITION_END_AT',2,'END ON DATE','INDICATES THIS TASK REPEATS ON A DAILY BASIS',8,new Date(),new Date(),1);
        addCatalog('TASK_REPETITION_END_AT',3,'END AFTER N REPETITIONS','INDICATES THIS TASK REPEATS ON A DAILY BASIS',8,new Date(),new Date(),1);

        addCatalog('TASK_REPETITION_FREQUENCY',1,'DAYS','INDICATES THIS TASK REPEATS ON A DAILY BASIS',8,new Date(),new Date(),1);
        addCatalog('TASK_REPETITION_FREQUENCY',2,'WEEKS','INDICATES THIS TASK REPEATS ON A DAILY BASIS',8,new Date(),new Date(),1);
        addCatalog('TASK_REPETITION_FREQUENCY',3,'MONTHS','INDICATES THIS TASK REPEATS ON A DAILY BASIS',8,new Date(),new Date(),1);
        addCatalog('TASK_REPETITION_FREQUENCY',4,'YEARS','INDICATES THIS TASK REPEATS ON A DAILY BASIS',8,new Date(),new Date(),1);
        
        addCatalog('CURRENCIES',1,'MXN','MEXICAN PESO',8,new Date(),new Date(),1);
        
        addCatalog('MULTIMEDIA_MEDIA_TYPE',1,'MOVIES','MOVIES',8,new Date(),new Date(),1);
        addCatalog('MULTIMEDIA_MEDIA_TYPE',2,'TV SERIES','TV SERIES',8,new Date(),new Date(),1);
        addCatalog('MULTIMEDIA_MEDIA_TYPE',3,'ANIME','ANIME',8,new Date(),new Date(),1);
        addCatalog('MULTIMEDIA_MEDIA_TYPE',4,'BOOK','BOOK',8,new Date(),new Date(),1);

        addCatalog('MULTIMEDIA_PLATFORM',1,'PC','PLATFORM OF MEDIA USED',8,new Date(),new Date(),1);
        addCatalog('MULTIMEDIA_PLATFORM',2,'NETFLIX','PLATFORM OF MEDIA USED',8,new Date(),new Date(),1);
        addCatalog('MULTIMEDIA_PLATFORM',3,'YOUTUBE','PLATFORM OF MEDIA USED',8,new Date(),new Date(),1);
        addCatalog('MULTIMEDIA_PLATFORM',4,'PRIME VIDEO','PLATFORM OF MEDIA USED',8,new Date(),new Date(),1);
        addCatalog('MULTIMEDIA_PLATFORM',5,'TV','PLATFORM OF MEDIA USED',8,new Date(),new Date(),1);

        inserts.forEach(i => {
            connection.runSyncSql(i,(err) => {
                if (err){
                    console.log(err);
                }
            });
        });
        console.log('Catalog: inserted ' + inserts.length);

        // User
        inserts = [];
        let addUser = (
            usr_id: string,
	        usr_pwd: string,
	        usr_first_name: string,
	        usr_middle_name: string,
	        usr_last_name: string,
	        usr_ctg_user_type: number,
	        usr_email: string,
	        usr_ctg_connected: number,
	        usr_login_attempts: number,
	        usr_date_last_login_attempt: Date,
	        usr_date_pwd_change: Date,
	        usr_ctg_pwd_temporal: number,
	        usr_ctg_blocked: number,
	        usr_config: string,
	        usr_date_add: Date,
	        usr_date_mod: Date,
	        usr_ctg_status: number
        ) => {
            t = new User({
                usr_id,usr_pwd,usr_first_name,usr_middle_name,usr_last_name,usr_ctg_user_type,usr_email,usr_ctg_connected,usr_login_attempts,usr_date_last_login_attempt,usr_date_pwd_change,usr_ctg_pwd_temporal,usr_ctg_blocked,usr_config,usr_date_add,usr_date_mod,usr_ctg_status
            });
            inserts.push(sqlMotor.toInsertSQL(t));
        };

        addUser('dummy','dummypwd','Dummy','D.','Doe',1,'dummy@dummy.com',1,0,null,null,1,1,null,new Date(),new Date(),1);
        addUser('admin','admin','Admin','-','-',2,'admin@domain.com',1,0,null,null,1,1,null,new Date(),new Date(),1);
        addUser('mycomplexsoul','*','Daniel','-','-',2,'mycomplexsoul@gmail.com',1,0,null,null,1,1,null,new Date(),new Date(),1);

        inserts.forEach(i => {
            connection.runSyncSql(i,(err) => {
                if (err){
                    console.log(err);
                }
            });
        });
        console.log('User: inserted ' + inserts.length);

        // end data

        console.log('populate initial data end');
    };
}
