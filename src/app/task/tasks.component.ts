import { Component, OnInit, Renderer } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TasksCore } from './tasks.core';
import { SyncAPI } from '../common/sync.api';
import { Task } from './task.type';
import { TaskIndicator } from './task.indicator.service';
import { DateCommon } from '../common/date.common';
import { TaskTimeTracking } from '../../crosscommon/entities/TaskTimeTracking';

@Component({
    selector: 'tasks',
    templateUrl: './tasks.template.html',
    providers: [TasksCore, SyncAPI, TaskIndicator]
})
export class TasksComponent implements OnInit {
    public item: any;
    public tasks: any[];
    public services: {
        tasksCore: TasksCore
        , sync: SyncAPI
        , taskIndicator: TaskIndicator
        , dateUtils: DateCommon
    } = {
        tasksCore: null
        , sync: null
        , taskIndicator: null
        , dateUtils: null
    };
    public state: any = {};
    public format: string = 'yyyy-MM-dd HH:mm:ss';
    public delayOnUpdateState: number = 100;
    public groupHeader: string;
    public timers: any = {};
    public viewAll: boolean = false;
    public viewBacklog: boolean = false;
    public viewPostponed: boolean = false;
    public viewReportsWeek: boolean = false;
    public viewReportsDayDistribution: boolean = false;
    public viewOptions: boolean = false;
    public viewQualifierTotals: boolean = false;
    public viewETABeforeAdd: boolean = false;
    public taskStatus = {
        'BACKLOG': 1,
        'OPEN': 2,
        'CLOSED': 3,
        'CANCELLED': 4
    };
    public showBatchAdd: boolean = false;
    public load: boolean = true;
    public reports: any = {};
    public optionsInput: string = "default";
    public showButtonSection: boolean = false;
    public tagInfo: any = {};
    public options: any;
    public defaultOptions: any = {
        optViewElapsedDays: false
        , optShowFinishedToday: false
        , optShowQualifiedTasksOnly: false
        , optNewTaskStatusIsBacklog: false
        , optShowIndicatorsTable: false
        , optServerAddress: "http://localhost:8081"
    };
    public timerModeRemaining: boolean = false;
    public comparisonData: any;
    public nextTasks: any[];
    public focusedTask: {
        task: Task
        , element: HTMLElement
    } = {
        task: null
        , element: null
    };
    public events: any[] = [];

    constructor(
        tasksCore: TasksCore,
        private sync: SyncAPI,
        private taskIndicator: TaskIndicator,
        private dateUtils: DateCommon,
        private titleService: Title
    ){
        titleService.setTitle('Tasks');

        this.services.tasksCore = tasksCore;
        this.services.sync = sync;
        this.services.taskIndicator = taskIndicator;
        this.services.dateUtils = dateUtils;
        if (typeof(window.localStorage) !== "undefined") {
            this.options = JSON.parse(localStorage.getItem('Options'));
            if(!this.options){
                this.options = this.defaultOptions;
            }
            this.services.tasksCore.setApiRoot(this.options.optServerAddress);
            //this.services.sync.setApiRoot(this.options.optServerAddress);
        }
        this.nextTasks = [];
        this.updateState();
        this.notification({
            body: 'Hello there!! you have ' + this.state.openTasksCount + ' tasks open'
        });
        this.services.tasksCore.getAllForUser('anon').then(taskList => {
            this.tasks = taskList;
            this.load = true;
            this.updateState();
        });
        this.services.tasksCore.computeComparisonData().then((data: any) => this.comparisonData = data);

        // events
        this.subscribe('updateTimeTracking', (timeTrackingItem: any) => {
            let foundItem: Task = null;
            // Looks into open tasks
            foundItem = this.state.openTasks.find((item: Task) => item.tsk_id === timeTrackingItem.tsh_id);
            if (foundItem) {
                const historyIndex = foundItem['tsk_time_history'].findIndex((item: any) => item.tsh_id === timeTrackingItem.tsh_id && item.tsh_num_secuential === timeTrackingItem.tsh_num_secuential);
                foundItem['tsk_time_history'][historyIndex] = timeTrackingItem;
            }
            // Looks into closed tasks
        });
    }

    ngOnInit(){
        this.registerServiceWorker();
    }

    addTask(form: any){
        if (!this.showBatchAdd){
            if (form.value.tsk_name){
                this.services.tasksCore.addTask({
                    'tsk_date_add': this.services.dateUtils.newDateUpToSeconds(),
                    'tsk_name': form.value.tsk_name
                },this.options);
                this.tasks = this.services.tasksCore.tasks();
                this.updateState();
                form.controls.tsk_name.reset();
            }
        } else {
            // Batch add
            let t: any;
            if (form.value.tsk_multiple_name){
                this.services.tasksCore.batchAddTasks(form.value.tsk_multiple_name.split('\n'),this.options);
                this.tasks = this.services.tasksCore.tasks();
                form.controls.tsk_multiple_name.reset();
                this.showBatchAdd = false;
                setTimeout(() => this.updateState(), 100);
            }
        }
        this.viewETABeforeAdd = false;
        this.scheduleNotificationsForStartingTasks();
    }

