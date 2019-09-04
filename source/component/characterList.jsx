class CharacterList extends React.Component {
	constructor(props) {
		super(props);
		this.select = this.select.bind(this);
	}

	select(char) {
		this.props.onCharPlanSelect(char);
	}

	getList() {
		return this.props.roster.map((item) => {
			let classes = 'sidebar-clickable';
			if(this.props.selected == item) {
				classes += ' selected';
			} else if(!item.active) {
				classes += ' inactive';
			}
			let selectThisChar = this.select.bind(this, item);
			return (
				<li key={item.name} className={classes} onClick={selectThisChar}>
					{item.name}
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