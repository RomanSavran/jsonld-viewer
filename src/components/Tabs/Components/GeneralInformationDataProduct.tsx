import React from 'react';
import {
	makeStyles,
	createStyles,
	Theme
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Error404 from '../../Errors/Error404';
import URI from '../../URI';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		h2: {
			fontSize: 30,
			fontWeight: 600,
            lineHeight: '37px',
            color: '#fff',
			textTransform: 'capitalize',
			[theme.breakpoints.down('md')]: {
				fontSize: 19
			}
		},
		itemTitle: {
			margin: 0,
			marginRight: 10,
			marginBottom: 20,
			fontSize: 23,
			fontWeight: 600,
			lineHeight: '28px',
			[theme.breakpoints.down('md')]: {
				fontSize: 18
			}
		},
		tableDescription: {
			margin: 0,
			fontSize: 18,
			marginBottom: 25,
			[theme.breakpoints.down('md')]: {
				marginBottom: 10,
				fontSize: 14
			}
        },
        descriptionWrapper: {
            display: 'flex',
            flexWrap: 'wrap'
        },
        descriptionItem: {
            width: '49%',
            marginRight: '2%',
            marginBottom: '2%',
            padding: '20px 15px',
            background: 'rgb(235, 240, 248)',
            boxSizing: 'border-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            '&:nth-child(2n)': {
                marginRight: 0
            },
            [theme.breakpoints.down('md')]: {
                width: '100%',
                marginRight: 0,
                marginBottom: 15,
                padding: 10,
            }
        },
        text: {
            margin: 0,
            fontSize: 14,
            color: 'rgb(49, 49, 49)'
        },
	}),
);

type GeneralInformationDataProductTypes = {
	id: string,
	data?: any,
	uriList?: any
}

const GeneralInformationDataProduct: React.FC<GeneralInformationDataProductTypes> = ({
    id,
    data,
    uriList
}) => {
	const classes = useStyles();
	const { t } = useTranslation();	
	if (!data) return <Error404 />

	return (
        <div>
            <h2 className={classes.h2}>{id}</h2>
            <div className={classes.descriptionWrapper}>
                <div className={classes.descriptionItem}>
                    <URI uri={uriList}/>
                </div>
                <div className={classes.descriptionItem}>
                    <h4 className={classes.itemTitle}>{t("Description")}</h4>
                    <p className={classes.text}>{data.comment}</p>
                </div>
            </div>
            
        </div>
	)
}

export default React.memo(GeneralInformationDataProduct);