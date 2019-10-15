import React from 'react';
import SkillIcon from './skillIcon';

const renderHeaderCells = (classData) => {
	return classData.relatedSkills.map((s) => {
		return (<th key={s}><SkillIcon skill={s}></SkillIcon></th>);
	});
};
const renderRowCells = (classData, field) => {
	return classData.relatedSkills.map((skill) => {
		return (<td key={field+':'+skill} className="bold">{classData[field][skill] || '-'}</td>);
	});
};

const SkillCertTable = ({classData}) => {

	if(classData.relatedSkills.length === 0) {
		return <div className="">N/A</div>;
	}

	return (<table className="mini-table skill-cert-table">
		<thead>
			<tr>{renderHeaderCells(classData)}</tr>
		</thead>
		<tbody>
			<tr className={""}>{renderRowCells(classData, 'certification')}</tr>
			<tr className={""}>{renderRowCells(classData, 'skillBonus')}</tr>
		</tbody>
	</table>);
};

export default SkillCertTable;