    updateState(){
        let today = this.services.dateUtils.newDateUpToSeconds();
        let today0 = new Date(today.getFullYear(),today.getMonth(),today.getDate());
        let yesterday0 = new Date(today.getFullYear(),today.getMonth(),today.getDate()-1);
        let tomorrow0 = new Date(today.getFullYear(),today.getMonth(),today.getDate()+1);
        let sortByClosedDate = (a: any, b: any) => {
            let res = new Date(a.tsk_date_done) > new Date(b.tsk_date_done);
            return res ? -1 : 1;
        };
        let sortByDateUntilView = (a: any, b: any) => {
            let res = new Date(a.tsk_date_view_until) > new Date(b.tsk_date_view_until);
            return res ? 1 : -1;
        };
        this.tasks = this.services.tasksCore.tasks();
        this.state.backlogTasks = this.createGroupedTasks(this.tasks.filter((t) => t.tsk_ctg_status == this.taskStatus.BACKLOG).sort(this.sortByGroup));
        this.state.openTasks = this.createGroupedTasks(this.tasks.filter((t) => t.tsk_ctg_status == this.taskStatus.OPEN && (t.tsk_date_view_until ? new Date(t.tsk_date_view_until) < today : true) && ((this.options.optShowQualifiedTasksOnly ? t.tsk_qualifiers !== '' : true) || t.tsk_ctg_in_process == 2)).sort(this.sortByGroup));
        this.state.closedTasks = this.createGroupedClosedTasks(this.tasks.filter((t) => t.tsk_ctg_status == this.taskStatus.CLOSED).sort(sortByClosedDate));
        this.state.closedTodayTasks = this.tasks.filter((t) => t.tsk_ctg_status == this.taskStatus.CLOSED && new Date(t.tsk_date_done) >= today0 && new Date(t.tsk_date_done) <= tomorrow0).sort(sortByClosedDate);
        this.state.postponedTasks = this.tasks.filter((t) => t.tsk_ctg_status == this.taskStatus.OPEN && (t.tsk_date_view_until ? new Date(t.tsk_date_view_until) > today : false)).sort(sortByDateUntilView);

        // Estimated Total
        this.state.totalTimeEstimated = 0;
        this.state.totalTimeEstimatedOld = 0;
        this.state.totalTaskCountOld = 0;
        this.state.totalTimeEstimatedAddedToday = 0;
        this.state.totalTimeEstimatedAddedTodayClosed = 0;
        this.state.totalTimeEstimatedAddedTodayOpen = 0;
        this.state.totalTimeEstimatedOpen = 0;
        this.state.totalTimeEstimatedClosedToday = 0;
        this.tasks.filter((t) => t.tsk_ctg_status == this.taskStatus.OPEN).forEach((t: any) => {
            this.state.totalTimeEstimatedOpen += parseInt(t.tsk_estimated_duration);
        });
        this.tasks.filter((t) => t.tsk_ctg_status == this.taskStatus.CLOSED && new Date(t.tsk_date_done) >= today0 && new Date(t.tsk_date_done) <= today).forEach((t: any) => {
            this.state.totalTimeEstimatedClosedToday += parseInt(t.tsk_estimated_duration);
        });
        this.tasks.filter((t) => new Date(t.tsk_date_add) >= today0 && new Date(t.tsk_date_add) <= today).forEach((t: any) => {
            this.state.totalTimeEstimatedAddedToday += parseInt(t.tsk_estimated_duration);
            if (t.tsk_ctg_status == this.taskStatus.OPEN){
                this.state.totalTimeEstimatedAddedTodayOpen += parseInt(t.tsk_estimated_duration);
            }
            if (t.tsk_ctg_status == this.taskStatus.CLOSED){
                this.state.totalTimeEstimatedAddedTodayClosed += parseInt(t.tsk_estimated_duration);
            }
        });
        this.state.totalTimeEstimated = this.state.totalTimeEstimatedOpen + this.state.totalTimeEstimatedClosedToday;
        this.tasks.filter((t) => (new Date(t.tsk_date_done) >= today0 && new Date(t.tsk_date_done) < today && new Date(t.tsk_date_add) < today0) || (new Date(t.tsk_date_add) < today0 && t.tsk_ctg_status == this.taskStatus.OPEN)).forEach((t: any) => {
            this.state.totalTimeEstimatedOld += parseInt(t.tsk_estimated_duration);
        });
        this.state.totalTaskCountOld = this.tasks.filter((t) => (new Date(t.tsk_date_done) >= today0 && new Date(t.tsk_date_done) < today && new Date(t.tsk_date_add) < today0) || (new Date(t.tsk_date_add) < today0 && t.tsk_ctg_status == this.taskStatus.OPEN)).length;

        // Info
        // Total time spent today
        this.calculateTotalTimeSpentToday();
        this.state.openTasksCount = this.tasks.filter((t) => t.tsk_ctg_status == this.taskStatus.OPEN).length;
        this.state.backlogTasksCount = this.tasks.filter((t) => t.tsk_ctg_status == this.taskStatus.BACKLOG).length;

        // Postponed tasks count
        this.state.postponedTasksCount = this.tasks.filter((t) => t.tsk_ctg_status == this.taskStatus.OPEN && (t.tsk_date_view_until ? new Date(t.tsk_date_view_until) > today : false)).length;
        this.state.productivityRatio = {};
        if (this.state.totalTimeSpentToday !== 0){
            this.state.productivityRatio.value = Math.round((this.state.totalTimeEstimatedClosedToday * 60 * 100) / this.state.totalTimeSpentToday) / 100;
            if (this.state.productivityRatio.value >= 1){
                this.state.productivityRatio.className = 'productivity-good';
                this.state.productivityRatio.message = 'Good! keep going!';
            } else {
                this.state.productivityRatio.className = 'productivity-bad';
                this.state.productivityRatio.message = 'Come on! you can do it!';
            }
        } else {
            this.state.productivityRatio.value = 0;
            this.state.productivityRatio.className = 'productivity-good';
            this.state.productivityRatio.message = "Let's begin!";
        }

        // Indicators
        this.state.dayStartedAtDate = this.firstTTEntryFromDay(today0);
        if(this.state.dayStartedAtDate){
            this.state.realTimeElapsed = this.elapsedTime(this.firstTTEntryFromDay(today0),this.lastTTEntryFromDay(today0));
        }
        this.state.karmaCount = 0;
        this.state.karmaScore = 0;
        this.state.closedTodayTasks.forEach((t: any) => {
            let onTime = t.tsk_total_time_spent < (t.tsk_estimated_duration * 60);
            this.state.karmaCount += onTime ? 1 : 0;
        });
        if (this.state.closedTodayTasks.length){
            this.state.karmaScore = Math.round(this.state.karmaCount * 100 / this.state.closedTodayTasks.length) / 100;
        }
        this.state.timeManagementRatio = 0;
        if (this.state.realTimeElapsed){
            this.state.timeManagementRatio = Math.round(this.state.totalTimeSpentToday * 100 / this.state.realTimeElapsed) / 100;
        }

        // indicators array
        this.calculateIndicators();

        // identify not synced tasks
        this.tasksNotInSync();

        // reporting
        this.weekStats();
        this.dayDistribution();
        this.qualifierTotals();

        if (this.load){
            this.load = false;
            setTimeout(() => this.showTimersOnLoad(), 100);
            this.scheduleNotificationsForStartingTasks();
        }

        // next tasks to do today
        if (this.nextTasks.length === 0){
            this.nextTasks.push({
                'estimatedDuration': 0
                , 'tasks': []
            });
            if (typeof(window.localStorage) !== "undefined") {
                let nextTasksIds = JSON.parse(localStorage.getItem('NextTasks'));
                if(nextTasksIds){
                    nextTasksIds.forEach((id: string) => {
                        let nt = this.tasks.find((e: any) => e.tsk_id === id && e.tsk_ctg_status === this.taskStatus.OPEN);
                        if (nt) {
                            this.nextTasks[0].tasks.push(nt);
                        }
                    });
                    localStorage.setItem("NextTasks", JSON.stringify(this.nextTasks[0].tasks.map((e: any) => e.tsk_id)));
                }
            }
        }
        this.nextTasks[0].estimatedDuration = 0;
        this.nextTasks[0].tasks.forEach((t: any) => {
            if (t.tsk_ctg_status === this.taskStatus.OPEN){
                this.nextTasks[0].estimatedDuration += t.tsk_estimated_duration;
            } else {
                let index = this.nextTasks[0].tasks.findIndex((e: any) => e.tsk_id === t.tsk_id);
                this.nextTasks[0].tasks.splice(index,1);
                localStorage.setItem("NextTasks", JSON.stringify(this.nextTasks[0].tasks.map((e: any) => e.tsk_id)));
            }
        });
        // sort next tasks by order field
        let sortByOrder = (a: any, b: any) => {
            let res = a.tsk_order > b.tsk_order;
            return res ? 1 : -1;
        };
        this.nextTasks[0].tasks = this.nextTasks[0].tasks.sort(sortByOrder);

        if (this.focusedTask.task){
            if (this.focusedTask.task.tsk_ctg_status === this.taskStatus.OPEN){
                console.log('trying to set focus for task',this.focusedTask);
                //let f: HTMLElement = document.getElementById(this.focusedTask.tsk_id).querySelector('span.task-text[contenteditable=true]');
                //f['tabIndex'] = -1;
                setTimeout(() => {
                    this.focusedTask.element.focus();
                    console.log('focus should be set now');
                //     f.focus();
                }, 3000);
            } else {

            }
        }

        // Update comparison results
        setTimeout(() => {
            this.services.tasksCore.computeComparisonData().then((data: any) => this.comparisonData = data);
        }, 6000);
    }

    showTimersOnLoad(){
        this.tasks.filter(t => {
            return t.tsk_ctg_status == this.taskStatus.OPEN && t.tsk_ctg_in_process === 2  && (t.tsk_date_view_until ? new Date(t.tsk_date_view_until) < new Date() : true);
        }).forEach(t => {
            if (!this.timers[t.tsk_id]){
                this.showTimer(t,this.getTaskDOMElement(t.tsk_id));
            }
        });
    }

    setSelected(item: any){
        this.state.selected = item;
    }

    sortByGroup(a: any, b: any){
        if (a.tsk_id_record !== b.tsk_id_record){
            return (a.tsk_id_record > b.tsk_id_record) ? 1 : -1;
        } else {
            return (a.tsk_order > b.tsk_order) ? 1 : -1;
        }
    }

    createGroupedTasks(tasks: Array<any>){
        let res: Array<any> = [];
        let lastHeader: string;

        tasks.forEach((t) => {
            if (t.tsk_id_record !== lastHeader){
                lastHeader = t.tsk_id_record;
                res.push({
                    'header': lastHeader
                    , 'estimatedDuration': 0
                    , 'tasks': []
                });
            }
            res[res.length-1].tasks.push(t);
            res[res.length-1].estimatedDuration += t.tsk_estimated_duration;
        });

        // order groups by total ETA
        res = res.sort((a: any, b: any) :number => {
            return a.estimatedDuration > b.estimatedDuration ? -1 : 1;
        });

        return res;
    }

