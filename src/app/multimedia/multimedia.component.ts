import { Component, OnInit, Renderer } from '@angular/core';
import { NgForm } from '@angular/forms';
// types
import { Multimedia } from '../../crosscommon/entities/Multimedia';

// services
import { MultimediaService } from './multimedia.service';
import { LoginService } from '../common/login.service';
import { SyncAPI } from '../common/sync.api';
import { Catalog } from '../../crosscommon/entities/Catalog';

@Component({
    selector: 'multimedia',
    templateUrl: './multimedia.template.html',
    styleUrls: ['./multimedia.css'],
    providers: [
        MultimediaService
        , LoginService
        , SyncAPI
    ]
})
export class MultimediaComponent implements OnInit {
    public viewData: {
        multimediaList: Multimedia[],
        mediaTypeList: Catalog[],
        showCreateForm: boolean
    } = {
        multimediaList: [],
        mediaTypeList: [],
        showCreateForm: false
    };
    public services: {
        multimediaService: MultimediaService
        , loginService: LoginService
        , syncService: SyncAPI
    } = {
        multimediaService: null
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

    constructor(
        multimediaService: MultimediaService
        , loginService: LoginService
        , syncService: SyncAPI
    ){
        this.services.multimediaService = multimediaService;
        this.services.loginService = loginService;
        this.services.syncService = syncService;

        this.services.multimediaService.getAllForUser(this.services.loginService.getUsername() || 'anon').then(data => {
            this.viewData.multimediaList = data;
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
}