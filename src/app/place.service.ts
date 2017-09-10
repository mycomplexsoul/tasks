import { Place } from './place.type';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';

@Injectable()
export class PlaceService {
    private data: Array<Place> = [];
    private storage: StorageService = null;
    private config = {
        storageKey: 'places'
        , defaultUser: 'anon'
    }

    constructor(storage: StorageService){
        this.storage = storage;
    }

    get list(): Array<Place> {
        return this.data;
    }

    initialData(){
        let list: Array<Place>;

        let newData = (mpl_id: string, mpl_name: string) => {
            return {mpl_id, mpl_name};
        };
        let data = [];
        data.push(newData('1','Walmart'));
        data.push(newData('2','Vips'));
        data.push(newData('3','Sams Club'));
        data.push(newData('4','Cinepolis'));
        data.push(newData('5','The Home Depot'));
        
        list = data.map((d: any) => {
            d.mpl_user = this.config.defaultUser;
            return new Place(d);
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
        const all: Array<Place> = this.getAll();

        return all.filter((x: Place) => x.mpl_user === user);
    }

    saveToStorage(){
        this.storage.set(this.config.storageKey,JSON.stringify(this.data));
    }

    newId(){
        return this.data.length + 1 + '';
    }

    newItem(place: string, user: string): Place{
        let newId: string = this.newId();
        let newItem = new Place({
            mpl_id: newId
            , mpl_name: place
            , mpl_user: user
        });
        this.data.push(newItem);
        this.saveToStorage();
        return newItem;
    }
}