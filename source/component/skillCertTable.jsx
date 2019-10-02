import SkillIcon from './skill-icon';

export default class SkillCertTable extends React.Component {
	constructor(props) {
		super(props);
		this.renderHeaderCells = this.renderHeaderCells.bind(this);
		this.renderRowCells = this.renderRowCells.bind(this);
	}
	renderHeaderCells() {
		return Object.keys(this.props.data).map((s) => {
			return (<th key={s}><SkillIcon skill={s}></SkillIcon></th>);
		});
	}
	renderRowCells() {
		let data = this.props.data;
		return Object.keys(data).map((slColumn) => {
			let val = data[slColumn];
			return (<td key={slColumn} className="bold">{val}</td>);
		});
	}
	render() {
		if(Object.keys(this.props.data).length === 0) {
			return <div className="">N/A</div>;
		}
		return (<table className="mini-table skill-cert-table">
			<thead>
				<tr>{this.renderHeaderCells()}</tr>
			</thead>
			<tbody>
				<tr className={""}>{this.renderRowCells()}</tr>
			</tbody>
		</table>);
	}
}