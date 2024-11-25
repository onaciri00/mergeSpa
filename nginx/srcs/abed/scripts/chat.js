export const chatButton = document.querySelector("#chat");
export const chatPage = document.querySelector("#chat-part");

import { profileId } from "./profile.js";
import { main } from "./home.js";
import {settingPage} from "./setting.js";
import { rankPart } from "./rank.js";
import { friendsPart, friendsFunction } from "./friends.js";
import { get_csrf_token } from "./register.js";
import { newDataFunc } from "../script.js";

export const chatFunction = () => {
    profileId.style.display = "none";
    main.style.display = "none";
    settingPage.style.display = "none";
    rankPart.style.display = "none";
    friendsPart.style.display = "none";
    chatPage.style.display = "block";
    const chats = document.querySelector("#chats");
    document.querySelector('#chat-pic').style.display = 'none';
    document.querySelector('#input-group-chat').style.display = 'none';
    document.querySelector('#user-status').style.display = 'none';
    const ul = document.getElementById('msgs');
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
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

async function getRoomName(recipient, sender) {
    const token = await get_csrf_token();
    const response = await fetch('http://127.0.0.1:8003/chat/api/room_name/', {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json',
            'X-CSRFToken':  token
        },
        body: JSON.stringify({
            'user1':  sender,
            'user2': recipient,
        })
        
    });
    if (response.ok) {
        // console.log("ok");
        const data = await response.json();
        // console.log(`this user : ${data.room_name}`);
        return data.room_id;
    }
    else {
        
        console.log("no");
    }
}

function createRoomContainer(roomName) {
    const msgContainer = document.getElementById('msgs');
    const roomTag = document.createElement('div');
    roomTag.id = `chat-log-${roomName}`;
    roomTag.style.display = 'none';
    msgContainer.appendChild(roomTag);
}

function showRoom(recipient, sender) {
    document.querySelectorAll('.my-msg').forEach(log => {
        log.style.display = 'none';
    });
    document.querySelectorAll('.friend-msg').forEach(log => {
        log.style.display = 'none';
    });
    checkBlockStatus(recipient, sender);
    // const selectedUser = document.getElementById('msgs');
    // selectedUser.style.display = 'flex';
}


async function block_user(recipient, room_id, sender) {
    const token = await get_csrf_token();
    const response = await fetch('http://127.0.0.1:8003/chat/api/block_user/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken':  token
        },
        body: JSON.stringify ({
            'blocker' : sender,
            'blocked': recipient,
            'room_id': room_id
        })
    });
    if (response.ok) {
        const data = await response.json();
    }
    else {
        console.log('fetch block users not working', response.status, response.statusText);
    }
}

const unblockUser = async (room_id) => {
    const token = await get_csrf_token();
    const response = await fetch('http://127.0.0.1:8003/chat/api/unblock_user/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': token,
        },
        body: JSON.stringify({ 'room_id': room_id }),
    });

    if (response.ok) {
        const data = await response.json();
        return data.etat;
    } else {
        const error = await response.json();
        return false;
    }
};


async function is_user_blockes(room_id) {
    const token = await get_csrf_token();
    const response = await fetch('http://127.0.0.1:8003/chat/api/is_user_blocked/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken':  token
        },
        body: JSON.stringify ({
            'room_id' : room_id
        })
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    }
    else {

        console.log('fetch isUserBloked not working', response.status, response.statusText);
    }
}

const checkBlockStatus = async (recipient, sender) => {
    const room_id = await getRoomName(recipient, sender);
    const data = await is_user_blockes(room_id);
    if (data.etat) {
        document.querySelector('#something').disabled = false;
    } else {
        document.querySelector('#something').disabled = false;
    }
};

