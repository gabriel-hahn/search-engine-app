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

    describe('Request methods', () => {
        it('Should call request twice', () => {
            search.searchLinks(true);
            expect(requests.length).to.be.eq(2);
        });
    });
});
