import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {
    get(key: string){
        return localStorage.getItem(key);
    }

    set(key: string, value: string): void{
        localStorage.setItem(key,value);
    }

    getObject(key: string): any{
        return JSON.parse(localStorage.getItem(key));
    }

    setObject(key: string, value: any): void{
        localStorage.setItem(key,JSON.stringify(value));
    }
}