    toggleTimeTracking(t: any, event: KeyboardEvent){
        let parent = event.target["parentNode"];
        this.taskToggleTimeTracking(t,parent);
    }

    taskEdit(t: Task, event: KeyboardEvent){
        let parent = event.target["parentNode"];
        if (event.altKey && event.keyCode==38){ // detect move up
            this.taskMoveUp(parent);
        }
        if (event.altKey && event.keyCode==40){ // detect move down
            this.taskMoveDown(parent);
        }
        if (!event.altKey && event.keyCode==38){ // detect jump up
            this.taskJumpUp(parent,"span.task-text[contenteditable=true]");
        }
        if (!event.altKey && event.keyCode==40){ // detect jump down
            this.taskJumpDown(parent,"span.task-text[contenteditable=true]");
        }
        if (!event.shiftKey && event.keyCode==113){ // detect "F2" = start/stop time tracking
            this.taskToggleTimeTracking(t,parent);
        }
        if (event.altKey && event.keyCode==83){ // detect 's'
            this.setSelected(t);
        }
        if (event.altKey && event.keyCode==46){ // detect supr (delete)
            this.taskCancel(t);
        }
        if (event.altKey && event.keyCode==66){ // detect 'b'
            this.taskToBacklog(t);
        }
        if (event.altKey && (event.keyCode==106 || event.keyCode==49)){ // detect '*' || '1'
            document.querySelector(`input[type=checkbox]#${t.tsk_id}`)['click']();
        }
        if (event.altKey && (event.keyCode==73 || event.keyCode==50)){ // detect 'i' || '2'
            this.markTaskAs(t,'important');
        }
        if (event.altKey && (event.keyCode==85 || event.keyCode==52)){ // detect 'u' || '4'
            this.markTaskAs(t,'urgent');
        }
        if (event.altKey && (event.keyCode==72 || event.keyCode==53)){ // detect 'h' || '5'
            this.markTaskAs(t,'highlighted');
        }
        if (event.altKey && (event.keyCode==80 || event.keyCode==51)){ // detect 'p' || '3'
            this.markTaskAs(t,'progressed');
        }
        if (event.altKey && (event.keyCode==67 || event.keyCode==54)){ // detect 'c' || '6'
            this.markTaskAs(t,'call');
        }
        if (event.altKey && (event.keyCode==55)){ // detect '7'
            this.markTaskAs(t,'unexpected');
        }
        if (event.altKey && event.keyCode==107){ // detect '+'
            this.focusElement('input[name=tsk_name]');
        }
        if (event.altKey && event.keyCode==78){ // detect 'n'
            this.asNextToDo(t,true);
        }
        if (event.altKey && event.keyCode==82){ // detect 'r'
            this.asNextToDo(t,false);
        }
        if (event.altKey && event.keyCode==84){ // detect 't'
            let tt = this.lastTTEntryFromDay(this.services.dateUtils.dateOnly(new Date()));
            if (!tt){ // no task today, try yesterday
                tt = this.lastTTEntryFromDay(this.services.dateUtils.dateOnly(this.services.dateUtils.addDays(new Date(),-1)));
            }
            if (tt && t.tsk_time_history.length) {
                t.tsk_time_history[t.tsk_time_history.length - 1].tsh_date_start = tt;
                if (t.tsk_ctg_in_process == 1){
                    let randomFinish = ((t.tsk_estimated_duration - 2) * 60) + Math.floor(Math.random() * 2 * 10 * 6);
                    t.tsk_time_history[t.tsk_time_history.length - 1].tsh_date_end = new Date(tt.getTime() + randomFinish * 1000);
                    t.tsk_time_history[t.tsk_time_history.length - 1].tsh_time_spent = randomFinish;
                    let total: number = 0;
                    t.tsk_time_history.forEach((tth: any) => {
                        total += tth.tsh_time_spent;
                    });
                    this.services.tasksCore.updateTask(t,{
                        tsk_total_time_spent: total
                    });
                    t.tsk_total_time_spent = total;
                    console.log('task with changes after time tracking setup',t);
                }
                //this.updateTaskTimeTracking(t.tsk_id,t.tsk_time_history.length,data);
                this.services.tasksCore.tasksToStorage(); // TODO: move this sentence to tasksCore
                // TODO: update time tracking history on server
                this.updateState();
            }
        }
        if (event.shiftKey && event.keyCode==113){ // detect "Shift + F2" = find time tracking task, stop it, close the task and start the focused one
            // find tasks in progress
            let inprogress: Array<Task> = this.tasks.filter((task: Task) => task.tsk_ctg_in_process === 2);
            console.log('inprogress now',inprogress);
            // stop them
            inprogress.forEach((task: Task) => {
                // let parent: HTMLElement = document.getElementById(task.tsk_id);
                // this.taskToggleTimeTracking(task, parent);
                document.querySelector(`#${task.tsk_id} input[type=checkbox]`)['click']();
            });
            // start current task time tracking
            this.taskToggleTimeTracking(t,parent);
        }
        // event.preventDefault();
        // event.returnValue = false;
        // return false;
    }

    taskCheckboxHandler(t: any, event: Event){
        if (this.timers[t.tsk_id]) { // task is in running state
            // stop time tracking
            this.taskToggleTimeTracking(t,this.getTaskDOMElement(t.tsk_id));
        }
        let dateDone: Date = this.services.dateUtils.newDateUpToSeconds();
        if (event['shiftKey'] && t.tsk_time_history.length){ // modifier, use the last time tracking end date record
            dateDone = new Date(t.tsk_time_history[t.tsk_time_history.length-1].tsh_date_end);
        }
        this.updateTask(t.tsk_id,{
            tsk_ctg_status: event['target']['checked'] ? this.taskStatus.CLOSED : this.taskStatus.OPEN
            , tsk_date_done: dateDone
        });
        setTimeout(() => {
            this.updateState();
        }, this.delayOnUpdateState);
    }

    updateTask(tsk_id: string, newData: any){
        let model = this.tasks.find((e) => e.tsk_id === tsk_id);
        this.services.tasksCore.updateTask(model,newData);
    }

    taskMoveUp(current: HTMLElement){
        // previous <- current | next
        // current | previous | next
        if (current.previousElementSibling && current.previousElementSibling.id){
            this.interchangeTaskOrder(current.id,current.previousElementSibling.id);
            current.parentNode.insertBefore(current.previousSibling,current.nextSibling);
        }
    }

    taskMoveDown(current: HTMLElement){
        // previous | current -> next
        // previous | next | current
        if (current.nextElementSibling && current.nextElementSibling.id){
            this.interchangeTaskOrder(current.id,current.nextElementSibling.id);
            current.parentNode.insertBefore(current.nextSibling,current);
        }
    }

    interchangeTaskOrder(tsk_id1: string,tsk_id2: string){
        let t1 = this.tasks.find((e) => e.tsk_id === tsk_id1).tsk_order;
        let t2 = this.tasks.find((e) => e.tsk_id === tsk_id2).tsk_order;
        this.updateTask(tsk_id1,{tsk_order: t2});
        this.updateTask(tsk_id2,{tsk_order: t1});
    }

    taskJumpUp(current: any, selector: string){
        if (current.previousElementSibling.querySelector(selector)){
            current.previousElementSibling.querySelector(selector).focus();
        } else {
            if (current.previousElementSibling.parentNode.previousElementSibling && current.previousElementSibling.parentNode.previousElementSibling.lastElementChild.querySelector(selector)){
                current.previousElementSibling.parentNode.previousElementSibling.lastElementChild.querySelector(selector).focus();
            } else {
                if (this.showBatchAdd){
                    this.focusElement("textarea[name=tsk_multiple_name]");
                } else {
                    this.focusElement("input[name=tsk_name]");
                }
            }
        }
    }

    focusElement(selector: string){
        document.querySelector(selector)["focus"]();
    }

    taskJumpDown(current: any, selector: string){
        if (current.nextElementSibling && current.nextElementSibling.querySelector(selector)){
            current.nextElementSibling.querySelector(selector).focus();
        } else {
            if (current.parentNode.nextElementSibling && current.parentNode.nextElementSibling.firstElementChild.nextElementSibling.querySelector(selector)){
                current.parentNode.nextElementSibling.firstElementChild.nextElementSibling.querySelector(selector).focus();
            }
        }
    }

