export default class RequestUtil {
    constructor() {

    }

    static get(url) {
        return new Promise((resolve, reject) => {
            var ajax = new XMLHttpRequest();

            ajax.open('GET', url);
            ajax.send();

            ajax.onload = event => {
                resolve(ajax.responseText);
            }

            ajax.onerror = err => {
                reject(err);
            }
        });
    }

    static post(url, data) {
        return new Promise((resolve, reject) => {
            var ajax = new XMLHttpRequest();

            ajax.open('POST', url);
            ajax.setRequestHeader('Content-type', 'application/json');
            ajax.send(JSON.stringify(data));

            ajax.onload = event => {
                resolve(ajax.responseText);
            }

            ajax.onerror = err => {
                reject(err);
            }
        });
    }
}