import React from 'react';
import * as Data from './data';

export function capitalize(str) {
	return str[0].toUpperCase() + str.slice(1);
}

export function appraiseBaseGrowthRate(val) {
	if(val <= 30) {
		return 'bad';
	}
	if(val >= 50) {
		return 'good';
	}
	return 'neutral';
}
export function appraiseGrowthRateModifier(val) {
	if(val < 0) {
		return 'bad';
	}
	if(val > 0) {
		return 'good';
	}
	return 'neutral';
}
export function renderProficiency(val) {
	let res = val.split('').map((char, i) => {
		switch(char) {
			case '+':
				return <span className="good" key={i}>
					<i className="material-icons">arrow_upward</i>
				</span>;
			case '-':
				return <span className="bad" key={i}>
					<i className="material-icons">arrow_downward</i>
				</span>;
			case 'B':
				return <span className="budding" key={i}>
					<i className="material-icons">lightbulb</i>
				</span>;
			default:
				console.error(`Bad proficiency ${val}`);
		}
	});
	return res;
}
export function compareClass(dataA, dataB) {
	const tierOrder = ['basic', 'beginner', 'intermediate', 'advanced', 'master', 'event'];
	let a = tierOrder.indexOf(dataA.tier);
	let b = tierOrder.indexOf(dataB.tier);
	if(a !== b) {
		return a - b;
	}
	return dataA.name.localeCompare(dataB.name);
}
export function compareLearnable(lA, lB) {
	const order = Data.STATIC.skillCategories;
	let a = order.indexOf(lA.reqs.skillCat);
	let b = order.indexOf(lB.reqs.skillCat);
	if(a !== b) {
		return a - b;
	}
	return compareGrade(lA.reqs.grade, lB.reqs.grade);
}
export function compareGrade(gradeA, gradeB) {
	const order = Data.STATIC.grades;
	let a = order.indexOf(gradeA);
	let b = order.indexOf(gradeB);
	return a - b;
}
export function compareSupportableUnit(a, b) {
	if(a.active && !b.active) {
		return -1;
	} else if(!a.active && b.active) {
		return 1;
	}
	return a.id - b.id;
}