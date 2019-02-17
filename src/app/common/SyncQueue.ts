export interface SyncQueue {
    action: string
    , model: any
    , pk: any
    , entity: string
    , status: string
    , callback: Function
    , recordName?: Function
    , matchMethod?: Function
}
