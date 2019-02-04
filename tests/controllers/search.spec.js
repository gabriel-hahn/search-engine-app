// Needs polyfill because I used async functions.
import RequestUtil from '../../src/utils/RequestUtil';
import ConfigUtil from '../../src/utils/ConfigUtil';

import 'babel-polyfill';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { jsdom } from 'jsdom';

chai.use(sinonChai);

import SearchController from '../../src/controllers/SearchController';

describe('Search', () => {
    let search;
    let requests;

    let images = [
        {
            siteUrl: 'http://www.test.com.br',
            imageUrl: 'http://www.test.com.br/image.jpg',
            alt: 'Test',
            title: 'Image Title Test',
            clicks: 0,
            broken: false
        },
        {
            siteUrl: 'http://www.test2.com.br',
            imageUrl: 'http://www.test2.com.br/image2.jpg',
            alt: 'Test 2',
            title: 'Image Title Test 2',
            clicks: 3,
            broken: false
        }
    ];

    let sites = [
        {
            url: 'http://www.test-gabriel.com',
            title: 'Gabriel Test',
            description: 'Gabriel Unit test',
            keywords: 'gabriel,test,site,mock',
            clicks: 1
        },
        {
            url: 'http://www.test2-gabriel.com',
            title: 'Gabriel Test 2',
            description: 'Gabriel Unit test 2',
            keywords: 'gabriel,test,site,mock,2',
            clicks: 13
        }
    ]

    beforeEach(() => {
        global.document = jsdom('');
        global.window = document.defaultView;

        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };

        search = new SearchController();
    });

    afterEach(() => {
        global.XMLHttpRequest.restore();
        sinon.restore();
    });

    describe('Smoke tests', () => {
        //jsdom();
        it('Should exists changeLinkSelection method', () => {
            expect(search.changeLinkSelection).to.exist;
        });

        it('Should exists startEvents method', () => {
            expect(search.startEvents).to.exist;
        });

        it('Should exists searchLinks method', () => {
            expect(search.searchLinks).to.exist;
        });

        it('Should exists setCountResults method', () => {
            expect(search.setCountResults).to.exist;
        });
    });

    describe('Request methods', () => {
        it('Should call request once', () => {
            search.searchLinks(true);
            expect(requests.length).to.be.eq(1);
        });
    });

    /*
    describe('Tabs behavior', () => {
        it('Site tab should has click event', () => {
        
        });
        
        it('Image tab should has click event', () => {
        
        });
        
        it('Should activate Site tab', () => {
            search.changeLinkSelection(true);
        });
        
        it('Should activate Image tab', () => {
            search.changeLinkSelection(false);
        });
    });*/

    describe('List of results', () => {
        it('Should set resuls correctly - 2 items', () => {
            var fake = sinon.fake.returns(images);
            sinon.replace(RequestUtil, 'get', fake);
            search.searchLinks();
            expect(search._results).to.be.eq(images);
        });
    });

    describe('Count method', () => {
        jsdom();
        it('Should set count results to 2', () => {
            //expect(search.setCountResults(2)).to.be.eq(2);
        });

        it('Should set count results to 3', () => {
            //expect(search.setCountResults(3)).to.be.eq(3);
        });
    });
}); 
