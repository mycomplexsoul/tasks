import { MultimediaView } from '../../crosscommon/entities/MultimediaView';
import { Injectable } from '@angular/core';
import { SyncAPI } from '../common/sync.api';
import { Utils } from '../../crosscommon/Utility';
import { LoginService } from '../common/login.service';

@Injectable()
export class MultimediaViewService {
    private data: Array<MultimediaView> = [];
    private sync: SyncAPI = null;
    private loginService: LoginService = null;
    private config = {
        api: {
            list: '/api/multimediaview'
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

    list(): Array<MultimediaView> {
        return this.data;
    }

    async getAll(){
        const filter = {
            gc: 'AND'
            , cont: [{
                f: 'mmv_ctg_status'
                , op: 'eq'
                , val: 1
            }, {
                f: 'mmv_id_user'
                , op: 'eq'
                , val: this.loginService.getUsername() || 'anon'
            }]
        };
        const query = `?q=${JSON.stringify(filter)}`;
        const sort = ((a: MultimediaView, b: MultimediaView) => {
            return a.mmv_date_mod.getTime() > b.mmv_date_mod.getTime() ? 1 : -1;
        });
        
        return this.sync.get(`${this.config.api.list}${query}`).then(data => {
            this.data = data.map((d: any): MultimediaView => new MultimediaView(d));
            this.data = this.data.sort(sort);
            return this.data;
        }).catch(err => {
            return [];
        });
    }

    async getAllForUser(user: string){
        return this.getAll().then((all: MultimediaView[]) => {
            return all.filter((x: MultimediaView) => x.mmv_id_user === user);
        });
    }

    newItem(id: string, epId: string, summary: string, dateViewed: Date, rating: number, platform: number, notes: string, user: string) :MultimediaView {
        let newItem = new MultimediaView({
            mmv_id: id
            , mmv_id_ep: epId
            , mmv_ep_summary: summary
            , mmv_date_viewed: dateViewed
            , mmv_num_rating: rating
            , mmv_ctg_platform: platform
            , mmv_notes: notes
            , mmv_id_user: user
            , mmv_date_add: new Date()
            , mmv_date_mod: new Date()
            , mmv_ctg_status: 1
        });
        
        return newItem;
    }
    
    asSyncQueue(item: MultimediaView) {
        return this.sync.asSyncQueue('create'
            , Utils.entityToRawTableFields(item)
            , Utils.getPKFromEntity(item)
            , 'MultimediaView'
            , () => {
                item['not_sync'] = false; // means it's synced
            }
            , item.recordName
            , (item) => item.mmv_id === item.mmv_id && item.mmv_id_ep === item.mmv_id_ep
        );
    }
}