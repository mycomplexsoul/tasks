import { StorageService } from '../common/storage.service';
import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {
    private storage: StorageService = null;
    private config = {
        storageKey: 'login'
        , defaultUser: 'anon'
        , api: {
            list: '/api/login'
        }
    }
    private apiRoot: string = '';

    constructor(storage: StorageService){
        this.storage = storage;
        // get api root
        this.apiRoot = storage.getObject('Options')['optServerAddress'] || '';
    }
}