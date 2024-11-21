export const chatButton = document.querySelector("#chat");
export const chatPage = document.querySelector("#chat-part");

import { profileId } from "./profile.js";
import { main } from "./home.js";
import {settingPage} from "./setting.js";
import { rankPart } from "./rank.js";
import { friendsPart, friendsFunction } from "./friends.js";

export const chatFunction = () => {
    profileId.style.display = "none";
    main.style.display = "none";
    settingPage.style.display = "none";
    rankPart.style.display = "none";
    friendsPart.style.display = "none";
    chatPage.style.display = "block";
    const chats = document.querySelector("#chats");
    if (chats) {
        chats.innerHTML = "";
    }
    data_characters();
}

// chatButton.addEventListener("click", chatFunction);

const container = document.querySelector("#msgs");

const scrollToBottom = ()=> {
    container.scrollTop = container.scrollHeight;
    
}

const data_characters = async () => {
    const characters = await friendsFunction();
    const chats1 = document.querySelector("#chats");
    characters.forEach(character => {
        const userStr = `
            <p>${character.username}</p>
            <p class="user-dots"><button class="btn" style="background-color: rgb(0, 12, 45, 0.90);"><i class="fa-solid fa-ellipsis-vertical"></i></button></p>
        `;
        const user = document.createElement("div");
        user.classList.add("user");
        user.innerHTML = userStr.trim();
        chats1.appendChild(user);
        const handleDots = () => {
            const existingBlock = document.querySelector(".block-style");
            if (existingBlock)
                existingBlock.remove();
            else {
                const blockElement = document.createElement("div");
                blockElement.classList.add("block-style"); // style in css
                blockElement.innerHTML = "Block";
                user.appendChild(blockElement);
            }
        }
        const dots = user.querySelector(".user-dots button");
        dots.addEventListener("click", handleDots);
        const handleUserClick = (userElement) => {
            const users = document.querySelectorAll("#chats div");
            users.forEach(user => {
                user.classList.remove("selected-user");
                user.style.width = "90%";
                user.style.boxShadow = "0 0 5px #0e2c2e";
            });
            userElement.style.boxShadow = "0 0 5px #9bf9ff";
            userElement.classList.add("selected-user");
            document.querySelector("#chat-pic").style.backgroundImage = `url("${character.imageProfile}")`;
            document.querySelector("#secondd h3").innerHTML = character.username;
        };
        user.addEventListener("click", () => handleUserClick(user));
    });
};

const sendMsg = document.querySelector("#something");

const frontChat = (event)=> {
    if (event.key === "Enter" && sendMsg.value != "") {
        if (sendMsg.value != "friend" && sendMsg.value != "alaykum salam") {
            const msg = document.createElement("div");
            msg.classList.add("my-msg");
            document.querySelector("#msgs").appendChild(msg);
            msg.innerHTML = `${sendMsg.value}`;
            sendMsg.value = "";
            scrollToBottom();
        } else {
            const msg = document.createElement("div");
            document.querySelector("#msgs").appendChild(msg);
            msg.classList.add("friend-msg");
            msg.innerHTML = `${sendMsg.value}`;
            sendMsg.value = "";
            scrollToBottom();
        }
    }
}

const frontChat2 = (event)=> {
    if (sendMsg.value != "") {
        if (sendMsg.value != "friend" && sendMsg.value != "alaykum salam") {
            const msg = document.createElement("div");
            msg.classList.add("my-msg");
            document.querySelector("#msgs").appendChild(msg);
            msg.innerHTML = `${sendMsg.value}`;
            sendMsg.value = "";
            scrollToBottom();
        } else {
            const msg = document.createElement("div");
            document.querySelector("#msgs").appendChild(msg);
            msg.classList.add("friend-msg");
            msg.innerHTML = `${sendMsg.value}`;
            sendMsg.value = "";
            scrollToBottom();
        }
    }
}

sendMsg.addEventListener("keyup", frontChat);
const sendMsgBtn = document.querySelector("#input-group-text-chat");
sendMsgBtn.addEventListener("click", frontChat2);