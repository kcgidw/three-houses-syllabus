import React from 'react';
import cn from 'classnames';
class CharacterList extends React.Component {
	constructor(props) {
		super(props);
		this.listCharacters = this.listCharacters.bind(this);
	}

	listCharacters() {
		return this.props.roster.map((charPlan) => {
			let cns = cn({
				'sidebar-clickable': true,
				'selected': this.props.selected === charPlan,
				'inactive': !charPlan.active,
			});

			return (
				<li key={charPlan.name} className={cns} onClick={() => {
					this.props.onCharPlanSelect(charPlan);
				}}>
					{charPlan.name}
				</li>);
		});
	}

	render() {
		return (
			<div className="characters">
				<ul>
					{this.listCharacters()}
				</ul>
			</div>
		);
	}
}

export default CharacterList;