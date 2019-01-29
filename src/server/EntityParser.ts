import * as fs from 'fs';
import { EntityDefinition } from '../crosscommon/EntityDefinition';
import { FieldDefinition } from '../crosscommon/FieldDefinition';
import { ViewJoinDefinition } from '../crosscommon/ViewJoinDefinition';

export class EntityParser {
    /**
     * Loads a file from file system and returns content as JSON object.
     */
    loadJSON = (file: string) => {
        let obj = JSON.parse(fs.readFileSync(file + '.json', 'utf8'));
        return obj;
    }
    /**
     * Loads entity data by file name.
     */
    loadEntityData = (entityName: string) => {
        return this.loadJSON(entityName);
    }

    /**
     * Loads template for metadata for identified named cases for generation of code logic
     */
    loadTemplates = (): any => {
        let template = this.loadJSON(`./src/server/templates/template`);
        template.getTemplate = (name: string) => {
            return this._getTemplate(template, name);
        };
        return template;
    }
    /**
     * Search for a given template name into the templates collection
     */
    _getTemplate = (templates: any, name: string): any | Error => {
        for (let i=0 ; i<templates.length; i++){
            if (templates[i].templateId === name){
                return templates[i];
            }
        }
        throw new Error(`can't find template ${name}`);
    }

    parse = (entityName: string): EntityDefinition => {
        const templateRootPath = './src/server/templates';
        let baseTemplate: any;
        // reads entity from filesystem
        baseTemplate = this.loadEntityData(`${templateRootPath}/${entityName}`);
        let templateCollection = this.loadTemplates();
        let t = new EntityDefinition();

        // expand permissions template if provided
        if (baseTemplate.permissionsTemplate){
            t.permissions = templateCollection.getTemplate(baseTemplate.permissionsTemplate).permissions;
        }

        t.name = baseTemplate.name;
        t.tableName = t.name.toLowerCase();
        t.viewName = `vi${t.name.toLowerCase()}`;
        t.namespace = baseTemplate.namespace;
        t.removeMeans = baseTemplate.removeMeans;
        t.authNeeded = baseTemplate.authNeeded;
        t.displayOnMenu = baseTemplate.displayOnMenu;
        t.prefix = baseTemplate.prefix;
        t.permissionsTemplate = baseTemplate.permissionsTemplate;
        t.specialFeatures = baseTemplate.specialFeatures;
        t.fields = [];
        baseTemplate.fields.forEach((rawField: any, index: number, fieldArray: Array<any>) => {
            let f: FieldDefinition = new FieldDefinition(); // empty model
            
            // Extend base template with particular template
            f.templateId = rawField.templateId;
            if (f.templateId === "status"){ // if field is status, extend with integer template
                /*(<any>Object).assign(f, templateCollection.getTemplate("integer"));
                (<any>Object).assign(f, templateCollection.getTemplate("status"));*/
                f = {
                    f
                    , ...templateCollection.getTemplate('base')
                    , ...templateCollection.getTemplate('integer')
                    , ...templateCollection.getTemplate('status')
                };
                //console.log('field after status template extension', f);
            }
            f = {
                ...f
                , ...templateCollection.getTemplate(f.templateId)
                , ...templateCollection.getTemplate('order')
                , ...rawField
            };
            //console.log('field after template extension', f);
            /*(<any>Object).assign(f, templateCollection.getTemplate(f.templateId), f); // extend with template if provided for field
            (<any>Object).assign(f, templateCollection.getTemplate("order")); // extend with order template
            (<any>Object).assign(f, rawField); // extend with raw field definition
            */
            // Override with raw field template data
            /*f.dbName = rawField.dbName;
            f.dbType = rawField.dbType;
            f.isTableField = rawField.isTableField;
            f.isPK = rawField.isPK;
            f.size = rawField.size;
            f.decimal = rawField.decimal;
            f.minLength = rawField.minLength;
            f.allowNull = rawField.allowNull;
            f.default = rawField.default;
            f.dbComment = rawField.dbComment;
            f.catalogId = rawField.catalogId;
            f.originTable = rawField.originTable;
            f.linkedField = rawField.linkedField;
            f.entName = rawField.entName;
            f.formControl = rawField.formControl;
            f.captureRequired = rawField.captureRequired;
            f.appearsByDefaultOnGrid = rawField.appearsByDefaultOnGrid;
            f.specialRules = rawField.specialRules;
            f.displayName = rawField.displayName;
            f.tooltip = rawField.tooltip;
            f.isRecordName = rawField.isRecordName;*/

            // Override order if defined, if not provided use index
            f.gridOrder = rawField.gridOrder !== undefined ? rawField.gridOrder : index;
            f.orderOnNew = rawField.orderOnNew !== undefined ? rawField.orderOnNew : index;
            f.orderOnDetails = rawField.orderOnDetails !== undefined ? rawField.orderOnDetails : index;
            f.orderOnEdit = rawField.orderOnEdit !== undefined ? rawField.orderOnEdit : index;
            f.orderOnImport = rawField.orderOnImport !== undefined ? rawField.orderOnImport : index;
            
            // If field db name starts with an underscore, append the prefix to it to have a proper name
            if (f.dbName && f.dbName[0] === "_"){
                f.dbName = baseTemplate.prefix + f.dbName;
            }

            // Special rule for ctg_status field, 

            // If it is a view field and starts with an underscore, append the prefix
            if (f.linkedField && f.linkedField[0] === "_"){
                f.linkedField = baseTemplate.prefix + f.linkedField;
            }

            // Extend with catalog template if needed (for view fields)
            if (f.templateId === "catalog"){
                // copy from linkedField data
                const linkedField = t.fields.filter((e: any) => e.dbName === f.linkedField)[0];
                if (linkedField){
                    f.dbName = linkedField.dbName.replace("_ctg_","_txt_"); // this creates a different name for the view field
                    f.dbComment = linkedField.dbComment;
                    f.entName = f.entName ? f.entName : `Text${linkedField.entName}`;
                    f.displayName = f.displayName ? f.displayName : linkedField.displayName;
                    f.catalogId = f.catalogId ? f.catalogId : linkedField.catalogId;
                    f.allowNull = true;
                } else {
                    console.log('fiels until now', t.fields);
                    throw new Error(`linked field not found ${f.linkedField}`);
                }
            }

            // Extend with table template for linked fields (for view fields, those will need a view join)
            if (f.templateId === "table"){
                // copy from linkedField data
                let linkedField = t.fields.filter((e: any) => e.dbName === f.linkedField)[0];
                if (linkedField){
                    f.dbComment = linkedField.dbComment;
                    f.entName = f.entName ? f.entName : `Text${linkedField.entName}`;
                    f.displayName = f.displayName ? f.displayName : linkedField.displayName;
                    f.catalogId = f.catalogId ? f.catalogId : linkedField.catalogId;
                    f.allowNull = true;
                }
            }

            // Set an initial field value
            switch(f.dbType){
                case "integer":
                case "long":
                case "double":
                    f.value = 0;
                    break;
                case "string":
                case "date":
                case "datetime":
                    f.value = null;
                    break;
            }

            // getter/setter
            t.model[f.entName] = (value: any) => {
                if (value !== undefined){
                    f.value = value;
                } else {
                    return f.value;
                }
            };
            t.db[f.dbName] = (value: any) => {
                if (value !== undefined){
                    f.value = value;
                } else {
                    return f.value;
                }
            };

            t.fields.push(f);
        });

        t.view = baseTemplate.view;

        // console.log('entity definition is', t);
        // TODO: more assignments and validate
        return t;
    }
}