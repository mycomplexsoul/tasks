import { Component } from '@angular/core';

@Component({
    selector: 'drink-water',
    templateUrl: './drinkwater.template.html',
    providers: [ ]
})
export class DrinkWaterComponent {
    public count: number = 0;
    private intervalRef: number = 0;
    public notifyEnabled: boolean = false;

    constructor(){
        this.startNotification();
    }

    notification(data: any){
        let not = window["Notification"];
        if(not && not.permission !== "denied") {
            not.requestPermission(function(status: string) {  // status is "granted", if accepted by user
                var n = new not(data.title || 'Tasks', { 
                    body: data.body,
                    icon: data.icon || 'favicon.ico' // optional
                }); 
            });
        }
    }

    addOne() {
        this.count++;
    }

    stopNotification() {
        window.clearInterval(this.intervalRef);
        this.intervalRef = 0;
        this.notifyEnabled = false;
    }

    startNotification() {
        const min = 30;
        const notify = this.notification;
        this.notifyEnabled = true;
        this.intervalRef = window.setInterval(() => {
            notify({
                title: 'Drink Water',
                body: 'Hey! drink some water man'
            });
        }, min * 60 * 1000);
    }
}