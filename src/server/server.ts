import * as express from "express";
import * as mysql from "mysql";
import iConnection from "./iConnection";
import ConnectionService from './ConnectionService';
import * as Generator from './MoBasicGenerator';
import { MoInstallSQL } from "./MoInstallSQL";
import { Catalog } from "../crosscommon/entities/Catalog";
import { MovementCustom } from "./MovementCustom";
import { iNode } from "./iNode";
//import * as bodyParser from 'body-parser';
const app = express();
app.use(express.json());

app.use(express.static(__dirname + '/src'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use(function(req, res, next) {
    console.log(`incoming request: ${req.url}`);
    next();
});
//app.use(app.router);

interface iError{
    message: string
    , code: string
}

class validationRule {
    public name: string;
    public type: string = 'string';
    public required: boolean = true;
    public custom: (value: string) => {valid: boolean, errors: Array<iError>};
    constructor(name: string, type: string = 'string', required: boolean = true, custom?: (value: string) => {valid: boolean, errors: Array<iError>}){
        this.name = name;
        this.type = type;
        this.required = required;
        this.custom = custom;
    }
}

function validateQueryString(qs: any, rules: Array<validationRule>): iError[]{
    let errors: iError[] = [];
    const addError = (code: string, message: string) => errors.push({code, message});
    rules.forEach((r: validationRule) => {
        console.log('rule', r);
        const v = qs[r.name];
        if (r.required && v === undefined){
            addError('VALIDATE-URL-PARAMS-REQUIRED', `required param is not present`);
        }
        if (r.type == 'date' && !(typeof v == 'string' && v.length == 10 && /[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/ig.test(v))){
            addError('VALIDATE-URL-PARAMS-TYPE-INCORRECT', `not valid date for param ${r.name}`);
        }
        if (r.custom) {
            const result: { valid: boolean, errors: Array<iError> } = r.custom(v);
            if (!result.valid) {
                result.errors.forEach((e: iError) => addError(e.code, e.message));
            }
        }
    });

    return errors;
}

app.get('/task/list', (req, res) => {
    let user = req.query['u'];
    // Query string validation on params
    const rules: Array<validationRule> = [
        new validationRule('user', 'date')
        , new validationRule('status')
    ];
    let errors: iError[] = validateQueryString(req.query, rules);
    console.log('errors on validation', errors);
    let connection: iConnection = ConnectionService.getConnection();
    connection.runSql('select * from vitask').then(response => {
        res.end(JSON.stringify({ operationOK: true, message: `task list here, u = ${user}`, data: response }));
        connection.close();
        connection = null;
    });
});

app.get('/generator/type', (req, res) => {
    const entities = [
        'Catalog'
        ,'User'
        ,'Logger'
        ,'Task','TaskTimeTracking','TaskSchedule'
        , 'Account','Category','Place','Movement','Entry','Balance'
        , 'LastTime','LastTimeHistory'
    ];
    let gen: Generator.MoBasicGenerator;
    let message: string = entities.join(', ');

    entities.forEach((entity: string) => {
        gen = new Generator.MoBasicGenerator(entity);
        gen.createTypeFile();
    });
    res.end(JSON.stringify({ operationOK: true, message: `Successfully generated File types for the entities: ${message}` }));
});

app.get('/generator/database', (req, res) => {
    let model: Catalog = new Catalog();
    let sqlMotor: MoInstallSQL = new MoInstallSQL(model);
    let sqlCreate: string = sqlMotor.createTableSQL();
    console.log('sql create', sqlCreate);
    res.end(JSON.stringify({ operationOK: true, message: `success!` }));
});

app.get('/movement/import', (req, res) => {
    let mov: MovementCustom = new MovementCustom();
    let node: iNode = {
        request: req
        , response: res
        , mysql: mysql
        , connection: ConnectionService
        , data: null
    };
    mov.import(node);
});

app.get('/movement/list', (req, res) => {
    let mov: MovementCustom = new MovementCustom();
    let node: iNode = {
        request: req
        , response: res
        , mysql: mysql
        , connection: ConnectionService
        , data: null
    };
    mov.list(node);
});

app.post('/movement/create', (req, res) => {
    let mov: MovementCustom = new MovementCustom();
    let node: iNode = {
        request: req
        , response: res
        , mysql: mysql
        , connection: ConnectionService
        , data: req.body
    };
    mov.create(node);
});

app.get('/movement/generate-entries', (req, res) => {
    let mov: MovementCustom = new MovementCustom();
    let node: iNode = {
        request: req
        , response: res
        , mysql: mysql
        , connection: ConnectionService
        , data: null
    };
    mov._generateEntries(node);
});

app.get('/movement/generate-balance', (req, res) => {
    let mov: MovementCustom = new MovementCustom();
    let node: iNode = {
        request: req
        , response: res
        , mysql: mysql
        , connection: ConnectionService
        , data: null
    };
    //mov.generateBalance(node);
    mov.rebuildAndTransfer();
    res.end(JSON.stringify({operationOk: true, message: `Batch finished, inserted ok`}));
});

app.use(function(req, res) {
    // Use res.sendfile, as it streams instead of reading the file into memory.
    res.sendFile(__dirname + '/src/index.html');
});

const server = app.listen(8081, () => {
    console.log('Server running at http://127.0.0.1:8081/');
});