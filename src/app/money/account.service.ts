import { Account } from './account.type';
import { StorageService } from '../common/storage.service';
import {Injectable} from '@angular/core';

@Injectable()
export class AccountService {
    private data: Array<Account> = [];
    private storage: StorageService = null;
    private config = {
        storageKey: 'accounts'
    }

    constructor(storage: StorageService){
        this.storage = storage;
    }

    initialData(){
        let list: Array<Account>;
        
        let data = [{
            acc_id: '1'
            , acc_name: 'Capital'
        },{
            acc_id: '2'
            , acc_name: 'Mosho Cartera'
        },{
            acc_id: '3'
            , acc_name: 'Mosho Libreton'
        },{
            acc_id: '4'
            , acc_name: 'Mosho Nomina'
        },{
            acc_id: '5'
            , acc_name: 'Mosho Credito'
        },{
            acc_id: '6'
            , acc_name: 'Mosho Puntos'
        },{
            acc_id: '7'
            , acc_name: 'Mosho Santander'
        },{
            acc_id: '8'
            , acc_name: 'Hipoteca'
        },{
            acc_id: '9'
            , acc_name: 'Mosho Inversion'
        },{
            acc_id: '10'
            , acc_name: 'Prestamos Mosho a Otros'
        },{
            acc_id: '11'
            , acc_name: 'Prestamos Mosho a Lau'
        },{
            acc_id: '12'
            , acc_name: 'Prestamos Mosho a Oliva'
        },{
            acc_id: '13'
            , acc_name: 'Prestamos Mosho a Memo'
        },{
            acc_id: '14'
            , acc_name: 'Revolvente Moshos'
        },{
            acc_id: '15'
            , acc_name: 'LPHT Nom Bancomer'
        },{
            acc_id: '16'
            , acc_name: 'LPHT Deb Bancomer'
        },{
            acc_id: '17'
            , acc_name: 'LPHT Deb Banamex'
        },{
            acc_id: '18'
            , acc_name: 'LPHT Cred Banamex'
        },{
            acc_id: '19'
            , acc_name: 'LPHT Cartera'
        },{
            acc_id: '20'
            , acc_name: 'Prestamos Lau a MamaAgüis'
        },{
            acc_id: '21'
            , acc_name: 'Prestamos Lau a Hermano'
        },{
            acc_id: '22'
            , acc_name: 'Fondo de Reserva CV'
        },{
            acc_id: '23'
            , acc_name: 'Adeudo a FR'
        },{
            acc_id: '24'
            , acc_name: 'Prestamos FR a Mosho'
        },{
            acc_id: '25'
            , acc_name: 'Capital CV'
        },{
            acc_id: '26'
            , acc_name: 'Prestamos Mosho a Anibal'
        },{
            acc_id: '27'
            , acc_name: 'Mosho Scotia Credito'
        },{
            acc_id: '28'
            , acc_name: 'LPHT Cred Bancomer'
        }];
        
        list = data.map((d: any) => new Account(d));

        return list;
    }

    getAll(){
        let fromStorage = this.storage.get(this.config.storageKey);
        if (fromStorage){
            this.data = JSON.parse(fromStorage);
        } else {
            this.data = this.initialData();
        }
        return this.data;
    }
}