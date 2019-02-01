import { iEntity } from "../iEntity";
import { FieldDefinition } from "../FieldDefinition";
import { ViewJoinDefinition } from "../ViewJoinDefinition";

export class User implements iEntity {
	public usr_id: string;
	public usr_pwd: string;
	public usr_first_name: string;
	public usr_middle_name: string;
	public usr_last_name: string;
	public usr_ctg_user_type: number;
	public usr_email: string;
	public usr_ctg_connected: number;
	public usr_login_attempts: number;
	public usr_date_last_login_attempt: Date;
	public usr_date_pwd_change: Date;
	public usr_ctg_pwd_temporal: number;
	public usr_ctg_blocked: number;
	public usr_config: string;
	public usr_date_add: Date;
	public usr_date_mod: Date;
	public usr_ctg_status: number;

	public usr_txt_user_type: string;
	public usr_txt_connected: string;
	public usr_txt_pwd_temporal: string;
	public usr_txt_blocked: string;
	public usr_txt_status: string;

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
		name: 'User'
		, namespace: 'common'
		, removeMeans: 'CANCELATION'
		, authNeeded: false
		, displayOnMenu: false
		, prefix: 'usr'
		, permissionsTemplate: 'permissions_all'
		, tableName: 'user'
		, viewName: 'viuser'
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
			, 'HEADERS(User,Users)'
			, 'TABLE_NAME(USER)'
			, 'VIEW_NAME(VIUSER)'
		]
		, fields: [
			{
				templateId: 'string'
				, dbName: 'usr_id'
				, dbType: 'string'
				, isTableField: true
				, isPK: true
				, size: 64
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Id for the user, used for login'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'UserId'
				, formControl: 'Textbox'
				, captureRequired: true
				, appearsByDefaultOnGrid: true
				, specialRules: [
					'DUPLICITY_ADD'
				]
				, displayName: 'User Id'
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
				, dbName: 'usr_pwd'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 100
				, decimal: 0
				, minLength: 0
				, allowNull: false
				, default: ''
				, dbComment: 'Password'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Password'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Password'
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
				, dbName: 'usr_first_name'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 100
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'First name of the user'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'FirstName'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'First Name'
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
				, dbName: 'usr_middle_name'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 100
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Middle name of the user'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'MiddleName'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Middle Name'
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
				, dbName: 'usr_last_name'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 100
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Last name of the user'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'LastName'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Last Name'
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
				templateId: 'integer'
				, dbName: 'usr_ctg_user_type'
				, dbType: 'integer'
				, isTableField: true
				, isPK: false
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Type of user, classification or group'
				, catalogId: 'USER_TYPES'
				, originTable: ''
				, linkedField: ''
				, entName: 'UserType'
				, formControl: 'Textbox'
				, captureRequired: true
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'User Type'
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
				templateId: 'string'
				, dbName: 'usr_email'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 100
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Email of the user'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Email'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Email'
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
				templateId: 'integer'
				, dbName: 'usr_ctg_connected'
				, dbType: 'integer'
				, isTableField: true
				, isPK: false
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Indicates if the user is connected or not'
				, catalogId: 'BOOLEAN'
				, originTable: ''
				, linkedField: ''
				, entName: 'IsConnected'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Is Connected'
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
				templateId: 'integer'
				, dbName: 'usr_login_attempts'
				, dbType: 'integer'
				, isTableField: true
				, isPK: false
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Number of consecutive failed attemps to login'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'LoginAttempts'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Consecutive Failed Attemps to Login'
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
				templateId: 'datetime'
				, dbName: 'usr_date_last_login_attempt'
				, dbType: 'datetime'
				, isTableField: true
				, isPK: false
				, size: 16
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Date and time of the last login attempt'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'DateLastLoginAttempt'
				, formControl: 'datetime'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Date of Last Login Attempt'
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
				templateId: 'datetime'
				, dbName: 'usr_date_pwd_change'
				, dbType: 'datetime'
				, isTableField: true
				, isPK: false
				, size: 16
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Date and time of the last password change'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'DatePwdChange'
				, formControl: 'datetime'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Date of Last Password Change'
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
				templateId: 'integer'
				, dbName: 'usr_ctg_pwd_temporal'
				, dbType: 'integer'
				, isTableField: true
				, isPK: false
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Indicates if the password should be changed, considered temporal'
				, catalogId: 'BOOLEAN'
				, originTable: ''
				, linkedField: ''
				, entName: 'IsPasswordTemporal'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Password is Temporal'
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
				templateId: 'integer'
				, dbName: 'usr_ctg_blocked'
				, dbType: 'integer'
				, isTableField: true
				, isPK: false
				, size: 4
				, decimal: 0
				, minLength: 1
				, allowNull: false
				, default: ''
				, dbComment: 'Indicates if the user is blocked and not allowed to login'
				, catalogId: 'BOOLEAN'
				, originTable: ''
				, linkedField: ''
				, entName: 'IsBlocked'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'User is Blocked'
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
				templateId: 'string'
				, dbName: 'usr_config'
				, dbType: 'string'
				, isTableField: true
				, isPK: false
				, size: 4000
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Particular configuration for the user'
				, catalogId: ''
				, originTable: ''
				, linkedField: ''
				, entName: 'Configuration'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Configuration'
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
				templateId: 'creationDate'
				, dbName: 'usr_date_add'
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
				, gridOrder: 14
				, orderOnNew: 14
				, orderOnDetails: 14
				, orderOnEdit: 14
				, orderOnImport: 14
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'modificationDate'
				, dbName: 'usr_date_mod'
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
				, gridOrder: 15
				, orderOnNew: 15
				, orderOnDetails: 15
				, orderOnEdit: 15
				, orderOnImport: 15
				, globalOrder: 0
				, value: null
			}, {
				templateId: 'status'
				, dbName: 'usr_ctg_status'
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
				, gridOrder: 16
				, orderOnNew: 16
				, orderOnDetails: 16
				, orderOnEdit: 16
				, orderOnImport: 16
				, globalOrder: undefined
				, value: null
			}, {
				templateId: 'catalog'
				, dbName: 'usr_txt_user_type'
				, dbType: 'string'
				, isTableField: false
				, isPK: false
				, size: 250
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Type of user, classification or group'
				, catalogId: 'USER_TYPES'
				, originTable: 'CATALOG'
				, linkedField: 'usr_ctg_user_type'
				, entName: 'TextUserType'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'User Type'
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
				templateId: 'catalog'
				, dbName: 'usr_txt_connected'
				, dbType: 'string'
				, isTableField: false
				, isPK: false
				, size: 250
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Indicates if the user is connected or not'
				, catalogId: 'BOOLEAN'
				, originTable: 'CATALOG'
				, linkedField: 'usr_ctg_connected'
				, entName: 'TextIsConnected'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Is Connected'
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
				templateId: 'catalog'
				, dbName: 'usr_txt_pwd_temporal'
				, dbType: 'string'
				, isTableField: false
				, isPK: false
				, size: 250
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Indicates if the password should be changed, considered temporal'
				, catalogId: 'BOOLEAN'
				, originTable: 'CATALOG'
				, linkedField: 'usr_ctg_pwd_temporal'
				, entName: 'TextIsPasswordTemporal'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'Password is Temporal'
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
				templateId: 'catalog'
				, dbName: 'usr_txt_blocked'
				, dbType: 'string'
				, isTableField: false
				, isPK: false
				, size: 250
				, decimal: 0
				, minLength: 0
				, allowNull: true
				, default: ''
				, dbComment: 'Indicates if the user is blocked and not allowed to login'
				, catalogId: 'BOOLEAN'
				, originTable: 'CATALOG'
				, linkedField: 'usr_ctg_blocked'
				, entName: 'TextIsBlocked'
				, formControl: 'Textbox'
				, captureRequired: false
				, appearsByDefaultOnGrid: true
				, specialRules: [
				]
				, displayName: 'User is Blocked'
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
				, dbName: 'usr_txt_status'
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
				, linkedField: 'usr_ctg_status'
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
		]
	};

	constructor(base?: any){
		if (base !== undefined){
			this.usr_id = base.usr_id;
			this.usr_pwd = base.usr_pwd;
			this.usr_first_name = base.usr_first_name;
			this.usr_middle_name = base.usr_middle_name;
			this.usr_last_name = base.usr_last_name;
			this.usr_ctg_user_type = base.usr_ctg_user_type;
			this.usr_email = base.usr_email;
			this.usr_ctg_connected = base.usr_ctg_connected;
			this.usr_login_attempts = base.usr_login_attempts;
			this.usr_date_last_login_attempt = (base.usr_date_last_login_attempt !== null) ? new Date(base.usr_date_last_login_attempt) : null;
			this.usr_date_pwd_change = (base.usr_date_pwd_change !== null) ? new Date(base.usr_date_pwd_change) : null;
			this.usr_ctg_pwd_temporal = base.usr_ctg_pwd_temporal;
			this.usr_ctg_blocked = base.usr_ctg_blocked;
			this.usr_config = base.usr_config;
			this.usr_date_add = (base.usr_date_add !== null) ? new Date(base.usr_date_add) : null;
			this.usr_date_mod = (base.usr_date_mod !== null) ? new Date(base.usr_date_mod) : null;
			this.usr_ctg_status = base.usr_ctg_status;

			this.usr_txt_user_type = base.usr_txt_user_type;
			this.usr_txt_connected = base.usr_txt_connected;
			this.usr_txt_pwd_temporal = base.usr_txt_pwd_temporal;
			this.usr_txt_blocked = base.usr_txt_blocked;
			this.usr_txt_status = base.usr_txt_status;
		}
	}

	recordName = () => {
		return this.metadata.fields.filter(f => f.isRecordName).map(f => {
			return `${f.dbName} = ${this[f.dbName]}`;
		}).join(', ');
	};
}