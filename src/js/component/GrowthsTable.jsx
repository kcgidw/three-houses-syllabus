import React from 'react';
import * as Data from '../data';
import * as Util from '../util';

const TABLE_TYPE = {
	BASE: 'BASE',
	MODIFIER: 'MODIFIER',
};

const HEADER_CELLS = Data.STATIC.stats.map((s) => {
	return (<th key={s}>{Util.capitalize(s)}</th>);
});

export default class GrowthsTable extends React.Component {
	constructor(props) {
		super(props);
		this.renderRowCells = this.renderRowCells.bind(this);
	}
	renderRowCells() {
		let growths = this.props.growths;
		return Data.STATIC.stats.map((gColumn) => {
			let val = growths[gColumn];
			let classes;
			if(this.props.tableType === TABLE_TYPE.BASE) {
				classes = Util.appraiseBaseGrowthRate(val);
			} else if(this.props.tableType === TABLE_TYPE.MODIFIER) {
				classes = Util.appraiseGrowthRateModifier(val);
			}
			return (<td key={gColumn} className={classes}>{val}</td>);
		});
	}
	render() {
		return (<table className="mini-table growths-table">
			<thead>
				<tr>{HEADER_CELLS}</tr>
			</thead>
			<tbody>
				<tr className="bold">{this.renderRowCells()}</tr>
			</tbody>
		</table>);
	}
}