import * as Data from "./data";
import CharacterList from "./component/characterList";
import CharacterPlan from "./component/characterPlan";
import * as Roster from './roster';
import EditRosterView from './component/editRoster';
import SaveLoadView from './component/saveLoad';

const VIEWS = {
	SAVELOAD: 'SAVELOAD',
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
		this.viewSaveLoad = this.viewSaveLoad.bind(this);
		this.viewCharPlan = this.viewCharPlan.bind(this);
		this.viewRosterEdit = this.viewRosterEdit.bind(this);
		this.getMainView = this.getMainView.bind(this);
		this.handleRosterToggle = this.handleRosterToggle.bind(this);
		this.getSortedRoster = this.getSortedRoster.bind(this);
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
	viewSaveLoad() {
		this.setState({
			view: VIEWS.SAVELOAD,
			charPlanFocus: undefined,
		});
	}
	viewRosterEdit() {
		this.setState({
			view: VIEWS.ROSTER,
			charPlanFocus: undefined,
		});
	}
	viewCharPlan(charPlan) {
		this.setState({
			charPlanFocus: charPlan,
			view: VIEWS.CHARPLAN,
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
	getMainView() {
		switch (this.state.view) {
			case VIEWS.SAVELOAD:
				return (<SaveLoadView roster={this.state.roster}/>);
			case VIEWS.ROSTER:
				return (<EditRosterView roster={this.state.roster} onToggle={this.handleRosterToggle} onToggleHouse={this.handleHouseToggle.bind(this)} />);
			case VIEWS.CHARPLAN:
				return (<CharacterPlan key={this.state.charPlanFocus.name} charData={Data.findCharData(this.state.charPlanFocus.name)} roster={this.state.roster} />);
			default:
				throw 'Bad view';
		}
	}
	render() {
		return (<div id="wrapper">
			<div id="top-header">
				<h1>Syllabus</h1>
			</div>
			<div id="left-sidebar">
				<div id="sidebar-menus">
					<h3 className="sidebar-header">MENU</h3>
					<ul>
						<li className={"sidebar-clickable" + (this.state.view === VIEWS.SAVELOAD ? " selected" : "")} onClick={this.viewSaveLoad}>Save/Load</li>
						<li className={"sidebar-clickable" + (this.state.view === VIEWS.ROSTER ? " selected" : "")} onClick={this.viewRosterEdit}>Edit Roster</li>
					</ul>
				</div>
				<div id="sidebar-units">
					<h3 className="sidebar-header">UNIT</h3>
					<CharacterList roster={this.getSortedRoster()} selected={this.state.charPlanFocus} onCharPlanSelect={this.viewCharPlan}/>
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