const data_characters = async () => {

    const characters = await friendsFunction();
    const thisCurrUser = await newDataFunc();
    const chats1 = document.querySelector("#chats");
    var chatSocket = null;
    var room_id = 0;
    var check = "";
    let blockEtat = "block";
    let socketGlob = null;

    socketGlob = new WebSocket(
        'wss://' + window.location.hostname + ':8003/wss/chat/'
    );

    socketGlob.onopen = function(e){
        console.log('global socket connection open');
    }

    socketGlob.onmessage = (e) => {

        console.log('hello socket');
        const data = JSON.parse(e.data);
        const type = data['type'];
        const author = data['author'];
        const recipient = data['recipient'];

        if (type === 'play_invitation' && author !== thisCurrUser.username) {

            const _confirm = confirm(`you have been invited to pong match with ${author}`);
            console.log("confirmationzz", _confirm);

            socketGlob.send(JSON.stringify ({
                'type': 'response',
                'sender' : author,
                'recipient': "chaguer",
                'confirmation': _confirm
            }))
        }

        if (data.type === 'response_invitation' && author === thisCurrUser.username) {

            const _confirm = data['confirmation'];
            const recipient = data['recipient'];
            console.log("confirmation", data);

            if (_confirm){
                alert(`${recipient} has accept the invitation`);
            }
            else{
                alert(`${recipient} has not accept the invitation`);
            }

        }

    }
    console.log(characters);
    characters.forEach(character => {
        const userStr = `
            <p>${character.username}</p>
            <p class="user-dots">
                <button class="btn" style="background-color: rgb(0, 12, 45, 0.90);">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </button>
            </p>
        `;
        const user = document.createElement("div");
        user.classList.add("user");
        user.innerHTML = userStr.trim();
        chats1.appendChild(user);
        
        const handleDots = async () => {
            room_id = await getRoomName(character.username, thisCurrUser.username);
            check = await is_user_blockes(room_id);
            const existingBlock = document.querySelector(".block-style");
            if (existingBlock)
                existingBlock.remove();
            else {
                const blockContainer = `
                    <button id="play-${character.username}" class="block-child">Play</button>
                    <button id="block-${character.username}" class="block-child">${blockEtat}</button>
                `;
                const blockElement = document.createElement("div");
                blockElement.classList.add("block-style"); // style in css
                if (check.etat === false)
                    blockEtat = "Block";
                else
                    blockEtat = "Unblock";
                blockElement.innerHTML = blockContainer.trim();
                user.appendChild(blockElement);

                // on click play buuton
                document.getElementById(`play-${character.username}`).addEventListener('click', async function (e) {
                   
                    
                    // if (chatSocket !== null) {
                    //     console.log("---> the first step", character.username, thisCurrUser.username);
                        socketGlob.send(JSON.stringify({
                            'type': 'requestFriend',
                            'recipient': character.username,
                            'sender': thisCurrUser.username
                        }));
                    // }
                });

                // on click block buuton 
                const blockTag = document.getElementById(`block-${character.username}`);
                blockTag.addEventListener('click', async function(e) {
                    if (check.etat === false) {
                        console.log(`room id in block ${user}`);
                        block_user(character.username, room_id, thisCurrUser.username);
                        alert(`you block ${character.username}`);
                        blockTag.innerHTML = "Unblock";
                    }
                    else {
                        unblockUser(room_id);
                        blockTag.innerHTML = "Block";
                        alert(`you unblock ${character.username}`);
                    }
                });
            }

        }

        const dots = user.querySelector(".user-dots button");
        dots.addEventListener("click", handleDots);


        const handleUserClick = async(userElement) => {
            // =========== just style ================
            const users = document.querySelectorAll("#chats div");
            users.forEach(user => {
                // for cleaning;
                user.classList.remove("selected-user");
                user.style.width = "90%";
                user.style.boxShadow = "0 0 5px #0e2c2e";
            });
            userElement.style.boxShadow = "0 0 5px #9bf9ff";
            userElement.classList.add("selected-user");
            document.querySelector("#chat-pic").style.display = 'block'
            document.querySelector('#input-group-chat').style.display = 'flex'
            document.querySelector('#user-status').style.display = 'block';
            const picTag = document.querySelector("#chat-pic");
            picTag.style.backgroundImage = `url("${character.imageProfile}")`;
            document.querySelector("#secondd h3").innerHTML = character.username;
        

            picTag.addEventListener('click',  () => {
                chatPage.style.display = "none";
                profileId.style.display = "flex";
                
            });
            // =============== Modify here ==============
            console.log("user id ", character.id);
            const room_id = await getRoomName(character.username, thisCurrUser.username);
            console.log(`Room name: ${room_id}`);
            showRoom(character.username, thisCurrUser.username);
            initWebSocket(room_id, character.username);
        };
        user.addEventListener("click", async function () { handleUserClick(user)} );
    });

    function initWebSocket(roomId, username) {

        if (chatSocket !== null) {
            chatSocket.close();
            console.log('socket closed');
            const ul = document.getElementById('msgs');
            while (ul.firstChild) {
                ul.removeChild(ul.firstChild);
            }
        }
        chatSocket = new WebSocket(
            'wss://' + window.location.hostname + ':8003/wss/chat/' + roomId + '/'
        );
    
        chatSocket.onopen = function(e) {
    
            console.log("socket is connecting" , e);
        }
    
        chatSocket.onmessage = (e) => {
            
            const data = JSON.parse(e.data);
            const message = data['message'];
            const type = data['type'];
            const messageBlock = data['message_block'];
            const author = data['author'];
            const isBlocked = data['is_blocked'];

            // if (type === 'play_invitation' && author !== thisCurrUser.username) {

            //     const _confirm = confirm(`you have been invited to pong match with ${author}`);
            //     console.log("confirmationzz", _confirm);

            //     chatSocket.send(JSON.stringify ({
            //         'type': 'response',
            //         'sender' : author,
            //         'recipient': username,
            //         'confirmation': _confirm
            //     }))
            // }

            // if (data.type === 'response_invitation' && author === thisCurrUser.username) {

            //     const _confirm = data['confirmation'];
            //     const recipient = data['recipient'];
            //     console.log("confirmation", data);

            //     if (_confirm){
            //         alert(`${recipient} has accept the invitation`);
            //     }
            //     else{
            //         alert(`${recipient} has not accept the invitation`);
            //     }

            // }
    
                const msgTag = document.createElement('div');
                msgTag.textContent = message;
                if (author === thisCurrUser.username) {
                    msgTag.classList.add('my-msg');
                }
                else {
                    msgTag.classList.add('friend-msg');
                }
                document.getElementById('msgs').appendChild(msgTag);
    
        }
    
        // chatSocket.onclose = function(e) {
        //     console.log("socket closed unexpectedly", e);
        // }
    
        document.querySelector('#something').onkeyup = function(e) {
            if (e.key === 'Enter') {
                document.querySelector('#input-group-text-chat').click();
            }
        };
    
        document.querySelector('#input-group-text-chat').onclick = function(e) {
            var messageinput = document.querySelector('#something');
            var message = messageinput.value;
    
            if (message !== "" && chatSocket.readyState === WebSocket.OPEN) {
                chatSocket.send(JSON.stringify ({
                  'message': message,
                  'author' : thisCurrUser.username,
                  'roomId': roomId,
                  'recipient' : username
                }));
                messageinput.value = '';
                scrollToBottom();
            }
            else {
                messageinput.value = '';
            }
        };
    }
};

// const sendMsg = document.querySelector("#something");

// const frontChat = (event)=> {
//     // alert("chat enter");
//     if (sendMsg.value != "friend" && sendMsg.value != "alaykum salam") { // you are the sender;
//         const msg = document.createElement("div");
//         msg.classList.add("my-msg");
//         document.querySelector("#msgs").appendChild(msg);
//         msg.innerHTML = `${sendMsg.value}`;
//         sendMsg.value = "";
//         scrollToBottom();
//     } else {                                                            // you are the receiver;
//         const msg = document.createElement("div");
//         document.querySelector("#msgs").appendChild(msg);
//         msg.classList.add("friend-msg");
//         msg.innerHTML = `${sendMsg.value}`;
//         sendMsg.value = "";
//         scrollToBottom();
//     }
// }

// const sendMsgBtn = document.querySelector("#input-group-text-chat");
// sendMsgBtn.addEventListener("click", frontChat);
// if (sendMsg) {
//     sendMsg.addEventListener("keydown", (event)=> {
//         if (event.key === "Enter") {
//             frontChat();
//         }
//     });
// }
