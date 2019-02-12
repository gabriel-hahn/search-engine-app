import RequestUtil from '../utils/RequestUtil';
import ConfigUtil from '../utils/ConfigUtil';

export default class SearchController {

    constructor() {
        this._searchLinkSites = document.getElementById('sitesLink');
        this._searchLinkImages = document.getElementById('imagesLink');

        this.startEvents = this.startEvents.bind(this);
        this.changeLinkSelection = this.changeLinkSelection.bind(this);
        this.getTerm = this.getTerm.bind(this);
        this.getPage = this.getPage.bind(this);
        this.searchLinks = this.searchLinks.bind(this);
        this.getCountByTerm = this.getCountByTerm.bind(this);
        this.setCountResults = this.setCountResults.bind(this);
        this.includeSiteResults = this.includeSiteResults.bind(this);
        this.setTermResearched = this.setTermResearched.bind(this);
        this.trimField = this.trimField.bind(this);

        this.startEvents();
    }

    /**
     * Start elements events.
     */
    startEvents() {
        window.onload = () => {
            this._searchLinkSites.addEventListener('click', e => {
                e.preventDefault();
                this.changeLinkSelection(true);
                this.searchLinks(true);
            });

            this._searchLinkImages.addEventListener('click', e => {
                e.preventDefault();
                this.changeLinkSelection(false);
                this.searchLinks(false);
            });

            this._searchLinkSites.click();
        }
    }

    /**
     * Change CSS from tab.
     * @param {If it's needs to show sites or images} isSites 
     */
    changeLinkSelection(isSites) {
        if (isSites) {
            if (![...this._searchLinkSites.classList].includes('active')) {
                this._searchLinkSites.classList.add('active');
                this._searchLinkImages.classList.remove('active');
            }
        }
        else {
            if (![...this._searchLinkImages.classList].includes('active')) {
                this._searchLinkSites.classList.remove('active');
                this._searchLinkImages.classList.add('active');
            }
        }
    }

    /**
     * Return the term researched.
     */
    getTerm() {
        let url = window.location.href ? new URL(window.location.href) : null;
        return url ? url.searchParams.get('term') : '';
    }

    /**
     * Interval using to get results (page).
     */
    getPage() {
        let url = window.location.href ? new URL(window.location.href) : null;
        return url ? url.searchParams.get('page') : '';
    }

    /**
     * Set term in main input box.
     * 
     * @param {Term researched} term 
     */
    setTermResearched(term) {
        let inputEl = document.getElementsByClassName('searchBox')[0];
        inputEl.value = term;
    }

    /**
     * Get data from API and set results on screen.
     * @param {If it's needs to search term in sites or images API} isSites 
     */
    searchLinks(isSites) {
        this._term = this.getTerm();
        this._page = this.getPage();

        this._isSites = isSites;

        this.setTermResearched(this._term);

        //Get all links or images about the term researched.
        return RequestUtil.get(ConfigUtil.DEFAULT_API.concat(isSites ? 'site' : 'image').concat('/getByTerm/').concat(this._term), this._page).then(data => {
            let response = JSON.parse(data);
            this.includeSiteResults(response);
            this.getCountByTerm();

            return response;
        });
    }

    /**
     * Get count of all items by term.
     */
    getCountByTerm() {
        return RequestUtil.get(ConfigUtil.DEFAULT_API.concat(this._isSites ? 'site' : 'image').concat('/getCountByTerm/').concat(this._term)).then(count => {
            this.setCountResults(count);
        });
    }

    /**
     * Set count results in element.
     * @param {Count of results} count 
     */
    setCountResults(count) {
        let countEl = document.getElementsByClassName('resultsCount');
        countEl[0].innerHTML = `${count} results found`;
        return count;
    }

    /**
     * Include all results in links and list on screen.
     * @param {All results found} results 
     */
    includeSiteResults(results) {
        let resultsEl = document.getElementsByClassName('mainResultsSection')[0];

        results.forEach(result => {
            let element = `<div class="siteResults">
                    <div class="resultContainer">
                        <h3 class="title">
                            <a class="result" href=${result.url}>
                                ${this.trimField(result.title, 55)}
                            </a>
                        </h3>
                        <span class="url">${result.url}</span>
                        <span class="description">${this.trimField(result.description, 180)}</span>
                    </div>
                </div>
            `;

            let divEl = document.createElement('div');
            divEl.innerHTML = element;

            resultsEl.appendChild(divEl);
        });
    }

    /**
     * Return value with dots (...) if length is bigger than limit of characteres.
     * 
     * @param {String to trim} value 
     * @param {Limit of characteres} limit 
     */
    trimField(value, limit) {
        if (!value) return '';

        let dots = value.length > limit ? '...' : '';
        return value.substring(0, limit).concat(dots);
    }
}
