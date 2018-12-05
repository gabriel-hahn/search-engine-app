import RequestUtil from '../utils/RequestUtil';

let urlApiData = 'http://localhost:9090/api/';

export default class SearchController {

    constructor() {
        this._searchLinkSites = document.getElementById('sitesLink');
        this._searchLinkImages = document.getElementById('imagesLink');

        //this.startEvents();
        this.searchLinks(true);
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

    startEvents() {
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
    }

    searchLinks(isSites) {
        let url = new URL(window.location.href);
        let term = url.searchParams.get('term');

        //Get all links or images about the term searched.
        RequestUtil.get(urlApiData.concat(isSites ? 'site' : 'image').concat('/getByTerm/').concat(term)).then(data => {
            let response = JSON.parse(data);
            this.setCountResults(response.length);
            console.log(response);
        });
    }

    setCountResults(count) {
        let countEl = document.getElementsByClassName('resultsCount');
        countEl[0].innerHTML = `${count} results found`;
    }
}
