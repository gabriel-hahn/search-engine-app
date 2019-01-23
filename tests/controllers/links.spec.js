// Needs polyfill because I used async functions.
import 'babel-polyfill';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

import LinksController from '../../src/controllers/LinksController';

describe('Links', () => {
    let links;
    let requests;

    beforeEach(() => {
        links = new LinksController();

        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    afterEach(() => {
        global.XMLHttpRequest.restore();
    });

    describe('Smoke tests', () => {
        it('Should exists startEvents method', () => {
            expect(links.startEvents).to.exist;
        });

        it('Should exists getMetaTags method', () => {
            expect(links.getMetaTags).to.exist;
        });

        it('Should exists getTitleTags method', () => {
            expect(links.getTitleTags).to.exist;
        });

        it('Should exists getImagesTags method', () => {
            expect(links.getImagesTags).to.exist;
        });

        it('Should exists getLinks method', () => {
            expect(links.getLinks).to.exist;
        });

        it('Should exists getDOMByURL method', () => {
            expect(links.getDOMByURL).to.exist;
        });

        it('Should exists getNotSocialNetworkUrl method', () => {
            expect(links.getNotSocialNetworkUrl).to.exist;
        });

        it('Should exists fixUrlsWithRoutes method', () => {
            expect(links.fixUrlsWithRoutes).to.exist;
        });

        it('Should exists verifyLinks method', () => {
            expect(links.verifyLinks).to.exist;
        });

        it('Should exists verifyImages method', () => {
            expect(links.verifyImages).to.exist;
        });
    });

    /* describe('Request methods', () => {
        it('Should call request once', () => {
            links.verifyLinks('site', 'title', 'description', 'keywords');
            expect(requests.length).to.be.eq(1);
        });

        it('Should call request once', () => {
            links.verifyImages('site', 'imageUrl', 'alt', 'title');
            expect(requests.length).to.be.eq(1);
        });
    }); */
});
