import { Component, OnInit, Renderer } from '@angular/core';
import { NgForm } from '@angular/forms';
// types
import { Multimedia } from '../../crosscommon/entities/Multimedia';

// services
import { MultimediaService } from './multimedia.service';
import { MultimediaDetService } from './multimediadet.service';
import { MultimediaViewService } from './multimediaview.service';
import { LoginService } from '../common/login.service';
import { SyncAPI } from '../common/sync.api';
import { Catalog } from '../../crosscommon/entities/Catalog';
import { MultimediaView } from '../../crosscommon/entities/MultimediaView';
import { MultimediaDet } from '../../crosscommon/entities/MultimediaDet';
import { DateUtils } from '../../crosscommon/DateUtility';
import { SyncQueue } from '../common/SyncQueue';

@Component({
    selector: 'multimedia',
    templateUrl: './multimedia.template.html',
    styleUrls: ['./multimedia.css'],
    providers: [
        MultimediaService
        , MultimediaDetService
        , MultimediaViewService
        , LoginService
        , SyncAPI
    ]
})
export class MultimediaComponent implements OnInit {
    public viewData: {
        multimediaList: Multimedia[],
        multimediaDetList: MultimediaDet[],
        multimediaViewList: MultimediaView[],
        mediaTypeList: Catalog[],
        platformList: Catalog[],
        showCreateForm: boolean,
        showCreateEpForm: boolean
    } = {
        multimediaList: [],
        multimediaDetList: [],
        multimediaViewList: [],
        mediaTypeList: [],
        platformList: [],
        showCreateForm: false,
        showCreateEpForm: false
    };
    public services: {
        multimediaService: MultimediaService
        , multimediaDetService: MultimediaDetService
        , multimediaViewService: MultimediaViewService
        , loginService: LoginService
        , syncService: SyncAPI
    } = {
        multimediaService: null
        , multimediaDetService: null
        , multimediaViewService: null
        , loginService: null
        , syncService: null
    };
    public model: {
        id: string,
        fMediaType: number,
        fSeason: number,
        fYear: number,
        fCurrentEp: string
    } = {
        id: null,
        fMediaType: 1,
        fSeason: 1,
        fYear: (new Date()).getFullYear(),
        fCurrentEp: '1'
    };
    public epModel: {
        id: string,
        epId: string,
        fTitle: string,
        fYear: number,
        fEpTitle: string,
        fAltEpTitle: string,
        fUrl: string,
        isViewed: boolean,
        fDateViewed: Date,
        fSummary: string,
        fRating: number,
        fPlatform: number,
        fNotes: string
    } = {
        id: null,
        epId: null,
        fTitle: null,
        fYear: null,
        fEpTitle: null,
        fAltEpTitle: null,
        fUrl: null,
        isViewed: false,
        fDateViewed: new Date(),
        fSummary: null,
        fRating: 0,
        fPlatform: 0,
        fNotes: null
    };

    constructor(
        multimediaService: MultimediaService
        , multimediaDetService: MultimediaDetService
        , multimediaViewService: MultimediaViewService
        , loginService: LoginService
        , syncService: SyncAPI
    ){
        this.services.multimediaService = multimediaService;
        this.services.multimediaDetService = multimediaDetService;
        this.services.multimediaViewService = multimediaViewService;
        this.services.loginService = loginService;
        this.services.syncService = syncService;

        this.services.multimediaService.getAllForUser(this.services.loginService.getUsername() || 'anon').then(data => {
            this.viewData.multimediaList = data;
        });
        this.services.multimediaDetService.getAllForUser(this.services.loginService.getUsername() || 'anon').then((data: MultimediaDet[]) => {
            this.viewData.multimediaDetList = data;
        });
        this.services.multimediaViewService.getAllForUser(this.services.loginService.getUsername() || 'anon').then((data: MultimediaView[]) => {
            this.viewData.multimediaViewList = data;
        });
        const mediaTypes: string = JSON.stringify({
            gc: 'AND'
            , cont: [{
                f: 'ctg_id'
                , op: 'eq'
                , val: 'MULTIMEDIA_MEDIA_TYP' // TODO: fix database length for field ctg_name
            }]
        })
        this.services.syncService.get(`/api/sync?entity=Catalog&q=${mediaTypes}`).then(data => {
            this.viewData.mediaTypeList = data.list;
        });

        const platformQuery: string = JSON.stringify({
            gc: 'AND'
            , cont: [{
                f: 'ctg_id'
                , op: 'eq'
                , val: 'MULTIMEDIA_PLATFORM' // TODO: fix database length for field ctg_name
            }]
        })
        this.services.syncService.get(`/api/sync?entity=Catalog&q=${platformQuery}`).then(data => {
            this.viewData.platformList = data.list;
        });
    }

