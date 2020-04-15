import React, {useState} from 'react';

type RoutesContextProps = {
    children: React.ReactNode
}

const RoutesContext = React.createContext<any>(null)

const RoutesContextProvider: React.FC<RoutesContextProps> = ({
    children
}) => {
    const [currentPath, setCurrentPath] = useState<'classes-hierarchy' | 'classes-grid' | 'properties-grid'>(
        'classes-hierarchy'
    );

    const [treeState, setTreeState] = useState({});

    const handleChangeCurrentPath = (path: 'classes-hierarchy' | 'classes-grid' | 'properties-grid') => {
        setCurrentPath(path)
    }

    const handleChangeTreeState = (node: any, status: boolean) => {
        setTreeState(prevState => ({
            ...prevState,
            [node]: status
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