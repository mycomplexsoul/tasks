import { iEntity } from "../iEntity";
import { FieldDefinition } from "../FieldDefinition";
import { ViewJoinDefinition } from "../ViewJoinDefinition";

export class Entry implements iEntity {
	public ent_id: string;
	public ent_sequential: number;
	public ent_date: Date;
	public ent_ctg_currency: number;
	public ent_amount: number;
	public ent_id_account: string;
	public ent_ctg_type: number;
	public ent_budget: string;
	public ent_id_category: string;
	public ent_id_place: string;
	public ent_desc: string;
	public ent_notes: string;
	public ent_id_user: string;
	public ent_date_add: Date;
	public ent_date_mod: Date;
	public ent_ctg_status: number;

	public ent_txt_type: string;
	public ent_txt_currency: string;
	public ent_txt_account: string;
	public ent_txt_category: string;
	public ent_txt_place: string;
	public ent_txt_status: string;

	public metadata: {
		name: string
		, namespace: string
		, removeMeans: string
		, authNeeded: boolean
		, displayOnMenu: boolean
		, prefix: string
		, permissionsTemplate: string
		, tableName: string
		, viewName: string
		, permissions: string[]
		, specialFeatures: string[]
		, fields: FieldDefinition[]
		, view: ViewJoinDefinition[]
	} = {
		name: 'Entry'
		, namespace: 'Money'
		, removeMeans: 'CANCELATION'
		, authNeeded: false
		, displayOnMenu: true
		, prefix: 'ent'
		, permissionsTemplate: 'permissions_all'
		, tableName: 'entry'
		, viewName: 'vientry'
		, permissions: [
			'access'
			, 'add'
			, 'edit'
			, 'remove'
			, 'report'
			, 'export'
			, 'import'
		]
		, specialFeatures: [
			'HEADERS(Entry,Entries)'
			, 'TABLE_NAME(ENTRY)'
			, 'VIEW_NAME(VIENTRY)'
		]
		, fields: [
			{
				templateId: 'string'
				, dbName: 'ent_id'
				, dbType: 'string'
				, isTableField: true
				, isPK: true
				, size: 32
				, decimal: 0
				, minLength: 32
				, allowNull: false
				, default: ''
				, dbComment: 'Id for the entry movement'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'MovementId'
				, formControl: 'Textbox'
				, captureRequired: true
				, appearsByDefaultOnGrid: true
				, specialRules: [
					'DUPLICITY_ADD(ent_sequential)'
				]
				, displayName: 'Movement Id'
				, tooltip: ''
				, isRecordName: true
				, gridOrder: 0
				, orderOnNew: 0
				, orderOnDetails: 0
				, orderOnEdit: 0
				, orderOnImport: 0
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'integer'
				, dbName: 'ent_sequential'
				, dbType: 'integer'
				, isTableField: true
				, isPK: true
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Sequential for the entry inside the same movement'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Sequential'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
					'DUPLICITY_ADD(ent_id)'
				]
				, displayName: 'Sequential'
				, tooltip: ''
				, isRecordName: true
				, gridOrder: 1
				, orderOnNew: 1
				, orderOnDetails: 1
				, orderOnEdit: 1
				, orderOnImport: 1
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'datetime'
				, dbName: 'ent_date'
				, dbType: 'datetime'
				, isTableField: true
				, isPK: false
				, size: 16
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Date when the entry was made'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'ApplicationDate'
				, formControl: 'datetime'
				, captureRequired: true
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Date of Application'
				, tooltip: ''
				, isRecordName: true
				, gridOrder: 2
				, orderOnNew: 2
				, orderOnDetails: 2
				, orderOnEdit: 2
				, orderOnImport: 2
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'integer'
				, dbName: 'ent_ctg_currency'
				, dbType: 'integer'
				, isTableField: true
				, isPK: true
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Currency of the entry'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Currency'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Currency'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 3
				, orderOnNew: 3
				, orderOnDetails: 3
				, orderOnEdit: 3
				, orderOnImport: 3
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'double'
				, dbName: 'ent_amount'
				, dbType: 'double'
				, isTableField: true
				, isPK: false
				, size: 19
				, decimal: 2
				, minLength: 0
				, allowNull: false
				, default: ''
				, dbComment: 'Amount of the entry'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Amount'
				, formControl: 'Textbox'
				, captureRequired: true
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Amount'
				, tooltip: ''
				, isRecordName: true
				, gridOrder: 4
				, orderOnNew: 4
				, orderOnDetails: 4
				, orderOnEdit: 4
				, orderOnImport: 4
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'string'
				, dbName: 'ent_id_account'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 16
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Name for the account, appears on balance'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Account'
				, formControl: 'Textbox'
				, captureRequired: true
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Account'
				, tooltip: ''
				, isRecordName: true
				, gridOrder: 5
				, orderOnNew: 5
				, orderOnDetails: 5
				, orderOnEdit: 5
				, orderOnImport: 5
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'integer'
				, dbName: 'ent_ctg_type'
				, dbType: 'integer'
				, isTableField: true
				, isPK: false
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Type of Movement'
				, catalogId: 'MOVEMENT_TYPES'
				, originTable: ''
				, linkedField: ''
				, entName: 'MovementType'
				, formControl: 'Textbox'
				, captureRequired: true
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Movement Type'
				, tooltip: ''
				, isRecordName: true
				, gridOrder: 6
				, orderOnNew: 6
				, orderOnDetails: 6
				, orderOnEdit: 6
				, orderOnImport: 6
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'string'
				, dbName: 'ent_budget'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 50
				, decimal: 0
				, minLength: 1
				, allowNull: true
				, default: ''
				, dbComment: 'Monthly Budget where this movement sums up'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Budget'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Budget'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 7
				, orderOnNew: 7
				, orderOnDetails: 7
				, orderOnEdit: 7
				, orderOnImport: 7
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'string'
				, dbName: 'ent_id_category'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 32
				, decimal: 0
				, minLength: 32
				, allowNull: false
				, default: ''
				, dbComment: 'Category for this movement, helps grouping movements'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Category'
				, formControl: 'Textbox'
				, captureRequired: true
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Category'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 8
				, orderOnNew: 8
				, orderOnDetails: 8
				, orderOnEdit: 8
				, orderOnImport: 8
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'string'
				, dbName: 'ent_id_place'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 32
				, decimal: 0
				, minLength: 32
				, allowNull: false
				, default: ''
				, dbComment: 'Place where this movement was done, helps tracking movements'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Place'
				, formControl: 'Textbox'
				, captureRequired: true
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Place'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 9
				, orderOnNew: 9
				, orderOnDetails: 9
				, orderOnEdit: 9
				, orderOnImport: 9
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'string'
				, dbName: 'ent_desc'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 200
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Description of the movement, something to remember and track the movement'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Description'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Description'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 10
				, orderOnNew: 10
				, orderOnDetails: 10
				, orderOnEdit: 10
				, orderOnImport: 10
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'string'
				, dbName: 'ent_notes'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 200
				, decimal: 0
				, minLength: 1
				, allowNull: true
				, default: ''
				, dbComment: 'Notes to help tracking, grouping and identifying trends for movements'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Notes'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Notes'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 11
				, orderOnNew: 11
				, orderOnDetails: 11
				, orderOnEdit: 11
				, orderOnImport: 11
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'string'
				, dbName: 'ent_id_user'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 50
				, decimal: 0
				, minLength: 0
				, allowNull: false
				, default: ''
				, dbComment: 'User who this entry belongs to'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'User'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'User'
				, tooltip: ''
				, isRecordName: true
				, gridOrder: 12
				, orderOnNew: 12
				, orderOnDetails: 12
				, orderOnEdit: 12
				, orderOnImport: 12
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'creationDate'
				, dbName: 'ent_date_add'
				, dbType: 'datetime'
				, isTableField: true
				, isPK: false
				, size: 0
				, decimal: 0
				, minLength: 0
				, allowNull: false
				, default: ''
				, dbComment: 'Creation date of record in table'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'CreationDate'
				, formControl: 'Datetime'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
					'SAVE_DATE_AT_NEW'
				]
				, displayName: 'Creation Date'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 13
				, orderOnNew: 13
				, orderOnDetails: 13
				, orderOnEdit: 13
				, orderOnImport: 13
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'modificationDate'
				, dbName: 'ent_date_mod'
				, dbType: 'datetime'
				, isTableField: true
				, isPK: false
				, size: 0
				, decimal: 0
				, minLength: 0
				, allowNull: false
				, default: ''
				, dbComment: 'Last modification date of record in table'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'ModDate'
				, formControl: 'Datetime'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
					'SAVE_DATE_AT_NEW'
					, 'SAVE_DATE_AT_EDIT'
				]
				, displayName: 'Last Modification Date'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 14
				, orderOnNew: 14
				, orderOnDetails: 14
				, orderOnEdit: 14
				, orderOnImport: 14
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'status'
				, dbName: 'ent_ctg_status'
				, dbType: 'integer'
				, isTableField: true
				, isPK: false
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Record status in table'
				, catalogId: 'RECORD_STATUS'
				, originTable: 'CATALOG'
				, linkedField: ''
				, entName: 'Status'
				, formControl: 'Combobox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Status'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 15
				, orderOnNew: 15
				, orderOnDetails: 15
				, orderOnEdit: 15
				, orderOnImport: 15
				, globalOrder: undefined
				, value: null
			}, {
				templateId: 'catalog'
				, dbName: 'ent_txt_type'
				, dbType: 'string'
				, isTableField: false
				, isPK: false
				, size: 250
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Type of Movement'
				, catalogId: 'MOVEMENT_TYPES'
				, originTable: 'CATALOG'
				, linkedField: 'ent_ctg_type'
				, entName: 'TextMovementType'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Movement Type'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 16
				, orderOnNew: 16
				, orderOnDetails: 16
				, orderOnEdit: 16
				, orderOnImport: 16
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'catalog'
				, dbName: 'ent_txt_currency'
				, dbType: 'string'
				, isTableField: false
				, isPK: false
				, size: 250
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Currency of the entry'
				, catalogId: ''
				, originTable: 'CATALOG'
				, linkedField: 'ent_ctg_currency'
				, entName: 'TextCurrency'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Currency'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 17
				, orderOnNew: 17
				, orderOnDetails: 17
				, orderOnEdit: 17
				, orderOnImport: 17
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'table'
				, dbName: 'ent_txt_account'
				, dbType: 'string'
				, isTableField: false
				, isPK: false
				, size: 100
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: ''
				, catalogId: ''
				, originTable: 'ACCOUNT'
				, linkedField: 'ACCOUNT1.acc_name'
				, entName: ''
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: ''
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 18
				, orderOnNew: 18
				, orderOnDetails: 18
				, orderOnEdit: 18
				, orderOnImport: 18
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'table'
				, dbName: 'ent_txt_category'
				, dbType: 'string'
				, isTableField: false
				, isPK: false
				, size: 100
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: ''
				, catalogId: ''
				, originTable: 'CATEGORY'
				, linkedField: 'mct_name'
				, entName: ''
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: ''
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 19
				, orderOnNew: 19
				, orderOnDetails: 19
				, orderOnEdit: 19
				, orderOnImport: 19
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'table'
				, dbName: 'ent_txt_place'
				, dbType: 'string'
				, isTableField: false
				, isPK: false
				, size: 100
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: ''
				, catalogId: ''
				, originTable: 'PLACE'
				, linkedField: 'mpl_name'
				, entName: ''
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: ''
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 20
				, orderOnNew: 20
				, orderOnDetails: 20
				, orderOnEdit: 20
				, orderOnImport: 20
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'catalog'
				, dbName: 'ent_txt_status'
				, dbType: 'string'
				, isTableField: false
				, isPK: false
				, size: 250
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Record status in table'
				, catalogId: 'RECORD_STATUS'
				, originTable: 'CATALOG'
				, linkedField: 'ent_ctg_status'
				, entName: 'TextStatus'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Status'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 21
				, orderOnNew: 21
				, orderOnDetails: 21
				, orderOnEdit: 21
				, orderOnImport: 21
				, globalOrder: 0
				, value: null
			}
		]
		, view: [
			{
				joinType: 'INNER'
				, joinTable: 'ACCOUNT ACCOUNT1'
				, joinStatement: 'ent_id_account = ACCOUNT1.acc_id and ent_id_user = ACCOUNT1.acc_id_user'
			}, {
				joinType: 'LEFT'
				, joinTable: 'CATEGORY'
				, joinStatement: 'ent_id_category = mct_id and ent_id_user = mct_id_user'
			}, {
				joinType: 'LEFT'
				, joinTable: 'PLACE'
				, joinStatement: 'ent_id_place = mpl_id and ent_id_user = mpl_id_user'
			}
		]
	};

	constructor(base?: any){
		if (base !== undefined){
			this.ent_id = base.ent_id;
			this.ent_sequential = base.ent_sequential;
			this.ent_date = (base.ent_date !== null) ? new Date(base.ent_date) : null;
			this.ent_ctg_currency = base.ent_ctg_currency;
			this.ent_amount = base.ent_amount;
			this.ent_id_account = base.ent_id_account;
			this.ent_ctg_type = base.ent_ctg_type;
			this.ent_budget = base.ent_budget;
			this.ent_id_category = base.ent_id_category;
			this.ent_id_place = base.ent_id_place;
			this.ent_desc = base.ent_desc;
			this.ent_notes = base.ent_notes;
			this.ent_id_user = base.ent_id_user;
			this.ent_date_add = (base.ent_date_add !== null) ? new Date(base.ent_date_add) : null;
			this.ent_date_mod = (base.ent_date_mod !== null) ? new Date(base.ent_date_mod) : null;
			this.ent_ctg_status = base.ent_ctg_status;

			this.ent_txt_type = base.ent_txt_type;
			this.ent_txt_currency = base.ent_txt_currency;
			this.ent_txt_account = base.ent_txt_account;
			this.ent_txt_category = base.ent_txt_category;
			this.ent_txt_place = base.ent_txt_place;
			this.ent_txt_status = base.ent_txt_status;
		}
	}

	recordName = () => {
		return this.metadata.fields.filter(f => f.isRecordName).map(f => {
			return `${f.dbName} = ${this[f.dbName]}`;
		}).join(', ');
	};
}