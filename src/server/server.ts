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
import EmailModule from './EmailModule';
import { MoSQL } from './MoSQL';
import { User } from '../crosscommon/entities/User';
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

app.get('/online', (req, res) => {
    res.end(JSON.stringify({ operationOK: true, message: "Hi! I'm online!" }));
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

app.get('/email/test', (req, res) => {
    EmailModule.sendHTMLEmail('Test email', 'Hey! hello from somewhere in the <strong>world</strong>!', 'mycomplexsoul@gmail.com');
    res.end(JSON.stringify({ operationOK: true, message: 'Success!' }));
});

app.post('/api/login', async (req, res) => {
    const {
        fUsername,
        fPassword
    } = req.body;

    const sqlMotor: MoSQL = new MoSQL(new User());
    const sql = sqlMotor.toSelectSQL(encodeURIComponent(JSON.stringify({
        gc: "AND",
        cont: [{
            f: "usr_id",
            op: "eq",
            val: fUsername
        }]
    })));

    const connection: iConnection = ConnectionService.getConnection();
    const {
        rows: UserList
    } = await connection.runSql(sql);
    
    if (!UserList.length) {
        res.end(JSON.stringify({ operationResult: false, message: 'Authentication failed.' }));
        return;
    }
    
    const userDB: User = new User(UserList[0]);
    
    // validate password
    // TODO: needs crypto methods to cypher passwords
    
    res.end(JSON.stringify({
        operationResult: true,
        message: 'Authentication ok.',
        identity: {
            auth_token: 'T123456',
            user: fUsername,
            email: userDB.usr_email
        }
    }));
    return true;
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

const port = process.env.PORT || 8001;
//const server = 
app.listen(port, () => { // to change it, set in a cmd >export PORT=3000  then run the app
    console.log(`Server v${process.env.npm_package_version} running at http://127.0.0.1:${port}/`);
});