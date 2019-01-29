import { Component, OnInit, Renderer } from '@angular/core';
import { NgForm } from '@angular/forms';
// types

// services
import { TypeGeneratorService } from './type-generator.service';

@Component({
    selector: 'type-generator',
    templateUrl: './type-generator.template.html',
    styleUrls: ['./type-generator.css'],
    providers: [
        TypeGeneratorService
    ]
})
export class TypeGeneratorComponent implements OnInit {
    private user: string = 'anon';
    public viewData: {
        entityList: string[]
    } = {
        entityList: []
    };
    public services: {
        typeGenerator: TypeGeneratorService
    } = {
        typeGenerator: null
    };
    public model: {
        selectedEntityList: string[]
    } = {
        selectedEntityList: []
    };

    constructor(
        typeGenerator: TypeGeneratorService
    ){
        this.services.typeGenerator = typeGenerator;

        this.services.typeGenerator.getAll().then(data => {
            this.viewData.entityList = data.entities;
        });
    }

    ngOnInit(){
       
    }

    isChecked(target: string) {
        return this.model.selectedEntityList.find(s => s === target);
    }

    toggleSelection(target: string) {
        if (this.isChecked(target)) {
            this.model.selectedEntityList = this.model.selectedEntityList.filter(s => s !== target);
        } else {
            this.model.selectedEntityList.push(target);
        }
    }

    toggleSelectAll(event: Event) {
        const allChecked = event.target['checked'];
        
        this.viewData.entityList.forEach(e => {
            const toggleCase = (allChecked && !this.isChecked(e)) || (!allChecked && this.isChecked(e));
            if (toggleCase) {
                document.getElementById(e).click();
                //this.toggleSelection(e);
            }
        });
    }

    generate(){
        this.services.typeGenerator.create({ entities: this.model.selectedEntityList }).then(response => {
            const messagesContainer = document.getElementById('generator-messages');
            messagesContainer.innerHTML = response.message;
        });
    }

    check(){
        this.services.typeGenerator.check({ entities: this.model.selectedEntityList }).then(response => {
            const messagesContainer = document.getElementById('generator-messages');
            messagesContainer.innerHTML = response.message;
        });
    }
}