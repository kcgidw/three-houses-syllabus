import React from 'react';
import ReactDOM from 'react-dom';
import * as Data from "./data";
import UnitList from "./component/UnitList";
import UnitPlan from "./component/UnitPlan";
import * as Roster from './roster';
import EditRosterView from './component/EditRoster';
import SaveLoadView from './component/SaveLoad';
import SupportSheetView from "./component/SupportSheet";

const VIEWS = {
	SAVELOAD: 'SAVELOAD',
	SUPPORTS: 'SUPPORTS',
	ROSTER: 'ROSTER',
	UNIT_PLAN: 'UNIT_PLAN',
};
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			view: VIEWS.ROSTER,
			unitPlanFocus: undefined,
			roster: Roster.createRoster(this.props.data.units, this.props.savedRoster),
			sidebarHidden: window.matchMedia(`(max-width:1024px)`).matches,
		};
		this.toggleSidebar = this.toggleSidebar.bind(this);
		this.setView = this.setView.bind(this);
		this.getViewTitle = this.getViewTitle.bind(this);
		this.getMainView = this.getMainView.bind(this);
		this.handleRosterToggle = this.handleRosterToggle.bind(this);
		this.updateRoster = this.updateRoster.bind(this);
	}
	componentDidUpdate(prevProps) {
		if(localStorage.getItem('save') != JSON.stringify(this.state.roster)) {
			console.log('saving');
			localStorage.setItem('save', JSON.stringify(this.state.roster));
		}
	}
	setView(view, unitPlanFocus) {
		this.setState({
			unitPlanFocus: unitPlanFocus,
			view: view,
		});
	}
	handleRosterToggle(unitPlan) {
		this.setState({
			roster: Roster.setUnitPlanActive(this.state.roster, unitPlan),
		});
	}
	handleHouseToggle(house) {
		this.setState({
			roster: Roster.toggleHouseActive(this.state.roster, house),
		});
	}
	updateRoster(newRoster) {
		this.setState({
			roster: newRoster
		});
	}
	getViewTitle() {
		switch (this.state.view) {
			case VIEWS.SAVELOAD:
				return `Save / Load`;
			case VIEWS.SUPPORTS:
				return `Supports`;
			case VIEWS.ROSTER:
				return `Edit Roster`;
			case VIEWS.UNIT_PLAN:
				return this.state.unitPlanFocus.name;
			default:
				throw 'Bad view';
		}
	}
	getMainView() {
		switch (this.state.view) {
			case VIEWS.SAVELOAD:
				return (<SaveLoadView roster={this.state.roster} loadRosterJSON={this.loadRosterJSON.bind(this)} />);
			case VIEWS.SUPPORTS:
				return (<SupportSheetView roster={this.state.roster} />);
			case VIEWS.ROSTER:
				return (<EditRosterView roster={this.state.roster} onToggle={this.handleRosterToggle} onToggleHouse={this.handleHouseToggle.bind(this)} />);
			case VIEWS.UNIT_PLAN:
				return (<UnitPlan key={this.state.unitPlanFocus.name} unitData={Data.findUnitData(this.state.unitPlanFocus.name)} roster={this.state.roster} updateRoster={this.updateRoster.bind(this)} />);
			default:
				throw 'Bad view';
		}
	}
	toggleSidebar() {
		this.setState({
			sidebarHidden: !this.state.sidebarHidden
		});
	}
	loadRosterJSON(json) {
		this.setState({
			roster: JSON.parse(json)
		});
	}
	render() {
		return (<div id="wrapper">

			<div id="left-sidebar" className={(this.state.sidebarHidden ? 'hidden' : '')}>
				<div id="sidebar-title">
					<h1>Syllabus</h1>
				</div>
				<div id="sidebar-menus">
					<h4>Menu</h4>
					<ul>
						<li className={"sidebar-clickable" + (this.state.view === VIEWS.SAVELOAD ? " selected" : "")} onClick={() => this.setView(VIEWS.SAVELOAD)}>Save/Load</li>
						<li className={"sidebar-clickable" + (this.state.view === VIEWS.SUPPORTS ? " selected" : "")} onClick={() => this.setView(VIEWS.SUPPORTS)} roster={this.state.roster}>Support Sheet</li>
						<li className={"sidebar-clickable" + (this.state.view === VIEWS.ROSTER ? " selected" : "")} onClick={() => this.setView(VIEWS.ROSTER)}>Edit Roster</li>
					</ul>
				</div>
				<div id="sidebar-units">
					<h4>Unit</h4>
					<UnitList roster={Roster.sortByActive(this.state.roster)} selected={this.state.unitPlanFocus} onUnitPlanSelect={(unitPlan) => (this.setView(VIEWS.UNIT_PLAN, unitPlan))}/>
				</div>
			</div>

			<div id="sidebar-overlay" className={(this.state.sidebarHidden ? 'hide' : 'show')} onClick={this.toggleSidebar}></div>

			<div id="right-area" className={(!this.state.sidebarHidden ? 'desktop-sidebar-active' : '')}>
				<div id="top-header">
					<div className="gradient" />
					<div className="pattern" />
					<div id="top-header-content">
						<div id="top-center">
							<h1>{this.getViewTitle()}</h1>
						</div>
						<div id="top-left">
							<i className="material-icons" onClick={this.toggleSidebar}>menu</i>
						</div>
						<div id="top-right">
							<a href="https://github.com/kcgidw/three-houses-syllabus" target="_blank" id="github">Github</a>
						</div>
					</div>
				</div>
				<div id="main">
					{this.getMainView()}
				</div>
			</div>

		</div>);
	}
}

let save = (function fetchLocalStorageRoster() {
	let save = localStorage.getItem('save');
	try {
		if(save) {
			console.log('Save found');
			console.log(save);
			return JSON.parse(save);
		} else {
			console.log('No save found');
		}
	} catch(e) {
		console.error('Error loading roster. Clearing localStorage.');
		console.error('Previous localStorage: ' + save);
		localStorage.clear();
	}
})();

ReactDOM.render(<App data={Data.STATIC} savedRoster={save}/>, document.getElementById('root'));