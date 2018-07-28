"use strict";
import iConnection from "./iConnection";
//import { Promise } from 'es6-promise';
import * as mysql from 'mysql';

let ConnectionService = (function(){
    function loadJSON(file: string){
        let fs = require('fs');
        let obj = JSON.parse(fs.readFileSync(file + '.json', 'utf8'));
        return obj;
    }
    let getConnection = (): iConnection => {
        let config = loadJSON(__dirname + '/../../cfg');
        let connection: mysql.Connection;// = mysql.createConnection(config[0]);

        function handleDisconnect() {
            connection = mysql.createConnection(config[0]); // Recreate the connection, since
                                                            // the old one cannot be reused.
            
            connection.connect(function(err: any) {              // The server is either down
                if(err) {                                     // or restarting (takes a while sometimes).
                    console.log('error when connecting to db:', err);
                    setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
                }                                     // to avoid a hot loop, and to allow our node script to
                console.log('connected as id ' + connection.threadId);
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
        
        let close = () => {
            console.log(`ending connection with id ${connection.threadId}`);
            connection.end();
            console.log(`connection ${connection}`);
        };
        let runSql = (sql: string): Promise<any> => {
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
        let runSqlArray = (sqlArray: Array<string>): Array<Promise<any>> => {
            let responseArray = sqlArray.map((sql: string) => runSql(sql));
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
