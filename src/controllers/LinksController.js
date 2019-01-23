import RequestUtil from '../utils/RequestUtil';
import ConfigUtil from '../utils/ConfigUtil';

// API REST paths to each type of data.
let apiUrlSite = ConfigUtil.DEFAULT_API.concat('site');
let apiUrlImage = ConfigUtil.DEFAULT_API.concat('image');

export default class LinksController {

    constructor() {
        this._alreadyCrawled = [];
        this._depth = 1;
        this._currentDom = {};

        //Social medias needs a authentication in most of time, so the project needs to ignore links that contains these words.
        this._socialNetworks = ['instagram', 'facebook', 'pinterest', 'linkedin'];
    }

    /**
     * Website that will be crawled. 
     */
    startEvents() {
        this.getLinks('https://www.uol.com.br/', 'https://www.uol.com.br', 0);
    }

    /**
     * Get Meta tags from current DOM object.
     */
    getMetaTags() {
        return this._currentDom.getElementsByTagName('meta');
    }

    /**
     * Get Title tags from current DOM object.
     */
    getTitleTags() {
        return this._currentDom.getElementsByTagName('head')[0].getElementsByTagName('title');
    }

    /**
     * Get Image tags from current DOM object.
     */
    getImagesTags() {
        return [...this._currentDom.getElementsByTagName('img')];
    }

    /**
     * Get the links from href attributes throuth a URL.
     * In this file, I used async/await only to make the code more easier to read.
     * The performance isn't a critical field in this moment, because this file will be run once to each site that I'd crawling. POST functions are using asynchronous methods to best performance :)
     * 
     * @param {URL that will be crawled} url 
     * @param {Current host (domain)} host 
     * @param {Current depth of crawling} currentDepth 
     */
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

            //If description and keyword tags don't exist, the url will be insert too, but it's more harder to appear when the user will use the project and search a site.
            let description = this.getDescriptionByTag(tags);
            let keyword = this.getKeywordByTag(tags);

            //After insert the site in DB, do the same things with 'children' urls.
            this.verifyLinks(url, title, description, keyword);

            //Get images from website
            let images = this.getImagesTags();
            images.forEach(image => {
                if (image.dataset && image.dataset.src) {
                    this.verifyImages(url, image.dataset.src, image.alt, image.title);
                }
            });

            //Get links from the page.
            let links = [...this._currentDom.getElementsByTagName('a')].filter(element => element.href.startsWith('http', 0));
            let linksFixed = this.fixUrlsWithRoutes(links, host);

            //Get the child links that will be crawling.
            let childLinksToSearch = linksFixed.filter(link => link.href !== url);

            //To control the depth of links inside a webpage, the count of layers that crawling method will search inside each URL.
            currentDepth++;

            if (currentDepth <= this._depth) {
                childLinksToSearch.forEach(link => {
                    if (!this._alreadyCrawled.includes(link.href) && !link.href.startsWith('http://localhost:8080') && this.getNotSocialNetworkUrl(link.href)) {
                        this.getLinks(link.href, link.host, currentDepth);
                    }
                });
            }
        }
    }

    /**
     * Return keyword found by tags.
     * 
     * @param {Tags from DOM object} tags 
     */
    getKeywordByTag(tags) {
        if (tags.length > 0) {
            var keyword = [...tags].filter(tag => (tag.attributes['name'] && tag.attributes['name'].nodeValue === 'keywords'));
            return keyword && keyword[0] ? keyword[0].content.split(',').map(key => key.trim()).join(',') : '';
        }
    }

    /**
     * Return description found by tags.
     * 
     * @param {Tags from DOM object} tags 
     */
    getDescriptionByTag(tags) {
        if (tags.length > 0) {
            var description = [...tags].filter(tag => (tag.attributes['name'] && tag.attributes['name'].nodeValue === 'description'));
            return description && description[0] ? description[0].content : '';
        }
    }

    /**
     * Get DOM object from a URL.
     * 
     * @param {URL that I want to get DOM object} url 
     */
    async getDOMByURL(url) {
        let response = await RequestUtil.get(url);
        return new DOMParser().parseFromString(response, 'text/html');
    }

    /**
     * Return if in the url exists a name from a social network, that probably will throw a error because the crawling method doesn't have a authentication for it.
     * 
     * @param {URL of a site that probably will be crawled} href
     */
    getNotSocialNetworkUrl(href) {
        return this._socialNetworks.filter(socialName => href.indexOf(socialName) > -1) == [];
    }

    /**
     * Fix links that contains routes, like /about. For this case, needs to put the correct base URL.
     * 
     * @param {Links to be fixed} links
     * @param {Current host} host
     */
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

    /**
     * Verify if the URL already exists in database.
     * 
     * @param {Site of URL} url
     * @param {Title of site} title
     * @param {Description of site} description
     * @param {Keywords of site} keywords
     */
    verifyLinks(url, title, description, keywords) {
        let newData = { url, title, description, keywords };

        RequestUtil.post(`${apiUrlSite.concat('/siteByUrl')}`, { url }).then(response => {
            insert(response, newData, true);
        });
    }

    /**
     * Verify if the image already exists in database.
     * 
     * @param {Site that contains the url image} siteUrl
     * @param {Image URL} imageUrl
     * @param {Alt of the image} alt
     * @param {Title of the image} title
     */
    verifyImages(siteUrl, imageUrl, alt, title) {
        let newData = { siteUrl, imageUrl, alt, title };

        RequestUtil.post(`${apiUrlImage.concat('/imageByUrl')}`, { imageUrl }).then(response => {
            insert(response, newData, false);
        });
    }

    /**
     * Send data to API, to save the new link.
     * 
     * @param {Response of verify methods} response
     * @param {Data to save} newData
     * @param {If the URL is a link of a site or a image} isLink     
     */
    insert(response, isLink) {
        if (JSON.parse(response).length === 0) {
            RequestUtil.post(isLink ? apiUrlSite : apiUrlImage, newData).then(data => {
                console.log('URL added');
            }).catch(err => {
                console.error(err);
            });
        }
    }
}
