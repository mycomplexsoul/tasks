import { Place } from '../../crosscommon/entities/Place';
import { StorageService } from '../common/storage.service';
import { Injectable } from '@angular/core';
import { SyncAPI } from '../common/sync.api';

@Injectable()
export class PlaceService {
    private data: Array<Place> = [];
    private storage: StorageService = null;
    private sync: SyncAPI = null;
    private config = {
        storageKey: 'places'
        , defaultUser: 'anon'
        , api: {
            list: '/api/places'
        }
    }

    constructor(storage: StorageService, sync: SyncAPI){
        this.storage = storage;
        this.sync = sync;
    }

    list(): Array<Place> {
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
            d.mpl_id_user = this.config.defaultUser;
            return new Place(d);
        });

        return list;
    }

    async getAll(){
        const sort = ((a: Place, b: Place) => {
            return a.mpl_name > b.mpl_name ? 1 : -1;
        });
        return this.sync.get(`${this.config.api.list}`).then(data => {
            this.data = data.map((d: any): Place => new Place(d));
            this.data = this.data.sort(sort);
            return this.data;
        }).catch(err => {
            return [];
        });
    }

    async getAllForUser(user: string){
        return this.getAll().then((all: Place[]) => {
            return all.filter((x: Place) => x.mpl_id_user === user);
        });
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
            , mpl_id_user: user
        });
        this.data.push(newItem);
        this.saveToStorage();
        return newItem;
    }
}