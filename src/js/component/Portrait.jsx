import React from 'react';

const Portrait = ({unitName, className}) => {
	if(unitName === 'Byleth') {
		return null;
	}
	const lowercased = unitName.toLowerCase();
	return (
		<img src={`/assets/images/portraits/${lowercased}.png`} title={unitName} alt={unitName} className={className || 'portrait'}></img>
	);
};

export default Portrait;