import RequestUtil from '../utils/RequestUtil';
import ConfigUtil from '../utils/ConfigUtil';

export default class SearchController {

    constructor() {
        this._results = [];

        this._searchLinkSites = document.getElementById('sitesLink');
        this._searchLinkImages = document.getElementById('imagesLink');

        this.startEvents = this.startEvents.bind(this);
        this.changeLinkSelection = this.changeLinkSelection.bind(this);
        this.searchLinks = this.searchLinks.bind(this);
        this.setCountResults = this.setCountResults.bind(this);

        this.startEvents();
    }

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

            this.changeLinkSelection(true);
        }
    }

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

    searchLinks(isSites) {
        let url = window.location.href ? new URL(window.location.href) : null;
        let term = url ? url.searchParams.get('term') : '';

        //Get all links or images about the term searched.
        RequestUtil.get(ConfigUtil.DEFAULT_API.concat(isSites ? 'site' : 'image').concat('/getByTerm/').concat(term)).then(data => {
            let response = JSON.parse(data);
            this._results = response;
            this.setCountResults(response.length);            
        });
    }

    setCountResults(count) {
        let countEl = document.getElementsByClassName('resultsCount');
        countEl[0].innerHTML = `${count} results found`;
        return count;
    }
}
