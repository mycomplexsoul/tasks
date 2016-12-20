import { Component, OnInit, Renderer } from '@angular/core';
import { TasksCore } from '../app/tasks.core';

@Component({
    selector: 'tasks',
    template: `
        <form #tasksForm="ngForm">
            <input type="text" name="tsk_name"
                placeholder="Write a task..."
                class="task"
                autocomplete="off"
                autofocus="true"
                *ngIf="!showBatchAdd"
                (keyup)="inputKeyUpHandler($event)"
                [(ngModel)]="tsk_name" />
            <textarea name="tsk_multiple_name"
                placeholder="Write a task per line..."
                class="task-multiple"
                (keyup)="inputKeyUpHandler($event)"
                [(ngModel)]="tsk_multiple_name"
                *ngIf="showBatchAdd"></textarea>
            <button type="submit" (click)="addTask(tasksForm)" id="btnAddTask">Add task</button>
            <button (click)="toggleViewFinishedToday()">{{viewFinishedToday ? 'hide': 'show'}} finished today</button>
            <button (click)="toggleViewBacklog()">{{viewBacklog ? 'hide': 'show'}} backlog</button>
            <button (click)="toggleViewAll()">{{viewAll ? 'hide': 'show'}} all</button>
            <button (click)="toggleViewOptions()">{{viewOptions ? 'hide': 'show'}} options</button>
        </form>
        <div *ngIf="viewOptions">
            <button (click)="deleteTasks()">delete all tasks</button>
            <hr/>
        </div>
        <div id="backlogTaskList" *ngIf="viewBacklog">
            <strong>Backlog</strong>
            <div *ngFor="let item of state.backlogTasks">
                <div>
                    <strong>{{item.header}}</strong>
                    ({{formatTime(item.estimatedDuration * 60)}})
                </div>
                <div *ngFor="let t of item.tasks" data-id="{{t.tsk_id}}">
                    - <span *ngIf="t.tsk_total_time_spent !== 0">[{{t.tsk_time_history.length}}/{{formatTime(t.tsk_total_time_spent)}}]</span>
                    <span contenteditable="true" (keyup)="taskEdit(t,$event)"
                        class="editable">{{t.tsk_name}}</span>
                    <span contenteditable="true" (blur)="taskEstimatedDurationEdit(t,$event)"
                        [ngClass]="{'task-no-eta': (t.tsk_estimated_duration === 0)}"
                        class="task-eta"
                        >{{formatTime(t.tsk_estimated_duration * 60,"#h#m")}}</span>
                    <span *ngIf="t.tsk_schedule_date_start">(start at {{t.tsk_schedule_date_start | date: 'yyyy-MM-dd HH:mm'}})</span>
                    <span [ngClass]="taskAgeClass(t)">{{taskAge(t)}}</span>
                    <button (click)="setOpen(t)">Move to open</button>
                </div>
            </div>
            <hr/>
        </div>
        <div id="openTaskList">
            <div *ngIf="!state.openTasks.length"><strong>No tasks open! Congratulations! Consider reviewing the backlog or add new tasks to do.</strong><hr/></div>
            <div *ngFor="let item of state.openTasks">
                <div>
                    <strong>{{item.header}}</strong>
                    ({{formatTime(item.estimatedDuration * 60)}})
                </div>
                <div *ngFor="let t of item.tasks" data-id="{{t.tsk_id}}">
                    <input type="checkbox" id="{{t.tsk_id}}"
                        (click)="taskCheckboxHandler(t,$event)" />
                    <span *ngIf="t.tsk_total_time_spent !== 0">[{{t.tsk_time_history.length}}/{{formatTime(t.tsk_total_time_spent)}}]</span>
                    <span>{{(timers[t.tsk_id]) ? '[' + timers[t.tsk_id].timerString + ']' : ''}}</span>
                    <span contenteditable="true" (keyup)="taskEdit(t,$event)"
                        [ngClass]="{'task-done': (t.tsk_ctg_status === this.taskStatus.CLOSED), 'task-in-process': (t.tsk_ctg_in_process === 2)}"
                        (blur)="commandOnTask(t,$event)"
                        class="editable">{{t.tsk_name}}</span>
                    <span contenteditable="true" (blur)="taskEstimatedDurationEdit(t,$event)"
                        [ngClass]="{'task-no-eta': (t.tsk_estimated_duration === 0)}"
                        class="task-eta"
                        >{{formatTime(t.tsk_estimated_duration * 60,"#h#m")}}</span>
                    <span *ngIf="t.tsk_schedule_date_start">(start at {{t.tsk_schedule_date_start | date: 'yyyy-MM-dd HH:mm'}})</span>
                    <span [ngClass]="taskAgeClass(t)">{{taskAge(t)}}</span>
                </div>
            </div>
            <div id="Info">
                Total Tasks: {{tasks.length}} | Backlog: {{state.backlogTasksCount}} | Closed Today: {{state.closedTodayTasks.length}} | Open: {{state.openTasksCount}}
                <span *ngIf="state.postponedTasksCount"> | Postponed: {{state.postponedTasksCount}}</span>
                <br/>Time Estimated Today: {{formatTime(state.totalTimeEstimated * 60)}}
                <span *ngIf="state.totalTimeEstimatedClosedToday"> | Closed Today ETA: {{formatTime(state.totalTimeEstimatedClosedToday * 60)}} | Open ETA: {{formatTime(state.totalTimeEstimatedOpen * 60)}}</span>
                <br/>Time Spent Today: {{formatTime(state.totalTimeSpentToday)}}
                <span *ngIf="state.totalTimeSpentTodayOnOpenTasks"> | Closed: {{formatTime(state.totalTimeSpentTodayOnClosedTasks)}} | Open {{formatTime(state.totalTimeSpentTodayOnOpenTasks)}}</span>
            </div>
            <hr/>
        </div>
        <div id="taskDetails" *ngIf="state.selected">
            <button (click)="state.selected=null">hide</button>
            <br/>
            <strong>Task Details</strong>
            <div>Id: {{state.selected.tsk_id}}</div>
            <div>Container: {{state.selected.tsk_id_container}}</div>
            <div>Record: {{state.selected.tsk_id_record}}</div>
            <div>Name: {{state.selected.tsk_name}}</div>
            <div>Notes: {{state.selected.tsk_notes}}</div>
            <div>Parent: {{state.selected.tsk_parent}}</div>
            <div>Order: {{state.selected.tsk_order}}</div>
            <div>Date Done: {{state.selected.tsk_date_done}}</div>
            <div>Total Time Spent: {{formatTime(state.selected.tsk_total_time_spent)}}</div>
            <div>
                <fieldset *ngIf="state.selected.tsk_time_history.length">
                    <legend>Time History</legend>
                    <table>
                        <tr>
                            <td>Id</td>
                            <td>Sequential</td>
                            <td>Name</td>
                            <td>Date Start</td>
                            <td>Date End</td>
                            <td>Time Spent</td>
                            <td>User</td>
                            <td>Date Add</td>
                            <td>Date Mod</td>
                            <td>Actions</td>
                        </tr>
                        <tr *ngFor="let h of state.selected.tsk_time_history">
                            <td>{{h.tsh_id}}</td>
                            <td>{{h.tsh_num_secuential}}</td>
                            <td>{{h.tsh_name}}</td>
                            <td><span contenteditable="true" (keyup)="editTimeTracking(h,1,$event)">{{h.tsh_date_start | date: format}}</span></td>
                            <td><span contenteditable="true" (keyup)="editTimeTracking(h,2,$event)">{{h.tsh_date_end | date: format}}</span></td>
                            <td>{{formatTime(h.tsh_time_spent)}}</td>
                            <td>{{h.tsh_id_user}}</td>
                            <td>{{h.tsh_date_add | date: format}}</td>
                            <td>{{h.tsh_date_mod | date: format}}</td>
                            <td><button *ngIf="h.tsh_date_end" (click)="deleteTimeTracking(state.selected,h)">delete</button></td>
                        </tr>
                    </table>
                </fieldset>
            </div>
            <div>In Progress: {{state.selected.tsk_ctg_in_process}}</div>
            <div>Qualifiers: {{state.selected.tsk_qualifiers}}</div>
            <div>Tags: {{state.selected.tsk_tags}}</div>
            <div>Estimated Duration: {{state.selected.tsk_estimated_duration}}</div>
            <div>Schedule Date Start: {{state.selected.tsk_schedule_date_start}}</div>
            <div>Schedule Date End: {{state.selected.tsk_schedule_date_end}}</div>
            <div>Date View Until: {{state.selected.tsk_date_view_until}}</div>
            <div>User Added: {{state.selected.tsk_id_user_added}}</div>
            <div>User Asigned: {{state.selected.tsk_id_user_asigned}}</div>
            <div>Date Add: {{state.selected.tsk_date_add | date: format}}</div>
            <div>Date Last Mod: {{state.selected.tsk_date_mod | date: format}}</div>
            <div>Status: {{state.selected.tsk_ctg_status}}</div>
            <hr/>
        </div>
        <div *ngIf="viewFinishedToday">
            <strong>Finished Today</strong>
            <div *ngFor="let item of state.closedTodayTasks">
                <input type="checkbox" id="{{item.tsk_id}}" checked
                    (click)="taskCheckboxHandler(item,$event)" />
                <span>[{{item.tsk_time_history.length}}/{{formatTime(item.tsk_total_time_spent)}}]</span>
                <span [ngClass]="{'task-done': (item.tsk_ctg_status === this.taskStatus.CLOSED)}"
                    >{{item.tsk_name}}</span>
                <button (click)="setSelected(item)">details</button>
            </div>
            <hr/>
        </div>
        <div id="closedTaskList" *ngIf="viewAll">
            <strong>Closed Tasks</strong>
            <div *ngFor="let item of state.closedTasks">
                - <span>[{{item.tsk_time_history.length}}/{{formatTime(item.tsk_total_time_spent)}}]</span>
                <span>{{item.tsk_name}}</span>
                <span>(done at {{item.tsk_date_done | date: 'yyyy-MM-dd HH:mm:ss'}})</span>
                <button (click)="setSelected(item)">details</button>
            </div>
            <hr/>
        </div>
        `,
    providers: [TasksCore]
})
export class TasksComponent implements OnInit {
    public item: any;
    public tasks: any[];
    public services: any = {};
    public state: any = {};
    public format: string = 'yyyy-MM-dd HH:mm:ss';
    public groupHeader: string;
    public timers: any = {};
    public viewAll: boolean = false;
    public viewFinishedToday: boolean = false;
    public viewBacklog: boolean = false;
    public viewOptions: boolean = false;
    public taskStatus = {
        'BACKLOG': 1,
        'OPEN': 2,
        'CLOSED': 3
    };
    public showBatchAdd: boolean = false;

