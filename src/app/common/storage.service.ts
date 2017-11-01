import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {
    get(key: string){
        return localStorage.getItem(key);
    }

    set(key: string, value: string){
        localStorage.setItem(key,value);
    }
}