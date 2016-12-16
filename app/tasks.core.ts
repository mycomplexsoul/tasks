// import { Injectable } from "@angular/core";

// @Injectable()
export class TasksCore {
    pendingRequests: Array<any> = [];
    data: any = {
        taskList: <any>[]
        , user: 'anon'
    };

    constructor() {
        let tasks = <any> this.tasksFromStorage();
        this.data.taskList = tasks;
    }

    mockData(){
        let T = this.data.taskList;
        let data = [{
            'tsk_date_add': new Date(2016,9,31,13,30,0)
            , 'tsk_name': '[Tasks] ActividadApp to Tasks - Start migration to Angular2!!'
            , 'tsk_ctg_status': 2
        },{
            'tsk_date_add': new Date(2016,10,1,22,36,12)
            , 'tsk_name': '[Tasks] ActividadApp to Tasks - Service configuration test'
            , 'tsk_ctg_status': 2
        },{
            'tsk_date_add': new Date(2016,10,4,16,32,27)
            , 'tsk_name': '[Tasks] ActividadApp to Tasks - Id generation for task'
            , 'tsk_ctg_status': 2
            , 'tsk_time_history': [
                {
                    'tsh_id': ''
                    , 'tsh_num_secuential': 1
                    , 'tsh_date_start': new Date(2016,10,4,20,0,2)
                    , 'tsh_date_end': new Date(2016,10,4,21,20,0)
                    , 'tsh_time_spent': 0
                    , 'tsh_id_user': 2
                    , 'tsh_date_add': new Date(2016,10,4,19,25,0)
                    , 'tsh_date_mod': new Date(2016,10,4,19,25,0)
                }
            ]
        }];
        
        data.forEach((t) => {
            // T.push(this.newTaskTemplate(t));
            this.addTask(t);
            // console.log(T[T.length-1]);
        });
    }

    /** BEGIN API methods */
    /**
     * Creation and addition of a new task to the collection.
     * @param {object} task A basic task model, for simplicity to be extended and added to the task collection.
     * @return {object} The task added to the collection (as a complete task model).
     */
    addTask(task: any){
        let T = this.data.taskList;

        if (task.tsk_name.startsWith('[')){
            task.tsk_id_record = task.tsk_name.substr(task.tsk_name.indexOf('[')+1,task.tsk_name.indexOf(']')-1);
            task.tsk_name = task.tsk_name.replace(`[${task.tsk_id_record}] `,'');
        }

        // Parse special tokens
        // [DATE]
        let tokens = [{
            'tokenStr': '[DATE]',
            'replaceMethod': () => this.dateWithFormat(this.dateOnly(new Date())).substring(0,10)
        },{
            'tokenStr': '[DATETIME]',
            'replaceMethod': () => this.dateWithFormat(this.dateOnly(new Date()))
        }];
        tokens.forEach((token) => {
            task.tsk_name = this.replaceAll(task.tsk_name,token.tokenStr,token.replaceMethod())
        });

        // detect duration
        if (task.tsk_name.indexOf('%') !== -1 && task.tsk_name.indexOf('%%') === -1){
            let endPosition = task.tsk_name.indexOf(' ',task.tsk_name.indexOf('%')) === -1 ? task.tsk_name.length : task.tsk_name.indexOf(' ',task.tsk_name.indexOf('%'));
            let duration = task.tsk_name.substring(task.tsk_name.indexOf('%') + 1,endPosition);
            
            task.tsk_name = task.tsk_name.replace('%' + duration + ' ','');
            task.tsk_name = task.tsk_name.replace(' %' + duration,'');
            task.tsk_name = task.tsk_name.replace('%' + duration,'');

            duration = this.parseTime(duration);

            task.tsk_estimated_duration = parseInt(duration);
        }

        T.push(this.newTaskTemplate(task));
        // console.log(T[T.length-1]);
        this.tasksToStorage();
        return T[T.length-1];
    }

