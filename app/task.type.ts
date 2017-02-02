export class Task {
    public tsk_id: string;
    public tsk_id_container: string;
    public tsk_id_record: string;
    public tsk_name: string;
    public tsk_notes: string;
    public tsk_parent: string;
    public tsk_order: number;
    public tsk_date_done: Date;
    public tsk_total_time_spent: number;
    public tsk_time_history: Array<TaskTimeTracking>;
    public tsk_ctg_in_process: number;
    public tsk_qualifiers: string;
    public tsk_tags: string;
    public tsk_estimated_duration: number;
    public tsk_schedule_date_start: Date;
    public tsk_schedule_date_end: Date;
    public tsk_schedule_history: Array<TaskSchedule>;
    public tsk_date_view_until: Date;
    public tsk_notifications: Array<Notification>;
    public tsk_id_user_added: number;
    public tsk_id_user_asigned: number;
    public tsk_date_add: Date;
    public tsk_date_mod: Date;
    public tsk_ctg_status: number;

    constructor(){

    }
}
interface ITask{
}

interface TaskTimeTracking{
    tsh_id: string
    , tsh_num_secuential: number
    , tsh_name: string
    , tsh_date_start: Date
    , tsh_date_end: Date
    , tsh_time_spent: number
    , tsh_id_user: number
    , tsh_date_add: Date
    , tsh_date_mod: Date
}

interface TaskSchedule{

}

interface Notification{

}