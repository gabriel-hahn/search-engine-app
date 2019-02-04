// Needs polyfill because I used async functions.
import RequestUtil from '../../src/utils/RequestUtil';

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
            "siteUrl": "http://www.test.com.br",
            "imageUrl": "http://www.test.com.br/image.jpg",
            "alt": "Test",
            "title": "Image Title Test",
            "clicks": 0,
            "broken": false
        },
        {
            "siteUrl": "http://www.test2.com.br",
            "imageUrl": "http://www.test2.com.br/image2.jpg",
            "alt": "Test 2",
            "title": "Image Title Test 2",
            "clicks": 3,
            "broken": false
        }
    ];

    beforeEach(() => {
        jsdom.env({
            url: 'http://localhost:8080?term=Dog', 'html': `<html>
                <head></head>
                <body>
                    <p class="resultsCount"></p>
                    <div class="tabsContainer">
                        <ul class="tabList">
                            <li class="active" id="sitesLink">
                                <a href>Sites</a>
                            </li>
                            <li id="imagesLink">
                                <a href>Images</a>
                            </li>
                        </ul>
                    </div>
                </body>
            </html>`,
            onload: function (window) {
                global.window = window;
                global.document = window.document;

                global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
                requests = [];

                global.XMLHttpRequest.onCreate = function (xhr) {
                    requests.push(xhr);
                };

                search = new SearchController();
            }
        });
    });

    afterEach(() => {
        global.XMLHttpRequest.restore();
        sinon.restore();
    });

    describe('Smoke tests', () => {
        it('Should exists changeLinkSelection method', () => {
            expect(search.changeLinkSelection).to.exist;
        });

        it('Should exists startEvents method', () => {
            expect(search.startEvents).to.exist;
        });

        it('Should exists getTerm method', () => {
            expect(search.getTerm).to.exist;
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

    describe('List of results', () => {
        it('Should set resuls correctly - 2 items', () => {
            sinon.stub(RequestUtil, 'get').resolves(JSON.stringify(images));
            search.searchLinks().then(r => {
                expect(r).to.be.eql(images);
            });
        });
    });

    describe('Count method', () => {
        it('Should set count results to 2', () => {
            expect(search.setCountResults(2)).to.be.eq(2);
        });

        it('Should set count results to 3', () => {
            expect(search.setCountResults(3)).to.be.eq(3);
        });
    });

    describe('Tabs behavior', () => {
        it('Should activate Site tab', () => {
            search.changeLinkSelection(true);
            expect(search._searchLinkSites.classList.value).to.be.eq('active');
            expect(search._searchLinkImages.classList.value).to.be.eq('');
        });

        it('Should activate Image tab', () => {
            search.changeLinkSelection();
            expect(search._searchLinkImages.classList.value).to.be.eq('active');
            expect(search._searchLinkSites.classList.value).to.be.eq('');
        });
    });
}); 
