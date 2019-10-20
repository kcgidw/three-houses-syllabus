import React from 'react';

const StarButton = (props) => {
	return <button className={"star-btn " + (props.active && 'active')} onClick={props.onClick}>
		<i className='material-icons'>star</i>
	</button>;
};
export default StarButton;