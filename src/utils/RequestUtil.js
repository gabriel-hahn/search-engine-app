export default class RequestUtil {
    constructor() {

    }

    static get(url, page) {
        return new Promise((resolve, reject) => {
            var ajax = new XMLHttpRequest();

            ajax.open("GET", url);

            if (page) {
                let startFrom = (page - 1) * 20;
                ajax.setRequestHeader("limit", startFrom.toString());
            }

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

            ajax.open("POST", url);
            ajax.setRequestHeader("Content-type", "application/json");
            ajax.send(JSON.stringify(data));

            ajax.onload = event => {
                resolve(ajax.responseText);
            }

            ajax.onerror = err => {
                reject(err);
            }
        });
    }

    static put(url, data) {
        return new Promise((resolve, reject) => {
            var ajax = new XMLHttpRequest();

            ajax.open("PUT", url);
            ajax.setRequestHeader("Content-type", "application/json");
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
