class CharacterList extends React.Component {
	constructor(props) {
		super(props);
		this.select = this.select.bind(this);
	}

	select(charPlan) {
		this.props.onCharPlanSelect(charPlan);
	}

	getList() {
		return this.props.roster.map((charPlan) => {
			let classes = 'sidebar-clickable';
			if (this.props.selected == charPlan) {
				classes += ' selected';
			} else if (!charPlan.active) {
				classes += ' inactive';
			}
			let selectThisChar = this.select.bind(this, charPlan);
			return (
				<li key={charPlan.name} className={classes} onClick={selectThisChar}>
					{charPlan.name}
				</li>);
		});
	}

	render() {
		return (
			<div className="characters">
				<ul>
					{this.getList()}
				</ul>
			</div>
		);
	}
}

export default CharacterList;