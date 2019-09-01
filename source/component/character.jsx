import * as Data from '../data';
import * as Util from '../util';

class Character extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			supportable: this.getSupportable(),
		};
		this.getTableColumns = this.getTableColumns.bind(this);
		this.getGrowths = this.getGrowths.bind(this);
		this.getSupportable = this.getSupportable.bind(this);
	}
	getTableColumns() {
		return Data.STATIC.stats.map((s) => {
			return (<th key={s}>{Util.capitalize(s)}</th>);
		});
	}
	getGrowths() {
		let growths = this.props.charData.growths;
		return Object.keys(growths).map((g) => {
			let val = growths[g];
			let classes = Util.getGrowthClassName(val);
			return (<td key={g} className={classes}>{val}</td>);
		});
	}
	getSupportable() {
		let supportable = this.props.charData.supports;
		let res = supportable.filter((name) => {
			return this.props.roster.find((charPlan) => {
				return charPlan.name == name && charPlan.active;
			});
		});
		return res;
	}
	render() {
		return (<div>
			<div id="character-name" className="name">
				<h1>{this.props.charData.name}</h1>
			</div>
			<div id="supportable">
				<span>Supportable Allies: {this.state.supportable.length} ({this.state.supportable.join(', ')})</span>
			</div>
			<div id="character-body">
				<div id="character-goals">
					<h2>Class Goals</h2>
					<div>
						{/* <h3>Basic</h3>
						<h3>Beginner</h3>
						<h3>Intermediate</h3>
						<h3>Advanced</h3>
						<h3>Master</h3> */}
					</div>
					<h2>Skill Level Goals</h2>
				</div>
				<div id="character-growths">
					<h2>Growths</h2>
					<table>
						<thead>
							<tr>{this.getTableColumns()}</tr>
						</thead>
						<tbody>
							<tr>{this.getGrowths()}</tr>
						</tbody>
					</table>
				</div>
				<div id="character-skills">
					<h2>Skill Levels</h2>
				</div>
				<div id="character-abilities">
					<h2>Abilities</h2>
				</div>
				<div id="character-arts">
					<h2>Combat Arts</h2>
				</div>
			</div>
		</div>);
	}
}

export default Character;