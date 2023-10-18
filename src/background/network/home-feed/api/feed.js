import { request } from "../../../../api/scripts/request.js"
import { crunchyArray } from "../../../../api/models/crunchyroll.js"
import { github } from "../../../../api/scripts/github.js";
import { Settings } from "../../../../api/scripts/storage.js";

export default {
    listeners: [
        request.override([
            "https://www.crunchyroll.com/content/v2/discover/*/home_feed?*"
        ], "GET", async (info) => {
            var data = new crunchyArray(info.body);
            var parameters = request.getURLParams(info);
            var user_id = info.details.url.split("/discover/")[1].split("/")[0];

            const start = parseInt(parameters.get("start")) || 0;
            const size = parseInt(parameters.get("n")) || 4;

            var feed = await github.home_feed.getFeeds();
            var info = await github.getInfo();

            var profile = await Settings.get("profile");

            for(const feed_list of feed) {
                if(feed_list.type === "hero_carousel") {
                    if(start !== 0) continue;

                    for(var item of feed_list.heros) {
                        for(const [key, value] of Object.entries(item.images)) {
                            item.images[key] = `G_${info.user}_${info.repo.replaceAll("/", ";")}_${info.branch}_${info.other.replaceAll("/", ";")}_${feed_list.url}_${value}`;
                        }
                        if(item.replace === true) data.result.data[0].items.splice(item.position, 1, item)
                        else data.result.data[0].items.splice(item.position, 0, item)
                    }

                    continue;
                }

                for(var item of feed_list.items) {
                    if(start <= item.position + 1 && item.position <= start + size) {
                        if(item.link !== undefined) item.link = item.link.replaceAll("{user_id}", user_id).replaceAll("{text_locale}", profile.preferred_communication_language).replaceAll("{audio_locale}", profile.preferred_content_audio_language);

                        if(item.panel !== undefined) {
                            for(const [key, value] of Object.entries(item.panel.images)) {
                                item.panel.images[key] = `G_${info.user}_${info.repo.replaceAll("/", ";")}_${info.branch}_${info.other.replaceAll("/", ";")}_${feed.url}_${value}`;
                            }
                        }
                        if(item.images !== undefined) {
                            for(const [key, value] of Object.entries(item.images)) {
                                item.images[key] = `G_${info.user}_${info.repo.replaceAll("/", ";")}_${info.branch}_${info.other.replaceAll("/", ";")}_${feed.url}_${value}`;
                            }
                        }

                        item.resource_type = feed_list.type

                        if(item.replace === true) data.splice((item.position - start), 1, item)
                        else data.splice((item.position - start), 0, item)
                    }
                }
            }
            
            return data.toString();
        })
    ]
}