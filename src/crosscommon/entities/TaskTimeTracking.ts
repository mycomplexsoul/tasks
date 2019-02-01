import { iEntity } from "../iEntity";
import { FieldDefinition } from "../FieldDefinition";
import { ViewJoinDefinition } from "../ViewJoinDefinition";

export class TaskTimeTracking implements iEntity {
	public tsh_id: string;
	public tsh_num_secuential: number;
	public tsh_name: string;
	public tsh_date_start: Date;
	public tsh_date_end: Date;
	public tsh_time_spent: number;
	public tsh_id_user: string;
	public tsh_date_add: Date;
	public tsh_date_mod: Date;

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
		name: 'TaskTimeTracking'
		, namespace: 'common'
		, removeMeans: 'DELETION'
		, authNeeded: false
		, displayOnMenu: false
		, prefix: 'tsh'
		, permissionsTemplate: 'permissions_all'
		, tableName: 'tasktimetracking'
		, viewName: 'vitasktimetracking'
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
			, 'HEADERS(Task Time Tracking,Tasks Time Tracking)'
			, 'TABLE_NAME(TASKTIMETRACKING)'
			, 'VIEW_NAME(VITASKTIMETRACKING)'
		]
		, fields: [
			{
				templateId: 'string'
				, dbName: 'tsh_id'
				, dbType: 'string'
				, isTableField: true
				, isPK: true
				, size: 32
				, decimal: 0
				, minLength: 32
				, allowNull: false
				, default: ''
				, dbComment: 'Id for the task'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'TaskId'
				, formControl: 'Textbox'
				, captureRequired: true
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Task Id'
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
				, dbName: 'tsh_num_secuential'
				, dbType: 'integer'
				, isTableField: true
				, isPK: true
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Secuential assigned, ordering the time tracking records precedence in time for the task'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Secuential'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
					'DUPLICITY_ADD(tsh_id)'
				]
				, displayName: 'Secuential'
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
				, dbName: 'tsh_name'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 500
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Name of the task, meaning the task itself'
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
				, isRecordName: true
				, gridOrder: 2
				, orderOnNew: 2
				, orderOnDetails: 2
				, orderOnEdit: 2
				, orderOnImport: 2
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'datetime'
				, dbName: 'tsh_date_start'
				, dbType: 'datetime'
				, isTableField: true
				, isPK: false
				, size: 16
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Date where the tracking started, indicating beginning of task attendance'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'StartDate'
				, formControl: 'datetime'
				, captureRequired: true
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Start Date'
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
				templateId: 'datetime'
				, dbName: 'tsh_date_end'
				, dbType: 'datetime'
				, isTableField: true
				, isPK: false
				, size: 16
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Date where the tracking ended, indicating stop of task attendance'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'EndDate'
				, formControl: 'datetime'
				, captureRequired: true
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'End Date'
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
				templateId: 'long'
				, dbName: 'tsh_time_spent'
				, dbType: 'long'
				, isTableField: true
				, isPK: false
				, size: 9
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Time spent attending this task'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'TimeSpent'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Time Spent'
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
				templateId: 'user'
				, dbName: 'tsh_id_user'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 50
				, decimal: 0
				, minLength: 0
				, allowNull: false
				, default: ''
				, dbComment: 'User who attended this task time entry'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'User'
				, formControl: 'Combobox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'User'
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
				templateId: 'creationDate'
				, dbName: 'tsh_date_add'
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
				, dbName: 'tsh_date_mod'
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
			}
		]
		, view: [
		]
	};

	constructor(base?: any){
		if (base !== undefined){
			this.tsh_id = base.tsh_id;
			this.tsh_num_secuential = base.tsh_num_secuential;
			this.tsh_name = base.tsh_name;
			this.tsh_date_start = (base.tsh_date_start !== null) ? new Date(base.tsh_date_start) : null;
			this.tsh_date_end = (base.tsh_date_end !== null) ? new Date(base.tsh_date_end) : null;
			this.tsh_time_spent = base.tsh_time_spent;
			this.tsh_id_user = base.tsh_id_user;
			this.tsh_date_add = (base.tsh_date_add !== null) ? new Date(base.tsh_date_add) : null;
			this.tsh_date_mod = (base.tsh_date_mod !== null) ? new Date(base.tsh_date_mod) : null;
		}
	}

	recordName = () => {
		return this.metadata.fields.filter(f => f.isRecordName).map(f => {
			return `${f.dbName} = ${this[f.dbName]}`;
		}).join(', ');
	};
}