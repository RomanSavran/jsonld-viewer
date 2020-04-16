import React, {useState} from 'react';
import {useLocation} from 'react-router-dom';

type RoutesContextProps = {
    children: React.ReactNode
}

function createPathObject(path: string, status: boolean) {
    return path
        .split('/')
        .filter(s => (
			!['', 'v1', 'context', 'classdefinitions', 'vocabulary', 'schema'].includes(s.toLowerCase())
		))
		.reduce((acc, current, index, array) => {
			return {
				...acc,
				[current]: array.length - 1 === index ? status : true
			}
        }, {});
}

const RoutesContext = React.createContext<any>(null)

const RoutesContextProvider: React.FC<RoutesContextProps> = ({
    children
}) => {
    const [currentPath, setCurrentPath] = useState<'classes-hierarchy' | 'classes-grid' | 'properties-grid'>(
        'classes-hierarchy'
    );

    const location = useLocation();

    const pathObject = createPathObject(location.pathname, false)
        
    const [treeState, setTreeState] = useState(pathObject);

    const handleChangeCurrentPath = (path: 'classes-hierarchy' | 'classes-grid' | 'properties-grid') => {
        setCurrentPath(path)
    }

    const handleChangeTreeState = (node: any, status: boolean = false) => {
        const newState = createPathObject(node, status);
        setTreeState(prevState => ({
            ...prevState,
            ...newState
        }))
    }

    return (
        <RoutesContext.Provider
            value={{
                treeState,
                handleChangeTreeState,
                currentPath,
                handleChangeCurrentPath
            }}
        >
            {children}
        </RoutesContext.Provider>
    )
}

export {
    RoutesContext,
    RoutesContextProvider,
};