import { Injectable } from "@angular/core";
import { Http, Headers } from '@angular/http';

@Injectable()
export class SyncAPI {
    public queue: Array<SyncQueue> = [];
    private apiRoot: string = 'http://localhost:8081';
    private headers = new Headers({'Content-Type': 'application/json'});
    
    constructor(private http: Http){
        this.http = http;
    }

    request(method: string, url: string, data: any, callback: Function){
        this.queue.push({
            method, url, data, callback
            , status: 'queue'
        });

        console.log(`Sync API - Recieved a request to ${url} and added it to the queue`);
        console.log(`Sync API - Currently there are ${this.queue.length} elements in the queue`);
        console.log(`Sync API - Of which ${this.queue.filter(q => q.status === 'queue').length} elements are not yet processed`);

        this.isOnline().then((online) => {
            if (online){
                this.processQueue();
            }
        });
    }

    isOnline(){
        let nav = navigator.onLine;
        return this.isServerReachable().then((data) => { // some request to BE
            return nav && data;
        });
    }

    isServerReachable(){
        return this.http.get(`${this.apiRoot}/online`).toPromise()
        .then((data) => {
            console.log(data.json());
            return true;
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

    processQueue(){
        this.queue.filter((q: any) => { // retry the ones with error
            return q.status === 'error';
        }).forEach((q: any) => {
            console.log('Sync API - Processing request that before had an error', q);
            if (q.method === 'POST'){
                this.http.post(q.url,q.data,{headers: this.headers}).toPromise()
                .then((data) => {
                    console.log('Sync API - Processed request and response', q, data.json());
                    q.callback(data.json());
                    q.status = 'processed';
                    console.log(`Sync API - ${this.queue.length} elements in the queue, ${this.queue.filter(q => q.status === 'processed').length} processed, ${this.queue.filter(q => q.status === 'queue').length} not yet processed, ${this.queue.filter(q => q.status === 'error').length} with error`);
                }).catch((err) => {
                    console.log('Sync API - Error for request (again)', q, err);
                    q.status = 'error';
                });
            }
        });
        
        this.queue.filter((q: any) => { // process queue
            return q.status === 'queue';
        }).forEach((q: any) => {
            console.log('Sync API - Processing request', q);
            if (q.method === 'POST'){
                this.http.post(q.url,q.data,{headers: this.headers}).toPromise()
                .then((data) => {
                    console.log('Sync API - Processed request and response', q, data.json());
                    q.callback(data.json());
                    q.status = 'processed';
                    console.log(`Sync API - ${this.queue.length} elements in the queue, ${this.queue.filter(q => q.status === 'processed').length} processed, ${this.queue.filter(q => q.status === 'queue').length} not yet processed, ${this.queue.filter(q => q.status === 'error').length} with error`);
                }).catch((err) => {
                    console.log('Sync API - Error for request', q, err);
                    q.status = 'error';
                });
            }

        });

        console.log(`Sync API - Currently there are ${this.queue.length} elements in the queue`);
        console.log(`Sync API - Of which ${this.queue.filter(q => q.status === 'queue').length} elements are not yet processed`);
        console.log(`Sync API - And ${this.queue.filter(q => q.status === 'processed').length} elements are processed`);
        console.log(`Sync API - And ${this.queue.filter(q => q.status === 'error').length} elements returned an error`);
    }
}

interface SyncQueue {
    method: string
    , url: string
    , data: any
    , callback: Function
    , status: string
}