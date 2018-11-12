import { Injectable } from '@angular/core';
import { SyncAPI } from '../common/sync.api';

@Injectable()
export class TypeGeneratorService {
    private data: any = {};
    private sync: SyncAPI = null;
    private config = {
        storageKey: 'type-generator'
        , defaultUser: 'anon'
        , api: {
            config: '/api/type-generator/config',
            type: '/api/type-generator/type'
        }
    };

    constructor(sync: SyncAPI){
        this.sync = sync;
    }

    getAll(): Promise<any>{
        return this.sync.get(`${this.config.api.config}`).then(data => {
            this.data = data;
            return this.data;
        });
    }
}