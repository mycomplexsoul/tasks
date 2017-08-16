import { Injectable } from '@angular/core';

@Injectable()
export class DateCommon {
    elapsedTime(date1: Date, date2: Date) :number{ // return diff in seconds
        if (date1 && date2){
            return Math.floor(Math.abs(date1.getTime() - date2.getTime()) / 1000);
        }
        return 0;
    }

    dateOnly(base: Date){
        return new Date(base.getFullYear(),base.getMonth(),base.getDate(),0,0,0);
    }

    addDays(base: Date, days: number){
        return new Date(( base.getTime() + (days * 86400000) ));
    }
}