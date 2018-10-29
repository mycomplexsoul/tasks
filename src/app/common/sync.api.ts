import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class SyncAPI {
    public queue: Array<SyncQueue> = [];
    //private apiRoot: string = 'http://10.230.9.78:8081';
    private headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Headers': 'Content-Type'});
    private options = new RequestOptions({ headers: this.headers });
    private version = 'v1.3';
    private logPrefix = `Sync API ${this.version} -`;
    private currentOperation: any = null;
    private lastOnlineStamp: Date = null;
    
    constructor(private http: Http){
        this.http = http;
        this.log('Starting, recovering pending queue from storage');
        this.queue = this.fromStorage() || [];
        this.queueStatus();
        
        if (this.queue.length > 0){
            this.log(`Found in storage ${this.queue.length} requests, trying to process queue if possible`);
            this.log('Current queue',this.queue);
            this.isOnline().then((online) => {
                if (online){
                    //this.processQueue();
                    this.syncQueue();
                }
            });
        }
    }

    /**
     * Adds a single request to the queue and process it when server is reachable.
     */
    request(action: string, model: any, pk: any, entity: string, callback: Function, recordName: (e: any) => string, matchMethod: (val: any) => boolean){
        this.log(`Handling new request`);
        const queueItem: SyncQueue = {
            action,
            model,
            pk,
            entity,
            callback,
            recordName,
            matchMethod,
            status: 'queue' // this is ignored
        };
        this.handleRequest([queueItem]);
    }

    /**
     * Adds multiple requests to the queue and process them when server is reachable.
     */
    multipleRequest(list: SyncQueue[]){
        this.log(`Handling new multiple requests`);
        this.handleRequest(list);
    }

    /**
     * Internal method that adds a request list to the queue and process it when server is reachable.
     * For API purposes use either `request` or `multipleRequest` instead of this one.
     */
    private handleRequest(list: SyncQueue[]) {
        if (this.currentOperation) {
            this.log('Cancelling sync operation with timer id',this.currentOperation);
            clearTimeout(this.currentOperation);
        }
        list.forEach((e: SyncQueue) => {
            this.addToQueue(e);
        });

        this.isOnline().then((online) => {
            if (online){
                this.currentOperation = setTimeout(() => {
                    //this.processQueue();
                    this.syncQueue();
                    this.currentOperation = null;
                }, 5000);
                this.log('Scheduled sync with timer id',this.currentOperation);
            }
        });
    }

    /**
     * Adds the request to the queue.
     * This is an internal method.
     */
    private addToQueue(item: SyncQueue) {
        const { matchMethod, recordName, ...queueItem } = item;
        let foundIndex: number = -1;

        if (matchMethod){
            foundIndex = this.queue.findIndex((val: SyncQueue) => matchMethod(val.model) && (val.status === 'queue' || val.status === 'error'));
        }

        if (foundIndex !== -1) { // if record has a match, replace model only
            this.log(`Recieved a request, found record with id <<${recordName(queueItem.model)}>> and updated it`);
            this.queue[foundIndex].model = queueItem.model;
            return;
        }
        // if not found or no match method, add it
        this.queue.push({
            ...queueItem
            , status: 'queue'
        });

        this.log(`Recieved a request to ${queueItem.entity} and added it to the queue`);
    }

    isOnline(){
        if (!this.lastOnlineStamp || (new Date()).getTime() - this.lastOnlineStamp.getTime() > 30000 ) {
            let nav = navigator.onLine;
            this.log(`Your navigator reports online status as: ${nav}`)
            return this.isServerReachable().then((data) => { // some request to BE
                this.log(`Tried to contact the server, answer was`,data);
                this.lastOnlineStamp = new Date();
                return nav && data;
            });
        } else {
            return Promise.resolve(true);
        }
    }

    isServerReachable(){
        return this.http.get('/online').toPromise()
        .then((data) => {
            return true;
        }).catch((err) => {
            return false;
        });
    }

    queueStatus(){
        console.log(`${this.logPrefix} Status is ${this.queue.length} elements in the queue, ${this.queue.filter(q => q.status === 'processed').length} processed, ${this.queue.filter(q => q.status === 'queue').length} not yet processed, ${this.queue.filter(q => q.status === 'error').length} with error`);
    }

    log(message: string,data?: any){
        if (!data){
            console.log(`${this.logPrefix} ${message}`);
        } else {
            console.log(`${this.logPrefix} ${message}`, data);
        }
    }

    toStorage(){
        if(typeof(window.localStorage) !== "undefined") {
            localStorage.setItem("Sync", JSON.stringify(this.queue.filter(q => q.status !== 'processed')));
            this.queue = this.queue.filter(q => q.status !== 'processed')
        }
    }

    fromStorage(){
        if(typeof(window.localStorage) !== "undefined") {
            let list: Array<SyncQueue> = JSON.parse(localStorage.getItem("Sync"));
            return list;
        }
        return [];
    }

    syncQueue(){
        let dataToSend = <any>[];
        
        dataToSend = this.queue.filter((q: any) => { // process queue
            return q.status !== 'processed';
        });

        const compareObjects = (o1: any, o2: any) => {
            const keys1 = Object.keys(o1);
            const keys2 = Object.keys(o2);

            // all keys from o1 should exist on o2 and their values must match
            const test1 = keys1.every(k1 => keys2.find((k2) => k2 === k1) && o1[k1] === o2[k1]);
            // same for o2
            const test2 = keys2.every(k2 => keys1.find((k1) => k1 === k2) && o2[k2] === o1[k2]);

            return test1 && test2;
        };

        this.http.post('/api/sync', { queue: dataToSend }, this.options).toPromise()
        .then((data) => {
            const response = data.json();
            this.log('Processed sync, response was', response);
            
            // get status from response
            response.result.forEach((r: any) => {
                let found = this.queue.find((q: SyncQueue) => compareObjects(q.pk, r.pk));
                if (found) {
                    found.status = r.operationOk ? 'processed' : 'error';
                    if (r.operationOk) {
                        found.callback(found.model, response);
                    }
                }
            });
            this.queueStatus();
            this.toStorage();
        }).catch((err) => {
            this.log('Error for request', err);
            //q.status = 'error';
            this.queueStatus();
            this.toStorage();
        });
    }

    /**
     * Makes a single request, no tracking for sync process
     * useful when you need only to make a request for batch
     */
    post(url: string, payload: any): Promise<any>{
        return this.http.post(url, payload, this.options)
            .toPromise().then((data) => data.json());
    }

    get(url: string): Promise<any>{
        return this.http.get(url, this.options)
            .toPromise().then((data) => data.json());
    }
}

interface SyncQueue {
    action: string
    , model: any
    , pk: any
    , entity: string
    , status: string
    , callback: Function
    , recordName?: Function
    , matchMethod?: Function
}