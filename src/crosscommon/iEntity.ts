import { FieldDefinition } from "./FieldDefinition";
import { ViewJoinDefinition } from "./ViewJoinDefinition";

export interface iEntity {
    metadata: {
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
	}

	recordName: () => string;
}