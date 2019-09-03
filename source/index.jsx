import * as Data from "./data";
import CharacterList from "./component/characterList";
import CharacterPlan from "./component/characterPlan";
import * as Roster from './roster';
import EditRoster from './component/editRoster';

const VIEWS = {
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
		if(this.state.view === VIEWS.ROSTER) {
			return (<EditRoster roster={this.state.roster} onToggle={this.handleRosterToggle} onToggleHouse={this.handleHouseToggle.bind(this)} />);
		}
		if(this.state.view === VIEWS.CHARPLAN) {
			return (<CharacterPlan key={this.state.charPlanFocus.name} charData={Data.findCharData(this.state.charPlanFocus.name)} roster={this.state.roster} />);
		}
		return;
	}
	render() {
		return (<div id="wrapper">
			<div id="top-header" className="bg">
				<h1>Syllabus</h1>
			</div>
			<div id="left-sidebar">
				<div id="btn-roster-edit-container">
					<button className="name btn" onClick={this.viewRosterEdit}>Edit Roster</button>
				</div>
				<CharacterList roster={this.getSortedRoster()} selected={this.state.charPlanFocus} onCharPlanSelect={this.viewCharPlan}/>
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