    /**
     * Extends a basic task model so it has all of the properties of a complete task model.
     * @param {object} a Basic task model to be extended, it has some properties used in the complete task model.
     * @return {object} A complete task model extended with the data of the basic task model.
     */
    newTaskTemplate(task: any){
        return {
            'tsk_id': this.generateId()
            , 'tsk_id_container': 'tasks'
            , 'tsk_id_record': task.tsk_id_record || 'general'
            , 'tsk_name': task.tsk_name
            , 'tsk_notes': task.tsk_notes || ''
            , 'tsk_parent': task.tsk_parent || 0
            , 'tsk_order': this.data.taskList.length + 1
            , 'tsk_date_done': <Date>undefined
            , 'tsk_total_time_spent': 0
            , 'tsk_time_history': task.tsk_time_history || <any>[]
            , 'tsk_ctg_in_process': 1
            , 'tsk_qualifiers': ''
            , 'tsk_tags': task.tsk_tags || ''
            , 'tsk_estimated_duration': task.tsk_estimated_duration || 0
            , 'tsk_schedule_date_start': <Date>undefined
            , 'tsk_schedule_date_end': <Date>undefined
            , 'tsk_schedule_history': <any>[]
            , 'tsk_date_view_until': <Date>undefined
            , 'tsk_notifications': <any>[]
            , 'tsk_id_user_added': task.tsk_id_user_added || this.data.user
            , 'tsk_id_user_asigned': task.tsk_id_user_asigned || this.data.user
            , 'tsk_date_add': new Date()
            , 'tsk_date_mod': new Date()
            , 'tsk_ctg_status': task.tsk_ctg_status || 1
        }
    }

    tasks(){
        return this.data.taskList;
    }

    tasksGroups(){

    }

    pad(value: string | number, fillChar: string, length: number, dir: number = -1){
        let result: string = value + '';
        while(result.length < length){
            if (dir === -1){
                result = fillChar + result;
            } else {
                result = result + fillChar;
            }
        }
        return result;
    }

    generateId(){
        // take date + time + random 10 digits
        // total digits 10 + 6 + 10 = 26
        let date = new Date();
        let random = Math.floor(Math.random() * 1e14);
        let datetimeString = `${date.getFullYear()}${this.pad(date.getMonth()+1,'0',2)}${this.pad(date.getDate(),'0',2)}`;
        datetimeString += `${this.pad(date.getHours(),'0',2)}${this.pad(date.getMinutes(),'0',2)}${this.pad(date.getSeconds(),'0',2)}`;
        let id = `T${datetimeString}-${random}`;
        return id;
    }

    /** BEGIN Storage */
    tasksFromStorage(){
        if(typeof(window.localStorage) !== "undefined") {
            let tasks = JSON.parse(localStorage.getItem("Tasks"));
            if (tasks){
                return tasks;
            }
        }
        return [];
    }

    tasksToStorage(){
        if(typeof(window.localStorage) !== "undefined") {
            localStorage.setItem("Tasks", JSON.stringify(this.data.taskList));
        }
    }
    /** END Storage */

    updateTask(task: any, newData: any){
        Object.keys(newData).forEach(k => {
            task[k] = newData[k];
        });
        task.tsk_date_mod = new Date(); 
        this.tasksToStorage();
    }

    addTimeTracking(task: any){
        task.tsk_time_history.push({
            'tsh_id': task.tsk_id
            , 'tsh_num_secuential': (task.tsk_time_history.length + 1)
            , 'tsh_name': task.tsk_name
            , 'tsh_date_start': new Date()
            , 'tsh_date_end': null
            , 'tsh_time_spent': 0
            , 'tsh_id_user': 'anon'
            , 'tsh_date_add': new Date()
            , 'tsh_date_mod': new Date()
        });
        this.tasksToStorage();
    }

    stopTimeTracking(task: any){
        let h = task.tsk_time_history[task.tsk_time_history.length - 1];
        h.tsh_name = task.tsk_name;
        h.tsh_date_end = new Date();
        h.tsh_time_spent = this.elapsedTime(h.tsh_date_start,h.tsh_date_end);
        h.tsh_date_mod = new Date();

        this.recalculateTotalTimeSpent(task);
        this.tasksToStorage();
    }

    recalculateTotalTimeSpent(task: any){
        // sum in task
        let sum: number = 0;
        task.tsk_time_history.forEach((t: any) => {
            sum += t.tsh_time_spent;
        });
        task.tsk_total_time_spent = sum;
    }

    elapsedTime(date1: Date, date2: Date) :number{
        return Math.abs(date1.getTime() - date2.getTime()) / 1000;
    }

