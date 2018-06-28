import { FieldDefinition } from "./FieldDefinition";
import { ViewJoinDefinition } from "./ViewJoinDefinition";

export class EntityDefinition {
    name: string;
    namespace: string;
    removeMeans: string;
    authNeeded: boolean;
    displayOnMenu: boolean;
    prefix: string;
    permissionsTemplate: string;
    permissions: string[];
    specialFeatures: string[];
    fields: FieldDefinition[];
    view: ViewJoinDefinition[];

    tableName: string;
    viewName: string;
    model: any = {};
    db: any = {};
}