// Needs polyfill because I used async functions.
import 'babel-polyfill';
import { expect } from 'chai';
import sinon from 'sinon';

import RequestUtil from '../../src/utils/RequestUtil';

describe('Request Util', () => {
    let requests = [];
    let URL = 'http://localhost:9090?term="Dog"';

    beforeEach(() => {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    describe('Request Util', () => {
        describe('Smoke tests', () => {
            it('Should exists get method', () => {
                expect(RequestUtil.get).to.exist;
            });

            it('Should exists post method', () => {
                expect(RequestUtil.post).to.exist;
            });
        });

        describe('Request count', () => {
            it('Should call request GET once', () => {
                RequestUtil.get(URL);
                expect(requests.length).to.be.eq(1);
            });

            it('Should call request GET twice', () => {
                RequestUtil.get(URL);
                RequestUtil.get(URL);
                expect(requests.length).to.be.eq(2);
            });

            it('Should call request POST once', () => {
                RequestUtil.post(URL);
                expect(requests.length).to.be.eq(1);
            });

            it('Should call request POST twice', () => {
                RequestUtil.post(URL);
                RequestUtil.post(URL);
                expect(requests.length).to.be.eq(2);
            });
        });
        
        /*describe('Return values', () => {
            describe('GET method', () => {
                it('Should return the correct data', () => {
                    sinon.stub(global.XMLHttpRequest, "onload").resolves(data);
                    RequestUtil.get(URL).then(response => {
                        expect(response).to.be.eq(data);
                    });
                });

                it('Should reject the request', () => {
                    let msg = "Error!";
                    sinon.stub(global.XMLHttpRequest, "onerror").resolves(msg);
                    RequestUtil.get(URL).catch(error => {
                        expect(error).to.be.eq(data);
                    });
                });
            });

            describe('POST method', () => {
                it('Should send data correctly', () => {
                    sinon.stub(global.XMLHttpRequest, "onload").resolves(data);
                    RequestUtil.post(URL).then(response => {
                        expect(response).to.be.eq(data);
                    });
                });

                it('Should reject the request', () => {
                    let msg = "Error!";
                    sinon.stub(global.XMLHttpRequest, "onerror").resolves(msg);
                    RequestUtil.post(URL).catch(error => {
                        expect(error).to.be.eq(data);
                    });
                });
            });
        }); */        
    });
});
