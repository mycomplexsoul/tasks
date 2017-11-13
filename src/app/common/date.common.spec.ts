/* tslint:disable:no-unused-variable */
import { DateCommon } from './date.common';

import { TestBed }      from '@angular/core/testing';

import { By }           from '@angular/platform-browser';

////////  SPECS  /////////////

describe('DateCommon', () => {
    let dateObj: DateCommon;

    beforeEach(() => {
        dateObj = new DateCommon();
    });

    describe('dateOnly method', () => {
        it('should return date without hours, minutes and seconds for a provided date', () => {
            let date = new Date(2017,10,8,11,50,25);
            let expDate = new Date(2017,10,8,0,0,0);
            expect(dateObj.dateOnly(date).getTime()).toBe(expDate.getTime());
        });

        it('should return date without hours, minutes and seconds when a date is not provided using current date', () => {
            let expDate = new Date();
            expDate = new Date(expDate.getFullYear(), expDate.getMonth(), expDate.getDate());
            expect(dateObj.dateOnly().getTime()).toBe(expDate.getTime());
        });
    });
});
