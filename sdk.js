if (typeof AdsmuraiSDK === 'undefined') {
  class AdsmuraiSDK {
    constructor() {
      this.setupListeners();
    }

    sendCommand (method, params) {
      window.dispatchEvent(new CustomEvent("adsmu-command", { detail: { command: "run", method: method, params: params}}));
    }

    setupListeners() {
      window.addEventListener("adsmu-command", (e) => {
        console.log("COMMAND RECEIVED", e.detail);
        switch(e.detail.command) {
          case "run":
            this.runInWindow(e.detail.method, e.detail.params);
            break;
        }
      });
    }
    post (key, data, url, resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url ? url : "https://ev.st.adsmurai.com/v1.0/events");
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.setRequestHeader("Auth-Token", key);

      if (resolve) {
        xhr.addEventListener("load", (e) => {
          resolve({
            status: e.target.status,
            response: e.target.response,
          });
        });
      }
      if (reject) {
        xhr.addEventListener("error", reject);
      }

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

    rgbToHex (r, g, b) {
      return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
    }

    getBackgroundColor () {
      const bgColor = window.getComputedStyle(document.body, null).getPropertyValue('background');
      let color = 'ffffff';

      if (bgColor.startsWith('rgb(')) {
        color = bgColor.replace('rgb(', '').split(') ')[0].split(',');
        return this.rgbToHex(parseInt(color[0]), parseInt(color[1]), parseInt(color[2]));
      }

      return color;
    }

    getPlatformSpecs () {
      return {
        platform: navigator.platform,
        screen: {
          width: screen.width,
          height: screen.height,
        },
        bg: this.getBackgroundColor(),
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        containers: this.getContainers()
      };
    }

    getContainers () {
      let containerIds = null;

      if (window.google_tag_data && window.google_tag_data.tidr && window.google_tag_data.tidr.container) {
        containerIds = {};
        const possibleContainers = [
          {
            start: 'GTM-',
            type: 'gtm',
          },
          {
            start: 'G-',
            type: 'analytics',
          },
          {
            start: 'AW-',
            type: 'adwords',
          }
        ];
        Object.keys(google_tag_data.tidr.container).forEach(containerId => {
          possibleContainers.forEach(possibleContainer => {
            if (containerId.startsWith(possibleContainer.start)) {
              containerIds[possibleContainer.type] = containerId;
            }
          });
        });
      }

      return containerIds;
    }

    injectScript(url, onSuccess, onError, id) {
      id = "adsmu-sdk-" + id;
      if (document.getElementById(id)) {
        onSuccess();
        return;
      }
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.id = id;

      document.head.appendChild(script);

      if (onSuccess) {
        script.onload = onSuccess;
      }
      if (onError) {
        script.onerror = onError;
      }
    }

    setTimeout (cb, time) {
      window.setTimeout(cb, time);
    }

    pushEvent () {
      if (window.dataLayer) {
        window.dataLayer.push(arguments);
      }
    }

    getFromWindow (fieldName) {
      return window[fieldName];
    }

    runInWindow(method, data) {
      const methodParts = method.split('.');
      let context = window;

      while (methodParts.length > 1) {
        context = context[methodParts.shift()];
      }
      console.log(context[methodParts[0]]);
      return context[methodParts[0]](...data);
    }

    setItem (fieldName, value) {
      sessionStorage.setItem(fieldName, value);
    }

    getItem (fieldName) {
      return sessionStorage.getItem(fieldName);
    }

    log () {
      if (typeof this.logs === "undefined") {
        this.logs = [];
      }
      this.logs.push(arguments);
    }
  }
  window.adsmuraiSDK = new AdsmuraiSDK();
}

