import { Multimedia } from '../../crosscommon/entities/Multimedia';
import { Injectable } from '@angular/core';
import { SyncAPI } from '../common/sync.api';
import { Utils } from '../../crosscommon/Utility';
import { LoginService } from '../common/login.service';

@Injectable()
export class MultimediaService {
    private data: Array<Multimedia> = [];
    private sync: SyncAPI = null;
    private loginService: LoginService = null;
    private config = {
        api: {
            list: '/api/multimedia'
            , create: 'create'
            , update: 'update'
        }
    }

    constructor(sync: SyncAPI, loginService: LoginService){
        this.sync = sync;
        this.loginService = loginService;
    }

    ngOnInit() {
        if (!this.loginService.isLoggedIn()) {
            console.log('User is not logged in');
        }
    }

    list(): Array<Multimedia> {
        return this.data;
    }

    async getAll(){
        const filter = {
            gc: 'AND'
            , cont: [{
                f: 'mma_ctg_status'
                , op: 'eq'
                , val: 1
            }, {
                f: 'mma_id_user'
                , op: 'eq'
                , val: this.loginService.getUsername() || 'anon'
            }]
        };
        const query = `?q=${JSON.stringify(filter)}`;
        const sort = ((a: Multimedia, b: Multimedia) => {
            return a.mma_date_mod.getTime() > b.mma_date_mod.getTime() ? 1 : -1;
        });
        
        return this.sync.get(`${this.config.api.list}${query}`).then(data => {
            this.data = data.map((d: any): Multimedia => new Multimedia(d));
            this.data = this.data.sort(sort);
            return this.data;
        }).catch(err => {
            return [];
        });
    }

    async getAllForUser(user: string){
        return this.getAll().then((all: Multimedia[]) => {
            return all.filter((x: Multimedia) => x.mma_id_user === user);
        });
    }

    newId(){
        const m: Multimedia = new Multimedia();
        const length: number = m.metadata.fields.find(f => f.dbName === 'mma_id').size;
        return Utils.hashId(m.metadata.prefix, length);
    }

    newItem(title: string, media_type: number, season: number, year: number, current_ep: string, total_ep: string, url: string, user: string): Multimedia{
        let newId: string = this.newId();
        let newItem = new Multimedia({
            mma_id: newId
            , mma_title: title
            , mma_ctg_media_type: media_type
            , mma_season: season
            , mma_year: year
            , mma_current_ep: current_ep
            , mma_total_ep: total_ep
            , mma_url: url
            , mma_id_user: user
            , mma_date_add: new Date()
            , mma_date_mod: new Date()
            , mma_ctg_status: 1
        });

        this.sync.request('create'
            , Utils.entityToRawTableFields(newItem)
            , Utils.getPKFromEntity(newItem)
            , 'Multimedia'
            , () => {
                newItem['not_sync'] = false; // means it's synced
            }
            , newItem.recordName
            , (item) => item.mma_id === newItem.mma_id
        );

        return newItem;
    }
    
    asUpdateSyncQueue(item: Multimedia) {
        const updateLocal = () => {
            const index = this.data.findIndex(e => e.mma_id === item.mma_id);
            if (index !== -1){
                this.data[index] = item;
            }
        };

        return this.sync.asSyncQueue('update'
            , Utils.entityToRawTableFields(item)
            , Utils.getPKFromEntity(item)
            , 'Multimedia'
            , () => {
                item['not_sync'] = false; // means it's synced
                updateLocal();
            }
            , item.recordName
            , (item) => item.mma_id === item.mma_id
        );
    }
}