    constructor(tasksCore: TasksCore, private rendered: Renderer){
        this.services.tasksCore = tasksCore;
        this.updateState();
    }

    ngOnInit(){
        
    }

    addTask(form: any){
        if (!this.showBatchAdd){
            if (form.value.tsk_name){
                this.services.tasksCore.addTask({
                    'tsk_date_add': new Date(),
                    'tsk_name': form.value.tsk_name
                });
                this.tasks = this.services.tasksCore.tasks();
                this.updateState();
                form.controls.tsk_name.reset();
            }
        } else {
            // Batch add
            if (form.value.tsk_multiple_name){
                form.value.tsk_multiple_name.split('\n').forEach((text: string) => {
                    this.services.tasksCore.addTask({
                        'tsk_date_add': new Date(),
                        'tsk_name': text
                    });
                });
                this.tasks = this.services.tasksCore.tasks();
                this.updateState();
                form.controls.tsk_multiple_name.reset();
                this.showBatchAdd = false;
            }
        }
    }

    updateState(){
        let today = new Date();
        let today0 = new Date(today.getFullYear(),today.getMonth(),today.getDate());
        let sortByClosedDate = (a: any, b: any) => {
            let res = new Date(a.tsk_date_done) > new Date(b.tsk_date_done);
            return res ? -1 : 1;
        };
        this.tasks = this.services.tasksCore.tasks();
        this.state.backlogTasks = this.createGroupedTasks(this.tasks.filter((t) => t.tsk_ctg_status == this.taskStatus.BACKLOG).sort(this.sortByGroup));
        this.state.openTasks = this.createGroupedTasks(this.tasks.filter((t) => t.tsk_ctg_status == this.taskStatus.OPEN && (t.tsk_date_view_until ? new Date(t.tsk_date_view_until) < today : true)).sort(this.sortByGroup));
        this.state.closedTasks = this.tasks.filter((t) => t.tsk_ctg_status == this.taskStatus.CLOSED).sort(sortByClosedDate);
        this.state.closedTodayTasks = this.tasks.filter((t) => t.tsk_ctg_status == this.taskStatus.CLOSED && new Date(t.tsk_date_done) >= today0 && new Date(t.tsk_date_done) <= today).sort(sortByClosedDate);

        // Estimated Total
        this.state.totalTimeEstimated = 0;
        this.state.totalTimeEstimatedOpen = 0;
        this.state.totalTimeEstimatedClosedToday = 0;
        this.tasks.filter((t) => t.tsk_ctg_status == this.taskStatus.OPEN).forEach((t: any) => {
            this.state.totalTimeEstimatedOpen += parseInt(t.tsk_estimated_duration);
        });
        this.tasks.filter((t) => t.tsk_ctg_status == this.taskStatus.CLOSED && new Date(t.tsk_date_done) >= today0 && new Date(t.tsk_date_done) <= today).forEach((t: any) => {
            this.state.totalTimeEstimatedClosedToday += parseInt(t.tsk_estimated_duration);
        });
        this.state.totalTimeEstimated = this.state.totalTimeEstimatedOpen + this.state.totalTimeEstimatedClosedToday;

        // Info
        // Total time spent today
        this.calculateTotalTimeSpentToday();
        this.state.openTasksCount = this.tasks.filter((t) => t.tsk_ctg_status == this.taskStatus.OPEN).length;
        this.state.backlogTasksCount = this.tasks.filter((t) => t.tsk_ctg_status == this.taskStatus.BACKLOG).length;

        // Postponed tasks count
        this.state.postponedTasksCount = this.tasks.filter((t) => t.tsk_ctg_status == this.taskStatus.OPEN && (t.tsk_date_view_until ? new Date(t.tsk_date_view_until) > today : false)).length;

        setTimeout(() => this.showTimersOnLoad(), 100);
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

        return res;
    }

