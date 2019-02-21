// Needs polyfill because I used async functions.
import "babel-polyfill";
import { expect } from "chai";
import sinon from "sinon";

import RequestUtil from "../../src/utils/RequestUtil";

describe("Request Util", () => {
    let requests = [];
    let URL = 'http://localhost:9090?term="Dog"';

    beforeEach(() => {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    afterEach(() => {
        global.XMLHttpRequest.restore();
    });

    describe("Request Util", () => {
        describe("Smoke tests", () => {
            it("Should exists get method", () => {
                expect(RequestUtil.get).to.exist;
            });

            it("Should exists post method", () => {
                expect(RequestUtil.post).to.exist;
            });

            it("Should exists put method", () => {
                expect(RequestUtil.put).to.exist;
            });
        });

        describe("Request count", () => {
            it("Should call request GET once", () => {
                RequestUtil.get(URL);
                expect(requests.length).to.be.eq(1);
            });

            it("Should call request GET twice", () => {
                RequestUtil.get(URL);
                RequestUtil.get(URL);
                expect(requests.length).to.be.eq(2);
            });

            it("Should call request POST once", () => {
                RequestUtil.post(URL);
                expect(requests.length).to.be.eq(1);
            });

            it("Should call request POST twice", () => {
                RequestUtil.post(URL);
                RequestUtil.post(URL);
                expect(requests.length).to.be.eq(2);
            });

            it("Should call request PUT once", () => {
                RequestUtil.put(URL);
                expect(requests.length).to.be.eq(1);
            });

            it("Should call request PUT twice", () => {
                RequestUtil.put(URL);
                RequestUtil.put(URL);
                expect(requests.length).to.be.eq(2);
            });
        });

        describe("Return and request values", () => {
            describe("GET method", () => {
                it("Should make a request with correct URL", () => {
                    RequestUtil.get(URL);
                    expect(requests[0].url).to.be.eq(URL);
                });

                it("Should calls the correct HTTP method", () => {
                    RequestUtil.get(URL);
                    expect(requests[0].method).to.be.eq("GET");
                });
            });

            describe("POST method", () => {
                it("Should make a request with correct URL", () => {
                    RequestUtil.post(URL);
                    expect(requests[0].url).to.be.eq(URL);
                });

                it("Should calls the correct HTTP method", () => {
                    RequestUtil.post(URL);
                    expect(requests[0].method).to.be.eq("POST");
                });
            });

            describe("PUT method", () => {
                it("Should make a request with correct URL", () => {
                    RequestUtil.put(URL);
                    expect(requests[0].url).to.be.eq(URL);
                });

                it("Should calls the correct HTTP method", () => {
                    RequestUtil.put(URL);
                    expect(requests[0].method).to.be.eq("PUT");
                });
            });
        });
    });
});
