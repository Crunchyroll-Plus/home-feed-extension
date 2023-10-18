/*
    @author: chonker
    @version: 0.0.2
    @license: MPL 2.0
    @description: API for controlling local storage.
*/

export const Settings = {
    default: {},
    setDefault: (key, value) => Settings.default[key] = value,
    get: (key) => {
        return new Promise((resolve, reject) => {
            browser.storage.local.get("settings").then((item) => {
                item.settings = item.settings || Settings.default;

                var value = key === "*" && item.settings || item.settings[key] !== undefined && item.settings[key] || Settings.default[key];
                
                resolve(value);
            }, reject);
        })
    },
    set: (key, value) => {
        return new Promise((resolve, reject) => {
            browser.storage.local.get("settings").then((item) => {
                item.settings = item.settings || {};

                item.settings[key] = value || Settings.default[key];

                browser.storage.local.set(item).then(resolve);
            }, reject);
        })
    }
}