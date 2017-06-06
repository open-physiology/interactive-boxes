import $ from '../libs/jquery.js';
import Tool from './Tool';

export class HelperTool extends Tool {
	
	showPoint(point, attrs) {
		
		point = point.in(this.coach.root.svg.main);
		
		console.info(...point.in(this.coach.root.svg.children).xy);
		
		let center = $.svg('<circle>').attr({
			...point.obj('cx', 'cy'),
			r: 5,
			fill: 'red',
			stroke: 'black',
			...attrs
		}).css({
			'pointer-events': 'none'
		}).appendTo(this.coach.root.svg.main);
		
		setTimeout(::center.remove, 500);
		
	}
	
}
