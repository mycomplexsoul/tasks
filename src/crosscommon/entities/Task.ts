import { iEntity } from "../iEntity";
import { FieldDefinition } from "../FieldDefinition";
import { ViewJoinDefinition } from "../ViewJoinDefinition";

export class Task implements iEntity {
	public tsk_id: string;
	public tsk_id_container: string;
	public tsk_id_record: string;
	public tsk_name: string;
	public tsk_notes: string;
	public tsk_parent: string;
	public tsk_order: number;
	public tsk_date_done: Date;
	public tsk_total_time_spent: number;
	public tsk_ctg_in_process: number;
	public tsk_qualifiers: string;
	public tsk_tags: string;
	public tsk_estimated_duration: number;
	public tsk_schedule_date_start: Date;
	public tsk_schedule_date_end: Date;
	public tsk_date_view_until: Date;
	public tsk_id_user_added: string;
	public tsk_id_user_asigned: string;
	public tsk_template: string;
	public tsk_template_state: string;
	public tsk_date_due: Date;
	public tsk_id_related: string;
	public tsk_url: string;
	public tsk_ctg_repeats: number;
	public tsk_id_main: string;
	public tsk_ctg_rep_type: number;
	public tsk_ctg_rep_after_completion: number;
	public tsk_ctg_rep_end: number;
	public tsk_rep_date_end: Date;
	public tsk_rep_end_iteration: number;
	public tsk_rep_iteration: number;
	public tsk_rep_frequency: number;
	public tsk_ctg_rep_frequency_rule: number;
	public tsk_rep_weekdays: string;
	public tsk_date_add: Date;
	public tsk_date_mod: Date;
	public tsk_ctg_status: number;

