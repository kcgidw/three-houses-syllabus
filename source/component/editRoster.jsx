import * as Data from '../data';
import * as Util from '../util';
import * as Roster from '../roster';

class EditRoster extends React.Component {
	constructor(props) {
		super(props);
		this.getHouseCharPlans = this.getHouseCharPlans.bind(this);
		this.renderSublist = this.renderSublist.bind(this);
	}
	getHouseCharPlans(house) {
		let arr = Roster.filterByHouse(this.props.roster, house);
		return arr.map((cp) => {
			let className = 'roster-char-toggle';
			if(cp.active) {
				className += ' active';
			}
			return (<li key={cp.name}>
				<div className={className} onClick={(e) => {this.props.onToggle(cp);}}>
					{cp.name}
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
		}
		return (<div className="roster-sublist">
			<h2 className={house}>{title}</h2>
			<button className="btn tert house-toggler" onClick={(e) => {this.props.onToggleHouse(house);}}>Toggle All</button>
			<ol>{this.getHouseCharPlans(house)}</ol>
		</div>);
	}
	render() {
		return (<div id="edit-roster-card" className="main-card">
			<div className="main-card-header">
				<h1>Edit Roster</h1>
			</div>
			<div id="edit-roster-content" className="main-card-body main-card-content">
				{this.renderSublist('be')}
				{this.renderSublist('bl')}
				{this.renderSublist('gd')}
				{this.renderSublist('seiros')}
			</div>
		</div>);
	}
}

export default EditRoster;