    elapsedDays(date1: Date, date2: Date) :number{
        return Math.floor(this.elapsedTime(this.dateOnly(date1),this.dateOnly(date2)) / (60 * 60 * 24));
    }

    updateTaskTimeTracking(taskTimeTracking: any, newData: any){
        Object.keys(newData).forEach(k => {
            taskTimeTracking[k] = newData[k];
        });
        if (taskTimeTracking.tsh_date_end !== null){
            taskTimeTracking.tsh_time_spent = this.elapsedTime(new Date(taskTimeTracking.tsh_date_start),new Date(taskTimeTracking.tsh_date_end));
        } else {
            taskTimeTracking.tsh_time_spent = 0;
        }
        taskTimeTracking.tsh_date_mod = new Date();
        this.recalculateTotalTimeSpent(this.data.taskList.find((t: any) => t.tsk_id === taskTimeTracking.tsh_id));
        this.tasksToStorage();
    }

    deleteTasks(){
        this.data.taskList = [];
        this.tasksToStorage();
    }

    dateOnly(base: Date){
        return new Date(base.getFullYear(),base.getMonth(),base.getDate(),0,0,0);
    }

    dateWithFormat(date: Date){
        var str = date.getFullYear() + "-" + (date.getMonth()+1>9?date.getMonth()+1:"0"+(date.getMonth()+1)) + "-" + (date.getDate()>9?date.getDate():"0"+date.getDate());
        str += " " + (date.getHours()>9?date.getHours():"0"+date.getHours()) + ":" + (date.getMinutes()>9?date.getMinutes():"0"+date.getMinutes()) + ":" + (date.getSeconds()>9?date.getSeconds():"0"+date.getSeconds());
        return str;
    }

    replaceAll(str: string, find: string, replace: string){
        return str.replace(new RegExp(this.escapeRegExp(find), "g"), replace);
    }

