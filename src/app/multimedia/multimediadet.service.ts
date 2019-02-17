import { MultimediaDet } from '../../crosscommon/entities/MultimediaDet';
import { Injectable } from '@angular/core';
import { SyncAPI } from '../common/sync.api';
import { Utils } from '../../crosscommon/Utility';
import { LoginService } from '../common/login.service';

@Injectable()
export class MultimediaDetService {
    private data: Array<MultimediaDet> = [];
    private sync: SyncAPI = null;
    private loginService: LoginService = null;
    private config = {
        api: {
            list: '/api/multimediadet'
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

    list(): Array<MultimediaDet> {
        return this.data;
    }

    async getAll(){
        const filter = {
            gc: 'AND'
            , cont: [{
                f: 'mmd_ctg_status'
                , op: 'eq'
                , val: 1
            }, {
                f: 'mmd_id_user'
                , op: 'eq'
                , val: this.loginService.getUsername() || 'anon'
            }]
        };
        const query = `?q=${JSON.stringify(filter)}`;
        const sort = ((a: MultimediaDet, b: MultimediaDet) => {
            return a.mmd_date_mod.getTime() > b.mmd_date_mod.getTime() ? 1 : -1;
        });
        
        return this.sync.get(`${this.config.api.list}${query}`).then(data => {
            this.data = data.map((d: any): MultimediaDet => new MultimediaDet(d));
            this.data = this.data.sort(sort);
            return this.data;
        }).catch(err => {
            return [];
        });
    }

    async getAllForUser(user: string){
        return this.getAll().then((all: MultimediaDet[]) => {
            return all.filter((x: MultimediaDet) => x.mmd_id_user === user);
        });
    }

    newItem(id: string, epId: string, title: string, altTitle: string, year: number, url: string, user: string) :MultimediaDet {
        let newItem = new MultimediaDet({
            mmd_id: id
            , mmd_id_ep: epId
            , mmd_ep_title: title
            , mmd_ep_alt_title: altTitle
            , mmd_year: year
            , mmd_url: url
            , mmd_id_user: user
            , mmd_date_add: new Date()
            , mmd_date_mod: new Date()
            , mmd_ctg_status: 1
        });

        return newItem;
    }
    
    asSyncQueue(item: MultimediaDet) {
        return this.sync.asSyncQueue('create'
            , Utils.entityToRawTableFields(item)
            , Utils.getPKFromEntity(item)
            , 'MultimediaDet'
            , () => {
                item['not_sync'] = false; // means it's synced
            }
            , item.recordName
            , (item) => item.mmd_id === item.mmd_id && item.mmd_id_ep === item.mmd_id_ep
        );
    }
}