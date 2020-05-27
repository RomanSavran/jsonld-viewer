import React from 'react';
import {
    Grid,
    makeStyles,
    createStyles,
    Theme
} from '@material-ui/core';
import {
    LinkedIn,
    Twitter,
    Facebook,
    YouTube,
    GitHub 
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo_footer.svg';
import vastulogo from '../../assets/vastuu-logo.png';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        footer: {
            padding: 24,
            paddingTop: 100,
            background: '#fff',
        },
        container: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            [theme.breakpoints.down('sm')]: {
                flexDirection: 'column'
            }
        },
        list: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
            [theme.breakpoints.down('sm')]: {
                marginTop: 30
            }
        },
        li: {
            marginBottom: 16,
            fontWeight: 'bold',
            '&:last-child': {
                marginBottom: 0
            }
        },
        link: {
            color: "#1e1540",
            textDecoration: 'none',
            textTransform: 'uppercase',
        },
        socialNetworkList: {
            display: 'flex',
            flexWrap: 'wrap',
            margin: 0,
            padding: 0,
            listStyle: 'none',
            [theme.breakpoints.down('sm')]: {
                marginTop: 30
            }
        },
        socialNetworkLi: {
            marginRight: 5,
            '&:last-child': {
                marginRight: 0
            },
        },
        icon: {
            fontSize: '2rem',
            color: '#1E1540'
        }
    })
);

const menuListEn = [
    {
        to: 'https://platformoftrust.net/en/cases/',
        title: 'Cases'
    },
    {
        to: 'https://platformoftrust.net/en/partners/',
        title: 'Partners'
    },
    {
        to: 'https://platformoftrust.net/en/services/',
        title: 'Services'
    },
    {
        to: 'https://platformoftrust.net/en/news/',
        title: 'News'
    },
    {
        to: 'https://platformoftrust.net/en/about/',
        title: 'About'
    },
    {
        to: 'https://platformoftrust.net/en/contact/',
        title: 'Contact'
    },
    {
        to: 'https://platformoftrust.net/en/platform-trust-oy-privacy-policy/',
        title: 'Privacy Policy'
    },
    {
        to: 'https://platformoftrust.net/en/platform-trust-oy-terms-service/',
        title: 'Terms of Service'
    },
    {
        to: 'https://platformoftrust.net/en/visual-guidelines/',
        title: 'Visual Guidelines'
    },
    {
        to: 'https://platformoftrust.net/en/frequently-asked-questions/',
        title: 'Frequently Asked Questions (FAQ)'
    }
];

const menuListFi = [
    {
        to: 'https://platformoftrust.net/fi/mika/',
        title: 'TIETOA MEISTÄ'
    },
    {
        to: 'https://platformoftrust.net/fi/kayttotapaukset/',
        title: 'KÄYTTÖTAPAUKSET'
    },
    {
        to: 'https://platformoftrust.net/fi/partnerit/',
        title: 'Partnerit'
    },
    {
        to: 'https://platformoftrust.net/fi/ajankohtaista/',
        title: 'AJANKOHTAISTA'
    },
    {
        to: 'https://platformoftrust.net/fi/yhteystiedot/',
        title: 'YHTEYSTIEDOT'
    },
    {
        to: 'https://platformoftrust.net/fi/tietosuojaseloste-platform-trust-oy/',
        title: 'TIETOSUOJASELOSTA'
    },
    {
        to: 'https://platformoftrust.net/fi/platform-trust-palveluehdot/',
        title: 'PALVELUEHDOT'
    },
    {
        to: 'https://platformoftrust.net/fi/usein-kysytyt-kysymykset/',
        title: 'USEIN KYSYTYT KYSYMYKSET (UKK)'
    }
]

const socialNetworksList = [
    {
        title: 'LinkedIn',
        href: 'https://www.linkedin.com/company/platform-of-trust/',
        icon: LinkedIn
    },
    {
        title: 'Twitter',
        href: 'https://twitter.com/PlatformOfTrust',
        icon: Twitter
    },
    {
        title: 'Facebook',
        href: 'https://www.facebook.com/platformoftrust',
        icon: Facebook
    },
    {
        title: 'Youtube',
        href: 'https://www.youtube.com/channel/UCSHXKYHxBCl_hXdBZU_A-gg',
        icon: YouTube
    },
    {
        title: 'Github',
        href: 'https://github.com/PlatformOfTrust/',
        icon: GitHub
    }
]

export default function Footer() {
    const classes = useStyles();
    const {i18n} = useTranslation();

    const menuList = i18n.language === 'en' ? menuListEn : menuListFi;

    return (
        <div className={classes.footer}>
            <Grid
                container
                spacing={3}
            >
                <Grid
                    item
                    xs={12}
                >
                    <div className={classes.container}>
                        <a
                            href="http://platformoftrust.net/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                style={{ height: 150 }}
                                src={logo}
                                alt="Platform Of Trust"
                            />
                        </a>
                        <ul className={classes.list}>
                            <li className={classes.li}>Platform of Trust Oy</li>
                            <li className={classes.li}>VAT-number: FI29800052</li>
                        </ul>
                        <ul className={classes.list}>
                            {
                                menuList.map(item => {
                                    return (
                                        <li
                                            className={classes.li}
                                            key={item.title}
                                        >
                                            <a
                                                className={classes.link}
                                                href={item.to}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {item.title}
                                            </a>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <ul className={classes.list}>
                            <li className={classes.li}>
                                <a
                                    className={classes.link}
                                    href="https://platformoftrust.net/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Platform Of Trust
                                </a>
                            </li>
                            <li className={classes.li}>
                                <a
                                    className={classes.link}
                                    href="https://developer.oftrust.net/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Developer Portal
                                </a>
                            </li>
                        </ul>
                    </div>
                </Grid>
                <Grid
                    item
                    xs={12}
                >
                    <div className={classes.container}>
                        <a
                            href="https://www.vastuugroup.fi/fi-en"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img 
                                style={{width: 150}}
                                src={vastulogo}
                                alt="Vastuu Group"
                            />
                        </a>
                        <ul className={classes.socialNetworkList}>
                            {
                                socialNetworksList.map(({title, href, icon: Icon}) => {
                                    return (
                                        <li
                                            className={classes.socialNetworkLi}
                                            key={title}
                                        >
                                            <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href={href}
                                                title={title}
                                            >
                                                <Icon className={classes.icon}/>
                                            </a>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}