    ngOnInit(){
        if (!this.services.loginService.isLoggedIn()) {
            console.log('User is not logged in');
        }
    }

    handleNewItem() {
        this.viewData.showCreateForm = !this.viewData.showCreateForm;
    }

    newItem(form: NgForm) {
        let values = form.value;

        const item: Multimedia = this.services.multimediaService.newItem(
            values.fTitle,
            values.fMediaType,
            values.fSeason,
            values.fYear,
            values.fCurrentEp,
            values.fTotalEp,
            values.fUrl,
            this.services.loginService.getUsername() || 'anon'
        );

        this.viewData.multimediaList.push(item);
    }

    showNewEpForm(id: string, epId: string, title: string) {
        this.viewData.showCreateEpForm = true;
        this.epModel.id = id;
        this.epModel.epId = epId;
        this.epModel.fTitle = title;

        // see if we have data for this ep in order to populate form
        const detFound = this.services.multimediaDetService.list().find(item => item.mmd_id === id && item.mmd_id_ep === epId);
        if (detFound) {
            this.epModel.fEpTitle = detFound.mmd_ep_title;
            this.epModel.fAltEpTitle = detFound.mmd_ep_alt_title;
            this.epModel.fYear = detFound.mmd_year;
            this.epModel.fUrl = detFound.mmd_url;
        }

        this.epModel.isViewed = false;
        const viewFound = this.services.multimediaViewService.list().find(item => item.mmv_id === id && item.mmv_id_ep === epId);
        if (viewFound) {
            this.epModel.isViewed = true;
            this.epModel.fSummary = viewFound.mmv_ep_summary;
            this.epModel.fDateViewed = viewFound.mmv_date_viewed;
            this.epModel.fRating = viewFound.mmv_num_rating;
            this.epModel.fPlatform = viewFound.mmv_ctg_platform;
            this.epModel.fNotes = viewFound.mmv_notes;
        }
    }
    
    hideNewEpForm() {
        this.viewData.showCreateEpForm = false;
    }

    newEpItem(form: NgForm) {
        let values = form.value;

        const queue: SyncQueue[] = [];

        const item: MultimediaDet = this.services.multimediaDetService.newItem(
            this.epModel.id,
            this.epModel.epId,
            values.fEpTitle,
            values.fAltEpTitle,
            values.fYear,
            values.fUrl,
            this.services.loginService.getUsername() || 'anon'
        );

        this.viewData.multimediaDetList.push(item);
        queue.push(this.services.multimediaDetService.asSyncQueue(item));
        
        if (values.fIsViewed) {
            const item2: MultimediaView = this.services.multimediaViewService.newItem(
                this.epModel.id,
                this.epModel.epId,
                values.fSummary,
                values.fDateViewed,
                values.fRating,
                values.fPlatform,
                values.fNotes,
                this.services.loginService.getUsername() || 'anon'
            );
            
            this.viewData.multimediaViewList.push(item2);
            queue.push(this.services.multimediaViewService.asSyncQueue(item2));

            const media = this.viewData.multimediaList.find(item => item.mma_id === this.epModel.id);
            media.mma_current_ep = this.calculateNextEp(media.mma_current_ep);
            media.mma_date_mod = new Date();
            queue.push(this.services.multimediaService.asUpdateSyncQueue(media));
        }
        
        this.services.syncService.multipleRequest(queue);
    }

    calculateNextEp(currentEp: string) :string {
        if (DateUtils.isDate(currentEp)) {
            const asDate: Date = new Date(currentEp);
            return DateUtils.formatDate(DateUtils.addDays(asDate, 7));
        }

        const asInteger: number = Number.parseInt(currentEp);
        const asFloat: number = Number.parseFloat(currentEp);

        if (asInteger - asFloat < 0.1) {
            // as integer
            return String(asInteger + 1);
        } else {
            // as float
            return String(Math.ceil(asFloat));
        }
    }

    showDetListing(id: string) {
        this.services.multimediaDetService.getAllForUser('anon').then(data => {
            this.viewData.multimediaDetList = data.filter(item => item.mmd_id === id);
        });
    }
}