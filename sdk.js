class AdsmuraiSDK {
    async post (key, data, url) {
        try {
            const response = await fetch(url ? url : "https://ev.st.adsmurai.com/v1.0/bulk", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Auth-Token": key,
                },
                body: JSON.stringify(data),
            });
            return await response.json();
        } catch (e) {
            return null;
        }
    }

    post2 (key, data, url) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url ? url : "https://ev.st.adsmurai.com/v1.0/bulk");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Auth-Token", key);
        xhr.send(JSON.stringify(data));
    }

    pushEvent () {
        dataLayer.push(arguments);
    }
}
window.adsmuraiSDK = new AdsmuraiSDK();
