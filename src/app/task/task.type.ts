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
    public tsk_template: string;  // the initial template, used for variable substitutions
    public tsk_template_state: string; // state variables used for template substitution on repetition
    public tsk_date_due: Date;  // if present, used for due calculations instead of date add
    public tsk_id_related: string; // id of a related task
    public tsk_url: string; // url related to a task
    public tsk_ctg_repeats: number;  // true, false
    public tsk_id_main: string; // id of the original task that triggered the repetition
    public tsk_ctg_rep_type: number; // repetition type: daily, weekly, bi-weekly, monthly, yearly, frequency (uses 2 frequency fields), some days of week (uses tsk_rep_weekdays), a day of each month (tsk_rep_frequency as 1st, 2nd, etc and tsk_rep_weekdays to just 1 day of the week/month like 1st monday of the month)
    public tsk_ctg_rep_after_completion: number; // repeats after completion: true, false
    public tsk_ctg_rep_end: number; // repetition ends at: forever, end on date, end after n repetitions
    public tsk_rep_date_end: Date; // date or null
    public tsk_rep_end_iteration: number; // number or 0
    public tsk_rep_iteration: number; // counts iterations
    public tsk_rep_frequency: number; // 1, 2, 3
    public tsk_ctg_rep_frequency_rule: number; // days, weeks, months, years
    public tsk_rep_weekdays: string; // DLMXJFS or null
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

export enum TaskStatus {
    BACKLOG = 1,
    OPEN = 2,
    CLOSED = 3,
    CANCELLED = 4
}