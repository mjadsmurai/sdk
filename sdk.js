class AdsmuraiSDK {
    async post (key, data, url) {
        try {
            const response = await fetch(url ? url : "https://ev.st.adsmurai.com/v1.0/bulk", {
                method: "POST",
                mode: "no-cors",
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

    pushEvent () {
        dataLayer.push(arguments);
    }
}
window.adsmuraiSDK = new AdsmuraiSDK();
