import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'combo-item',
    templateUrl: './comboItem.template.html',
    providers: [ ]
})
export class ComboItemComponent {
    public viewAddForm: boolean = false;
    public value: string;
    public addLabel: string = '+';
    @Input() addNewItem: Function;
    @Input() name: string;
    @Input() inputLabel: string = 'New Item';
    @Input() buttonLabel: string = 'Add Item';

    /* TODO: template does not have custom name/id */
    // TODO: input needs to be focused when displayed
    // TODO: add optional validation for duplicated item value (needs a reference list)

    toggleView(){
        this.viewAddForm = !this.viewAddForm;
        this.addLabel = this.viewAddForm ? '-' : '+';
        return false;
    }

    onNewItem(value: string){
        this.addNewItem(value);
        this.value = '';
        return this.toggleView();
    }
}