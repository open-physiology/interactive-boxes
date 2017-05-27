import $ from 'jquery';
import {NgModule, Input, Output, ElementRef, EventEmitter} from '@angular/core';
import {ColorPickerModule} from 'angular2-color-picker'
import {FormsModule}       from '@angular/forms';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

import ExtensibleComponent from './ExtensibleComponent.js';

import KeyCode from 'keycode-js';
const {KEY_ESCAPE} = KeyCode;

/**
 * The info-panel component.
 */
const Component = ExtensibleComponent; // to get WebStorm syntax highlighting
@Component({
	selector: 'info-panel',
	styles: [`

		:host {
			display: block;
			padding: 4px;
			position: relative;
		}
		
		.header {
			display: flex;
			align-items: center;
		}
		
		.header > button {
			border: solid 1px;
			border-radius: 6px 0 0 0;
			width: 30px;
			position: absolute;
			top:  4px;
			left: 4px;
			outline: none;
			height: 19px;
		}
		
		.header >>> .ngui-auto-complete-wrapper {
			margin-left: 29px;
			width: calc(100% - 29px);
			border: none !important;
			padding: 0 !important;
			height: 19px;
		}
		
		.header input[type="text"] {
			width: 100%;
			padding-left: 3px;
			border-radius: 0 6px 0 0;
			border: solid 1px;
			font-weight: bold;
			outline: none;
			height: 19px;
		}
		
		.header input[type="text"]:focus {
			background-color: white !important;
		}
		
		.other-fields {
			border-style: none solid solid solid;
			border-width: 1px;
			border-radius: 0 0 6px 6px;
			margin-top: -8px;
			padding: 12px 4px 4px 4px;
		}
		
		.other-fields table td:nth-child(1) {
			font-size: 14px;
		}
		
		.other-fields table td:nth-child(2) {
			position: relative;
		}
		
		.other-fields table select              ,
		.other-fields table input[type="text"]  ,
		.other-fields table .input              {
			display: inline-block;
			width: 100%;
			margin: 0;
			padding: 0 2px;
			border-style: none none solid solid;
			border-width: 1px;
			background-color: transparent;
			outline: none;
		}
		
		.other-fields table .input.disabled {
			background-color: #ECEAE1 !important;
			color: gray;
			cursor: default;
		}
		
		.other-fields table .input > input[type="number"] {
			width: 2em;
			border: none;
			background-color: transparent !important;
		}
		
	`],
	template: `

		<div class="header">
		
			<button [(colorPicker)]          =" model.color                  "
					[cpPosition]             =" 'left'                       "
					[cpPositionOffset]       =" '5px'                        "
					[cpAlphaChannel]         =" 'disabled'                   "
			        [style.background-color] =" model.color                  "
			        [style.color]            =" model.contrastingColor       "
			        [style.border-color]     =" model.darkenedColor          "
			        (cpToggleChange)         =" colorPickerOpen.next($event) ">
				<span class="button-symbol">{{ symbol }}</span>
			</button>
			
			<input type="text"
			       placeholder="Name"
				   [(ngModel)]          = " model.name          "
			       [style.border-color] = " model.darkenedColor "
			       auto-complete
			       [source]       = " autoCompleteOptions "
			       (valueChanged) = " onDataSelected($event) "/>
			     
		</div>
	`
})
export class InfoPanel {
	
	get autoCompleteOptions() { return [] }
	
	get symbol() { return '' }
	
	@Input() model;
	@Input() buttonSymbol = '';
	
	@Output() colorPickerOpen = new EventEmitter;
	
	constructor({nativeElement}: ElementRef) {
		this.nativeElement = $(nativeElement);
		this.console = console;
	}
	
	ngOnInit() {
		/* when the model is selected, give a nice focus effect to the name box */
		this.model.p('selected').subscribe((s) => {
			this.nativeElement.children('input').css(
				'background-color',
				s ? 'var(--boxer-highlight-color)' : ''
			)
		});
		
		/* focus on controls --> selected model */
		this.nativeElement.focusin (() => { this.model.selected = true  });
		this.nativeElement.focusout(() => { this.model.selected = false });
		
		/* make sure the auto-complete drop-down keeps the foreground when visible */
		const defaultZIndex = this.nativeElement.css('z-index');
		this.nativeElement.focusin(() => {
			this.nativeElement.css('z-index', 100);
		});
		this.nativeElement.focusout(() => {
			this.nativeElement.css('z-index', defaultZIndex);
			this.nativeElement.find('ngui-auto-complete').hide();
		});
		
	}
	
	onDataSelected(name) {
	} // intentionally empty; override in subclass
	
	
	
}

/**
 *
 */
@NgModule({
	imports: [
		FormsModule,
		ColorPickerModule,
		NguiAutoCompleteModule
	],
	declarations: [InfoPanel],
	exports:      [
		InfoPanel,
		NguiAutoCompleteModule
	]
})
export class InfoPanelModule {}

