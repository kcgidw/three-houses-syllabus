class CharacterList extends React.Component {
	constructor(props) {
		super(props);
		this.select = this.select.bind(this);
	}

	select(char) {
		this.props.selectChar(char);
	}

	getList() {
		return this.props.characters.map((item) => {
			let classes = 'name';
			if(this.props.selected == item) {
				classes += ' selected';
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