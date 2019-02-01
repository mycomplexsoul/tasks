import { iEntity } from "../iEntity";
import { FieldDefinition } from "../FieldDefinition";
import { ViewJoinDefinition } from "../ViewJoinDefinition";

export class Balance implements iEntity {
	public bal_year: number;
	public bal_month: number;
	public bal_ctg_currency: number;
	public bal_id_account: string;
	public bal_initial: number;
	public bal_charges: number;
	public bal_withdrawals: number;
	public bal_final: number;
	public bal_id_user: string;
	public bal_date_add: Date;
	public bal_date_mod: Date;
	public bal_ctg_status: number;

	public bal_txt_account: string;
	public bal_txt_currency: string;
	public bal_txt_status: string;

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
		name: 'Balance'
		, namespace: 'Money'
		, removeMeans: 'CANCELATION'
		, authNeeded: false
		, displayOnMenu: true
		, prefix: 'bal'
		, permissionsTemplate: 'permissions_all'
		, tableName: 'balance'
		, viewName: 'vibalance'
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
			'HEADERS(Balance,Balance)'
			, 'TABLE_NAME(BALANCE)'
			, 'VIEW_NAME(VIBALANCE)'
		]
		, fields: [
			{
				templateId: 'integer'
				, dbName: 'bal_year'
				, dbType: 'integer'
				, isTableField: true
				, isPK: true
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Year of the balance record'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Year'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
					'DUPLICITY_ADD(bal_year,bal_month,bal_ctg_currency,bal_id_account)'
				]
				, displayName: 'Year'
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
				, dbName: 'bal_month'
				, dbType: 'integer'
				, isTableField: true
				, isPK: true
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Month of the balance record'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Month'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
					'DUPLICITY_ADD(bal_year,bal_month,bal_ctg_currency,bal_id_account)'
				]
				, displayName: 'Month'
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
				templateId: 'integer'
				, dbName: 'bal_ctg_currency'
				, dbType: 'integer'
				, isTableField: true
				, isPK: true
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Currency of the balance record'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Currency'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
					'DUPLICITY_ADD(bal_year,bal_month,bal_ctg_currency,bal_id_account)'
				]
				, displayName: 'Currency'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 2
				, orderOnNew: 2
				, orderOnDetails: 2
				, orderOnEdit: 2
				, orderOnImport: 2
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'string'
				, dbName: 'bal_id_account'
				, dbType: 'string'
				, isTableField: true
				, isPK: true
				, size: 16
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Name for the account'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Account'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Account'
				, tooltip: ''
				, isRecordName: true
				, gridOrder: 3
				, orderOnNew: 3
				, orderOnDetails: 3
				, orderOnEdit: 3
				, orderOnImport: 3
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'double'
				, dbName: 'bal_initial'
				, dbType: 'double'
				, isTableField: true
				, isPK: false
				, size: 19
				, decimal: 2
				, minLength: 0
				, allowNull: false
				, default: ''
				, dbComment: 'Initial balance of the record'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Initial'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Initial'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 4
				, orderOnNew: 4
				, orderOnDetails: 4
				, orderOnEdit: 4
				, orderOnImport: 4
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'double'
				, dbName: 'bal_charges'
				, dbType: 'double'
				, isTableField: true
				, isPK: false
				, size: 19
				, decimal: 2
				, minLength: 0
				, allowNull: false
				, default: ''
				, dbComment: 'Charges of the record'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Charges'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Charges'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 5
				, orderOnNew: 5
				, orderOnDetails: 5
				, orderOnEdit: 5
				, orderOnImport: 5
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'double'
				, dbName: 'bal_withdrawals'
				, dbType: 'double'
				, isTableField: true
				, isPK: false
				, size: 19
				, decimal: 2
				, minLength: 0
				, allowNull: false
				, default: ''
				, dbComment: 'Withdrawals of the record'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Withdrawals'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Withdrawals'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 6
				, orderOnNew: 6
				, orderOnDetails: 6
				, orderOnEdit: 6
				, orderOnImport: 6
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'double'
				, dbName: 'bal_final'
				, dbType: 'double'
				, isTableField: true
				, isPK: false
				, size: 19
				, decimal: 2
				, minLength: 0
				, allowNull: false
				, default: ''
				, dbComment: 'Final balance of the record'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Final'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Final'
				, tooltip: ''
				, isRecordName: true
				, gridOrder: 7
				, orderOnNew: 7
				, orderOnDetails: 7
				, orderOnEdit: 7
				, orderOnImport: 7
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'string'
				, dbName: 'bal_id_user'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 50
				, decimal: 0
				, minLength: 0
				, allowNull: false
				, default: ''
				, dbComment: 'User who this balance record belongs to'
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
				, gridOrder: 8
				, orderOnNew: 8
				, orderOnDetails: 8
				, orderOnEdit: 8
				, orderOnImport: 8
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'creationDate'
				, dbName: 'bal_date_add'
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
				, gridOrder: 9
				, orderOnNew: 9
				, orderOnDetails: 9
				, orderOnEdit: 9
				, orderOnImport: 9
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'modificationDate'
				, dbName: 'bal_date_mod'
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
				, gridOrder: 10
				, orderOnNew: 10
				, orderOnDetails: 10
				, orderOnEdit: 10
				, orderOnImport: 10
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'status'
				, dbName: 'bal_ctg_status'
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
				, gridOrder: 11
				, orderOnNew: 11
				, orderOnDetails: 11
				, orderOnEdit: 11
				, orderOnImport: 11
				, globalOrder: undefined
				, value: null
			}, {
				templateId: 'table'
				, dbName: 'bal_txt_account'
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
				, gridOrder: 12
				, orderOnNew: 12
				, orderOnDetails: 12
				, orderOnEdit: 12
				, orderOnImport: 12
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'catalog'
				, dbName: 'bal_txt_currency'
				, dbType: 'string'
				, isTableField: false
				, isPK: false
				, size: 250
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Currency of the balance record'
				, catalogId: ''
				, originTable: 'CATALOG'
				, linkedField: 'bal_ctg_currency'
				, entName: 'TextCurrency'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Currency'
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
				templateId: 'catalog'
				, dbName: 'bal_txt_status'
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
				, linkedField: 'bal_ctg_status'
				, entName: 'TextStatus'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Status'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 14
				, orderOnNew: 14
				, orderOnDetails: 14
				, orderOnEdit: 14
				, orderOnImport: 14
				, globalOrder: 0
				, value: null
			}
		]
		, view: [
			{
				joinType: 'INNER'
				, joinTable: 'ACCOUNT ACCOUNT1'
				, joinStatement: 'bal_id_account = ACCOUNT1.acc_id and bal_id_user = ACCOUNT1.acc_id_user'
			}
		]
	};

	constructor(base?: any){
		if (base !== undefined){
			this.bal_year = base.bal_year;
			this.bal_month = base.bal_month;
			this.bal_ctg_currency = base.bal_ctg_currency;
			this.bal_id_account = base.bal_id_account;
			this.bal_initial = base.bal_initial;
			this.bal_charges = base.bal_charges;
			this.bal_withdrawals = base.bal_withdrawals;
			this.bal_final = base.bal_final;
			this.bal_id_user = base.bal_id_user;
			this.bal_date_add = (base.bal_date_add !== null) ? new Date(base.bal_date_add) : null;
			this.bal_date_mod = (base.bal_date_mod !== null) ? new Date(base.bal_date_mod) : null;
			this.bal_ctg_status = base.bal_ctg_status;

			this.bal_txt_account = base.bal_txt_account;
			this.bal_txt_currency = base.bal_txt_currency;
			this.bal_txt_status = base.bal_txt_status;
		}
	}

	recordName = () => {
		return this.metadata.fields.filter(f => f.isRecordName).map(f => {
			return `${f.dbName} = ${this[f.dbName]}`;
		}).join(', ');
	};
}