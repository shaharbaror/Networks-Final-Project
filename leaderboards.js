const sheet = new CSSStyleSheet();
const lobby = window.location.href.split("/")[3];
AtStart()

async function AtStart() {
    data = await FetchAllMemes();
    
    sheet.replaceSync(data.styles);
    document.adoptedStyleSheets = [sheet];

    SetAllPlayers(data.players, data.winners);
    SetAllMemes(data.memes);
}

async function FetchAllMemes() {
    const response = await fetch("leaderboards?a=getallmemes");
    
    if (response) {
        let data = await response.json()
        if (data.send) {
            window.location.href = "/" + data.send;
            return;
        }
        // data = {
        //     players:[{
        //         username:"shaharbaror",
        //         profile_pic:"defaultPic.png",
        //         score:5
        //     },{
        //         username:"nerya",
        //         profile_pic:"defaultPic.png",
        //         score:4
        //     },{
        //         username:"eyal",
        //         profile_pic:"defaultPic.png",
        //         score:1
        //     }],
        //     winners:[
        //         {
        //             username:"shaharbr",
        //             profile_pic:"defaultPic.png",
        //             score:10
        //         },{
        //             username:"justavit",
        //             profile_pic:"defaultPic.png",
        //             score:7
        //         },{
        //             username:"eli",
        //             profile_pic:"defaultPic.png",
        //             score:6
        //         }]
        // }
        return data;
    }
}

function SetAllMemes(memes) {
    const MemeBoxDiv = document.getElementById("meme_box_div");
    
    const TempDiv = document.createElement("div");
    const TempTextArea = document.createElement("textarea");
    const TempText = document.createElement("p");
    const TempImg = document.createElement("img");

    let newMemeBox, newMeme, newCapDiv, newCaption, newPlayerDiv, newInfoDiv, newInfo;

    let Mmemes = memes.map(meme => {

        newMemeBox = TempDiv.cloneNode(false)
        newMemeBox.className = "meme_box";

        newMeme = TempDiv.cloneNode(false);
        newMeme.className = "meme";

        newPlayerDiv = TempDiv.cloneNode(false);
        newPlayerDiv.className = "meme_info_div";

        console.log(newMeme.childNodes);

        newMeme.className += ` ${meme.meme_classes}`;

        for (var i = 0; i< meme.content.length; i++) {
            newCapDiv = TempDiv.cloneNode(false);
            newCapDiv.className = meme.caption_div_classes[i];
            newCaption = TempTextArea.cloneNode(false);
            newCaption.readOnly = true;
            newCaption.value = meme.content[i];
            newCaption.className = `${meme.caption_classes[i]} caption_basic`;
            newCapDiv.appendChild(newCaption);
            newMeme.appendChild(newCapDiv);
        }
        newMemeBox.appendChild(newMeme);

        for (var i =0; i<2; i++) {
            newInfoDiv = TempDiv.cloneNode(false);
            newInfo = TempText.cloneNode(false);
            console.log(meme.creator);
            newInfo.innerHTML = i==0? meme.creator:`score: ${meme.score}`;
            newInfoDiv.appendChild(newInfo);
            newPlayerDiv.appendChild(newInfoDiv);
        }

        newInfoDiv = TempDiv.cloneNode(false);
        for (var i = 0; i < meme.meme_buddies.length; i++){
            newInfo = TempImg.cloneNode(false);
            newInfo.src = meme.meme_buddies[i];
            newInfo.alt = "meme_buddy";
            newInfo.className = "meme_buddy";

            newInfoDiv.appendChild(newInfo);

        }
        newPlayerDiv.appendChild(newInfoDiv);

        newMemeBox.appendChild(newPlayerDiv);


        console.log(newMemeBox.childNodes);
        MemeBoxDiv.appendChild(newMemeBox);
        return meme;

    });
}

function SetAllPlayers(players = true, winners) {
    
    
    for (var i =1; i<=3;i++) {
        console.log(winners[i-1])
        document.getElementById(`img${i}`).src = winners[i-1].profile_picture;
        document.getElementById(`player${i}`).innerHTML = winners[i-1].username;
    }

    if (players) {
        return;
    }
    const PlayerDiv = document.getElementById("other_players");
    
    const TempDiv = document.createElement("div");
    const TempText = document.createElement("p");
    const TempImg = document.createElement("img");

    let newPlayer,pD,score, newPic, newName, rating, pos = 4
    let Pplayers = players.map(player => {
        newPlayer = TempDiv.cloneNode(false);
        newPlayer.className = "player";
        for (var i =0; i<2; i++) {
            pD = TempDiv.cloneNode(false);
            if (i === 0) {
                pD.className = "player_info";
                rating = TempText.cloneNode(false);
                rating.innerHTML = pos + ".";
                pD.appendChild(rating);
                newPic = TempImg.cloneNode(false);
                newPic.className = "profile_pic";
                newPic.src = player.profile_pic;
                pD.appendChild(newPic);
                newName = TempText.cloneNode(false);
                newName.innerHTML = player.username;
                pD.appendChild(newName);
            }
            else {
                pD.className = "player_score";
                score = TempText.cloneNode(false);
                score.innerHTML = `score: ${player.score}`;
                pD.appendChild(score);
            }
            newPlayer.appendChild(pD);
        }
        PlayerDiv.appendChild(newPlayer);
        return player;
    });
}

async function ToLobby() {
    const response = await fetch("leaderboards?a=tolobby");
    if (response){
        window.location.href = "/" + `${lobby}/lobby.html`;

    }
    
}