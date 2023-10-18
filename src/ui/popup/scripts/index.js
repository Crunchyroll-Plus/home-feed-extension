import { github } from "../../../api/scripts/github.js";

var github_repo = document.body.querySelector("#github");

github_repo.addEventListener("keyup", (event) => {
   if(event.key === "Enter") github.home_feed.setLink(github_repo.value);
});

(async () => {
    github_repo.value = await github.home_feed.getLink();
})();