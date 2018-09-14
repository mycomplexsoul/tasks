import { Account } from '../../crosscommon/entities/Account';
import { StorageService } from '../common/storage.service';
import {Injectable} from '@angular/core';
import { SyncAPI } from '../common/sync.api';

@Injectable()
export class AccountService {
    private data: Array<Account> = [];
    private storage: StorageService = null;
    private sync: SyncAPI = null;
    private config = {
        storageKey: 'accounts',
        api: {
            list: '/api/movements/accounts'
        }
    }

    constructor(storage: StorageService, sync: SyncAPI){
        this.storage = storage;
        this.sync = sync;
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

    async getAll(){
        /*let fromStorage = this.storage.get(this.config.storageKey);
        if (fromStorage){
            this.data = JSON.parse(fromStorage);
        } else {
            this.data = this.initialData();
        }*/
        const sort = ((a: Account, b: Account) => {
            return a.acc_name > b.acc_name ? 1 : -1;
        });
        const filter = {
            gc: 'AND'
            , cont: [{
                f: 'acc_ctg_status'
                , op: 'eq'
                , val: '1'
            }, {
                f: 'acc_ctg_type'
                , op: 'ne'
                , val: '4'
            }]
        };
        const query = `?q=${JSON.stringify(filter)}`;
        return this.sync.get(`${this.config.api.list}${query}`).then(data => {
            this.data = data.map((d: any): Account => {
                let item = new Account(d);
                item['bal_final'] = d['bal_final'];
                return item;
            });
            this.data = this.data.sort(sort);
            return this.data;
        }).catch(err => {
            return [];
        });
    }
}