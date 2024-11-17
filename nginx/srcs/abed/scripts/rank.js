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
                    <p class="fw-lighter">Score: ${data.data[2].score}</p>
                </div>
            </div>
        </div>
    `;
    const rankPart = document.querySelector("#rank-part");
    const topThree = document.createElement("div");
    topThree.innerHTML = rank.trim();
    rankPart.append(topThree);
    // ------------------------------------ the rest ranking ------------------------------ //

    const firstCol = document.querySelector("#first-col");
    const secondCol = document.querySelector("#second-col");

    for (let i = 3; data.data[i]; i++) {
        const player = `
            <div class="player-rank">
                <h5>${data.data[i].id}</h5>
                <div class="player-pic" style="background-image: url(${data.data[i].imageProfile})"></div>
                <h5 class="usernamee">${data.data[i].username}</h5>
                <h4>${data.data[i].score}</h4>
            </div>
        `;
        if (i % 2 !== 0) {
            firstCol.innerHTML += player.trim();
        } else {
            secondCol.innerHTML += player.trim();
        }
    }
    const theRest = document.querySelector("#the-rest");
    topThree.insertAdjacentElement('afterend', theRest);
    const theRest2 = document.querySelector("#the-rest2");
    for (let i = 3; data.data[i]; i++) {
        const player = `
            <div class="player-rank">
                <h5>${data.data[i].id}</h5>
                <div class="player-pic" style="background-image: url(${data.data[i].imageProfile})"></div>
                <h5 class="usernamee">${data.data[i].username}</h5>
                <h4>${data.data[i].score}</h4>
            </div>
        `;
        theRest2.innerHTML += player.trim();
    }
}

let isFetched = 0;

export const rankFunct = async () => {
    main.style.display = "none";
    settingPage.style.display = "none";
    chatPage.style.display = "none";
    profileId.style.display = "none";
    friendsPart.style.display = "none";
    rankPart.style.display = "flex";
    if (!document.querySelector("#top-ranked")) { // just temporary solution;
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
}

// rankBtn.addEventListener("click", rankFunct);