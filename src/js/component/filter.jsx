import React, { useCallback } from "react";
import {capitalize} from '../util';

const toggle = (filter, field) => {
	filter[field] = !filter[field];
	return filter;
};
const toggleTier = (filter, tier) => {
	filter.tiers[tier] = !filter.tiers[tier];
	return filter;
};

const FilterForm = (props) => {
	const {filter, changeFilter} = props;

	const makeSimpleField = (fieldName, desc, action) => {
		return <label>
			<input type="checkbox" checked={filter[fieldName]} onChange={action} />
			{desc}
		</label>;
	};
	const makeTierField = (fieldName) => {
		return <label>
			<input type="checkbox" checked={filter.tiers[fieldName] || false} onChange={() => {
				changeFilter(toggleTier(filter, fieldName));
			}} />
			{capitalize(fieldName)}
		</label>;
	};

	return <form className="filter-form">
		{makeSimpleField('pinned', 'Pinned', () => {
			changeFilter(toggle(filter, 'pinned'));
		})}
		{makeTierField('starter')}
		{makeTierField('beginner')}
		{makeTierField('intermediate')}
		{makeTierField('advanced')}
		{makeTierField('master')}
	</form>;
};

export default FilterForm;