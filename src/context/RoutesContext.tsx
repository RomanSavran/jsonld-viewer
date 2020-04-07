import React from 'react';

type RoutesContext = {
    currentPath: 'classes-hierarchy' | 'classes-grid' | 'properties-grid',
    handleChangeCurrentPath: (path: 'classes-hierarchy' | 'classes-grid' | 'properties-grid') => void
}

const RoutesContext = React.createContext<RoutesContext>({
    currentPath: 'classes-hierarchy',
    handleChangeCurrentPath: () => {},
});

export {RoutesContext};