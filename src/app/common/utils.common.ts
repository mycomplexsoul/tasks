import { Injectable } from '@angular/core';

@Injectable()
export class UtilsCommon {
    pad(value: string | number, fillChar: string, length: number, dir: number = -1){
        let result: string = value + '';
        while(result.length < length){
            if (dir === -1){
                result = fillChar + result;
            } else {
                result = result + fillChar;
            }
        }
        return result;
    }

    hashId(prefix: string = 'X', length: number = 32, baseDate: Date = null){
        // take date + time + random digits
        // total digits: 1 + 10 + 6 + '-' + (length - 18) >= 32
        let date = baseDate || new Date();
        let random = Math.floor(Math.random() * Math.pow(10,length - 17 - prefix.length));
        let datetimeString = `${date.getFullYear()}${this.pad(date.getMonth()+1,'0',2)}${this.pad(date.getDate(),'0',2)}`;
        datetimeString += `${this.pad(date.getHours(),'0',2)}${this.pad(date.getMinutes(),'0',2)}${this.pad(date.getSeconds(),'0',2)}`;
        let id = `${prefix}${datetimeString}-${random}`;
        return id;
    }
}