class AdsmuraiSDK {
    post (key, data, url) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url ? url : "https://ev.st.adsmurai.com/v1.0/bulk");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Auth-Token", key);
        xhr.send(JSON.stringify(data));
    }

    fetch (url, resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.withCredentials = true;
        xhr.addEventListener("load", resolve);
        if (reject) {
            xhr.addEventListener("error", reject);    
        }
        xhr.send(null);
    }

    setTimeout (cb, time) {
        window.setTimeout(cb, time);
    }

    pushEvent () {
        dataLayer.push(arguments);
    }

    log () {
        if (typeof this.logs === "undefined") {
            this.logs = [];
        }
        this.logs.push(arguments);
    }
}
window.adsmuraiSDK = new AdsmuraiSDK();
