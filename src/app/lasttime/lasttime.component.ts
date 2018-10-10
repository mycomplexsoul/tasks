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
    styleUrls: ['./lasttime.css'],
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
        let list: LastTime[] = this.services.lastTime.list();
        list.forEach(item => {
            this.calculateValidity(item);
        });
        const sort = ((a: LastTime, b: LastTime) => {
            return a['expiryDate'].getTime() >= b['expiryDate'].getTime() ? 1 : -1;
        });
        list = list.sort(sort);
        console.log('listing', list);
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
        let str = '';
        if (diff > 1){
            str = `(${diff} days left)`;
        }
        if (diff === 1){
            str = '(tomorrow)';
        }
        if (diff === 0){
            str = '(today)';
        }
        if (diff === -1){
            str = '(yesterday)';
        }
        if (diff < -1){
            str = `(${Math.abs(diff)} days ago)`;
        }
        return str;
    }

    ageClass(baseDate: Date){
        let diff = DateUtils.age(baseDate);
        let str = '';
        if (diff >= 10){
            str = 'lasttime-age-10-left';
        }
        if (diff > 1 && diff < 10){
            str = 'lasttime-age-2-left';
        }
        if (diff === 1){
            str = 'lasttime-age-1-left';
        }
        if (diff === 0){
            str = 'lasttime-age-0';
        }
        if (diff === -1){
            str = 'lasttime-age-1-ago';
        }
        if (diff < -1 && diff > -10){
            str = 'lasttime-age-2-ago';
        }
        if (diff < -10){
            str = 'lasttime-age-10-ago';
        }
       
        return str;
    }

    editValue(item: LastTime, event: KeyboardEvent) {
        const newValue: string = event.target['textContent'];

        item.lst_value = newValue;
        item.lst_date_mod = DateUtils.newDateUpToSeconds();

        this.services.lastTime.updateItem(item).then(response => {
            this.calculateValidityForAll();
        });
    }
}