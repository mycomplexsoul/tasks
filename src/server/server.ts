import * as path  from 'path';
import * as express from "express";
import iConnection from "./iConnection";
import ConnectionService from './ConnectionService';
import * as Generator from './MoBasicGenerator';
import { MoInstallSQL } from "./MoInstallSQL";
import { Catalog } from "../crosscommon/entities/Catalog";
import { iNode } from "./iNode";
import * as Routes from './Routes';
import { InstallModule } from './InstallModule';
//import * as bodyParser from 'body-parser';
const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, '../../src')));
app.use('/node_modules', express.static(path.join(__dirname, '../../node_modules')));
app.use('/crosscommon', express.static(path.join(__dirname, '../crosscommon')));

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

app.get('/status', (req, res) => {
    res.end(JSON.stringify({ operationOK: true, message: `Hi! server time is ${new Date()}` }));
});

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
        ,'Account','Category','Place','Movement','Entry','Balance', 'Preset'
        ,'LastTime','LastTimeHistory'
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
    let sqlMotor: InstallModule = new InstallModule();
    sqlMotor.install();
    
    res.end(JSON.stringify({ operationOK: true, message: `success!` }));
});

app.use('/api', Routes.router);

app.use(function(req, res) {
    // Use res.sendfile, as it streams instead of reading the file into memory.
    const index = path.join(__dirname, '../index.html');
    if (req.url.indexOf('crosscommon') !== -1) { // TODO: move this to FE build
        const file = path.join(__dirname, `../${req.url}.js`);
        console.log(`Answering request with: ${file}`);
        res.sendFile(file);
    } else {
        console.log(`Answering request with: ${index}`);
        res.sendFile(index);
    }
});

const server = app.listen(8081, () => {
    console.log('Server running at http://127.0.0.1:8081/');
});