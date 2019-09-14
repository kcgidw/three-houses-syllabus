import * as Data from "./data";
import CharacterList from "./component/characterList";
import CharacterPlan from "./component/characterPlan";
import * as Roster from './roster';
import EditRosterView from './component/editRoster';
import SaveLoadView from './component/saveLoad';
import SupportSheetView from "./component/supportSheet";

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
			roster: Roster.createRoster(this.props.data.characters),
		};
		this.setView = this.setView.bind(this);
		this.getMainView = this.getMainView.bind(this);
		this.handleRosterToggle = this.handleRosterToggle.bind(this);
		this.getSortedRoster = this.getSortedRoster.bind(this);
		this.updateRoster = this.updateRoster.bind(this);
	}
	getSortedRoster() {
		return [... this.state.roster].sort((a, b) => {
			// sort by active CPs
			if(a.active && !b.active) {
				return -1;
			}
			if(!a.active && b.active) {
				return 1;
			}
			return 0;
		}, (a, b) => {
			// sort by ID
			let aData = Data.findCharData(a);
			let bData = Data.findCharData(b);
			if(aData.id < bData.id) {
				return -1;
			}
			if(aData.id > bData.id) {
				return 1;
			}
			return 0;
		});
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
	loadRosterJSON(json) {
		this.setState({
			roster: Roster.deserialize(json),
		});
	}
	render() {
		return (<div id="wrapper">
			<div id="top-header">
				<h1>Syllabus</h1>
			</div>
			<div id="left-sidebar">
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
					<CharacterList roster={this.getSortedRoster()} selected={this.state.charPlanFocus} onCharPlanSelect={(charPlan) => (this.setView(VIEWS.CHARPLAN, charPlan))}/>
				</div>
			</div>
			<div id="main">
				{this.getMainView()}
			</div>
		</div>);
	}
}

Data.loadData(function(data) {
	ReactDOM.render(<App data={data}/>, document.getElementById('root'));
});