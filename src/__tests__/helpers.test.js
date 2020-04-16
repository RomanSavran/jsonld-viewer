import { buildTree } from '../utils/helpers';

describe('test buildTree function', () => {
    test('test with empty array', () => {
        const mock = [];
        expect(buildTree(mock)).toEqual({});
    })

    test('test with mock data', () => {
        const mock = [
            {url: '/url1', type: 'type', id: 'children1', subClass: 'parent1, parent2'},
            {url: '/url2', type: 'type', id: 'children2', subClass: 'parent2'},
            {url: '/url3', type: 'type', id: 'children3', subClass: 'parent1'},
            {url: '/url4', type: 'type', id: 'parent1', subClass: ''},
            {url: '/url5', type: 'type', id: 'parent2', subClass: ''}
        ];

        expect(buildTree(mock)).toEqual({
            'parent2': {
                path: 'parent2',
                root: true,
                children: ['children1', 'children2']
            },
            'parent1': {
                path: 'parent1',
                root: true,
                children: ['children1', 'children3']
            },
            'children1': {
                path: '/url1',
                children: []
            },
            'children2': {
                path: '/url2',
                children: []
            },
            'children3': {
                path: '/url3',
                children: []
            }
        });
    })
});