	public tsk_txt_in_process: string;
	public tsk_txt_repeats: string;
	public tsk_txt_rep_type: string;
	public tsk_txt_rep_after_completion: string;
	public tsk_txt_rep_end: string;
	public tsk_txt_rep_frequency_rule: string;
	public tsk_txt_status: string;

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
		name: 'Task'
		, namespace: 'common'
		, removeMeans: 'CANCELATION'
		, authNeeded: false
		, displayOnMenu: false
		, prefix: 'tsk'
		, permissionsTemplate: 'permissions_all'
		, tableName: 'task'
		, viewName: 'vitask'
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
			, 'HEADERS(Task,Tasks)'
			, 'TABLE_NAME(TASK)'
			, 'VIEW_NAME(VITASK)'
		]
		, fields: [
			{
				templateId: 'string'
				, dbName: 'tsk_id'
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
					'DUPLICITY_ADD'
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
				templateId: 'string'
				, dbName: 'tsk_id_container'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 50
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Container group id for multiple tasks'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'ContainerId'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Container Id'
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
				, dbName: 'tsk_id_record'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 20
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Record id for multiple tasks grouping'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'RecordId'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Record Id'
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
				, dbName: 'tsk_name'
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
				, gridOrder: 3
				, orderOnNew: 3
				, orderOnDetails: 3
				, orderOnEdit: 3
				, orderOnImport: 3
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'string'
				, dbName: 'tsk_notes'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 4000
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Notes for the task, details'
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
				, gridOrder: 4
				, orderOnNew: 4
				, orderOnDetails: 4
				, orderOnEdit: 4
				, orderOnImport: 4
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'string'
				, dbName: 'tsk_parent'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 32
				, decimal: 0
				, minLength: 32
				, allowNull: true
				, default: ''
				, dbComment: 'Parent task of this subtask'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Parent'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Parent'
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
				, dbName: 'tsk_order'
				, dbType: 'integer'
				, isTableField: true
				, isPK: false
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Order used to be displayed in list'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Order'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Order'
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
				templateId: 'datetime'
				, dbName: 'tsk_date_done'
				, dbType: 'datetime'
				, isTableField: true
				, isPK: false
				, size: 16
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Date when the task is marked as done'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'DoneDate'
				, formControl: 'datetime'
				, captureRequired: true
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Date of Termination'
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
				templateId: 'long'
				, dbName: 'tsk_total_time_spent'
				, dbType: 'long'
				, isTableField: true
				, isPK: false
				, size: 9
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Total time spent attending this task'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'TotalTimeSpent'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Total Time Spent'
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
				templateId: 'integer'
				, dbName: 'tsk_ctg_in_process'
				, dbType: 'integer'
				, isTableField: true
				, isPK: false
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Indicates if this task is currently being attended or not'
				, catalogId: 'BOOLEAN'
				, originTable: ''
				, linkedField: ''
				, entName: 'InProgress'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'In Progress'
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
				, dbName: 'tsk_qualifiers'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 100
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Qualifiers used to enhance this task'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Qualifiers'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Qualifiers'
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
				, dbName: 'tsk_tags'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 200
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Tags used to group tasks'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Tags'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Tags'
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
				templateId: 'long'
				, dbName: 'tsk_estimated_duration'
				, dbType: 'long'
				, isTableField: true
				, isPK: false
				, size: 9
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Total time estimated to be taken attending this task'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'EstimatedDuration'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Estimated Duration'
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
				templateId: 'datetime'
				, dbName: 'tsk_schedule_date_start'
				, dbType: 'datetime'
				, isTableField: true
				, isPK: false
				, size: 16
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Schedule date and time for the task to be attended'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'ScheduleDateStart'
				, formControl: 'datetime'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Schedule Date Start'
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
				templateId: 'datetime'
				, dbName: 'tsk_schedule_date_end'
				, dbType: 'datetime'
				, isTableField: true
				, isPK: false
				, size: 16
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Schedule date and time for the task to be finished'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'ScheduleDateEnd'
				, formControl: 'datetime'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Schedule Date End'
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
				templateId: 'datetime'
				, dbName: 'tsk_date_view_until'
				, dbType: 'datetime'
				, isTableField: true
				, isPK: false
				, size: 16
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Date and time until this task must be shown, until then it should be hidden'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'DateUntilView'
				, formControl: 'datetime'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Date Until View'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 15
				, orderOnNew: 15
				, orderOnDetails: 15
				, orderOnEdit: 15
				, orderOnImport: 15
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'string'
				, dbName: 'tsk_id_user_added'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 50
				, decimal: 0
				, minLength: 0
				, allowNull: false
				, default: ''
				, dbComment: 'User who created this task'
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
				, gridOrder: 16
				, orderOnNew: 16
				, orderOnDetails: 16
				, orderOnEdit: 16
				, orderOnImport: 16
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'string'
				, dbName: 'tsk_id_user_asigned'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 50
				, decimal: 0
				, minLength: 0
				, allowNull: false
				, default: ''
				, dbComment: 'User who has been asigned to attend this task'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'UserAsigned'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'User Asigned'
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
				templateId: 'string'
				, dbName: 'tsk_template'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 500
				, decimal: 0
				, minLength: 1
				, allowNull: true
				, default: ''
				, dbComment: 'Template of the task, used for variable substitution on task creation'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Template'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Template'
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
				templateId: 'string'
				, dbName: 'tsk_template_state'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 4000
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'State of variables used to substitute values in the template'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'TemplateState'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Template State'
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
				templateId: 'datetime'
				, dbName: 'tsk_date_due'
				, dbType: 'datetime'
				, isTableField: true
				, isPK: false
				, size: 16
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Date when the task should be completed'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'DueDate'
				, formControl: 'datetime'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Due Date'
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
				templateId: 'string'
				, dbName: 'tsk_id_related'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 32
				, decimal: 0
				, minLength: 32
				, allowNull: true
				, default: ''
				, dbComment: 'Id of a related task'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'RelatedTaskId'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Related Task Id'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 21
				, orderOnNew: 21
				, orderOnDetails: 21
				, orderOnEdit: 21
				, orderOnImport: 21
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'string'
				, dbName: 'tsk_url'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 4000
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Url related to the task'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Url'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Url'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 22
				, orderOnNew: 22
				, orderOnDetails: 22
				, orderOnEdit: 22
				, orderOnImport: 22
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'integer'
				, dbName: 'tsk_ctg_repeats'
				, dbType: 'integer'
				, isTableField: true
				, isPK: false
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Indicates if this task repeats itself as a new undone task when finished'
				, catalogId: 'BOOLEAN'
				, originTable: ''
				, linkedField: ''
				, entName: 'Repeats'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Repeats'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 23
				, orderOnNew: 23
				, orderOnDetails: 23
				, orderOnEdit: 23
				, orderOnImport: 23
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'string'
				, dbName: 'tsk_id_main'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 32
				, decimal: 0
				, minLength: 32
				, allowNull: true
				, default: ''
				, dbComment: 'Id of the main task that configured the repetition rules'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'RepetitionMainTaskId'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Repetition Main Task Id'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 24
				, orderOnNew: 24
				, orderOnDetails: 24
				, orderOnEdit: 24
				, orderOnImport: 24
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'integer'
				, dbName: 'tsk_ctg_rep_type'
				, dbType: 'integer'
				, isTableField: true
				, isPK: false
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Indicates the repetition rule that applies to the task when finished'
				, catalogId: 'TASK_REPETITION_TYPE'
				, originTable: ''
				, linkedField: ''
				, entName: 'RepetitionType'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Repetition Type'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 25
				, orderOnNew: 25
				, orderOnDetails: 25
				, orderOnEdit: 25
				, orderOnImport: 25
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'integer'
				, dbName: 'tsk_ctg_rep_after_completion'
				, dbType: 'integer'
				, isTableField: true
				, isPK: false
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Indicates the repetition projection should be calculated after the repetition or not'
				, catalogId: 'BOOLEAN'
				, originTable: ''
				, linkedField: ''
				, entName: 'RepeatAfterCompletion'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Repeat After Completion'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 26
				, orderOnNew: 26
				, orderOnDetails: 26
				, orderOnEdit: 26
				, orderOnImport: 26
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'integer'
				, dbName: 'tsk_ctg_rep_end'
				, dbType: 'integer'
				, isTableField: true
				, isPK: false
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Indicates the repetition end rule'
				, catalogId: 'TASK_REPETITION_END_AT'
				, originTable: ''
				, linkedField: ''
				, entName: 'RepetitionEnd'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Repetition Ends At'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 27
				, orderOnNew: 27
				, orderOnDetails: 27
				, orderOnEdit: 27
				, orderOnImport: 27
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'datetime'
				, dbName: 'tsk_rep_date_end'
				, dbType: 'datetime'
				, isTableField: true
				, isPK: false
				, size: 16
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Date when the repetitions end'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'RepetitionEndDate'
				, formControl: 'datetime'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Repetition End Date'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 28
				, orderOnNew: 28
				, orderOnDetails: 28
				, orderOnEdit: 28
				, orderOnImport: 28
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'integer'
				, dbName: 'tsk_rep_end_iteration'
				, dbType: 'integer'
				, isTableField: true
				, isPK: false
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Total number of iterations that the task should be done to end repetition'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'RepetitionEndIterations'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Repetition End Iterations'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 29
				, orderOnNew: 29
				, orderOnDetails: 29
				, orderOnEdit: 29
				, orderOnImport: 29
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'integer'
				, dbName: 'tsk_rep_iteration'
				, dbType: 'integer'
				, isTableField: true
				, isPK: false
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Number of iteration of this task'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'RepetitionIteration'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Repetition Iteration'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 30
				, orderOnNew: 30
				, orderOnDetails: 30
				, orderOnEdit: 30
				, orderOnImport: 30
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'integer'
				, dbName: 'tsk_rep_frequency'
				, dbType: 'integer'
				, isTableField: true
				, isPK: false
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Frequency of repetition'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'RepetitionFrequency'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Repetition Frequency'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 31
				, orderOnNew: 31
				, orderOnDetails: 31
				, orderOnEdit: 31
				, orderOnImport: 31
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'integer'
				, dbName: 'tsk_ctg_rep_frequency_rule'
				, dbType: 'integer'
				, isTableField: true
				, isPK: false
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Indicates the repetition frequency rule'
				, catalogId: 'TASK_REPETITION_FREQUENCY'
				, originTable: ''
				, linkedField: ''
				, entName: 'RepetitionFrequencyRule'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Repetition Frequency Rule'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 32
				, orderOnNew: 32
				, orderOnDetails: 32
				, orderOnEdit: 32
				, orderOnImport: 32
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'string'
				, dbName: 'tsk_rep_weekdays'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 7
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Selected days of the week on task repetition'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'RepetitionWeekdays'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Repetition Days of the Week'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 33
				, orderOnNew: 33
				, orderOnDetails: 33
				, orderOnEdit: 33
				, orderOnImport: 33
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'creationDate'
				, dbName: 'tsk_date_add'
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
				, gridOrder: 34
				, orderOnNew: 34
				, orderOnDetails: 34
				, orderOnEdit: 34
				, orderOnImport: 34
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'modificationDate'
				, dbName: 'tsk_date_mod'
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
				, gridOrder: 35
				, orderOnNew: 35
				, orderOnDetails: 35
				, orderOnEdit: 35
				, orderOnImport: 35
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'status'
				, dbName: 'tsk_ctg_status'
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
				, gridOrder: 36
				, orderOnNew: 36
				, orderOnDetails: 36
				, orderOnEdit: 36
				, orderOnImport: 36
				, globalOrder: undefined
				, value: null
			}, {
				templateId: 'catalog'
				, dbName: 'tsk_txt_in_process'
				, dbType: 'string'
				, isTableField: false
				, isPK: false
				, size: 250
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Indicates if this task is currently being attended or not'
				, catalogId: 'BOOLEAN'
				, originTable: 'CATALOG'
				, linkedField: 'tsk_ctg_in_process'
				, entName: 'TextInProgress'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'In Progress'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 37
				, orderOnNew: 37
				, orderOnDetails: 37
				, orderOnEdit: 37
				, orderOnImport: 37
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'catalog'
				, dbName: 'tsk_txt_repeats'
				, dbType: 'string'
				, isTableField: false
				, isPK: false
				, size: 250
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Indicates if this task repeats itself as a new undone task when finished'
				, catalogId: 'BOOLEAN'
				, originTable: 'CATALOG'
				, linkedField: 'tsk_ctg_repeats'
				, entName: 'TextRepeats'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Repeats'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 38
				, orderOnNew: 38
				, orderOnDetails: 38
				, orderOnEdit: 38
				, orderOnImport: 38
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'catalog'
				, dbName: 'tsk_txt_rep_type'
				, dbType: 'string'
				, isTableField: false
				, isPK: false
				, size: 250
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Indicates the repetition rule that applies to the task when finished'
				, catalogId: 'TASK_REPETITION_TYPE'
				, originTable: 'CATALOG'
				, linkedField: 'tsk_ctg_rep_type'
				, entName: 'TextRepetitionType'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Repetition Type'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 39
				, orderOnNew: 39
				, orderOnDetails: 39
				, orderOnEdit: 39
				, orderOnImport: 39
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'catalog'
				, dbName: 'tsk_txt_rep_after_completion'
				, dbType: 'string'
				, isTableField: false
				, isPK: false
				, size: 250
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Indicates the repetition projection should be calculated after the repetition or not'
				, catalogId: 'BOOLEAN'
				, originTable: 'CATALOG'
				, linkedField: 'tsk_ctg_rep_after_completion'
				, entName: 'TextRepeatAfterCompletion'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Repeat After Completion'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 40
				, orderOnNew: 40
				, orderOnDetails: 40
				, orderOnEdit: 40
				, orderOnImport: 40
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'catalog'
				, dbName: 'tsk_txt_rep_end'
				, dbType: 'string'
				, isTableField: false
				, isPK: false
				, size: 250
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Indicates the repetition end rule'
				, catalogId: 'TASK_REPETITION_END_AT'
				, originTable: 'CATALOG'
				, linkedField: 'tsk_ctg_rep_end'
				, entName: 'TextRepetitionEnd'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Repetition Ends At'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 41
				, orderOnNew: 41
				, orderOnDetails: 41
				, orderOnEdit: 41
				, orderOnImport: 41
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'catalog'
				, dbName: 'tsk_txt_rep_frequency_rule'
				, dbType: 'string'
				, isTableField: false
				, isPK: false
				, size: 250
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Indicates the repetition frequency rule'
				, catalogId: 'TASK_REPETITION_FREQUENCY'
				, originTable: 'CATALOG'
				, linkedField: 'tsk_ctg_rep_frequency_rule'
				, entName: 'TextRepetitionFrequencyRule'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Repetition Frequency Rule'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 42
				, orderOnNew: 42
				, orderOnDetails: 42
				, orderOnEdit: 42
				, orderOnImport: 42
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'catalog'
				, dbName: 'tsk_txt_status'
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
				, linkedField: 'tsk_ctg_status'
				, entName: 'TextStatus'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Status'
				, tooltip: ''
				, isRecordName: false
				, gridOrder: 43
				, orderOnNew: 43
				, orderOnDetails: 43
				, orderOnEdit: 43
				, orderOnImport: 43
				, globalOrder: 0
				, value: null
			}
		]
		, view: [
		]
	};

	constructor(base?: any){
		if (base !== undefined){
			this.tsk_id = base.tsk_id;
			this.tsk_id_container = base.tsk_id_container;
			this.tsk_id_record = base.tsk_id_record;
			this.tsk_name = base.tsk_name;
			this.tsk_notes = base.tsk_notes;
			this.tsk_parent = base.tsk_parent;
			this.tsk_order = base.tsk_order;
			this.tsk_date_done = (base.tsk_date_done !== null) ? new Date(base.tsk_date_done) : null;
			this.tsk_total_time_spent = base.tsk_total_time_spent;
			this.tsk_ctg_in_process = base.tsk_ctg_in_process;
			this.tsk_qualifiers = base.tsk_qualifiers;
			this.tsk_tags = base.tsk_tags;
			this.tsk_estimated_duration = base.tsk_estimated_duration;
			this.tsk_schedule_date_start = (base.tsk_schedule_date_start !== null) ? new Date(base.tsk_schedule_date_start) : null;
			this.tsk_schedule_date_end = (base.tsk_schedule_date_end !== null) ? new Date(base.tsk_schedule_date_end) : null;
			this.tsk_date_view_until = (base.tsk_date_view_until !== null) ? new Date(base.tsk_date_view_until) : null;
			this.tsk_id_user_added = base.tsk_id_user_added;
			this.tsk_id_user_asigned = base.tsk_id_user_asigned;
			this.tsk_template = base.tsk_template;
			this.tsk_template_state = base.tsk_template_state;
			this.tsk_date_due = (base.tsk_date_due !== null) ? new Date(base.tsk_date_due) : null;
			this.tsk_id_related = base.tsk_id_related;
			this.tsk_url = base.tsk_url;
			this.tsk_ctg_repeats = base.tsk_ctg_repeats;
			this.tsk_id_main = base.tsk_id_main;
			this.tsk_ctg_rep_type = base.tsk_ctg_rep_type;
			this.tsk_ctg_rep_after_completion = base.tsk_ctg_rep_after_completion;
			this.tsk_ctg_rep_end = base.tsk_ctg_rep_end;
			this.tsk_rep_date_end = (base.tsk_rep_date_end !== null) ? new Date(base.tsk_rep_date_end) : null;
			this.tsk_rep_end_iteration = base.tsk_rep_end_iteration;
			this.tsk_rep_iteration = base.tsk_rep_iteration;
			this.tsk_rep_frequency = base.tsk_rep_frequency;
			this.tsk_ctg_rep_frequency_rule = base.tsk_ctg_rep_frequency_rule;
			this.tsk_rep_weekdays = base.tsk_rep_weekdays;
			this.tsk_date_add = (base.tsk_date_add !== null) ? new Date(base.tsk_date_add) : null;
			this.tsk_date_mod = (base.tsk_date_mod !== null) ? new Date(base.tsk_date_mod) : null;
			this.tsk_ctg_status = base.tsk_ctg_status;

			this.tsk_txt_in_process = base.tsk_txt_in_process;
			this.tsk_txt_repeats = base.tsk_txt_repeats;
			this.tsk_txt_rep_type = base.tsk_txt_rep_type;
			this.tsk_txt_rep_after_completion = base.tsk_txt_rep_after_completion;
			this.tsk_txt_rep_end = base.tsk_txt_rep_end;
			this.tsk_txt_rep_frequency_rule = base.tsk_txt_rep_frequency_rule;
			this.tsk_txt_status = base.tsk_txt_status;
		}
	}

	recordName = () => {
		return this.metadata.fields.filter(f => f.isRecordName).map(f => {
			return `${f.dbName} = ${this[f.dbName]}`;
		}).join(', ');
	};
}