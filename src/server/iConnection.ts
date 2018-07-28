interface iConnection {
    close: () => void
    , runSql: (sql: string) => Promise<any>
    , runSqlArray: (sqlArray: Array<string>) => Array<Promise<any>>
    , runSyncSql: (sql: string, callback: (err: any, rows: any, fields: any[]) => void) => void
}
export default iConnection;