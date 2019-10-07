import * as Data from "./data";
import CharacterList from "./component/characterList";
import CharacterPlan from "./component/characterPlan";
import * as Roster from './roster';
import EditRosterView from './component/editRoster';
import SaveLoadView from './component/saveLoad';
import SupportSheetView from "./component/supportSheet";
import classnames from "classnames";

const VIEWS = {
	SAVELOAD: 'SAVELOAD',
	SUPPORTS: 'SUPPORTS',
	ROSTER: 'ROSTER',
	CHARPLAN: 'CHARPLAN',
};
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			view: VIEWS.ROSTER,
			charPlanFocus: undefined,
			roster: Roster.createRoster(this.props.data.characters, this.props.savedRoster),
			sidebarHidden: false,
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
	setView(view, charPlanFocus) {
		this.setState({
			charPlanFocus: charPlanFocus,
			view: view,
		});
	}
	handleRosterToggle(cp) {
		this.setState({
			roster: Roster.setCharPlanActive(this.state.roster, cp),
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
			case VIEWS.CHARPLAN:
				return this.state.charPlanFocus.name;
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
			case VIEWS.CHARPLAN:
				return (<CharacterPlan key={this.state.charPlanFocus.name} charData={Data.findCharData(this.state.charPlanFocus.name)} roster={this.state.roster} updateRoster={this.updateRoster.bind(this)} />);
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
		let sidebarCns = classnames({
			'left-sidebar': true,
			'hidden': this.state.sidebarHidden,
		});

		return (<div id="wrapper">
			<div id="left-sidebar" className={(this.state.sidebarHidden && 'hidden')}>
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
					<CharacterList roster={Roster.sortByActive(this.state.roster)} selected={this.state.charPlanFocus} onCharPlanSelect={(charPlan) => (this.setView(VIEWS.CHARPLAN, charPlan))}/>
				</div>
			</div>
			<div id="sidebar-overlay" className={(!this.state.sidebarHidden && 'show')} onClick={this.toggleSidebar}></div>
			<div id="right-area" className={(!this.state.sidebarHidden && 'desktop-sidebar-active')}>
				<div id="top-header">
					<div id="top-left">
						<i className="material-icons" onClick={this.toggleSidebar}>menu</i>
					</div>
					<div className="flex-spacer"></div>
					<div id="top-center">
						<h1>{this.getViewTitle()}</h1>
					</div>
					<div className="flex-spacer"></div>
					<div id="top-right">
						<a href="https://github.com/kcgidw/three-houses-syllabus" target="_blank" id="github">Github</a>
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

Data.loadData(function(data) {
	ReactDOM.render(<App data={data} savedRoster={save}/>, document.getElementById('root'));
});