import React from 'react';
import {Route} from 'react-router-dom';
import RouterBreadcrumbs from '../breadcrumbs';
import './page-navigation.scss';

const PageNavigation = () => {
    return (
        <div className="page-navigation">
            <div className="row">
                <div className="col-12">
                    <Route>
                        {
                            ({location}) => {
                                const pathnames = location.pathname.split('/').filter(x => x);
                                return (
                                    <RouterBreadcrumbs items={pathnames}/>
                                )
                            }
                        }
                    </Route>
                </div>
            </div>
        </div>
    )
}

export default PageNavigation;