import React from 'react';
import cn from 'classnames';
class UnitList extends React.Component {
	constructor(props) {
		super(props);
		this.listUnits = this.listUnits.bind(this);
	}

	listUnits() {
		return this.props.roster.map((unitPlan) => {
			let cns = cn({
				'sidebar-clickable': true,
				'selected': this.props.selected === unitPlan,
				'inactive': !unitPlan.active,
			});

			return (
				<li key={unitPlan.name} className={cns} onClick={() => {
					this.props.onUnitPlanSelect(unitPlan);
				}}>
					{unitPlan.name}
				</li>);
		});
	}

	render() {
		return (
			<div className="units">
				<ul>
					{this.listUnits()}
				</ul>
			</div>
		);
	}
}

export default UnitList;