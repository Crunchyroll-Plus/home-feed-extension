import { request } from "../../../../api/scripts/request.js"

export default {
    listeners: [
        request.override(["https://static.crunchyroll.com/fms/*"], "GET", async (info) => {
            var id = info.details.url.split("/").reverse()[0];
            var result = info.array;
        
            if(id.indexOf("_") > -1) {
                var seperated = id.split("_").reverse();
                var indentifier = seperated.pop();
                var asset_url;
                
                switch(indentifier) {
                    case "G":
                        var user = seperated.pop();
                        var repo = seperated.pop().replaceAll(";", "/")
                        var branch = seperated.pop();
                        var other = seperated.pop();
                        var feed_root = seperated.pop().replaceAll(";", "/");
                        
                        var file = seperated.reverse().join("_");
        
                        if(feed_root.substring(1,1) === "/") feed_root = feed_root.substring(2, feed_root.length);
        
                        asset_url = new URL(["https://raw.githubusercontent.com", user, repo, branch, other, feed_root, "assets", file].join("/"))
        
                        break;
                }
        
                return (await fetch(asset_url)).arrayBuffer()
            }
        
            return result;
        })
    ]
}