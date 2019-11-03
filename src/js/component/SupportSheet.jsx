import React from 'react';
import * as Data from '../data';
import * as Roster from '../roster';

export default class SupportSheetView extends React.Component {
	constructor(props) {
		super(props);
	}
	renderRows() {
		return Roster.filterByActive(this.props.roster, true)
			.map((unitPlan) => {
				let unitData = Data.findUnitData(unitPlan.name);
				let activeSupports = Roster.getActiveSupports(this.props.roster, unitData);
				return (<tr key={unitPlan.name}>
					<td>
						{unitPlan.name}
					</td>
					<td>
						{activeSupports.join(', ')}
					</td>
				</tr>);
			});
	}
	render() {
		return (<div id="support-sheet" className="main-card">
			<div className="main-card-content">
				<table className="supports-table big-table">
					<tbody>
						{this.renderRows()}
					</tbody>
				</table>
			</div>
		</div>);
	}
}