    taskToggleTimeTracking(task: any, dom: HTMLElement){
        if (task.tsk_ctg_in_process === 1){
            // not in progress
            task.tsk_ctg_in_process = 2;
            this.updateTask(task.tsk_id,{
                tsk_ctg_in_process: 2
            });
            // show timer
            this.showTimer(task,dom);
            this.services.tasksCore.addTimeTracking(task);
        } else {
            // already in progress
            task.tsk_ctg_in_process = 1;
            this.updateTask(task.tsk_id,{
                tsk_ctg_in_process: 1
            });
            // hide timer
            this.hideTimer(task,dom);
            this.services.tasksCore.stopTimeTracking(task);
            this.calculateTotalTimeSpentToday();
        }
    }

    showTimer(task: any, dom: HTMLElement){
        let timer: number = 0;
        let start: Date = this.services.dateUtils.newDateUpToSeconds();

        // if task was running previously, get current running time
        if ( task.tsk_time_history.length > 0 ){
            let h = task.tsk_time_history[task.tsk_time_history.length-1];
            if (h.tsh_time_spent === 0){
                h.tsh_date_start = new Date(h.tsh_date_start);
                start = h.tsh_date_start;
                timer = this.elapsedTime(h.tsh_date_start,this.services.dateUtils.newDateUpToSeconds());
            }
        }

        // dom.querySelector("span[contenteditable=true]").classList.add("task-in-process");
        let formatTimerString = (timer: number) => {
            if (this.timerModeRemaining){
                return "R-" + this.formatTime((parseInt(task.tsk_estimated_duration) * 60) - parseInt(task.tsk_total_time_spent) - timer);
            } else {
                return this.formatTime(timer);
            }
        };

        let calcTimer = (start: Date) => {
            return this.elapsedTime(start,this.services.dateUtils.newDateUpToSeconds());
        }

        let watch = setInterval(() => {
            let h = task.tsk_time_history[task.tsk_time_history.length-1];
            timer = calcTimer(new Date(h.tsh_date_start));
            this.timers[task.tsk_id].timerString = formatTimerString(timer);
            if (task.tsk_estimated_duration * 60 - 60 < task.tsk_total_time_spent + timer && !this.timers[task.tsk_id].burnoutNotified){
                this.timers[task.tsk_id].burnoutNotified = true;
                if (this.tasks.find(t => t.tsk_id === task.tsk_id).tsk_ctg_status === this.taskStatus.OPEN){
                    this.notification({
                        body: `Task "${task.tsk_name}" is about to exceed estimation!`
                    });
                }
            }
        }, 1000);

        this.timers[task.tsk_id] = {};
        this.timers[task.tsk_id].timerString = formatTimerString(timer);
        this.timers[task.tsk_id].watch = watch;
        this.timers[task.tsk_id].burnoutNotified = false;
    }

    hideTimer(task: any, dom: HTMLElement){
        if (this.timers[task.tsk_id]){
            clearInterval(this.timers[task.tsk_id].watch);
            this.timers[task.tsk_id] = undefined;
        }
        // dom.querySelector("span[contenteditable=true]").classList.remove("task-in-process");
    }

    // TODO: replace with service's method
    elapsedTime(date1: Date, date2: Date) :number{
        return this.services.tasksCore.elapsedTime(date1,date2);
        //return Math.abs(date1.getTime() - date2.getTime()) / 1000;
    }

    formatTime(elapsed: number, format: String = undefined) :String{
        // time in seconds
        let hr: number = Math.floor(elapsed / (60 * 60));
        let min: number = Math.floor((elapsed - (hr * 60 * 60)) / 60);
        let sec: number = Math.round(elapsed - (hr * 60 * 60) - (min * 60));
        let str = "";
        if (format === "hr:min:sec" || format === undefined){
            if (hr === 0){ // only min:sec
                str += ((min > 9) ? min : "0" + min);
                str += ":" + ((sec > 9) ? sec : "0" + sec);
            } else {
                str += (hr > 9) ? hr : "0" + hr;
                str += ":" + ((min > 9) ? min : "0" + min);
                str += ":" + ((sec > 9) ? sec : "0" + sec);
            }
        }
        if (format === "#h#m"){
            if (hr === 0){
                str = `${min}m`;
            } else {
                if (min === 0){
                    str = `${hr}h`;
                } else {
                    str = `${hr}h${min}m`;
                }
            }
        }
        return str;
    }

    deleteTimeTracking(t: any, h: any){
        let spent: number = 0;

        t.tsk_time_history.forEach((tt: any) => {
            if (tt.tsh_num_secuential < h.tsh_num_secuential){
                spent += tt.tsh_time_spent;
            }
            if (tt.tsh_num_secuential > h.tsh_num_secuential){
                tt.tsh_num_secuential -= 1;
                spent += tt.tsh_time_spent;
            }
        });

        t.tsk_time_history.splice(h.tsh_num_secuential-1,1);
        t.tsk_total_time_spent = spent;
        this.calculateTotalTimeSpentToday();
    }

    editTimeTracking(h: any, which: number, event: KeyboardEvent){
        let newValue: string = event.target['textContent'];
        let field: string = (which === 1) ? 'tsh_date_start' : 'tsh_date_end';
        let oldValue: string = h[field];
        let task: any = this.tasks.find((t: any) => t.tsk_id === h.tsh_id);

        if (newValue.length !== 19 || (new Date(newValue)).getTime() === (new Date(oldValue)).getTime()){
            return false;
        }

        if (which !== 1 && task.tsk_ctg_in_process === 2 ){
            return false;
        }

        let data: any = {};
        data[field] = new Date(newValue);
        this.updateTaskTimeTracking(h.tsh_id,h.tsh_num_secuential,data);

        if (this.timers[h.tsh_id]){
            let dom: HTMLElement = this.getTaskDOMElement(task.tsk_id); 
            this.hideTimer(task,dom);
            this.showTimer(task,dom);
        }
        this.calculateTotalTimeSpentToday();
    }

    updateTaskTimeTracking(tsh_id: string, tsh_num_secuential: number, newData: any){
        let model = this.tasks.find((e) => e.tsk_id === tsh_id);
        if (model){
            model = model.tsk_time_history.find((h: any) => h.tsh_num_secuential === tsh_num_secuential);
        }
        this.services.tasksCore.updateTaskTimeTracking(model,newData);
    }

    getTaskDOMElement(tsk_id: string) :HTMLElement {
        let dom: HTMLElement = document.querySelector(`div[id="${tsk_id}"] span`).parentElement;
        return dom;
    }

    inputKeyUpHandler(event: KeyboardEvent){
        if (event.keyCode === 40 && !this.showBatchAdd){ // Down arrow
            this.focusElement("span[contenteditable=true]");
        }
        if (event.keyCode==113){ // detect "F2" = toggle Batch Add
            this.showBatchAdd = !this.showBatchAdd;
            this.viewETABeforeAdd = false;
            setTimeout(() => {
                if (this.showBatchAdd){
                    this.focusElement("textarea[name=tsk_multiple_name]");
                } else {
                    this.focusElement("input[name=tsk_name]");
                }
            }, 100);
        }
        // interpret ETAs and sum them up by record
        let t: any;
        let totalETA = 0;
        let totalPerRecord = <any>[];
        let value: string = event.target['value'];
        // console.log('event',event);
        // console.log(value.split('\n'));
        if (value){
            let totalTasksWritten = 0;
            value.split('\n').forEach((text: string) => {
                if (!text.startsWith('//') && text !== ''){
                    t = this.services.tasksCore.parseTask({
                        'tsk_date_add': this.services.dateUtils.newDateUpToSeconds(),
                        'tsk_name': text
                    },this.options);
                    if (totalPerRecord.find((r: any) => r.record === t.tsk_id_record)){
                        totalPerRecord.find((r: any) => r.record === t.tsk_id_record).totalETA += t.tsk_estimated_duration || 0;
                    } else {
                        totalPerRecord.push({
                            record: t.tsk_id_record
                            , totalETA: t.tsk_estimated_duration || 0
                        });
                    }
                    totalETA += t.tsk_estimated_duration || 0;
                    totalTasksWritten++;
                    // console.log("totals",totalPerRecord);
                }
            });
            this.viewETABeforeAdd = true;
            this.state.beforeAddETA = totalPerRecord;
            this.state.beforeAddTotalETA = totalETA;
            this.state.beforeAddTotalTasksWritten = totalTasksWritten;
            // console.log('ETA',totalETA);
        } else {
            this.viewETABeforeAdd = false;
        }
    }
    
