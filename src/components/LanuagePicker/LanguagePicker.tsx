import React from 'react';
import {
    makeStyles,
    createStyles,
    Select,
    MenuItem,
    Theme
} from '@material-ui/core';
import { FinlandFlag, USFlag } from '../Icons';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        text: {
            display: 'block',
            marginLeft: 10,
            color: '#fff',
            textTransform: 'uppercase'
        },
        itemText: {
            color: '#000'
        },
        inputRenderRoot: {
            display: 'flex',
            alignItems: 'center'
        },
        icon: {
            color: '#fff'
        }
    })
);

type Language = {
    label: 'en' | 'fi',
    icon: React.ComponentType
}

const options: Array<{ label: 'en' | 'fi', icon: React.ComponentType }> = [
    { label: 'en', icon: USFlag },
    { label: 'fi', icon: FinlandFlag }
];

const LanguagePicker: React.FC = () => {
    const classes = useStyles();
    const {i18n} = useTranslation();

    const handleChange = (e: React.ChangeEvent<{value: unknown}>) => {
        const {value} = e.target;
        i18n.changeLanguage(value as 'en' | 'fi');
        localStorage.setItem('language', JSON.stringify(value));
    }
    
    return (
        <Select
            classes={{
                icon: classes.icon
            }}
            value={i18n.language}
            renderValue={(value: any) => {
                const element: Language  = options.find(option => option.label === value) || { label: 'en', icon: USFlag };
                const IconComponent: React.ComponentType = element.icon;

                return (
                    <div className={classes.inputRenderRoot}>
                        <IconComponent />
                        <span className={classes.text}>{element.label}</span>
                    </div>
                )
            }}
            onChange={handleChange}
            disableUnderline
        >
            {options.map(option => {
                const IconComponent: React.ComponentType = option.icon;

                return (
                    <MenuItem
                        key={option.label}
                        value={option.label}
                        className={classes.inputRenderRoot}
                    >
                        <IconComponent />
                        <span className={clsx(classes.text, classes.itemText)}>{option.label}</span>
                    </MenuItem>
                )
            })}
        </Select>
    )
};

export default LanguagePicker;