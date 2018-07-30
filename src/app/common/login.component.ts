import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
// types

// services
import { LoginService } from './login.service';

@Component({
    selector: 'balance',
    templateUrl: './balance.template.html',
    styleUrls: ['./balance.css'],
    providers: [
        LoginService
    ]
})
export class LoginComponent implements OnInit {
    private user: string = 'anon';
    public viewData: {
        error: boolean
        , errorMessage: string
    } = {
        error: true
        , errorMessage: ''
    };
    public services: {
        login: LoginService
    } = {
        login: null
    };
    public model: {
        iterable: number
        , year: number
        , month: number
    } = {
        iterable: 0
        , year: 2017
        , month: 12
    };

    constructor(
        loginService: LoginService
    ){
        this.services.login = loginService;
    }

    ngOnInit(){
        
    }

    submit(loginForm: NgForm) {
        const {
            fUsername,
            fPassword
        } = loginForm.value;

        if (!fUsername || !fPassword){
            this.viewData.error = true;
            this.viewData.errorMessage = 'Username and Password are required';
            return false;
        }

        // Send to server
        // this.sync.post({}).then()

        // setup current identity
        //this.identity.set(fUsername, auth_token);
        //this.identity.get();
    }
}