    toggleViewBacklog(){
        this.viewBacklog = !this.viewBacklog;
    }

    toggleViewAll(){
        this.viewAll = !this.viewAll;
    }

    toggleViewReportsWeek(){
        this.viewReportsWeek = !this.viewReportsWeek;
    }

    toggleViewReportsDayDistribution(){
        this.viewReportsDayDistribution = !this.viewReportsDayDistribution;
    }

    toggleViewPostponed(){
        this.viewPostponed = !this.viewPostponed;
    }

    toggleViewOptions(){
        this.viewOptions = !this.viewOptions;
    }

    ageFontSizeNormalization(t: any) {
        // range from 8px to 80px
        let age = this.taskAgeRaw(t) / 2;
        return age >= 72 ? 80 : age + 8;
    }

    taskAgeRaw(t: any){
        return this.services.tasksCore.elapsedDays(new Date(t.tsk_date_add),new Date());
    }
    
    taskAge(t: any){
        let diff = this.services.tasksCore.elapsedDays(new Date(t.tsk_date_add),new Date());
        return `${(diff > 1 ? '(' + diff + ' days ago)' : (diff === 1 ? '(yesterday)' : ''))}`;
    }

    taskAgeClass(t: any){
        let diff = this.services.tasksCore.elapsedDays(new Date(t.tsk_date_add),new Date());
        let classes = ['task-age-0','task-age-1','task-age-2','task-age-10'];
        if (diff <= 2){
            return classes[diff];
        }
        if (2 < diff && diff < 10){
            return classes[2];
        }
        if (diff >= 10){
            return classes[3];
        }
        return '';
    }

    deleteTasks(){
        this.services.tasksCore.deleteTasks();
        this.updateState();
    }

    calculateTotalTimeSpentToday(){
        let today = new Date();
        let today0 = new Date(today.getFullYear(),today.getMonth(),today.getDate());
        let tomorrow0 = new Date(today.getFullYear(),today.getMonth(),today.getDate()+1);
        this.state.allClosedTimeTrackingToday = <any>[];
        this.state.allOpenTimeTrackingToday = <any>[];
        this.tasks.filter((t) => {
            t.tsk_time_history.filter((h: any) => {
                if (today0 <= new Date(h.tsh_date_start) && new Date(h.tsh_date_start) <= tomorrow0){
                    if (t.tsk_ctg_status === this.taskStatus.CLOSED){
                        this.state.allClosedTimeTrackingToday.push(h);
                    } else {
                        this.state.allOpenTimeTrackingToday.push(h);
                    }
                }
            });
        });
        let spent = 0;
        this.state.allClosedTimeTrackingToday.forEach((h: any) => {
            spent += h.tsh_time_spent;
        });
        this.state.totalTimeSpentTodayOnClosedTasks = spent;
        this.state.totalTimeSpentToday = 0;
        this.state.totalTimeSpentToday += spent;
        spent = 0;
        this.state.allOpenTimeTrackingToday.forEach((h: any) => {
            spent += h.tsh_time_spent;
        });
        this.state.totalTimeSpentTodayOnOpenTasks = spent;
        this.state.totalTimeSpentToday += spent;
    }

    setOpen(t: any){
        this.updateTask(t.tsk_id,{
            tsk_ctg_status: this.taskStatus.OPEN
        });
        this.updateState();
    }

    taskEstimatedDurationEdit(t: any, event: KeyboardEvent){
        let newDuration: number = this.services.tasksCore.parseTime(event.target['textContent']);
        if (newDuration !== t.tsk_estimated_duration){
            // if schedule date end is set, update it as well
            let newEnd = t.tsk_schedule_date_end;
            if (t.tsk_schedule_date_end){
                newEnd = new Date((new Date(t.tsk_schedule_date_start)).getTime() + newDuration * 60 * 1000);
            }
            this.updateTask(t.tsk_id,{
                tsk_estimated_duration: newDuration
                , tsk_schedule_date_end: newEnd
            });
        }
    }

    commandOnTask(t: any, event: KeyboardEvent){
        if (t.tsk_name !== event.target['textContent']){
            this.updateTask(t.tsk_id,{
                tsk_name: event.target['textContent']
            });
        }

        let command = event.target['textContent'];
        let originalTask = '';
        if (command.indexOf('--') !== -1){ // postpone
            command = command.substring(command.indexOf('--') + 2);
            originalTask = t.tsk_name.replace(' --' + command,'');
            console.log('command:',command);
            if (command.startsWith('pos')){
                // --pos 17:30
                // --pos now +2h30m
                // --pos tomorrow 09:00
                // --pos 2016-12-31 23:59
                let data = command.substring(4);
                let s = this.services.tasksCore.parseDatetime(data);
                console.log('date parsed:',s);
                this.updateTask(t.tsk_id,{
                    tsk_name: originalTask,
                    tsk_date_view_until: s.date_start
                });
                this.updateState();
            }
        }
        if (command.startsWith('->[')){ // move to other record
            command = command.substring(command.indexOf('->[') + 3,command.indexOf(']',command.indexOf('->[') + 3));
            originalTask = t.tsk_name.replace('->[' + command + '] ','');
            originalTask = t.tsk_name.replace('->[' + command + ']','');
            console.log('command new list:',command);
            if (command) {
                this.updateTask(t.tsk_id,{
                    tsk_name: originalTask,
                    tsk_id_record: command
                });
                this.updateState();
            }
        }
        if (command.indexOf('%[') !== -1){ // set schedule
            let endPosition = command.indexOf(']',command.indexOf('%[')) === -1 ? command.length : command.indexOf(']',command.indexOf('%['));
            command = command.substring(command.indexOf('%[') + 2,endPosition);
            let s = this.services.tasksCore.parseDatetime(command);
            originalTask = t.tsk_name.replace('%[' + command + '] ','');
            originalTask = t.tsk_name.replace(' %[' + command + ']','');
            originalTask = t.tsk_name.replace('%[' + command + ']','');
            this.updateTask(t.tsk_id,{
                tsk_name: originalTask,
                tsk_schedule_date_start: s.date_start,
                tsk_schedule_date_end: s.date_end,
                tsk_estimated_duration: s.duration
            });
            this.updateState();
        }
        if (command.indexOf('#[') !== -1){ // set schedule
            let endPosition = command.indexOf(']',command.indexOf('#[')) === -1 ? command.length : command.indexOf(']',command.indexOf('#['));
            command = command.substring(command.indexOf('#[') + 2,endPosition);
            
            originalTask = t.tsk_name.replace('#[' + command + '] ','');
            originalTask = t.tsk_name.replace(' #[' + command + ']','');
            originalTask = t.tsk_name.replace('#[' + command + ']','');
            this.updateTask(t.tsk_id,{
                tsk_name: originalTask,
                tsk_tags: command,
            });
            this.updateState();
        }
        if (command.indexOf('http://') !== -1){ // set url
            this.services.tasksCore.doThisWithAToken(t, (t: Task, expression: string) => {
                //t.tsk_url = 'http://' + expression;
                this.updateTask(t.tsk_id,{
                    tsk_name: t.tsk_name,
                    tsk_url: 'http://' + expression,
                });
                this.updateState();
            }, 'http://');
        }
        if (command.indexOf('https://') !== -1){ // set url
            this.services.tasksCore.doThisWithAToken(t, (t: Task, expression: string) => {
                //t.tsk_url = 'https://' + expression;
                this.updateTask(t.tsk_id,{
                    tsk_name: t.tsk_name,
                    tsk_url: 'https://' + expression,
                });
                this.updateState();
            }, 'https://');
        }
    }

