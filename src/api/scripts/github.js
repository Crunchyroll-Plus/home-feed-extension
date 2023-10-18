import { Settings } from "./storage.js";

export const github = {
    official: {
        repo: "Crunchyroll-Plus/home-feed",
        branch: "release",
        feed_root: ""
    },
    getInfo: async () => {
        const link = await github.home_feed.getLink();

        var parts = link.split("/").reverse();

        return {
            user: parts.pop(),
            repo: parts.pop(),
            branch: parts.pop(),
            other: parts.join("/")
        }
    },
    getURL: (str) => str.replaceAll(";", "/"),
    home_feed: {
        link: "",
        setLink: (link) => {
            github.home_feed.link = link;
            Settings.set("home_feed_git", github.home_feed.link);
        },
        getLink: () => {
            return new Promise((resolve, reject) => {
                try {
                    Settings.get("home_feed_git").then((link) => {
                        github.home_feed.link = link === undefined ? `${[github.official.repo, github.official.branch, github.official.feed_root].join("/")}` : link;
                        resolve(github.home_feed.link);
                    }, reject);
                } catch (error) { reject(error) };
            })
        },
        getFeed: (type) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const info = await github.getInfo();

                    if(info.repo === undefined || info.branch === undefined) return resolve();

                    const base_url = new URL(["https://raw.githubusercontent.com", info.user, info.repo, info.branch, info.other].join("/"));
                    const metadata_url = new URL(`${base_url.href}/metadata.json`);

                    const metadata = await (await fetch(metadata_url.href)).json();

                    if(metadata.available_feeds.indexOf(type) === -1) return resolve();

                    const feed_url = new URL(`${base_url.href}${metadata.link}/${type}.json`);
                    const feed_data = await (await fetch(feed_url)).json();

                    feed_data.url = metadata.link.replaceAll("/", ";");

                    resolve(feed_data);
                } catch (error) { reject(error) };
            })
        },
        getFeeds: () => {
            return new Promise(async (resolve, reject) => {
                try {
                    const info = await github.getInfo();

                    if(info.repo === undefined || info.branch === undefined) return resolve();

                    const base_url = new URL(["https://raw.githubusercontent.com", info.user, info.repo, info.branch, info.other].join("/"));
                    const metadata_url = new URL(`${base_url.href}/metadata.json`);

                    const metadata = await (await fetch(metadata_url.href)).json();
                    const feeds = [];

                    for(const type of metadata.available_feeds) {
                        const feed_url = new URL(`${base_url.href}${metadata.link}/${type}.json`);
                        const feed_data = await (await fetch(feed_url)).json();

                        feed_data.url = metadata.link.replaceAll("/", ";");
                        feeds.push(feed_data);
                    }

                    resolve(feeds);
                } catch (error) { reject(error) };
            })
        }
    }
}