import iConnection from "./iConnection";
import * as mysql from 'mysql';
import { configModule } from './ConfigModule';

let ConnectionService = (function(){
    const getConnection = (label = 'default'): iConnection => {
        //let config = loadJSON(__dirname + '/../../cfg');
        const config = configModule.getConfigValue('db').find((item: any) => item.label === label);
        let connection: mysql.Connection;// = mysql.createConnection(config[0]);

        function handleDisconnect() {
            connection = mysql.createConnection(config); // Recreate the connection, since
                                                            // the old one cannot be reused.
            
            connection.connect(function(err: any) {              // The server is either down
                if(err) {                                     // or restarting (takes a while sometimes).
                    console.log('error when connecting to db:', err);
                    setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
                }                                     // to avoid a hot loop, and to allow our node script to
                console.log('connected to <' + config.database + '> with id ' + connection.threadId);
            });                                     // process asynchronous requests in the meantime.
                                                    // If you're also serving http, display a 503 error.
            connection.on('error', function(err: any) {
                console.log((new Date()).toISOString() + ' - db error', err);
                if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
                    handleDisconnect();                         // lost due to either server restart, or a
                } else {                                      // connnection idle timeout (the wait_timeout
                    throw err;                                  // server variable configures this)
                }
            });
        }

        handleDisconnect();
        
        const close = () => {
            console.log(`ending connection with id ${connection.threadId}`);
            connection.end();
            console.log(`connection ${connection}`);
        };
        const runSql = (sql: string): Promise<any> => {
            return new Promise<any>((resolve,reject) => {
                connection.query(sql,(err: any, rows: any, fields: any[]) => {
                    if (err){
                        console.log('There was an error with this sql: ' + sql + ', the error is: ' + err);
                        reject(err);
                        return false;
                    }
                    if(!fields && rows.message){
                        console.log('Message returned after running the sql: ' + rows.message);
                    }
                    console.log('execution ok for query',sql);
                    resolve({sql,err,rows,fields});
                });
            });
        };
        const runSqlArray = (sqlArray: Array<string>): Array<Promise<any>> => {
            const responseArray = sqlArray.map((sql: string) => runSql(sql));
            return responseArray;
        };
        const runSyncSql = (sql: string, callback: (err: any, rows: any, fields: any[]) => void): void => {
            connection.query(sql, (err: any, rows: any, fields: any[]) => {
                console.log('sync execution ok for query',sql);
                callback(err, rows, fields);
            });
        };
        return {
            close
            , runSql
            , runSqlArray
            , runSyncSql
        } as iConnection;
    };

    return {
        getConnection: getConnection
    };
})();
export default ConnectionService;
