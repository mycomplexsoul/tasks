import { Component, OnInit, Renderer } from '@angular/core';
import { NgForm } from '@angular/forms';
// types
import { LastTime } from '../../crosscommon/entities/LastTime';

// services
import { StorageService }  from '../common/storage.service';
import { LastTimeService } from './lasttime.service';
import { DateUtils } from '../../crosscommon/DateUtility';

@Component({
    selector: 'lasttime',
    templateUrl: './lasttime.template.html',
    providers: [
        LastTimeService
    ]
})
export class LastTimeComponent implements OnInit {
    private user: string = 'anon';
    public viewData: {
        lastTime: Array<LastTime>,
        showCreateForm: boolean
    } = {
        lastTime: [],
        showCreateForm: false
    };
    public services: {
        lastTime: LastTimeService
    } = {
        lastTime: null
    };
    public model: {
        id: string
    } = {
        id: null
    };

    constructor(
        lastTimeService: LastTimeService
    ){
        this.services.lastTime = lastTimeService;
    }

    ngOnInit(){
        this.services.lastTime.getAllForUser(this.user).then((list: Array<LastTime>) => {
            this.viewData.lastTime = list;

            // calculate validity on each
            this.calculateValidityForAll();
        });
    }

    handleNewItem(form: NgForm) {
        this.viewData.showCreateForm = !this.viewData.showCreateForm;
    }

    calculateValidity(item: LastTime) {
        const valueIsDate: boolean = item.lst_value.length === 10; // TODO: improve date recognize process
        const baseValue: Date = valueIsDate ? new Date(item.lst_value) : item.lst_date_mod;
        item['expiryDate'] = DateUtils.addDays(baseValue, item.lst_validity);
        item['ageSentence'] = this.ageSentence(item['expiryDate']);
        item['ageClass'] = this.ageClass(item['expiryDate']);
    }

    calculateValidityForAll(){
        const list: LastTime[] = this.services.lastTime.list();
        list.forEach(item => {
            this.calculateValidity(item);
        });
    }

    newItem(form: NgForm) {
        let values = form.value;

        this.services.lastTime.newItem(values.fName, values.fValue, values.fValidity, values.fTags, values.fNotes, this.user).then(item => {
            this.viewData.lastTime = this.services.lastTime.list();
            this.calculateValidityForAll();
        });
    }
    
    ageSentence(baseDate: Date){
        let diff = DateUtils.age(baseDate);
        return `${(diff > 1 ? '(' + diff + ' days ago)' : (diff === 1 ? '(yesterday)' : ''))}`;
    }

    ageClass(baseDate: Date){
        let diff = DateUtils.age(baseDate);
        let classes = ['lasttime-age-0','lasttime-age-1','lasttime-age-2','lasttime-age-10'];
        if (diff <= 2){
            return classes[diff];
        }
        if (2 < diff && diff < 10){
            return classes[2];
        }
        if (diff >= 10){
            return classes[3];
        }
        return '';
    }
}