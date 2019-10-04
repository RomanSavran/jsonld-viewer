import React from 'react';
import {withGlobalState} from '../hoc-helpers';

const DetailsView = (props) => {
    const {leftData, rightData, value: {width}} = props;

    return (
        <div className="row">
            {
                leftData && width > 992 ? (
                    <>
                        <div className="col-sm-3">
                            {leftData}
                        </div>
                        <div className="col-sm-9">
                            {rightData}
                        </div>
                    </>
                ) : (
                    <div className="col-sm-12">
                        {rightData}
                    </div>
                )
            }
        </div>
    )
}

export default withGlobalState(DetailsView);