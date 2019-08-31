import * as Data from '../data';
import * as Util from '../util';

class Character extends React.Component {
	constructor(props) {
		super(props);
		this.getTableColumns = this.getTableColumns.bind(this);
		this.getGrowths = this.getGrowths.bind(this);
	}
	getTableColumns() {
		return Data.DATA.stats.map((s) => {
			return (<th key={s}>{Util.capitalize(s)}</th>);
		});
	}
	getGrowths() {
		let growths = this.props.charData.growths;
		return Object.keys(growths).map((g) => {
			return (<td key={g}>{growths[g]}</td>);
		});
	}
	render() {
		return (<div>
			<div id="character-name" className="name">
				<h1>{this.props.charData.name}</h1>
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
		</div>);
	}
}

export default Character;