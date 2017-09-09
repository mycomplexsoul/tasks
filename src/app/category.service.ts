import { Category } from './category.type';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CategoryService {
    private data: Array<Category> = [];
    private storage: StorageService = null;
    private config = {
        storageKey: 'categories'
        , defaultUser: 'anon'
    }

    constructor(storage: StorageService){
        this.storage = storage;
    }

    initialData(){
        let list: Array<Category>;

        let newData = (mct_id: string, mct_name: string) => {
            return {mct_id, mct_name};
        };
        let data = [];
        data.push(newData('1','Cap'));
        data.push(newData('2','Cart'));
        
        list = data.map((d: any) => {
            d.mct_user = this.config.defaultUser;
            return new Category(d);
        });

        return list;
    }

    getAll(){
        let fromStorage = this.storage.get(this.config.storageKey);
        if (fromStorage){
            this.data = JSON.parse(fromStorage);
        } else {
            this.data = this.initialData();
        }
        return this.data;
    }

    getAllForUser(user: string){
        const all: Array<Category> = this.getAll();

        return all.filter((x: Category) => x.mct_user === user);
    }
}