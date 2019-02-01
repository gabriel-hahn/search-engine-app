// Needs polyfill because I used async functions.
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
    });

    describe('Smoke tests', () => {
        jsdom();
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
    });
    
    describe('Request methods', () => {
        it('Should call request once', () => {
            search.searchLinks(true);
            expect(requests.length).to.be.eq(1);
        });
    });
    
    describe('Count method', () => {
        it('Should set count correctly', () => {
        
        });
        
        it('Should set count results to 0', () => {
                        
        });
        
        it('Should set count results to 3', () => {
                        
        });
        
        it('Should set count results to 22', () => {
                        
        });
    });
    */
}); 
