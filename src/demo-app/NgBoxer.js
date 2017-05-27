import {NgModule, Directive, Input, Output, ElementRef, EventEmitter} from '@angular/core';

import $ from 'jquery';


import {Box, Glyph, Edge, LineSegment, BoxCorner, Canvas, Coach} from '../index.js';
import {ID_MATRIX, Point2D} from '../util/svg.js';

import {HelperTool}      from '../tools/HelperTool.js';
import {MoveTool}        from '../tools/MoveTool.js';
import {ResizeTool}      from '../tools/ResizeTool.js';
import {HighlightTool}   from '../tools/HighlightTool.js'
import {MouseCursorTool} from '../tools/MouseCursorTool.js';
import {ClickTool}       from '../tools/ClickTool';
import {RotateTool}      from '../tools/RotateTool';
import {DrawTool}        from '../tools/DrawTool';
import {DeleteTool}      from '../tools/DeleteTool';
import {SelectTool}      from '../tools/SelectTool';
import {property, which} from 'utilities';

import KeyCode from 'keycode-js';
import {LyphBox} from './LyphBox';
import {ProcessChain} from './ProcessChain';
import {ProcessNode}  from './ProcessNode';
const {KEY_ESCAPE} = KeyCode;


/**
 * The ng-boxer component.
 */
@Directive({
	selector: 'svg[ng-boxer]',
	exportAs: 'boxer'
})
export class NgBoxer extends Coach {
	
	@property({ initial: null }) toolMode;
	
	stapleTools: Set = new Set;
	toolModes:   Set = new Set;
	
	constructor({nativeElement}: ElementRef) {
		/* initialize coach with svg element */
		super({
			root: new Canvas({ svg: $(nativeElement) })
		});
		
		/* standard tools */
		this.addTool(new SelectTool     )
			.addTool(new MouseCursorTool)
			.addTool(new HighlightTool  )
			.addTool(new HelperTool     )
			.addTool(new ClickTool      )
			.addTool(new MoveTool       )
			.addTool(new ResizeTool     )
			.addTool(new RotateTool     )
			.addTool(new DeleteTool     )
			.addTool(new DrawTool({
				boxFactory:   LyphBox,
				edgeFactory:  ProcessChain,
				glyphFactory: ProcessNode
			}))
			.start();
		
		
		/* setup modes */
		this.addStapleTools(SelectTool, HighlightTool, MouseCursorTool, HelperTool);
		this.addToolMode('Manipulate', [ClickTool, MoveTool, ResizeTool, RotateTool]);
		this.addToolMode('Delete',     [DeleteTool]);
		this.addToolMode('Draw Lyph',  [DrawTool], () => { this.drawTool.mode = DrawTool.DRAWING_BOX   });
		// this.addToolMode('Draw Node',  [DrawTool], () => { this.drawTool.mode = DrawTool.DRAWING_GLYPH });
		this.addToolMode('Draw Edge',  [DrawTool], () => { this.drawTool.mode = DrawTool.DRAWING_EDGE  });
		
		/* start and escape to Manipulate */
		this.toolMode = 'Manipulate';
		this.windowE('keydown')::which(KEY_ESCAPE).subscribe(() => { this.toolMode = 'Manipulate' });
	}
	
	addStapleTools(...tools) {
		tools.forEach(::this.stapleTools.add);
	}
	
	addToolMode(label, tools, init = ()=>{}) {
		this.toolModes.add(label);
		this.p('toolMode').filter(mode => mode === label).subscribe((m) => {
			this.activateExclusiveTools([...this.stapleTools, ...tools]);
			init();
		});
	}
	
}

/**
 *
 */
@NgModule({
	declarations: [NgBoxer],
	exports:      [NgBoxer]
})
export class NgBoxerModule {}