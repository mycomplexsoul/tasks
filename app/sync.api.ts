import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class SyncAPI {
    public queue: Array<SyncQueue> = [];
    private apiRoot: string = 'http://127.0.0.1:8081';
    private headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Headers': 'Content-Type'});
    private options = new RequestOptions({ headers: this.headers });
    private version = 'v1.2';
    private logPrefix = `Sync API ${this.version} -`;
    
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
                    this.processQueue();
                }
            });
        }
    }

    request(method: string, url: string, data: any, matchMethod: (val: any) => boolean, objNameMethod: (e: any) => string, callback: Function){
        this.log(`Handling new request`);
        if (matchMethod){
            let foundIndex = this.queue.findIndex((val: any) => matchMethod(val.data) && (val.status === 'queue' || val.status === 'error'));

            if (foundIndex !== -1) { // if record has a match, replace data only
                this.log(`Recieved a request, found record with id ${objNameMethod(data)} and updated it`);
                this.queue[foundIndex].data = data;
            } else { // if not found, add it
                this.queue.push({
                    method, url, data, callback
                    , status: 'queue'
                });
            }
        } else {
            // by request
            this.queue.push({
                method, url, data, callback
                , status: 'queue'
            });
        }

        this.log(`Recieved a request to ${url} and added it to the queue`);

        this.isOnline().then((online) => {
            if (online){
                this.processQueue();
            }
        });
    }

    isOnline(){
        let nav = navigator.onLine;
        this.log(`Your navigator reports online status as: ${nav}`)
        return this.isServerReachable().then((data) => { // some request to BE
            this.log(`Tried to contact the server, answer was`,data);
            return nav && data;
        });
    }

    isServerReachable(){
        return this.http.get(`${this.apiRoot}/online`).toPromise()
        .then((data) => {
            return true;
        }).catch((err) => {
            return false;
        });
    }

    processQueue(){
        this.queue.filter((q: any) => { // retry the ones with error
            return q.status === 'error';
        }).forEach((q: any) => {
            this.log('Processing request that before had an error', q);
            if (q.method === 'POST'){
                this.http.post(q.url,q.data,this.options).toPromise()
                .then((data) => {
                    this.log('Processed request and response',data.json());
                    q.callback(data.json());
                    q.status = 'processed';
                    this.queueStatus();
                    this.toStorage();
                }).catch((err) => {
                    this.log('Error for request (again)', [q, err]);
                    q.status = 'error';
                    this.queueStatus();
                    this.toStorage();
                });
            }
        });
        
        this.queue.filter((q: any) => { // process queue
            return q.status === 'queue';
        }).forEach((q: any) => {
            this.log('Processing request', q);
            if (q.method === 'POST'){
                this.http.post(q.url,q.data,this.options).toPromise()
                .then((data) => {
                    this.log('Processed request and response', data.json());
                    q.callback(data.json());
                    q.status = 'processed';
                    this.queueStatus();
                    this.toStorage();
                }).catch((err) => {
                    this.log('Error for request', [q, err]);
                    q.status = 'error';
                    this.queueStatus();
                    this.toStorage();
                });
            }

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
}

interface SyncQueue {
    method: string
    , url: string
    , data: any
    , callback: Function
    , status: string
}