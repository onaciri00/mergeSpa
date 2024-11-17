export const rankBtn = document.querySelector("#rank");
export const rankPart = document.querySelector("#rank-part");

import { main } from "./home.js";
import { settingPage } from "./setting.js";
import { chatPage } from "./chat.js";
import { profileId } from "./profile.js";
import { friendsPart } from "./friends.js";

const getRank = (data) => {
    const rank = `
        <h3 style="text-align: center;">LEADERBOARD</h3>
        <div id="top-ranked">
            <div id="first-three">
                <div id="gold">
                    <p style="margin: 0">${data.data[0].username}</p>
                    <div id="first-user-pic" style="background-image: url(${data.data[0].imageProfile})">
                        <i class="fa-brands fa-pagelines leaf"></i>
                        <i class="fa-solid fa-medal"></i>
                    </div>
                    <p class="fw-lighter">Score: ${data.data[0].score}</p>
                </div>
                <div id="silver">
                    <p style="margin: 0">${data.data[1].username}</p>
                    <div id="second-user-pic" style="background-image: url(${data.data[1].imageProfile})">
                        <i class="fa-solid fa-medal"></i>
                    </div>
                    <p class="fw-lighter">Score: ${data.data[1].score}</p>
                </div>
                <div id="bronze">
                    <p style="margin: 0">${data.data[2].username}</p>
                    <div id="third-user-pic" style="background-image: url(${data.data[2].imageProfile})">
                        <i class="fa-solid fa-medal"></i>
                    </div>
                    <p class="fw-lighter">Score: ${data.data[1].score}</p>
                </div>
            </div>
        </div>
    `
    const rankPart = document.querySelector("#rank-part");
    const topThree = document.createElement("div");
    topThree.innerHTML = rank.trim();
    rankPart.append(topThree);
    console.log(topThree);
}

export const rankFunct = async () => {
    main.style.display = "none";
    settingPage.style.display = "none";
    chatPage.style.display = "none";
    profileId.style.display = "none";
    friendsPart.style.display = "none";
    rankPart.style.display = "flex";
    // document.querySelector("#online-friends").style.display = "none";
    const response = await fetch("/users_rank/");
    console.log("rank response: ", response);
    if (response.ok) {
        // alert("here.");
        const jsonData = await response.json();
        if (jsonData.status === "success") {
            console.log("data of rank: ", jsonData);
            getRank(jsonData);
        }
    }
}

// rankBtn.addEventListener("click", rankFunct);