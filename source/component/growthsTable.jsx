import * as Data from '../data';
import * as Util from '../util';

export default class GrowthsTable extends React.Component {
	constructor(props) {
		super(props);
		this.renderHeaderCells = this.renderHeaderCells.bind(this);
		this.renderRowCells = this.renderRowCells.bind(this);
	}
	renderHeaderCells() {
		return Data.STATIC.stats.map((s) => {
			return (<th key={s}>{Util.capitalize(s)}</th>);
		});
	}
	renderRowCells() {
		let growths = this.props.growths;
		return Object.keys(growths).map((g) => {
			let val = growths[g];
			let classes = Util.getGrowthClassName(val);
			return (<td key={g} className={classes}>{val}</td>);
		});
	}
	render() {
		return (<table>
			<thead>
				<tr>{this.renderHeaderCells()}</tr>
			</thead>
			<tbody>
				<tr className="number">{this.renderRowCells()}</tr>
			</tbody>
		</table>);
	}
}