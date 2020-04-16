import React, { useState, useEffect } from 'react';
import SystemAPI from '../../../services/api';
import Spinner from '../../Spinner';
import { Error404 } from '../../Errors';
import ContentViewer from '../../ContentViewer';
import { useLocation } from 'react-router-dom';
import CopyTooltip from '../../CopyTooltip';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import {
    IconButton,
    makeStyles,
    createStyles,
    Theme
} from '@material-ui/core';
import DataContext from '../../../assets/custom-classes/DataContext/JSONSchema.json';
import SensorDataProductContext from '../../../assets/custom-classes/DataContext/SensorDataProductContext/JSONSchema.json';
import LtifDataProductContext from '../../../assets/custom-classes/DataContext/LtifDataProductContext/JSONSchema.json';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        itemDescription: {
            marginTop: 30,
            marginBottom: 30,
            padding: '20px 15px',
            background: 'rgb(235, 240, 248)',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        copyWrapper: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: 20
        },
        copyTitle: {
            margin: 0,
            marginRight: 10,
            fontSize: 23,
            fontWeight: 600,
            lineHeight: '28px',
            marginBottom: 0
        },
        iconButtonCopy: {
            padding: 2,
            color: 'rgb(33, 37, 41)',
            transition: '.2s linear',
            '&:hover': {
                color: 'rgb(0, 149, 255)'
            }
        },
        iconCopy: {
            width: 18,
            height: 18,
        },
        copyBtn: {
            marginRight: 10
        },
        link: {
            fontSize: 14,
            color: 'rgb(0, 149, 255)'
        },
    })
);

const JSONSchema: React.FC = () => {
    const classes = useStyles();
    const [value, setValue] = useState({
        data: {},
        loading: true,
        error: false
    });
    const location = useLocation();
    const path: string = location.pathname;
    const id: string = path
        .split('/')
        .filter(s => !!s)
        .pop() || '';
    const mainPath = path.split('Schema').pop() || '';

    useEffect(() => {
        let mounted = false;

        if (!['DataProductContext', 'SensorDataProductContext', 'LtifDataProductContext'].includes(id)) {
            SystemAPI.getData(`/v1/Schema${mainPath}`)
                .then(data => {
                    if (!mounted) {
                        if (typeof data === 'number') {
                            setValue(prevValue => ({
                                ...prevValue,
                                error: true
                            }))
                        } else {
                            setValue({
                                data,
                                loading: false,
                                error: false
                            })
                        }
                    }
                })
        } else {
            const data = id === 'DataProductContext' ? DataContext :
                id === 'SensorDataProductContext' ? SensorDataProductContext :
                    id === 'LtifDataProductContext' ? LtifDataProductContext : {};
            setValue({
                data: data,
                loading: false,
                error: false
            })
        }

        return () => {
            mounted = true;
        }
        /* eslint-disable-next-line */
    }, []);

    if (value.error) return <Error404 />
    if (value.loading && !value.error) return <Spinner />

    const uri = `https://standards-ontotest.oftrust.net/v1/Schema${mainPath}`;

    return (
        <>
            <div className={classes.itemDescription}>
                <div className={classes.copyWrapper}>
                    <h4 className={classes.copyTitle}>URI</h4>
                    <CopyTooltip
                        copyText={uri}
                        placement="right"
                    >
                        <IconButton
                            classes={{
                                root: classes.iconButtonCopy
                            }}
                        >
                            <FileCopyOutlinedIcon
                                classes={{
                                    root: classes.iconCopy
                                }}
                            />
                        </IconButton>
                    </CopyTooltip>
                </div>
                <a
                    className={classes.link}
                    href={uri}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {uri}
                </a>
            </div>
            <ContentViewer
                content={value.data}
                playground={false}
                fileName={`JSONSchema-${id}`}
            />
        </>
    )
}

export default JSONSchema;