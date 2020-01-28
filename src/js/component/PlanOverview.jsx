import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import * as Data from '../data';
import { LEARNABLE_TYPE } from '../enum';
import localize from '../l10n';
import * as Roster from '../roster';
import * as Util from '../util';
import cn from 'classnames';
import ClassCard from './ClassCard';
import ClassList from './ClassList';
import GrowthsTable from './GrowthsTable';
import SkillIcon from './SkillIcon';
import SkillLevelsTable from './SkillLevelsTable';
import StarButton from './Star';

const PlanOverview = (props) => {
	let name;
	return (
		<div class="plan-overview">
			<div class="plan-overview-header">
				<div class="plan-overview-name">{name}</div>
				<div class="plan-overview-unit-btn">Unit</div>
			</div>
			<ol class="plan-overview-class-list">

			</ol>
			<ol class="plan-overview-skill-list">

			</ol>
		</div>
	);
};
export default PlanOverview;