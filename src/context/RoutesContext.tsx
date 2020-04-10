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

    const handleChangeCurrentPath = (path: 'classes-hierarchy' | 'classes-grid' | 'properties-grid') => {
        setCurrentPath(path)
    }

    return (
        <RoutesContext.Provider
            value={{
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