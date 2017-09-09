import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'combo-item',
    templateUrl: './comboItem.template.html',
    providers: [ ]
})
export class ComboItemComponent {
    public viewAddForm: boolean = false;
    @Input() inputLabel: string = 'New Item';
    @Input() buttonLabel: string = 'Add Item';
    
}