    notification(data: any){
        let not = window["Notification"];
        if(not && not.permission !== "denied") {
            not.requestPermission(function(status: string) {  // status is "granted", if accepted by user
                var n = new not(data.title || 'Tasks', { 
                    body: data.body,
                    icon: data.icon || 'favicon.ico' // optional
                }); 
            });
        }
    }

    setUnpostpone(t: any){
        this.updateTask(t.tsk_id,{
            tsk_date_view_until: this.services.dateUtils.newDateUpToSeconds()
        });
        if (this.state.postponedTasks.length === 0){
            this.viewPostponed = false;
        }
        this.updateState();
    }

    scheduleNotificationsForStartingTasks(){
        let now = this.services.dateUtils.newDateUpToSeconds();
        let tomorrow0 = new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);
        if (!this.state.startingTasksSchedule){
            this.state.startingTasksSchedule = [];
        }
        this.tasks.filter((t) => {
            return t.tsk_ctg_status !== this.taskStatus.CLOSED && (t.tsk_schedule_date_start ? now < new Date(t.tsk_schedule_date_start) && new Date(t.tsk_schedule_date_start) < tomorrow0 : false)
        }).forEach((t) =>{
            let diff = this.services.tasksCore.elapsedTime(now, new Date(t.tsk_schedule_date_start));
            diff = diff - (5 * 60); // date minus 5 minutes
            // validate if there is no current schedule set
            let found = this.state.startingTasksSchedule.find((s: any) => s.task.tsk_id == t.tsk_id && s.timeoutHandler != -1);
            if (found) {
                if (new Date(found.task.tsk_schedule_date_start) != new Date(t.tsk_schedule_date_start)){
                    clearTimeout(found.timeoutHandler);
                    found.timeoutHandler = -1;
                } else {
                    return false; // date is the same, do nothing
                }
            }
            let timeout = setTimeout(() => {
                this.notification({
                    body: `Task "${t.tsk_name}" is about to start!`
                });
            }, diff * 1000);
            console.log('schedule in ' + this.formatTime(diff),t);
            this.state.startingTasksSchedule.push({
                task: t,
                timeoutHandler: timeout
            });
        });
    }

    taskCancel(t: any){
        this.updateTask(t.tsk_id,{
            tsk_ctg_status: this.taskStatus.CANCELLED
        });
        this.updateState();
        console.log('cancelled task',t);
    }

    weekStats(){
        let mondayDate = this.lastMonday(new Date(2016,11,15));
        let dayTasks = <any>[];
        let currentDay = mondayDate;
        let tomorrow = this.addDays(currentDay,1);
        let today = this.services.tasksCore.dateOnly(this.services.dateUtils.newDateUpToSeconds());
        let dailyCount = <any>[];
        let estimatedTotalPerDay = 0;
        let spentTotalPerDay = 0;

        while(currentDay <= today){
            dayTasks = this.tasks.filter(t => new Date(t.tsk_date_done) > currentDay && new Date(t.tsk_date_done) < tomorrow);
            estimatedTotalPerDay = 0;
            spentTotalPerDay = 0;

            dayTasks.forEach((t: any) => {
                estimatedTotalPerDay += t.tsk_estimated_duration;
                spentTotalPerDay += t.tsk_total_time_spent;
            });

            if (spentTotalPerDay !== 0){
                dailyCount.push({
                    date: currentDay
                    , tasksDone: dayTasks.length
                    , estimated: estimatedTotalPerDay
                    , timeSpent: spentTotalPerDay
                    , productivity: spentTotalPerDay === 0 ? 0 : Math.round((estimatedTotalPerDay * 60 * 100) / spentTotalPerDay) / 100
                    , realTimeElapsed: this.elapsedTime(this.firstTTEntryFromDay(currentDay),this.lastTTEntryFromDay(currentDay))
                });
            }

            currentDay = this.addDays(currentDay,1);
            tomorrow = this.addDays(currentDay,1);
        }

        this.reports.week = dailyCount;
    }

    lastMonday(from: Date){
        let base: Date = this.services.tasksCore.dateOnly(from);
        while (base.getDay() !== 1){
            base = this.addDays(base,-1);
        }
        return base;
    }

    addDays(base: Date, days: number){
        return new Date(( base.getTime() + (days * 86400000) ));
    }

    taskQualifiersEdit(task: any, event: KeyboardEvent){
        let newQualifiers = event.target['textContent'];

        if (task.tsk_qualifiers !== newQualifiers){
            this.updateTask(task.tsk_id,{
                tsk_qualifiers: newQualifiers
            });
            // this.updateState();
        }
    }

    firstTTEntryFromDay(date: Date){
        let day0 = this.services.tasksCore.dateOnly(date);
        let nextDay0 = this.addDays(day0,1);
        let firstDate: Date = nextDay0;
        let tasksOfTheDay = this.tasks.filter((t: any) => {
            return new Date(t.tsk_date_done) >= day0 && new Date(t.tsk_date_done) < nextDay0;
        });
        tasksOfTheDay.forEach((t: any) => {
            if (t.tsk_time_history.length){
                t.tsk_time_history.forEach((h: any) => {
                    if (new Date(h.tsh_date_start) < firstDate && day0 < new Date(h.tsh_date_start)){
                        firstDate = new Date(h.tsh_date_start);
                    }
                });
            }
        });
        if (firstDate === nextDay0){
            return null;
        }
        return firstDate;
    }

    lastTTEntryFromDay(date: Date){
        let day0 = this.services.tasksCore.dateOnly(date);
        let nextDay0 = this.addDays(day0,1);
        let lastDate: Date = day0;
        let tasksOfTheDay = this.tasks.filter((t: any) => {
            return new Date(t.tsk_date_done) >= day0 && new Date(t.tsk_date_done) < nextDay0;
        });
        tasksOfTheDay.forEach((t: any) => {
            if (t.tsk_time_history.length){
                t.tsk_time_history.forEach((h: any) => {
                    if (new Date(h.tsh_date_end) > lastDate && new Date(h.tsh_date_end) < nextDay0){
                        lastDate = new Date(h.tsh_date_end);
                    }
                });
            }
        });
        if (lastDate === day0){
            return null;
        }
        return lastDate;
    }

    taskToBacklog(t: any){
        this.updateTask(t.tsk_id,{
            tsk_ctg_status: this.taskStatus.BACKLOG
        });
        this.updateState();
    }

    dayDistribution(){
        let table = <any>[];
        let records = <any>[];
        let closedTodayTasks = this.state.closedTodayTasks;
        closedTodayTasks.forEach((t: any) => {
            if (table.indexOf(t.tsk_id_record) === -1){
                table.push(t.tsk_id_record);
                records.push({
                    "record": t.tsk_id_record,
                    "eta": 0,
                    "real": 0,
                    "percentageEta": 0,
                    "percentageReal": 0
                });
            }
        });

        let rec: any = null;
        let totalEta: number = 0;
        let totalReal: number = 0;
        closedTodayTasks.forEach((t: any) => {
            rec = records.find((r: any) => r.record === t.tsk_id_record);
            if (rec){
                rec.eta += t.tsk_estimated_duration;
                rec.real += t.tsk_total_time_spent;
                totalEta += t.tsk_estimated_duration;
                totalReal += t.tsk_total_time_spent;
            }
        });

        // order by total real
        records = records.sort((a: any, b: any) => {
            return (a.real < b.real) ? 1 : -1;
        });

        // percentage
        records.forEach((r: any) => {
            r.percentageEta = Math.round(r.eta * 100 / totalEta) / 100;
            r.percentageReal = Math.round(r.real * 100 / totalReal) / 100;
        });

        this.reports.dayDistribution = records;
    }

    editDateDone(t: any, event: KeyboardEvent){
        let newValue: string = event.target['textContent'];
        let oldValue: string = t.tsk_date_done;

        if (newValue.length !== 19 || (new Date(newValue)).getTime() === (new Date(oldValue)).getTime()){
            return false;
        }

        this.updateTask(t.tsk_id,{
            tsk_date_done: new Date(newValue)
        });
    }

    backup(){
        let tasks = JSON.stringify(this.tasks);
        this.optionsInput = tasks;
    }
    
    backupDoneOnly(){
        let tasks = this.tasks.filter((t: any) => {
            return t.tsk_ctg_status === this.taskStatus.CLOSED;
        });
        let tasksStr = JSON.stringify(tasks);
        this.optionsInput = tasksStr;
        this.optionsMessage(`Backup correctly ${tasks.length} tasks.`);
    }

    optionsMessage(message: string){
        document.querySelector('#optionsMessages').innerHTML = message;
    }

    import(){
        let data = this.optionsInput;
        let tasks = JSON.parse(data);

        if (Array.isArray(tasks) && tasks.length > 0){
            this.services.tasksCore.import(tasks);
            this.tasks = this.services.tasksCore.tasks();
            this.optionsMessage(`Imported correctly ${tasks.length} tasks.`);
            setTimeout(() => this.updateState(), 100);
        }
    }

    purgeDoneTasks(){
        let tasks = this.tasks.filter((t: any) => {
            return t.tsk_ctg_status === this.taskStatus.CLOSED;
        });
        this.services.tasksCore.purgeDoneTasks();
        this.optionsMessage(`Deleted correctly ${tasks.length} tasks.`);
    }

    // formatTags(tags: string){
    //     if (tags){
    //         return "#" + tags.replace(/\s/g," #");
    //     }
    //     return "";
    // }

    showTagStats(tag: string){
        let tasks = this.tasks.filter(t => t.tsk_tags.indexOf(tag) !== -1);
        this.tagInfo.display = true;
        this.tagInfo.tasks = tasks;
        // this.tagInfo.tasksOpen = tasks.filter(t => t.tsk_ctg_status === this.taskStatus.OPEN || t.tsk_ctg_status === this.taskStatus.BACKLOG);
        // this.tagInfo.tasksClosed = tasks.filter(t => t.tsk_ctg_status === this.taskStatus.CLOSED || t.tsk_ctg_status === this.taskStatus.CANCELLED);

        this.tagInfo.tasksOpenTotalEstimated = 0;
        this.tagInfo.tasksOpenTotalSpent = 0;
        this.tagInfo.tasksClosedTotalEstimated = 0;
        this.tagInfo.tasksClosedTotalSpent = 0;
        tasks.forEach(t => {
            if (t.tsk_ctg_status === this.taskStatus.OPEN || t.tsk_ctg_status === this.taskStatus.BACKLOG){
                this.tagInfo.tasksOpenTotalEstimated += t.tsk_estimated_duration;
                this.tagInfo.tasksOpenTotalSpent += t.tsk_total_time_spent;
            }
            if (t.tsk_ctg_status === this.taskStatus.CLOSED || t.tsk_ctg_status === this.taskStatus.CANCELLED){
                this.tagInfo.tasksClosedTotalEstimated += t.tsk_estimated_duration;
                this.tagInfo.tasksClosedTotalSpent += t.tsk_total_time_spent;
            }
        });
    }

    statusText(status: number){
        let r = '';
        switch(status){
            case this.taskStatus.BACKLOG:
                r = 'BACKLOG';
                break;
            case this.taskStatus.OPEN:
                r = 'OPEN';
                break;
            case this.taskStatus.CANCELLED:
                r = 'CANCELLED';
                break;
            case this.taskStatus.CLOSED:
                r = 'CLOSED';
                break;
        }
        return r;
    }

    markTaskAs(t: any, qualifier: string){
        let task = this.tasks.find((e: any) => {
            return e.tsk_id === t.tsk_id;
        });
        let qualifiers = task.tsk_qualifiers;
        if (qualifiers.indexOf(qualifier) === -1){ // not present, add it
            qualifiers = qualifiers ? qualifiers + ',' + qualifier : qualifier;
        } else { // present, remove it
            qualifiers = qualifiers.replace(',' + qualifier,'').replace(qualifier + ',','').replace(qualifier,'');
        }
        this.updateTask(t.tsk_id,{
            tsk_qualifiers: qualifiers
        });
    }

    isOnline(){
        return navigator.onLine;
    }

    taskTagsEdit(task: any, event: KeyboardEvent){
        let newData = event.target['textContent'];

        if (task.tsk_tags !== newData){
            this.updateTask(task.tsk_id,{
                tsk_tags: newData
            });
            this.updateState();
        }
    }

    registerServiceWorker(){
        if ('serviceWorker' in navigator) {
            navigator['serviceWorker']
                .register('../service-worker.js')
                .then(function(registration: any) {
                    console.log("Service Worker Registered");
                    return registration.sync.getTags();
                }).then(function() {
                    return navigator['serviceWorker'].ready;
                }).then(function(reg: any) {
                    return reg.sync.register('syncTest');
                }).then(function() {
                    console.log('Sync registered');
                })
                .catch(function(err: any) {
                    console.log("Service Worker Failed to Register", err);
                })

            }
    }

    sendAllToServer(){
        this.services.tasksCore.batchAdd();
    }

    getTasksFromServer(){
        this.services.tasksCore.getTasksFromServer();
        this.updateState();
    }

    qualifierTotals(){
        let qualifierCollection = ['important','urgent','highlighted','progressed'];
        let tasks = this.tasks.filter((t: Task) => t.tsk_ctg_status === this.taskStatus.OPEN);
        let filtered: Array<Task> = [];
        let records = <any>[];
        let rec = {
            qualifier: <string> null
            , taskCount: 0
            , totalETA: 0
        };

        qualifierCollection.forEach((q) => {
            filtered = tasks.filter((t: Task) => t.tsk_qualifiers && t.tsk_qualifiers.indexOf(q) !== -1);
            rec = {
                qualifier: q
                , taskCount: filtered.length
                , totalETA: 0
            }
            filtered.forEach((t) => {
                rec.totalETA += t.tsk_estimated_duration;
            });

            records.push(rec);
        });
        
        // order by total ETA
        records = records.sort((a: any, b: any) => {
            return (a.totalETA < b.totalETA) ? 1 : -1;
        });

        // total overall
        records.push({
            qualifier: 'TOTAL'
            , taskCount: records.reduce((p: any, n: any) => {
                return (p.taskCount || p) + n.taskCount;
            })
            , totalETA: records.reduce((p: any, n: any) => {
                return (p.totalETA || p) + n.totalETA;
            })
        });

        this.reports.qualifierTotals = records;
    }

    toggleView(view: string){
        this[view] = !this[view];
    }

    timeTrackingQuickEdit(task: any, event: KeyboardEvent, target: string){
        let newValue: string = event.target['textContent'].trim();
        if (newValue.length === 8 && /[0-2][0-9]:[0-5][0-9]:[0-5][0-9]/.test(newValue)){
            let parts = newValue.split(':');
            let data = {};
            data[`tsh_date_${target}`] = new Date(this.services.tasksCore.dateOnly(this.services.dateUtils.newDateUpToSeconds()).getTime() + (parseInt(parts[0]) * 60 * 60 * 1000) + (parseInt(parts[1]) * 60 * 1000) + (parseInt(parts[2]) * 1000));
            // only update if value changed
            let previousValue = new Date(task.tsk_time_history[task.tsk_time_history.length-1][`tsh_date_${target}`]);
            if (data[`tsh_date_${target}`].getTime() !== previousValue.getTime()) {
                task.tsk_time_history[task.tsk_time_history.length-1][`tsh_date_${target}`] = data[`tsh_date_${target}`];
                this.updateTaskTimeTracking(task.tsk_id,task.tsk_time_history.length,data);
    
                if (this.timers[task.tsk_id]){
                    let dom: HTMLElement = this.getTaskDOMElement(task.tsk_id); 
                    this.hideTimer(task,dom);
                    this.showTimer(task,dom);
                }
                this.calculateTotalTimeSpentToday();
                this.triggerEvent('updateTimeTracking', task.tsk_time_history[task.tsk_time_history.length-1]);
            }
        }
        let parent = event.target["parentNode"]["parentNode"]["parentNode"];
        if (!event.altKey && event.keyCode==38){ // detect jump up
            this.taskJumpUp(parent,`span.tt-${target}[contenteditable=true]`);
        }
        if (!event.altKey && event.keyCode==40){ // detect jump down
            this.taskJumpDown(parent,`span.tt-${target}[contenteditable=true]`);
        }
    }

    toggleOption(optionName: string){
        this.options[optionName] = !this.options[optionName];
        if(typeof(window.localStorage) !== "undefined") {
            localStorage.setItem("Options", JSON.stringify(this.options));
        }
    }
    
    saveOption(optionName: string,value: string){
        this.options[optionName] = value;
        //this.sync.setApiRoot(value);
        if (typeof(window.localStorage) !== "undefined") {
            localStorage.setItem("Options", JSON.stringify(this.options));
        }
    }

    toggleTimeMode(){
        this.timerModeRemaining = !this.timerModeRemaining;
    }

    tasksNotInSync(){
        if (this.services.sync.queue.filter((q: any) => q.status !== 'processed').length === 0){
            this.tasks.filter((t: any) => t.not_sync === true).forEach((t: any) => t.not_sync = undefined);
        } else {
            this.services.sync.queue.filter((q: any) => q.status !== 'processed').forEach((q: any) => {
                let task = this.tasks.find((t: Task) => t.tsk_id === q.model.tsk_id);
                task.not_sync = true;
            });
        }
    }

    createGroupedClosedTasks(tasks: Array<any>){
        let res: Array<any> = [];
        let lastHeader: Date = this.services.dateUtils.newDateUpToSeconds();

        tasks.forEach((t) => {
            if (this.services.tasksCore.dateOnly(new Date(t.tsk_date_done)).getTime() !== lastHeader.getTime()){
                lastHeader = this.services.tasksCore.dateOnly(new Date(t.tsk_date_done));
                res.push({
                    'header': lastHeader
                    , 'totalTimeSpent': 0
                    , 'tasks': []
                });
            }
            res[res.length-1].tasks.push(t);
            res[res.length-1].totalTimeSpent += t.tsk_total_time_spent;
        });

        // order groups by date desc
        res = res.sort((a: any, b: any) :number => {
            return a.header > b.header ? -1 : 1;
        });

        console.log('closed tasks',res);

        return res;
    }

    dayHasActivity(day: Date): boolean{
        let nextDay = this.services.dateUtils.addDays(day,1);
        if (day.getTime() === this.services.dateUtils.dateOnly(new Date()).getTime()){
            return true;
        } else {
            return this.tasks.filter((t: Task) => new Date(t.tsk_date_done).getTime() >= day.getTime() && new Date(t.tsk_date_done).getTime() <= nextDay.getTime()).length > 0;
        }
    }

    calculateIndicators(){
        let today = this.services.dateUtils.newDateUpToSeconds();
        let today0 = new Date(today.getFullYear(),today.getMonth(),today.getDate());
        let days: Array<Date> = [];
        let dayLabels: Array<String> = [];
        let nextDay: Date;
        for(let i = 0 ; i < 7 ; i++){
            nextDay = this.services.dateUtils.addDays(today0,-1*i);
            if (this.dayHasActivity(nextDay)){
                days.push(nextDay);
                dayLabels.push(i===0 ? 'Today' : (i===1 ? 'Yesterday' : i + ' days ago'));
            }
        }
        days.reverse();
        dayLabels.reverse();
        let values = [];

        let yesterdayValue: number = 0, todayValue: number = 0;
        this.state.indicators = [];
        this.state.indicatorLabels = dayLabels;
        this.services.taskIndicator.tasks = this.tasks;

        let addIndicator = (name: string, values: Array<number>,formatMethod?: (v: number) => String,completedCriteria?: (prev: number,current: number) => any): void => {
            let formattedValues: Array<String> = [];
            if (formatMethod){
                formattedValues = values.map((v: number) => formatMethod(v));
            } else {
                formattedValues = values.map((v: number) => v + '');
            }
            let completed = {
                isCompleted: values[values.length-2] <= values[values.length-1]
                , percentageCompleted: values[values.length-2] !== 0 ? Math.round(values[values.length-1] / values[values.length-2] * 100) / 100 : 0
            };

            if (completedCriteria){
                completed = completedCriteria(values[values.length-2],values[values.length-1]);
            }

            this.state.indicators.push({
                name
                , values: formattedValues
                , isCompleted: completed.isCompleted
                , percentageCompleted: completed.percentageCompleted
            });
        }

        let calculateForAllDays = (days: Array<any>,method: (d1: Date, d2: Date) => number): Array<number> => {
            let calculatedValues: Array<number> = [];
            let context = this.services.taskIndicator;

            days.forEach((d,index,array) => {
                calculatedValues.push(method.call(context,d,this.services.dateUtils.addDays(d,1)));
            });

            return calculatedValues;
        };
        
        // added ETA
        addIndicator('Added ETA',calculateForAllDays(days,this.services.taskIndicator.addedETA),(v: number) => this.formatTime(v * 60),(prev: number,curr: number) => ({ isCompleted: prev >= curr, percentageCompleted: prev !== 0 ? Math.round(curr * 100/prev) / 100 : 0 }));
        
        // added count
        addIndicator('Added Count',calculateForAllDays(days,this.services.taskIndicator.addedTaskCount),null,(prev: number,curr: number) => ({ isCompleted: prev >= curr, percentageCompleted: prev !== 0 ? Math.round(curr * 100/prev) / 100 : 0 }));

        // closed ETA
        addIndicator('Closed ETA',calculateForAllDays(days,this.services.taskIndicator.closedETA),(v: number) => this.formatTime(v * 60));

        // spent
        addIndicator('Closed Spent',calculateForAllDays(days,(d1: Date, d2: Date): number => this.services.taskIndicator.calculateTotalTimeSpent(d1,d2).totalTimeSpentTodayOnClosedTasks),(v: number) => this.formatTime(v));

        // closed count
        addIndicator('Closed Count',calculateForAllDays(days,this.services.taskIndicator.closedTaskCount));

        // productivity ratio
        addIndicator('Productivity Ratio',calculateForAllDays(days,this.services.taskIndicator.calculateProductivityRatio));

        // time management ratio
        addIndicator('Time Management Ratio',calculateForAllDays(days,this.services.taskIndicator.calculateTimeManagementRatio));
        
        // total task count overall
        addIndicator('Overall Task Count EOD',calculateForAllDays(days,this.services.taskIndicator.totalTaskCountUntil),null,(prev: number,curr: number) => ({ isCompleted: prev >= curr, percentageCompleted: prev !== 0 ? Math.round(curr * 100/prev) / 100 : 0 }));

        // karma

    }

    asNextToDo(t: any, add: boolean){
        let p = this.nextTasks[0].tasks;
        let index = p.findIndex((e: any) => e.tsk_id === t.tsk_id);
        if (add){
            if (index === -1){
                p.push(t);
                this.nextTasks[0].estimatedDuration += t.tsk_estimated_duration;
            }
        } else {
            if (index !== -1){
                p.splice(index,1);
                this.nextTasks[0].estimatedDuration -= t.tsk_estimated_duration;
            }
        }
        localStorage.setItem("NextTasks", JSON.stringify(p.map((e: any) => e.tsk_id)));
    }

    setTaskNotes(task: any, event: KeyboardEvent){
        let newNotes = event.target['textContent'];

        if (task.tsk_notes !== newNotes){
            this.updateTask(task.tsk_id,{
                tsk_notes: newNotes
            });
        }
    }

    setFocus(task: Task, event: KeyboardEvent){
        console.log('task on focus by user',task,event.target);
        this.focusedTask = {
            task
            , element: event.target['parentNode']
        };
    }

    sendFEToBE(taskDiff: Array<any>){
        let upd = {};
        taskDiff.forEach((td: any) => {
            upd[td.name] = td.client;
        });
        this.updateTask(taskDiff[0].id, upd);
        this.services.tasksCore.computeComparisonData().then((data: any) => this.comparisonData = data);
    }

    subscribe(event: string, callback: Function) {
        this.events.push({ event, callback });
    }

    triggerEvent(event: string, params: any) {
        const handlers = this.events.filter((e: any) => e.event === event).map(e => e.callback);
        handlers.forEach((handler: Function) => {
            handler(params);
        });
    }
}
