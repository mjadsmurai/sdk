class AdsmuraiSDK {
    post (key, data, url) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url ? url : "https://ev.st.adsmurai.com/v1.0/bulk");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Auth-Token", key);
        xhr.send(JSON.stringify(data));
    }

    fetch (resource, options) {
        return window.fetch(resource, options);
    }

    pushEvent () {
        dataLayer.push(arguments);
    }
}
window.adsmuraiSDK = new AdsmuraiSDK();
