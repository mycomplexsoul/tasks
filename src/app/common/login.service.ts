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
    private identity: any = {};

    constructor(storage: StorageService){
        this.storage = storage;
    }

    setIdentity(identity: any) {
        this.identity = identity;
    }

    getUsername() {
        return this.identity.user;
    }
}