import { iEntity } from "../iEntity";
import { FieldDefinition } from "../FieldDefinition";

export class Place implements iEntity {
	public mpl_id: string;
	public mpl_name: string;
	public mpl_id_user: string;
	public mpl_date_add: Date;
	public mpl_date_mod: Date;
	public mpl_ctg_status: number;

	public mpl_txt_status: string;

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
	} = {
		name: 'Place'
		, namespace: 'Money'
		, removeMeans: 'CANCELATION'
		, authNeeded: false
		, displayOnMenu: true
		, prefix: 'mpl'
		, permissionsTemplate: 'permissions_all'
		, tableName: 'place'
		, viewName: 'viplace'
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
			'HEADERS(Place,Places)'
			, 'TABLE_NAME(PLACE)'
			, 'VIEW_NAME(VIPLACE)'
		]
		, fields: [
			{
				templateId: 'string'
				, dbName: 'mpl_id'
				, dbType: 'string'
				, isTableField: true
				, isPK: true
				, size: 32
				, decimal: 0
				, minLength: 32
				, allowNull: false
				, default: ''
				, dbComment: 'Id for the place'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'PlaceId'
				, formControl: 'Textbox'
				, captureRequired: true
				, appearsByDefaultOnGrid: true
				, specialRules: [
					'DUPLICITY_ADD'
				]
				, displayName: 'Place Id'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 0
				, orderOnNew: 0
				, orderOnDetails: 0
				, orderOnEdit: 0
				, orderOnImport: 0
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'string'
				, dbName: 'mpl_name'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 100
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Name for the place'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Name'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Name'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 1
				, orderOnNew: 1
				, orderOnDetails: 1
				, orderOnEdit: 1
				, orderOnImport: 1
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'string'
				, dbName: 'mpl_id_user'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 50
				, decimal: 0
				, minLength: 0
				, allowNull: false
				, default: ''
				, dbComment: 'User who this place belongs to'
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
				, isRecordName: false
				, gridOrder: 2
				, orderOnNew: 2
				, orderOnDetails: 2
				, orderOnEdit: 2
				, orderOnImport: 2
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'creationDate'
				, dbName: 'mpl_date_add'
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
				, gridOrder: 3
				, orderOnNew: 3
				, orderOnDetails: 3
				, orderOnEdit: 3
				, orderOnImport: 3
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'modificationDate'
				, dbName: 'mpl_date_mod'
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
				, gridOrder: 4
				, orderOnNew: 4
				, orderOnDetails: 4
				, orderOnEdit: 4
				, orderOnImport: 4
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'status'
				, dbName: 'mpl_ctg_status'
				, dbType: 'integer'
				, isTableField: true
				, isPK: undefined
				, size: 4
				, decimal: undefined
				, minLength: 1
				, allowNull: undefined
				, default: 'undefined'
				, dbComment: 'Record status in table'
				, catalogId: 'RECORD_STATUS'
				, originTable: 'CATALOG'
				, linkedField: 'undefined'
				, entName: 'Status'
				, formControl: 'Combobox'
				, captureRequired: undefined
				, appearsByDefaultOnGrid: undefined
				, specialRules: [
				]
				, displayName: 'Status'
				, tooltip: 'undefined'
				, isRecordName: undefined
				, gridOrder: 5
				, orderOnNew: 5
				, orderOnDetails: 5
				, orderOnEdit: 5
				, orderOnImport: 5
				, globalOrder: undefined
				, value: null
			}, {
				templateId: 'catalog'
				, dbName: 'mpl_txt_status'
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
				, linkedField: 'mpl_ctg_status'
				, entName: 'TextStatus'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Status'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 6
				, orderOnNew: 6
				, orderOnDetails: 6
				, orderOnEdit: 6
				, orderOnImport: 6
				, globalOrder: 0
				, value: null
			}
		]
	};

	constructor(base?: any){
		if (base !== undefined){
			this.mpl_id = base.mpl_id;
			this.mpl_name = base.mpl_name;
			this.mpl_id_user = base.mpl_id_user;
			this.mpl_date_add = new Date(base.mpl_date_add);
			this.mpl_date_mod = new Date(base.mpl_date_mod);
			this.mpl_ctg_status = base.mpl_ctg_status;

			this.mpl_txt_status = base.mpl_txt_status;
		}
	}

	recordName = () => {
		return this.metadata.fields.filter(f => f.isRecordName).map(f => {
			return `${f.dbName} = ${this[f.dbName]}`;
		}).join(', ');
	};
}