import { Injectable } from '@angular/core';

@Injectable()
export class DateCommon {
    elapsedTime(date1: Date, date2: Date): number { // return diff in seconds
        if (date1 && date2){
            return Math.floor(Math.abs(date1.getTime() - date2.getTime()) / 1000);
        }
        return 0;
    }

    dateOnly(base?: Date): Date {
        if (base) {
            return new Date(base.getFullYear(),base.getMonth(),base.getDate(),0,0,0);
        }
        let newDate = new Date();
        return new Date(newDate.getFullYear(),newDate.getMonth(),newDate.getDate(),0,0,0);
    }

    addDays(base: Date, days: number): Date {
        return new Date(( base.getTime() + (days * 86400000) ));
    }

    newDateUpToSeconds(): Date {
        return new Date(Math.floor((new Date()).getTime() / 1000) * 1000);
    }
}