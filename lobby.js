const lobby = window.location.href.split("/")[3];
const PlayersDiv = document.getElementById("players_div");
console.log(PlayersDiv.childNodes)


AtStart()
function AtStart() {
    setInterval( async () => {
        const response = await fetch("lobby?a=getusers");
        if (response) {
            const data = await response.json()
            if (data.send) {
                window.location.href = "/" + `${lobby}/${data.send}`;
            }
            if (data.is_incharge) {
                document.getElementById("start_game").style.visibility = "visible";
                document.getElementById("start_game").disabled = true;
            } else {
                document.getElementById("start_game").style.visibility = "hidden";
                document.getElementById("start_game").disabled = false;
            }
            ShowPlayers(data);
            
        }
    }, 2000);
}

function ShowPlayers(players) {
    let PlayersRow;
    const PlayersDiv = document.getElementById("players_div");
    while (PlayersDiv.childNodes.length > 0) {
        PlayersDiv.removeChild(PlayersDiv.lastChild);
    }
    console.log(players);
    for (var i = 0; i< players.players.length; i++){
        var player = players.players[i];
        if (PlayersDiv.childNodes.length > 0) {
            while (PlayersDiv.childNodes[-1].length > 3) {
                PlayersDiv.childNodes[-1].removeChild();
            }
            let newPlayer = document.createElement("div");
            newPlayer.className = "player-div";

            let playerPic = document.createElement("img");
            playerPic.src = player.profile_pic;
            playerPic.alt = "profile-pic";

            newPlayer.appendChild(playerPic);
            let username = document.createElement("p");
            username.innerHTML = player.username;
            newPlayer.appendChild(username);
        
            if (PlayersDiv.childNodes[-1].length >= 3) {
                PlayersRow = document.createElement("div");
                PlayersRow.className = "player-row";
                PlayersRow.id = "player_row";
                

                PlayersRow.appendChild(newPlayer);
                PlayersDiv.appendChild(PlayersRow);
                return player;
            } else {
                PlayersDiv.childNodes[-1].appendChild(newPlayer);
                return playerl
            }

        }
        let newPlayer = document.createElement("div");
        newPlayer.className = "player-div";

        let playerPic = document.createElement("img");
        playerPic.src = player.profile_pic;
        playerPic.alt = "profile-pic";

        newPlayer.appendChild(playerPic);
        let username = document.createElement("p");
        username.innerHTML = player.username;
        newPlayer.appendChild(username);

        PlayersRow.appendChild(newPlayer);
        PlayersDiv.appendChild(PlayersRow);
        return player;
    }

}

async function StartGame() {
    const response = await fetch("lobby?a=startgame");
    if (response){
        window.location.href = "/" + `${lobby}/firstpage.html`;

    }
    
}