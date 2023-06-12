const lobby = window.location.href.split("/")[3];
AtStart();

async function AtStart () {
    const data = await FetchAllData();

    //console.log(memes)
    SetupMemes(data.memes);

}

//gets the page all the data needed to show the memes that were made this round
async function FetchAllData () {
   

        const response = await fetch(`showmeme?a=getalldata`);
        if (response) {
            const data = await response.json();
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
        <div>
            <div> <-- meme
                <textarea></textarea> <-- caption
                <textarea></textarea> <-- caption
            </div>
            <div> <-- maker info
                <div>
                    <p> username </p>
                <div>
                <div>
                    <image /> <-- meme buddies
                </div>
                <div>
                    <p> score </p>
                </div>
            </div>
                

    */
    /*
    const memeBoxDiv = document.getElementById("meme_box_div");
    const memeBox = document.createElement("div");
    memeBox.className = "meme-box";

    const Meme = document.createElement("div");
    Meme.id = "meme";
    const caption = document.createElement("textarea");
    caption.readOnly = true;
    
    let newMemeBox, newMeme, newCaption;
    memes.map(meme => {
        newMemeBox = memeBox.cloneNode(true);
        newMeme = Meme.cloneNode(true);
        newMeme.style.backgroundImage = `url("${meme.background_image}")`;
        for (var i = 0; i < meme.contnet.length ; i++) {
            newCaption = caption.cloneNode(true);
            newCaption.className = meme.caption_classes[i];
            newCaption.value = meme.contnet[i];
            newMeme.appendChild(newCaption);
        }
        newMemeBox.appendChild(newMeme);
        newMemeBox.appendChild
    })
    */

    /*
        <div id="meme_box">
            <div class="meme">
                <textarea readonly></textarea>
            </div>
            <div class="meme-info">
                <div class="meme-info-div">
                    <p>username</p>
                </div>
                <div>
                    <img class="meme-buddies" />
                </div>
                <div>
                    <p>score:</p>
                </div>
            </div>
        </div>
    */

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
    const MemeTemplate = document.getElementById("meme_box");

    let newMemeBox, newMeme, newCaption;
    
    let Mmemes = memes.map(meme => {
        newMemeBox = MemeTemplate.cloneNode(true);
        newMemeBox.childNodes[1].style.backgroundImage = `url(${meme.background_image})`;
        MemeTemplate.appendChild(newMemeBox);
        return meme;

    })

    

}