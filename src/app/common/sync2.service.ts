import { StorageService } from '../common/storage.service';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class Sync2 {
    private storage: StorageService = null;
    private data: Array<any> = [];
    private syncData: Array<any> = [];
    private config: SyncConfig;

    public queue: Array<SyncQueue> = [];
    private apiRoot: string = 'http://10.230.9.78:8081';
    private headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Headers': 'Content-Type'});
    private options = new RequestOptions({ headers: this.headers });
    private version = 'v2.0';
    private logPrefix = `Sync API ${this.version} -`;
    private currentOperation: any = null;
    private lastOnlineStamp: Date = null;
    

    constructor(storage: StorageService, config: SyncConfig){
        this.storage = storage;
        this.config = config;
    }

    /**
     * Guidance for this method objective:
     * - Read sync data from storage
     * - Read from storage to memory
     * - If server is available
     *   - Push sync data to server, server decides changes to keep, returns sync results (merge if needed)
     *   - Fetch from server to memory, then save to local
     * - Return data
     */
    fetch(){
        let syncFromStorage = this.storage.get(`sync-${this.config.storageKey}`);
        if (syncFromStorage){
            this.syncData = JSON.parse(syncFromStorage);
        }

        let fromStorage = this.storage.get(this.config.storageKey);
        if (fromStorage){
            this.data = JSON.parse(fromStorage);
        }
        
        this.push();
        let fromServer = this.fetchFromServer(this.config.fetchUrl);
        this.data = fromServer;
    }
    
    /**
     * 
     * When new data comes (new, update, delete):
     * - Create sync data in memory and push it to local (to be available if push to server fails)
     * - Update local with changes
     * - If server is available
     *   - Push sync data to server, server decides changes to keep, returns sync results (straightforward in this case)
     */
    push(){
        if (this.syncData.length && this.serverIsAvailable()){
            // TODO: sync queue
            //...
            this.syncData = [];
        }
    }

    serverIsAvailable(): boolean {
        // TODO: fetch server status
        return true;
    }

    fetchFromServer(fetchUrl: string): Array<any> {
        // TODO: ajax request to fetchUrl and return data as array
        return [];
    }
}

// TODO: Move this to a separate file
interface SyncConfig {
    storageKey: string;
    fetchUrl: string;
}

interface SyncQueue {
    method: string
    , type: string
    , data: any
    , callback: Function
    , status: string
}