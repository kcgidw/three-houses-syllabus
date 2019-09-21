import * as Data from '../data';
import * as Util from '../util';
import * as Roster from '../roster';

export default class SupportSheetView extends React.Component {
	constructor(props) {
		super(props);
	}
	renderRows() {
		return Roster.filterByActive(this.props.roster, true)
			.map((charPlan) => {
				let charData = Data.findCharData(charPlan.name);
				let activeSupports = charData.supports.filter((name) => {
					return Roster.findActiveCharPlan(this.props.roster, name);
				});
				return (<tr key={charPlan.name}>
					<td>
						{charPlan.name}
					</td>
					<td>
						{activeSupports.join(', ')}
					</td>
				</tr>);
			});
	}
	render() {
		return (<div id="support-sheet" className="main-card">
			<div className="main-card-header">
				<h1>Support Sheet</h1>
			</div>
			<div className="main-card-body">
				<div className="main-card-content">
					<table className="supports-table textual">
						<tbody>
							{this.renderRows()}
						</tbody>
					</table>
				</div>
			</div>
		</div>);
	}
}