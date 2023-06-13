const sheet = new CSSStyleSheet();
const lobby = window.location.href.split("/")[3];
let vote = 0;
let time = 20;

Vote();
setInterval(() => {
    Vote();
    
},20000)

Count();
let timer = setInterval(Count,1000);

function Count() {
    document.getElementById("time").innerHTML = `00:${time >= 10? time: "0" + time}`;
    time -= 1;
}

async function Vote() {
    if (vote >= 1 && vote <= 2) {
        
        await fetch(`ratememe?a=rated&v=${vote}`);
    }
    FetchImages();
} 

async function FetchImages() {
    let data
    const response = await fetch("ratememe?a=getmeme");
    if (response.ok) {
        data = await response.json()
        if (data.send) {
            window.location.href = "/" + `${lobby}/${data.send}`;
            return
        }
        if (data.hasnext) {
            window.location.href = "/" + `${lobby}/showmeme.html`;
        }
    }
    /* data:
    {
        "style":"",
        "captions": num,
        "content": ["",""],
        "user": ""
    }
    */ 

    //get the style for the meme and captions
    sheet.replaceSync(data.styles);
    document.adoptedStyleSheets = [sheet];

    const captionDiv = document.createElement("div");
    const caption = document.createElement("textarea");
    captionDiv.appendChild(caption);
    console.log(captionDiv);

    const meme = document.getElementById("meme");
    
    //clear the captions of the previus meme
    if (meme.hasChildNodes()) {
        while (meme.lastChild !== meme.firstChild) {
            console.log(meme.lastChild);
            meme.removeChild(meme.lastChild);
            //inputDiv.removeChild(inputDiv.lastChild);
            console.log("earased")
        }
    }
    meme.className = data.meme_calsses

    for (var i =0; i< data.captions; i++) {
        let cdClone = captionDiv.cloneNode(true);
        //cdClone.appendChild(document.createElement("textarea"));
        cdClone.id = `c${i}d`;
        meme.className = data.meme_classes
        cdClone.childNodes[0].id = `caption${i}`;
        cdClone.childNodes[0].className = data.caption_classes[i];
        console.log(data.content[i]);
        cdClone.childNodes[0].value = data.content[i];
        cdClone.childNodes[0].readonly = true;
        meme.appendChild(cdClone);
    }

    //set up a working timer
    time = 20
    clearInterval(timer);
    Count();
    timer = setInterval(Count,1000);
    
    
    
   

}

function UpVote() {
    console.log("he");
    vote = 2;
}

function DownVote() {
    vote = 1;
}

function Meh() {
    vote = 0;
}