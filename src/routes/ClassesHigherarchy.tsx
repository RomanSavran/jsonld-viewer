import React from 'react';
import TreeView from '../components/TreeView';

type ClassesHigherarchyType = {
	classesList: Array<{ [key: string]: string }>
}

const ClassesHigherarchy: React.FC<ClassesHigherarchyType> = ({
	classesList
}) => (
	<TreeView
		classesList={classesList}
	/>
)

export default ClassesHigherarchy;