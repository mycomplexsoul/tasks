export class Sync {
    public queue: Array<SyncQueue> = [];
    

    request(method: string, url: string, data: any, callback: Function){
        this.queue.push({
            method, url, data, callback
            , status: 'queue'
        });

        if (this.isOnline()){
            this.processQueue();
        }
    }

    isOnline(){
        let nav = navigator.onLine;
        let rq = true; // some request to BE
        return nav && rq;
    }

    processQueue(){
        this.queue.filter((q: any) => {
            q.status === 'queue';
        }).forEach((q: any) => {

        });
    }
}

interface SyncQueue {
    method: string
    , url: string
    , data: any
    , callback: Function
    , status: string
}