    escapeRegExp(str: string){
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    parseTime(duration: string){
        let hours = 0, min = 0;
        if (duration.indexOf('h') !== -1){
            hours = parseInt(duration.substring(0,duration.indexOf('h')));
            duration = duration.replace(hours + 'h','');
        }
        if (duration.indexOf(':') !== -1){
            hours = parseInt(duration.substring(0,duration.indexOf(':')));
            duration = duration.replace(hours + ':','');
        }
        if (duration.indexOf('m') !== -1){
            min = parseInt(duration.substring(0,duration.indexOf('m')));
            duration = duration.replace(min + 'm','');
        } else {
            if (duration !== ''){
                min = parseInt(duration);
                duration = duration.replace(min + '','');
            }
        }
        if (duration === ''){
            return hours * 60 + min;
        }
        return parseInt(duration);
    }

    /*
Milestone 1 (POC)
    Basics (visual)
    - [x] Shows a text field to capture task
    - [x] Shows a button 'Add Task' -> saves task captured and show it on open tasks
    - [x] When saving a task, task must have: id, record inferred from capture, order to be the next available
    - [x] Displays an open tasks list (each task has a checkbox and a details button)
    - [x] In the open task list, tasks are grouped by record associated
    - [x] Displays a closed tasks list (each task has a checkbox checked and a details button)
    - [x] When click on 'details' button -> show a panel with all the task info, the panel has a 'hide' button
    - [x] When click on 'hide' button on task details -> the panel must close
    Working on tasks (Actions)
    - [x] Can edit task name, when finished editing -> changes must be persisted
    - [x] Persist tasks and retrieve from/to local storage
    - [x] Click on checkbox in an open task -> mark task as done and updates the finished date
    - [x] Click on checkbox in a closed task -> mark task as open (updates finished date)
    Organization (reorder and movements)
    - [x] Can reorder tasks with Alt + Up and Alt + Down -> changes to order must be persisted
    - [x] Can move between tasks with Up and Down -> can jump even between groups
    - [x] When user is in the input to write a new task, if press Down Arrow -> jumps to (focus) first group first task
    Time Tracking
    - [x] Can start/end a timer with F2 key (defined as running state), timer must be visible and must increment each second until stopped
    - [x] While task has a timer running, the task item must be highlighted in UI
    - [x] When timer is stopped, elapsed time is persisted (it can be multiple timer data)
    - [x] Task must display total time spent and total time tracking items in a bubble if task has them
    - [x] Time tracking history is shown in details view of task
    - [x] Time tracking items can be deleted individually (via a 'delete' button) -> remaining items must be renumbered, total time spent must be recalculated
    - [x] If the task is in running state, the related time tracking entry could not be deleted
    - [x] On page load, if a task is in running state, timer should be displayed with current elapsed time
    - [x] Time tracking items can be edited (start and end timestamps) and must be persisted and sumed up to the total time spent of the task
    - [+] Time tracking item that is currently running can be edited (start timestamp only) and the running timer must be adjusted
    - [+] Click on checkbox in a running task -> stops timer (persisting that data), mark task as done and updates the finished date
    Finished Today
    - [+] Add a 'View Finished' button, that toggles display of the 'Today' section
    - [x] Add an 'Info' section, it must contain: Total tasks done today, total time spent (even in tasks not finished yet)
    - [+] Display a list of done tasks today, each task must be striked and has a checkbox marked indicating task is done, total time spent must be shown
    - [+] When the checkbox is clicked, the task is marked as not done and moved to open tasks
    - [ ] User can edit task finished date, data is persisted automatically when a valid date is captured
    Utilitary Information
    - [ ] Add an 'Information' section, it must contain: Total tasks, pending
    - [ ] If task has more than 3 days of creation, show a section at the end with the legend 'XX days old' and colored depending on days old: =0 -> green (legend changes for 'today'), <3 -> black, <5 -> brown, <10 -> red
    View All
    - [+] Add a 'View All' button, that toggles display of the 'Reports' section
    - [ ] Add a "View All" section, it should display all closed tasks and total time spent and history time tracking entries count, grouped by day in descending order (lastest first)
    Options
    - [+] Add a 'View Options' button, that toggles display of the 'Options' section
    - [+] Add an 'Options' section, it must contain a button 'delete all tasks'
    - [+] When user clicks 'delete all tasks' all tasks should be deleted and the view should be cleared
    Preventing Overload / Prioritizing
    - [x] When adding a new task, it will be in state BACKLOG
    - [x] In the buttons section will appear a button 'Show Backlog' / 'Hide Backog' which toggles the Backlog section
    - [x] A new section 'Backlog' will contain a group of tasks in BACKLOG state grouped by list
    - [x] Each task in BACKLOG state will have a button 'Move to Open', clicking this button will change state of the task to OPEN
    - [x] In the 'Info' Section will appear a backlog task counter
    Parsing Estimated Duration of Task from task text
    - [+] If task contains '%', the text between '%' and ' ' or end of text should be interpreted as the estimated duration of the task in the notation %#h##m
    - [+] The notation %#h#m could be any of the following cases: (# = any number of any digits)
        %#   | %5    -> interpreted as minutes
        %#m  | %27m  -> interpreted as minutes
        %#h  | %2h   -> interpreted as hours
        %#h# | %1h15 -> interpreted as hours (#h) and add the following as minutes (#)
        %#h#m| %2h23m-> interpreted as hours (#h) and add the following as minutes (#m)
        %#h# | %1:15 -> interpreted as hours (#:) and add the following as minutes (#)
        %#h#m| %2:23m-> interpreted as hours (#:) and add the following as minutes (#m)
    - [+] After the estimated duration has been extracted, it should be replaced in the task text as any of the following cases:
        '%#h#m ' -> ''
        ' %#h#m' -> ''
        '%#h#m'  -> ''
    - [ ] If the string '%%' is present, it should be replaced to '%' and the parsing of estimated time should not be done on that block
    - [ ] The estimated duration should be displayed alongside the time tracking in running state as '[##:##] / [##h##m]' (first block: time tracking, second: ETA)
    - [ ] When a task has estimated duration 0 it should be displayed a message indicating this 'no ETA' alongside the task text
    - [ ] In running state, if the elapsed time + total time spent is greater than the estimated duration, it must show a browser notification 'Estimated time exceeded ##h##m for task: [TASK]'
    - [ ] Total time estimated should be displayed in 'Info' section, it will show two values: total ETA remaining (for OPEN tasks), total ETA today (for OPEN and CLOSED today tasks)
    - [ ] Estimated duration can be edited after task is added, it is not saved unless it has a valid value in same format as when task creation
    Backup & Restore
    - [ ] In the 'Options' section, a button 'Backup' and a button 'Restore' are shown
    - [ ] If user clicks 'Backup' the complete JSON of tasks should be copied to clipboard in stringified format, a message is shown below 'Backup copied to clipboard'
    - [ ] If user clicks 'Restore' it will try to get clipboard data, parse it as JSON, get tasks and add them to existent ones, and save to storage, a message is shown below 'Added tasks from restore process'
    Parse special tokens
    - [x] If task has token '[DATE]' when adding, it should be replaced with today's date in format 'yyyy-MM-dd'
    - [x] If task has token '[DATETIME]' when adding, it should be replaced with today's date in format 'yyyy-MM-dd HH:mm:ss'
    Batch Add tasks
    - [x] If user press F2 when focused on task text input, it should toggle into a textarea, where the user could add multiple tasks, one per row, when added it should be trated each the same as individual input
    - [x] After adding batch tasks

Milestone 2 (MVP)
    Working on tasks
    - [ ] Task UI capture should parse these schemes on capture (and must persist values):
        {[Record] Name %[Estimated] #Tags $Qualifiers +Notes}
        {[Record] Name %[ScheduleStart+Estimated] #Tags $Qualifiers +Notes}
        {[Record] Name %[ScheduleStart-ScheduleEnd] #Tags $Qualifiers +Notes}
    Visual
    - [ ] Task UI display on row:
        {[x] [##:##] Name %Estimated #Tags }
        {[x] [2/TT:TT + ##:##] Name @Estimated #Tags }
            {[details][start/stop][up][down][cancel]}{Notes}
    Fields for scheduling repetitions
    - On Schedule/On Completion
      Daily/Weekly
      Some Days of the Week [DLMXJVS], On Every Given Period [Number + [days,weeks,months,years]], On A Days of Each Month [1st, 2nd, ..., 5th, Last + [DLMXJVS]]
      End Repeat [never, on date, after # repetitions]
    Fields for alarms array
    - Relative alarm: days, before/after, hours, minutes
    - On Date: datetime

     */

    //     "actividad":[
//         {
//             "act_num_actividad": 1
//             , "act_id_contenedor": "actividad"
//             , "act_id_registro": "0"
//             , "act_nombre": "Generate json struct"
//             , "act_notas": "struct init {}"
//             , "act_padre": 0
//             , "act_orden": 0
//             , "act_cve_tarea": 2
//             , "act_fecha_finalizado": new Date(2015,8,12,12,25,0)
//             , "act_tiempo_total_dedicado": 0
//             , "act_tiempo_historial": [
//                 {
//                     "ach_num_actividad": 1
//                     , "ach_num_secuencial": 1
//                     , "ach_fecha_inicio": null
//                     , "ach_fecha_fin": null
//                     , "ach_tiempo_dedicado": 0
//                     , "ach_num_usuario": 2
//                     , "ach_fecha_alta": new Date(2015,8,12,12,25,0)
//                     , "ach_fecha_ult_mod": new Date(2015,8,12,12,25,0)
//                 }
//             ]
//             , "act_cve_en_proceso": 1
//             , "act_calificadores": "star,gray"
//             , "act_etiquetas": "#ActividadApp,#json"
//             , "act_fecha_prog_inicio": new Date(2015,9,12,11,20,0)
//             , "act_fecha_prog_fin": new Date(2015,9,12,12,20,0)
//             , "act_prog_duracion": (1 * 60 * 60)
//             , "act_prog_historial": [
//                 {
//                     "aph_num_actividad": 1
//                     , "aph_num_secuencial": 1
//                     , "aph_fecha_prog_inicio": null
//                     , "aph_fecha_prog_fin": null
//                     , "aph_prog_duracion": 0
//                     , "aph_fecha_cambio": null
//                     , "aph_num_usuario": 1
//                     , "aph_fecha_alta": new Date(2015,8,12,12,25,0)
//                     , "aph_fecha_ult_mod": new Date(2015,8,12,12,25,0)
//                 }
//             ]
//             , "act_num_usuario_alta": 2
//             , "act_num_usuario_asignado": 2
//             , "act_fecha_alta": new Date(2015,8,12,12,25,0)
//             , "act_fecha_ult_mod": new Date(2015,8,12,12,25,0)
//             , "act_cve_estatus": 1
//         }
}