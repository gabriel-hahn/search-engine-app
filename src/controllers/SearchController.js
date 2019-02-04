import RequestUtil from '../utils/RequestUtil';
import ConfigUtil from '../utils/ConfigUtil';

export default class SearchController {

    constructor() {
        this._searchLinkSites = document.getElementById('sitesLink');
        this._searchLinkImages = document.getElementById('imagesLink');

        this.startEvents = this.startEvents.bind(this);
        this.changeLinkSelection = this.changeLinkSelection.bind(this);
        this.getTerm = this.getTerm.bind(this);
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

    getTerm() {
        let url = window.location.href ? new URL(window.location.href) : null;
        return url ? url.searchParams.get('term') : '';
    }

    searchLinks(isSites) {
        let term = this.getTerm();

        //Get all links or images about the term searched.
        return RequestUtil.get(ConfigUtil.DEFAULT_API.concat(isSites ? 'site' : 'image').concat('/getByTerm/').concat(term)).then(data => {
            let response = JSON.parse(data);
            this.setCountResults(response.length);
            return response;
        });
    }

    setCountResults(count) {
        let countEl = document.getElementsByClassName('resultsCount');
        countEl[0].innerHTML = `${count} results found`;
        return count;
    }
}
