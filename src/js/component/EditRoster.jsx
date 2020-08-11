import React from 'react';
import * as Roster from '../roster';

class EditRoster extends React.Component {
	constructor(props) {
		super(props);
		this.getHouseUnitPlans = this.getHouseUnitPlans.bind(this);
		this.renderSublist = this.renderSublist.bind(this);
	}
	getHouseUnitPlans(house) {
		let arr = Roster.filterByHouse(this.props.roster, house);
		return arr.map((uPlan) => {
			let className = 'roster-unit-toggle';
			if(uPlan.active) {
				className += ' active';
			}
			return (<li key={uPlan.name}>
				<div className={className} onClick={(e) => {this.props.onToggle(uPlan);}}>
					{uPlan.name}
				</div>
			</li>);
		});
	}
	renderSublist(house) {
		let title;
		switch(house) {
			case 'be':
				title = 'Black Eagles';
				break;
			case 'bl':
				title = 'Blue Lions';
				break;
			case 'gd':
				title = 'Golden Deer';
				break;
			case 'seiros':
				title = 'Seiros';
				break;
			case 'aw':
				title = 'Ashen Wolves';
				break;
		}
		return (<div className="roster-sublist">
			<h2 className={house}>{title}</h2>
			<button className="btn tert house-toggler" onClick={(e) => {this.props.onToggleHouse(house);}}>Toggle All</button>
			<ol>{this.getHouseUnitPlans(house)}</ol>
		</div>);
	}
	render() {
		return (<div id="edit-roster-card" className="main-card">
			<div id="edit-roster-content" className="main-card-body main-card-content">
				{this.renderSublist('be')}
				{this.renderSublist('bl')}
				{this.renderSublist('gd')}
				{this.renderSublist('seiros')}
				{this.renderSublist('aw')}
			</div>
		</div>);
	}
}

export default EditRoster;