import React from 'react';
import { cloneDeep } from 'lodash';
import { NavLink } from 'react-router-dom';

function buildClasses(dataList) {
    let result = [];
    let copyArray = cloneDeep(dataList);
    copyArray.forEach(item => {
        const [match] = item['subClassOf'].split(':');

        if (match === 'dli' || match === 'rdfs') {
            result = [...result, item['subClassOf']]
        }
    })

    const fullDataMap = new Map(copyArray.map(item => [item['@id'], item]));
    const interimMap = new Map(result.map(item => [item, []]));

    for (let item of fullDataMap.values()) {
        const [match] = item['subClassOf'].split(':');

        if (match === 'dli' || match === 'rdfs') {
            interimMap.set(item['subClassOf'], [...interimMap.get(item['subClassOf']), item]);
            continue;
        }

        const parent = fullDataMap.get(item['subClassOf']);
        parent.children = [...parent.children || [], item];
    }

    const mapObj = Object.fromEntries(interimMap)

    return Object.keys(mapObj).map(item => {
        return {
            '@id': item,
            'children': mapObj[item]
        }
    })
}

function render(array, parent, toggleViewObj, toggleViewHandler) {
    return array.sort((a, b) => a['@id'] > b['@id'] ? 1 : -1).map((el, idx) => {

        const [match, elName] = el['@id'].split(':');
        let url = `${parent}/${elName}`;

        if (el['subClassOf'] !== 'dli:Role' && !parent.includes('Identity')) {
            url = `${parent}/Identity/${elName}`;
        } else if (el['subClassOf'] === 'dli:Role' && !parent.includes('Link')) {
            url = `${parent}/Link/${elName}`;
        }

        if (match === 'dli' || match === 'rdfs') {
            url = `${parent}`;

            if (!toggleViewObj[idx + 1]) {
                return (
                    <li key={el['@id']}>
                        <span className="checker" onClick={() => toggleViewHandler(idx + 1)}>+</span>
                        <span className="expand">
                            <svg width="27" height="12" viewBox="0 0 27 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.280396 6.83429H16.8326" stroke="#A4A5A7" />
                                <path d="M20.9744 2.19993H24.9306C25.09 2.19993 25.2427 2.26322 25.3554 2.37587C25.468 2.48853 25.5313 2.64132 25.5313 2.80063V3.40133H14.7188V1.59923C14.7188 1.43992 14.782 1.28713 14.8947 1.17448C15.0073 1.06182 15.1601 0.998535 15.3195 0.998535H19.773L20.9744 2.19993ZM14.771 4.60273H25.4791C25.5622 4.60269 25.6444 4.6199 25.7205 4.65327C25.7966 4.68664 25.865 4.73544 25.9213 4.79658C25.9776 4.85773 26.0206 4.92989 26.0475 5.0085C26.0745 5.08711 26.0849 5.17046 26.078 5.25329L25.577 11.2603C25.5645 11.4104 25.496 11.5503 25.3852 11.6523C25.2744 11.7544 25.1293 11.811 24.9787 11.8111H15.2714C15.1208 11.811 14.9757 11.7544 14.8649 11.6523C14.754 11.5503 14.6856 11.4104 14.6731 11.2603L14.1721 5.25329C14.1652 5.17046 14.1756 5.08711 14.2026 5.0085C14.2295 4.92989 14.2725 4.85773 14.3288 4.79658C14.3851 4.73544 14.4535 4.68664 14.5296 4.65327C14.6057 4.6199 14.6879 4.60269 14.771 4.60273Z" />
                            </svg>
                        </span>
                        <span className="content">
                            <span className="disabled">{el['@id']}</span>
                        </span>
                    </li>
                )
            }

            return (
                <li key={el['@id']}>
                    <span className="checker on" onClick={() => toggleViewHandler(idx + 1)}>-</span>
                    <span className="expand">
                        <svg width="27" height="12" viewBox="0 0 27 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.280396 6.83429H16.8326" stroke="#A4A5A7" />
                            <path d="M20.9744 2.19993H24.9306C25.09 2.19993 25.2427 2.26322 25.3554 2.37587C25.468 2.48853 25.5313 2.64132 25.5313 2.80063V3.40133H14.7188V1.59923C14.7188 1.43992 14.782 1.28713 14.8947 1.17448C15.0073 1.06182 15.1601 0.998535 15.3195 0.998535H19.773L20.9744 2.19993ZM14.771 4.60273H25.4791C25.5622 4.60269 25.6444 4.6199 25.7205 4.65327C25.7966 4.68664 25.865 4.73544 25.9213 4.79658C25.9776 4.85773 26.0206 4.92989 26.0475 5.0085C26.0745 5.08711 26.0849 5.17046 26.078 5.25329L25.577 11.2603C25.5645 11.4104 25.496 11.5503 25.3852 11.6523C25.2744 11.7544 25.1293 11.811 24.9787 11.8111H15.2714C15.1208 11.811 14.9757 11.7544 14.8649 11.6523C14.754 11.5503 14.6856 11.4104 14.6731 11.2603L14.1721 5.25329C14.1652 5.17046 14.1756 5.08711 14.2026 5.0085C14.2295 4.92989 14.2725 4.85773 14.3288 4.79658C14.3851 4.73544 14.4535 4.68664 14.5296 4.65327C14.6057 4.6199 14.6879 4.60269 14.771 4.60273Z" />
                        </svg>
                    </span>
                    <span className="disabled">{el['@id']}</span>
                    <ul>
                        {render(el['children'], parent, toggleViewObj, toggleViewHandler)}
                    </ul>
                </li>
            )
        }

        if (el['@id'] === 'pot:Class') {
            return (
                <li key={el['@id']}>
                    <span className="expand">
                        <svg width="27" height="12" viewBox="0 0 27 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.280396 6.83429H16.8326" stroke="#A4A5A7" />
                            <path d="M20.9744 2.19993H24.9306C25.09 2.19993 25.2427 2.26322 25.3554 2.37587C25.468 2.48853 25.5313 2.64132 25.5313 2.80063V3.40133H14.7188V1.59923C14.7188 1.43992 14.782 1.28713 14.8947 1.17448C15.0073 1.06182 15.1601 0.998535 15.3195 0.998535H19.773L20.9744 2.19993ZM14.771 4.60273H25.4791C25.5622 4.60269 25.6444 4.6199 25.7205 4.65327C25.7966 4.68664 25.865 4.73544 25.9213 4.79658C25.9776 4.85773 26.0206 4.92989 26.0475 5.0085C26.0745 5.08711 26.0849 5.17046 26.078 5.25329L25.577 11.2603C25.5645 11.4104 25.496 11.5503 25.3852 11.6523C25.2744 11.7544 25.1293 11.811 24.9787 11.8111H15.2714C15.1208 11.811 14.9757 11.7544 14.8649 11.6523C14.754 11.5503 14.6856 11.4104 14.6731 11.2603L14.1721 5.25329C14.1652 5.17046 14.1756 5.08711 14.2026 5.0085C14.2295 4.92989 14.2725 4.85773 14.3288 4.79658C14.3851 4.73544 14.4535 4.68664 14.5296 4.65327C14.6057 4.6199 14.6879 4.60269 14.771 4.60273Z" />
                        </svg>
                    </span>
                    <span className="disabled">{el['@id']}</span>
                </li>
            )
        }

        if (!('children' in el)) {
            return (
                <li key={el['@id']} >
                    <div className="catch-active-wrapper">
                        <NavLink to={url} exact>{`:${elName}`}</NavLink>
                        <span className="expand">
                            <svg width="26" height="14" viewBox="0 0 26 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.642944 6.64478H13.9595" stroke="#A4A5A7" />
                                <path d="M13.9596 7.14023H25.8696V12.6011C25.8696 12.9657 25.5752 13.2615 25.2126 13.2615H14.6166C14.5301 13.2613 14.4445 13.2441 14.3646 13.2108C14.2848 13.1775 14.2123 13.1288 14.1513 13.0675C14.0902 13.0061 14.0419 12.9334 14.009 12.8534C13.9761 12.7734 13.9593 12.6876 13.9596 12.6011L13.9596 7.14023ZM13.9596 0.68848C13.9596 0.323902 14.254 0.0281372 14.6166 0.0281372H25.2126C25.5752 0.0281372 25.8696 0.32324 25.8696 0.68848V6.14496H13.9596L13.9596 0.68848ZM17.9296 2.01314V3.33647H21.8996V2.01314H17.9296ZM17.9296 9.29147V10.6148H21.8996V9.29147H17.9296Z" />
                            </svg>
                        </span>
                    </div>
                </li>
            )
        }

        if (el['skip']) {
            return (
                render(el['children'], url, toggleViewObj, toggleViewHandler)
            )
        }

        return (
            <li key={el['@id']}>
                <div className="catch-active-wrapper">
                    <NavLink to={url} exact>{`:${elName}`}</NavLink>
                    <span className="expand">
                        <svg width="26" height="14" viewBox="0 0 26 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.642944 6.64478H13.9595" stroke="#A4A5A7" />
                            <path d="M13.9596 7.14023H25.8696V12.6011C25.8696 12.9657 25.5752 13.2615 25.2126 13.2615H14.6166C14.5301 13.2613 14.4445 13.2441 14.3646 13.2108C14.2848 13.1775 14.2123 13.1288 14.1513 13.0675C14.0902 13.0061 14.0419 12.9334 14.009 12.8534C13.9761 12.7734 13.9593 12.6876 13.9596 12.6011L13.9596 7.14023ZM13.9596 0.68848C13.9596 0.323902 14.254 0.0281372 14.6166 0.0281372H25.2126C25.5752 0.0281372 25.8696 0.32324 25.8696 0.68848V6.14496H13.9596L13.9596 0.68848ZM17.9296 2.01314V3.33647H21.8996V2.01314H17.9296ZM17.9296 9.29147V10.6148H21.8996V9.29147H17.9296Z" />
                        </svg>
                    </span>
                </div>
                <ul>
                    {render(el['children'], url, toggleViewObj, toggleViewHandler)}
                </ul>
            </li>
        )
    })
}

export { buildClasses, render }