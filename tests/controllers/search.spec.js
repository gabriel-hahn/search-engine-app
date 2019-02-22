// Needs polyfill because I used async functions.
import RequestUtil from "../../src/utils/RequestUtil";

import "babel-polyfill";
import { expect } from "chai";
import sinon from "sinon";
import { jsdom } from "jsdom";

import SearchController from "../../src/controllers/SearchController";

describe("Search", () => {
    let search;
    let requests;

    let URL_DOG = "http://localhost:8080?term=Dog&page=3";

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

    let sites = [
        {
            "_id": "d3e12e3ew",
            "url": "http://www.test.com.br",
            "title": "Title test",
            "description": "Description test",
            "keywords": "test,gabriel,search,engine",
            "clicks": 2
        },
        {
            "_id": "sad2e1dww",
            "url": "http://www.test2.com.br",
            "title": "Title 2 test",
            "description": "Description test 2",
            "keywords": "test,2",
            "clicks": 3
        }
    ];

    let expectedAuxSite = `<p class="resultsCount"></p>
                    <div><div class="siteResults">
                    <div class="resultContainer">
                        <h3 class="title">
                            <a class="result" href="http://www.test.com.br" id="d3e12e3ew">
                                Title test
                            </a>
                        </h3>
                        <span class="url">http://www.test.com.br</span>
                        <span class="description">Description test</span>
                    </div>
                </div>
            </div><div><div class="siteResults">
                    <div class="resultContainer">
                        <h3 class="title">
                            <a class="result" href="http://www.test2.com.br" id="sad2e1dww">
                                Title 2 test
                            </a>
                        </h3>
                        <span class="url">http://www.test2.com.br</span>
                        <span class="description">Description test 2</span>
                    </div>
                </div>
            </div>`;

    let expectedAuxImage = `<p class="resultsCount"></p>
                    <div class="imageResults"><div class="gridItem" id="d3e12e3ew" style="position: absolute; left: -205px;">
                        <a href="undefined" data-fancybox="" data-caption="Title test">
                            <img src="undefined">
                            <span class="details">Title test</span>
                        </a>
                    </div>
                </div><div class="imageResults"><div class="gridItem" id="sad2e1dww" style="position: absolute; left: -205px;">
                        <a href="undefined" data-fancybox="" data-caption="Title 2 test">
                            <img src="undefined">
                            <span class="details">Title 2 test</span>
                        </a>
                    </div>
                </div>`;

    beforeEach(() => {
        jsdom.env({
            url: URL_DOG, "html": `<html>
                <head></head>
                <body>
                    <input type="text" class="searchBox" name="term" value="">
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
                    <div class="mainResultsSection">
                        <p class="resultsCount"></p>
                    </div>
                    <div class="paginationContainer">
                        <div class="pageButtons">
                            <div class="pageNumberContainer">
                                <img src="../assets/images/pageStart.png" alt="">
                            </div>
                            <div class="pageNumberContainer pageImg">
                                <img src="../assets/images/page.png" alt="">
                                <span class="pageNumber"></span>
                            </div>
                            <div class="pageNumberContainer">
                                <img src="../assets/images/pageEnd.png" alt="">
                            </div>
                        </div>
                    </div>
                </body>
            </html>`,
            onload: function (window) {
                global.window = window;
                global.document = window.document;
                global.HTMLElement = window.HTMLElement;
                global.getComputedStyle = window.getComputedStyle;

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

    describe("Smoke tests", () => {
        it("Should exists changeLinkSelection method", () => {
            expect(search.changeLinkSelection).to.exist;
        });

        it("Should exists startEvents method", () => {
            expect(search.startEvents).to.exist;
        });

        it("Should exists getTerm method", () => {
            expect(search.getTerm).to.exist;
        });

        it("Should exists setPaginationCount method", () => {
            expect(search.setPaginationCount).to.exist;
        });

        it("Should exists getPage method", () => {
            expect(search.getPage).to.exist;
        });

        it("Should exists searchLinks method", () => {
            expect(search.searchLinks).to.exist;
        });

        it("Should exists getCountByTerm method", () => {
            expect(search.getCountByTerm).to.exist;
        });

        it("Should exists setCountResults method", () => {
            expect(search.setCountResults).to.exist;
        });

        it("Should exists includeResults method", () => {
            expect(search.includeResults).to.exist;
        });

        it("Should exists setTermResearched method", () => {
            expect(search.setTermResearched).to.exist;
        });

        it("Should exists getLinkHrefElement method", () => {
            expect(search.getLinkHrefElement).to.exist;
        });

        it("Should exists increaseClicks method", () => {
            expect(search.increaseClicks).to.exist;
        });

        it("Should exists trimField method", () => {
            expect(search.trimField).to.exist;
        });

        it("Should exists cleanResults method", () => {
            expect(search.cleanResults).to.exist;
        });

        it("Should exists hiddenPagination method", () => {
            expect(search.hiddenPagination).to.exist;
        });
    });

    describe("Request methods", () => {
        it("Should call request once", () => {
            search.searchLinks(true);
            expect(requests.length).to.be.eq(1);
        });

        it("Should call request twice", () => {
            search.searchLinks(true);
            search.searchLinks(false);
            expect(requests.length).to.be.eq(2);
        });
    });

    describe("List of results", () => {
        it("Should set resuls correctly - 2 items", () => {
            sinon.stub(RequestUtil, "get").resolves(JSON.stringify(images));
            search.searchLinks().then((r) => {
                expect(r).to.be.eql(images);
            });
        });
    });

    describe("Count by term", () => {
        it("Should set 2 counts", async () => {
            sinon.stub(RequestUtil, "get").resolves(sites.length);
            await search.getCountByTerm();
            let countEl = document.getElementsByClassName("resultsCount");
            expect(countEl[0].innerHTML.toString()).to.be.eql("2 results found");
        });
    });

    describe("Count method", () => {
        it("Should set count results to 2", () => {
            expect(search.setCountResults(2)).to.be.eq(2);
        });

        it("Should set count results to 3", () => {
            expect(search.setCountResults(3)).to.be.eq(3);
        });
    });

    describe("Correct Href to pagination elements", () => {
        it("Should include link to page 3", () => {
            let href = search.getLinkHrefElement(3);
            expect(href).to.be.eq("http://localhost:8080/?term=Dog&page=3");
        });
    });

    describe("Increase clicks values", () => {
        it("Should return the same site after increse clicks number", () => {
            sinon.stub(RequestUtil, "put").resolves(sites[0]);
            search.increaseClicks(sites[0]._id).then((r) => {
                expect(r).to.be.eql(sites[0]);
            });
        });
    });

    describe("Hide pagination", () => {
        it("Should hide pagination element", () => {
            search.hiddenPagination(true);
            let paginationEl = document.getElementsByClassName("paginationContainer")[0];
            expect(paginationEl.style.display).to.be.eq("none");
        });

        it("Should not hide pagination element", () => {
            search.hiddenPagination(false);
            let paginationEl = document.getElementsByClassName("paginationContainer")[0];
            expect(paginationEl.style.display).to.be.eq("");
        });
    });

    describe("Tabs behavior", () => {
        it("Should activate Site tab", () => {
            let linkSitesEl = document.getElementById("sitesLink");
            let linkImagesEl = document.getElementById("imagesLink");

            linkSitesEl.classList.remove("active");
            linkImagesEl.classList.add("active");

            search.changeLinkSelection(true);
            expect(search._searchLinkSites.classList.value).to.be.eq("active");
            expect(search._searchLinkImages.classList.value).to.be.eq("");
        });

        it("Should activate Image tab", () => {
            search.changeLinkSelection();
            expect(search._searchLinkImages.classList.value).to.be.eq("active");
            expect(search._searchLinkSites.classList.value).to.be.eq("");
        });
    });

    describe("Get term", () => {
        it("Should return Dog", () => {
            expect(search.getTerm()).to.be.eq("Dog");
        });
    });

    describe("Get page", () => {
        it("Should return 3", () => {
            expect(search.getPage()).to.be.eq("3");
        });
    });

    describe("Pagination control", () => {
        it("Should insert 1 pagination elements", () => {
            search.setPaginationCount(15);
            let paginationEl = document.getElementsByClassName("pageImg");
            expect(paginationEl.length).to.be.eq(1);
        });

        it("Should insert 5 pagination elements", () => {
            search.setPaginationCount(85);
            let paginationEl = document.getElementsByClassName("pageImg");
            expect(paginationEl.length).to.be.eq(5);
        });

        it("Should insert 10 pagination elements, even using more than 200 results", () => {
            search.setPaginationCount(240);
            let paginationEl = document.getElementsByClassName("pageImg");
            expect(paginationEl.length).to.be.eq(10);
        });
    });

    describe("Input text box", () => {
        it("Should set \`Dog\` as a term", () => {
            search.setTermResearched(search.getTerm());
            let inputEl = document.getElementsByClassName("searchBox")[0];
            expect(inputEl.value).to.be.eq("Dog");
        });
    });

    describe("Trim function", () => {
        it("Should trim \`String test\` to \`String t...\`", () => {
            let term = search.trimField("String test", 8);
            expect(term).to.be.eq("String t...");
        });

        it("Should trim \`String test\` to \`String t\`", () => {
            let term = search.trimField("String t", 8);
            expect(term).to.be.eq("String t");
        });

        it("Should return empty string", () => {
            let term = search.trimField(null, 10);
            expect(term).to.be.empty;
        });
    });

    describe("Cleaner method", () => {
        it("Should clear all results", () => {
            search.includeResults(sites, true);
            let resultsEl = document.getElementsByClassName("mainResultsSection")[0];
            search.cleanResults();
            let expected = `<p class="resultsCount"></p>`;
            expect(resultsEl.innerHTML.toString().trim()).to.be.eq(expected);
        });
    });

    describe("Append results", () => {
        it("Should insert all site results", () => {
            search.includeResults(sites, true);
            let resultsEl = document.getElementsByClassName("mainResultsSection")[0];
            expect(resultsEl.innerHTML.toString().trim()).to.be.eq(expectedAuxSite);
        });

        it("Should insert all image results", () => {
            search.includeResults(sites, false);
            let resultsEl = document.getElementsByClassName("mainResultsSection")[0];
            expect(resultsEl.innerHTML.toString().trim()).to.be.eq(expectedAuxImage);
        });
    });
}); 
