const sheet = new CSSStyleSheet();
const lobby = window.location.href.split("/")[3];
let timer = 0;
AtStart();


async function AtStart () {
    const data = await FetchAllData();
    const round = data.info.round.split("/")[0][-1];

    sheet.replaceSync(data.styles);
    document.adoptedStyleSheets = [sheet];

    //console.log(memes)
    SetupMemes(data.memes);
    SetupPlayers(data.players);

    timer = data.info.timer;
    document.getElementById("round").innerHTML = data.info.round;
    setInterval(() => {
        timer--;
        if (timer <= 0) {
            NextPhase(round);
        }
        document.getElementById("timer").innerHTML = `${(timer/60 < 10? "0":"") + Math.floor(timer/60)}:${(timer%60 < 10? "0":"") + timer%60} remaining`;
    },1000)
    setInterval(async () => {
        const response = await fetch("showmeme?a=gettime");
        if (response) {
            info = await response.json()
            if (info.time <= 0) {
                NextPhase(round);
            }
            timer = info.time;
        }
    },5000)

}

//gets the page all the data needed to show the memes that were made this round
async function FetchAllData () {
   

        const response = await fetch(`showmeme?a=getalldata`);
        if (response) {
            const data = await response.json();
            if (data.send) {
                window.location.href = "/" + `${lobby}/${data.send}`;
                return
            }
            console.log(data)

            /*data:
                {
                    "memes":[{
                        "username":"#",
                        "background_image":"#",
                        "content":["#","#"],
                        "caption_classes":["#","#"],
                        "score":1234,
                        "meme_buddies":["player1","player2"]
                    }]
                    "players":[{
                        "username":"#",
                        "score":1234,
                        "profile_picture":"#"
                    }],
                    "info": {
                        "round":2,
                        "timer":30
                    }
                }
            */
            if (data.hasnext) {
                window.location.href = "/" + `${lobby}/showmeme.html`;
            }
            if (data.not_assigned) {
                window.location.href = "/" + `${lobby}/makeuser.html`;
            }
            console.log("h")
            return data
        }

    
    return {
        memes: [{},{}],
        players: {failed:true},
        info: {failed:true}
    }
}

function SetupMemes (memes) {

        /*
        "memes":[{
                        "username":"#",
                        "background_image":"#",
                        "content":["#","#"],
                        "caption_classes":["#","#"],
                        "score":1234,
                        "meme_buddies":["player1","player2"]
                    }]
        */
    const MemeTemplate = document.getElementById("meme_box_div");
    const TempDiv = document.createElement("div");
    const TempTextArea = document.createElement("textarea");
    const TempText = document.createElement("p");
    const TempImg = document.createElement("img");

    let newMemeBox, newMeme, newCapDiv, newCaption, newPlayerDiv, newInfoDiv, newInfo;
    
    let Mmemes = memes.map(meme => {

        newMemeBox = TempDiv.cloneNode(false)
        newMemeBox.id = "meme_box";

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
        MemeTemplate.appendChild(newMemeBox);
        return meme;

    });

}

function SetupPlayers (players) {
    /*
        "players":[{
            "username":"#",
            "score":1234,
            "profile_picture":"#"
        }],
    */
    const playerBox = document.getElementById("player_box");
    const TempDiv = document.createElement("div");
    const TempText = document.createElement("p");
    const TempImg = document.createElement("img");

    let newPlayerDiv, newInfoDiv,username, image, score, count = 0
    players = players.map(player => {
        newPlayerDiv = TempDiv.cloneNode(false);
        newPlayerDiv.className = `player_div ${count%2 == 0? "grey":""}`;
        for ( var i =0; i<2; i++) {
            if (i == 0) {
                newInfoDiv = TempDiv.cloneNode(false);
                newInfoDiv.className = `pic_div`;
                username = TempText.cloneNode(false);
                username.innerHTML = player.username;
                image = TempImg.cloneNode(false);
                image.className = "profile_pic";
                image.src = player.profile_picture;
                image.alt = "player";
                newInfoDiv.appendChild(image);
                newInfoDiv.appendChild(username);
            } else {
                newInfoDiv = TempDiv.cloneNode(false);
                newInfoDiv.className = "s_div";
                score = TempText.cloneNode(false);
                score.innerHTML = player.score;
                newInfoDiv.appendChild(score);
            }
            newPlayerDiv.appendChild(newInfoDiv);
        }
        playerBox.appendChild(newPlayerDiv);
        count++;
        return player;
    })
}

async function NextPhase(round) {
    const response = await fetch("showmeme?a=nextphase");
    if (response) {
        const data = await response.json();
        if (data.send) {
            window.location.href = "/" + `${lobby}/${data.send}`;
        }else {
            timer = data.time;
        }
    }
} 

