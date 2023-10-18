import { request } from "../../../api/scripts/request.js";
import { Settings } from "../../../api/scripts/storage.js";

export default {
    listeners: [
        request.override(
            ["https://www.crunchyroll.com/accounts/v1/me/profile"
        ], "GET", (info) => {
            console.log(info.body);
            Settings.set("profile", JSON.parse(info.body));
            return info.body;
        })
    ]
}