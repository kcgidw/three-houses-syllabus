import React from 'react';
import * as Roster from '../roster';
import FilterForm from './Filter';
import ClassCard from './ClassCard';

export default class ClassList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filter: {
				pinned: false,
				unpinned: true,
				tiers: {
					'starter': false,
					'beginner': false,
					'intermediate': true,
					'advanced': true,
					'master': true,
				},
				applicableOnly: true,
			}
		};
		this.changeFilter = this.changeFilter.bind(this);
	}
	changeFilter(filter) {
		this.setState({
			filter: filter,
		});
	}
	renderClasses() {
		const filtered = Roster.filterClasses(this.props.unitPlan, this.state.filter);
		return filtered.map((cd) => {
			let name = cd.name;
			let action = () => {
				this.props.updateRoster(Roster.toggleClass(this.props.roster, this.props.unitPlan, name));
			};
			return (
				<ClassCard key={name} data={cd} handleClick={action} isPinned={Roster.hasPinnedClass(this.props.unitPlan, name)} />
			);
		});
	}
	render() {
		return (<div>
			<FilterForm filter={this.state.filter} changeFilter={this.changeFilter}></FilterForm>
			<ol className="classes-list">
				{this.props.shouldRender && this.renderClasses()}
			</ol>
		</div>);
	}
}