    taskEdit(t: any, event: KeyboardEvent){
        let parent = event.target["parentNode"];
        if (event.altKey && event.keyCode==38){ // detect move up
            this.taskMoveUp(parent);
        }
        if (event.altKey && event.keyCode==40){ // detect move down
            this.taskMoveDown(parent);
        }
        if (!event.altKey && event.keyCode==38){ // detect jump up
            this.taskJumpUp(parent);
        }
        if (!event.altKey && event.keyCode==40){ // detect jump down
            this.taskJumpDown(parent);
        }
        if (event.keyCode==113){ // detect "F2" = start/stop time tracking
            this.taskToggleTimeTracking(t,parent);
        }
        if (event.altKey && event.keyCode==83){ // detect move down
            this.setSelected(t);
        }
        if (t.tsk_name !== event.target['textContent']){
            this.updateTask(t.tsk_id,{
                tsk_name: event.target['textContent']
            });
        }
    }

    taskCheckboxHandler(t: any, event: Event){
        if (this.timers[t.tsk_id]) { // task is in running state
            // stop time tracking
            this.taskToggleTimeTracking(t,this.getTaskDOMElement(t.tsk_id));
        }
        this.updateTask(t.tsk_id,{
            tsk_ctg_status: event.target['checked'] ? this.taskStatus.CLOSED : this.taskStatus.OPEN
            , tsk_date_done: new Date()
        });
        setTimeout(() => {
            this.updateState();
        }, 3000);
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

    taskJumpUp(current: any){
        if (current.previousElementSibling.querySelector("span[contenteditable=true]")){
            current.previousElementSibling.querySelector("span[contenteditable=true]").focus();
        } else {
            if (current.previousElementSibling.parentNode.previousElementSibling && current.previousElementSibling.parentNode.previousElementSibling.lastElementChild.querySelector("span[contenteditable=true]")){
                current.previousElementSibling.parentNode.previousElementSibling.lastElementChild.querySelector("span[contenteditable=true]").focus();
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

    taskJumpDown(current: any){
        if (current.nextElementSibling && current.nextElementSibling.querySelector("span[contenteditable=true]")){
            current.nextElementSibling.querySelector("span[contenteditable=true]").focus();
        } else {
            if (current.parentNode.nextElementSibling && current.parentNode.nextElementSibling.firstElementChild.nextElementSibling.querySelector("span[contenteditable=true]")){
                current.parentNode.nextElementSibling.firstElementChild.nextElementSibling.querySelector("span[contenteditable=true]").focus();
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

        // if task was running previously, get current running time
        if ( task.tsk_time_history.length > 0 ){
            let h = task.tsk_time_history[task.tsk_time_history.length-1];
            if (h.tsh_time_spent === 0){
                h.tsh_date_start = new Date(h.tsh_date_start);
                timer = this.elapsedTime(h.tsh_date_start,new Date());
            }
        }

        // dom.querySelector("span[contenteditable=true]").classList.add("task-in-process");

        let watch = setInterval(() => {
            this.timers[task.tsk_id].timerString = this.formatTime(++timer);
        }, 1000);

        this.timers[task.tsk_id] = {};
        this.timers[task.tsk_id].timerString = this.formatTime(timer);
        this.timers[task.tsk_id].watch = watch;
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
        return Math.abs(date1.getTime() - date2.getTime()) / 1000;
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
            setTimeout(() => {
                if (this.showBatchAdd){
                    this.focusElement("textarea[name=tsk_multiple_name]");
                } else {
                    this.focusElement("input[name=tsk_name]");
                }
            }, 100);
        }
    }

    toggleViewFinishedToday(){
        this.viewFinishedToday = !this.viewFinishedToday;
    }
    
    toggleViewBacklog(){
        this.viewBacklog = !this.viewBacklog;
    }

    toggleViewAll(){
        this.viewAll = !this.viewAll;
    }

    toggleViewOptions(){
        this.viewOptions = !this.viewOptions;
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
        let newDuration = this.services.tasksCore.parseTime(event.target['textContent']);
        if (newDuration !== t.tsk_estimated_duration){
            this.updateTask(t.tsk_id,{
                tsk_estimated_duration: newDuration
            });
        }
    }

    commandOnTask(t: any, event: KeyboardEvent){
        let command = event.target['textContent'];
        let originalTask = '';
        if (command.indexOf('--') !== -1){
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
    }
}
