import { Component, OnInit, Renderer } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
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
    public listBackup: LastTime[] = [];

    constructor(
        lastTimeService: LastTimeService,
        private titleService: Title
    ){
        this.services.lastTime = lastTimeService;
        titleService.setTitle('Last Time');
    }

    ngOnInit(){
        this.services.lastTime.getAllForUser(this.user).then((list: Array<LastTime>) => {
            this.viewData.lastTime = list;
            this.listBackup = [...this.viewData.lastTime]; // backup

            // calculate validity on each
            this.calculateValidityForAll();
        });
    }

    handleNewItem(form: NgForm) {
        this.viewData.showCreateForm = !this.viewData.showCreateForm;
    }

    calculateValidity(item: LastTime) {
        const valueIsDate: boolean = DateUtils.isDate(item.lst_value);
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
        this.viewData.lastTime = list.sort(sort);
        console.log('listing', this.viewData.lastTime);
    }

    newItem(form: NgForm) {
        let values = form.value;

        this.services.lastTime.newItem(values.fName, values.fValue, values.fValidity, values.fTags, values.fNotes, this.user).then(item => {
            this.viewData.lastTime = this.services.lastTime.list();
            const listItem = this.viewData.lastTime.find(elem => elem.lst_id === item.lst_id);
            listItem['isNew'] = true;
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

        if (item.lst_value !== newValue) {
            item.lst_value = newValue;
            item.lst_date_mod = DateUtils.newDateUpToSeconds();
            item['isEdited'] = true;
            
            this.services.lastTime.updateItem(item).then(response => {
                this.calculateValidityForAll();
                this.updateBackupItem(item);
            });
        }
    }
    
    archiveRecord(item: LastTime) {
        item.lst_ctg_status = 3; // archived
        item.lst_date_mod = DateUtils.newDateUpToSeconds();
        item['isEdited'] = true;
        
        this.services.lastTime.updateItem(item).then(response => {
            this.calculateValidityForAll();
            this.updateBackupItem(item);
        });
    }
    
    updateBackupItem(item: LastTime) {
        this.listBackup[this.listBackup.findIndex(i => i.lst_id === item.lst_id)] = item; // to keep backup list updated
    }

    filter(event: KeyboardEvent) {
        const query: string = event.target['value'];

        const criteria = (item: LastTime) => {
            return item.lst_name.toLowerCase().indexOf(query.toLowerCase()) !== -1 || item.lst_tags.toLowerCase().indexOf(query.toLowerCase()) !== -1;
        };

        if (query) {
            this.viewData.lastTime = this.listBackup.filter(i => criteria(i));
        } else {
            this.viewData.lastTime = this.listBackup;
        }
    }
}