import RequestUtil from '../utils/RequestUtil';

let apiUrlSite = 'http://localhost:9090/api/site';
let apiUrlImage = 'http://localhost:9090/api/image';

export default class LinksController {

    constructor() {
        this._alreadyCrawled = [];
        this._depth = 1;
        this._currentDom = {};

        //Social medias needs a authentication in most of time, so the project needs to ignore links that contains these words.
        this._socialNetworks = ['instagram', 'facebook', 'pinterest', 'linkedin'];

        //this.startEvents();
    }

    //Site that will be crowling.
    startEvents() {
        this.getLinks('https://www.uol.com.br/', 'https://www.uol.com.br', 0);
    }

    getMetaTags() {
        return this._currentDom.getElementsByTagName('meta');
    }

    getTitleTags() {
        return this._currentDom.getElementsByTagName('head')[0].getElementsByTagName('title');
    }

    getImagesTags() {
        return [...this._currentDom.getElementsByTagName('img')];
    }

    //Get the links from href attributes throuth a URL.
    //In this file, I used async/await only to make the code more easier to read.
    //The performance isn't a critical field in this moment, because this file will be run once to each site that I'd crowling. POST functions are using asynchronous methods to best performance :)
    async getLinks(url, host, currentDepth) {

        //Verify if the href already exists in crawled list and add it.
        if (!this._alreadyCrawled.includes(url)) {

            //DOM from the page.
            this._currentDom = await this.getDOMByURL(url);

            this._alreadyCrawled.push(url);

            //Get title from the page
            let titles = this.getTitleTags();
            let title = titles[0] ? titles[0].innerText : '';

            //Get description and keywords from site.
            let tags = this.getMetaTags();

            let description = '';
            let keyword = '';

            //If description and keyword tags don't exist, the url will be insert too, but it's more harder to appear when user will use the project and search a site.
            if (tags.length > 0) {
                description = [...tags].filter(tag => (tag.attributes['name'] && tag.attributes['name'].nodeValue === 'description'));
                description = description && description[0] ? description[0].content : '';

                keyword = [...tags].filter(tag => (tag.attributes['name'] && tag.attributes['name'].nodeValue === 'keywords'));
                keyword = keyword && keyword[0] ? keyword[0].content.split(',').map(key => key.trim()).join(',') : '';
            }

            //After insert the site in DB, do the same things with 'children' urls.
            this.insertLinks(url, title, description, keyword);

            //Get images from website
            let images = this.getImagesTags();
            images.forEach(image => {
                if (image.dataset && image.dataset.src) {
                    this.insertImages(url, image.dataset.src, image.alt, image.title);
                }
            });

            //Get links from the page.
            let links = [...this._currentDom.getElementsByTagName('a')].filter(element => element.href.startsWith('http', 0));
            let linksFixed = this.fixUrlsWithRoutes(links, host);

            //Get the child links that will be crawling.
            let childLinksToSearch = linksFixed.filter(link => link.href !== url);

            //To control the depth of links inside a webpage, the count of layers that crawling method will search.
            currentDepth++;

            if (currentDepth <= this._depth) {
                childLinksToSearch.forEach(link => {
                    if (!this._alreadyCrawled.includes(link.href) && !link.href.startsWith('http://localhost:8080' && !this.getNotSocialNetworkUrl(link.href))) {
                        this.getLinks(link.href, link.host, currentDepth);
                    }
                });
            }
        }
    }

    //Get the DOM from a URL.
    async getDOMByURL(url) {
        let response = await RequestUtil.get(url);
        return new DOMParser().parseFromString(response, 'text/html');
    }

    //Return if in the url exists a name from a social network, that probably will throw a error because the crawling method doesn't have a authentication from it;
    getNotSocialNetworkUrl(href) {
        return this._socialNetworks.filter(socialName => href.indexOf(socialName) > -1) == [];
    }

    //Fix links that contains routes, like /about. For this case, needs to put the correct base URL.
    fixUrlsWithRoutes(links, host) {
        return links.map(link => {
            if (link.href.startsWith(window.location.href)) {
                link.href = link.href.replace(window.location.href, host);
            }

            else if (link.href.startsWith(window.origin, 0)) {
                link.href = link.href.replace(window.origin, host);
            }

            return link;
        });
    }

    insertLinks(url, title, description, keywords) {
        let newData = { url, title, description, keywords };

        //Verify if the url already exist on db.
        RequestUtil.post(`${apiUrlSite.concat('/siteByUrl')}`, { url }).then(response => {
            if (JSON.parse(response).length === 0) {
                RequestUtil.post(apiUrlSite, newData).then(data => {
                    console.log('URL added');
                }).catch(err => {
                    console.error(err);
                });
            }
        });
    }

    insertImages(siteUrl, imageUrl, alt, title) {
        let newData = { siteUrl, imageUrl, alt, title };

        //Verify if the imageUrl already exist on db.
        RequestUtil.post(`${apiUrlImage.concat('/imageByUrl')}`, { imageUrl }).then(response => {
            if (JSON.parse(response).length === 0) {
                RequestUtil.post(apiUrlImage, newData).then(data => {
                    console.log('Image added');
                }).catch(err => {
                    console.error(err);
                });
            }
        });
    }
}
