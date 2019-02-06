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
    private identity: {
        auth_token: string,
        user: string,
        email: string
    } = {
        auth_token: null,
        user: null,
        email: null
    };

    constructor(storage: StorageService){
        this.storage = storage;
    }

    setIdentity(identity: any) {
        this.identity = identity; // { auth_token, user, email }
    }

    getUsername() {
        return this.identity.user;
    }

    isLoggedIn() {
        return !!this.identity.user;
    }
}