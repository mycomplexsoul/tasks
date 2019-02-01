import { iEntity } from "../iEntity";
import { FieldDefinition } from "../FieldDefinition";
import { ViewJoinDefinition } from "../ViewJoinDefinition";

export class Catalog implements iEntity {
	public ctg_id: string;
	public ctg_sequential: number;
	public ctg_name: string;
	public ctg_description: string;
	public ctg_meta1: string;
	public ctg_meta2: string;
	public ctg_ctg_permissions: number;
	public ctg_date_add: Date;
	public ctg_date_mod: Date;
	public ctg_ctg_status: number;

	public ctg_txt_permissions: string;
	public ctg_txt_status: string;

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
		name: 'Catalog'
		, namespace: 'common'
		, removeMeans: 'DELETION'
		, authNeeded: false
		, displayOnMenu: false
		, prefix: 'ctg'
		, permissionsTemplate: 'permissions_all'
		, tableName: 'catalog'
		, viewName: 'vicatalog'
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
			'AUTONUMERIC'
			, 'HEADERS(Catalog,Catalogues)'
			, 'TABLE_NAME(CATALOG)'
			, 'VIEW_NAME(VICATALOG)'
		]
		, fields: [
			{
				templateId: 'string'
				, dbName: 'ctg_id'
				, dbType: 'string'
				, isTableField: true
				, isPK: true
				, size: 20
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Id for the catalog'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'CatalogId'
				, formControl: 'Textbox'
				, captureRequired: true
				, appearsByDefaultOnGrid: true
				, specialRules: [
					'DUPLICITY_ADD'
				]
				, displayName: 'Catalog Id'
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
				, dbName: 'ctg_sequential'
				, dbType: 'integer'
				, isTableField: true
				, isPK: true
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Unique sequential inside the catalog, starting on 1'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Sequential'
				, formControl: 'Textbox'
				, captureRequired: true
				, appearsByDefaultOnGrid: true
				, specialRules: [
					'AUTONUM(CTG_ID)'
				]
				, displayName: 'Sequential Number'
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
				templateId: 'string'
				, dbName: 'ctg_name'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 150
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Identifier to use when showing the field value'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Name'
				, formControl: 'Textbox'
				, captureRequired: true
				, appearsByDefaultOnGrid: true
				, specialRules: [
					'DUPLICITY_ADD(CTG_ID)'
					, 'DUPLICITY_EDIT(CTG_ID)'
				]
				, displayName: 'Name'
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
				templateId: 'string'
				, dbName: 'ctg_description'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 250
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Explain how is this value intended to be used'
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
				, gridOrder: 3
				, orderOnNew: 3
				, orderOnDetails: 3
				, orderOnEdit: 3
				, orderOnImport: 3
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'string'
				, dbName: 'ctg_meta1'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 250
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Any metadata related to this value'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Metadata1'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Metadata 1'
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
				templateId: 'string'
				, dbName: 'ctg_meta2'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 250
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Any other metadata related to this value'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Metadata2'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Metadata 2'
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
				templateId: 'integer'
				, dbName: 'ctg_ctg_permissions'
				, dbType: 'integer'
				, isTableField: true
				, isPK: false
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Permissions on this record or related records'
				, catalogId: 'CATALOG_PERMISSIONS'
				, originTable: ''
				, linkedField: ''
				, entName: 'Permission'
				, formControl: 'Textbox'
				, captureRequired: true
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Permission Level'
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
				templateId: 'creationDate'
				, dbName: 'ctg_date_add'
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
				, gridOrder: 7
				, orderOnNew: 7
				, orderOnDetails: 7
				, orderOnEdit: 7
				, orderOnImport: 7
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'modificationDate'
				, dbName: 'ctg_date_mod'
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
				, gridOrder: 8
				, orderOnNew: 8
				, orderOnDetails: 8
				, orderOnEdit: 8
				, orderOnImport: 8
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'status'
				, dbName: 'ctg_ctg_status'
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
				, gridOrder: 9
				, orderOnNew: 9
				, orderOnDetails: 9
				, orderOnEdit: 9
				, orderOnImport: 9
				, globalOrder: undefined
				, value: null
			}, {
				templateId: 'catalog'
				, dbName: 'ctg_txt_permissions'
				, dbType: 'string'
				, isTableField: false
				, isPK: false
				, size: 250
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Permissions on this record or related records'
				, catalogId: 'CATALOG_PERMISSIONS'
				, originTable: 'CATALOG'
				, linkedField: 'ctg_ctg_permissions'
				, entName: 'TextPermission'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Permission Level'
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
				templateId: 'catalog'
				, dbName: 'ctg_txt_status'
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
				, linkedField: 'ctg_ctg_status'
				, entName: 'TextStatus'
				, formControl: 'Textbox'
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
				, globalOrder: 0
				, value: null
			}
		]
		, view: [
			{
				joinType: 'INNER'
				, joinTable: 'CATALOG CATALOG2'
				, joinStatement: 'CATALOG.CTG_ID = CATALOG2.CTG_ID AND CATALOG.CTG_SEQUENTIAL = CATALOG2.CTG_SEQUENTIAL'
			}
		]
	};

	constructor(base?: any){
		if (base !== undefined){
			this.ctg_id = base.ctg_id;
			this.ctg_sequential = base.ctg_sequential;
			this.ctg_name = base.ctg_name;
			this.ctg_description = base.ctg_description;
			this.ctg_meta1 = base.ctg_meta1;
			this.ctg_meta2 = base.ctg_meta2;
			this.ctg_ctg_permissions = base.ctg_ctg_permissions;
			this.ctg_date_add = (base.ctg_date_add !== null) ? new Date(base.ctg_date_add) : null;
			this.ctg_date_mod = (base.ctg_date_mod !== null) ? new Date(base.ctg_date_mod) : null;
			this.ctg_ctg_status = base.ctg_ctg_status;

			this.ctg_txt_permissions = base.ctg_txt_permissions;
			this.ctg_txt_status = base.ctg_txt_status;
		}
	}

	recordName = () => {
		return this.metadata.fields.filter(f => f.isRecordName).map(f => {
			return `${f.dbName} = ${this[f.dbName]}`;
		}).join(', ');
	};
}