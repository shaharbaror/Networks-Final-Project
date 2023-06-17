import json
from random import randint
import time

from mememaker import MemeMaker

PHASES = ["lobby.html", "firstpage.html", "waitingpage.html", "ratememe.html", "showmeme.html", "leaderboards.html"]
class Protocol:

    @staticmethod
    def receive(socket):
        return socket.recv(1024)

    # receives the http request and returns the type of request
    @staticmethod
    def proces_request(request):
        data = request.split("\r\n\r\n")
        header = data[0].split("\r\n")
        header = header[0].split(" ")
        data.append("")
        return header, data[1]

    @staticmethod
    def get_file_type(filenames):

        filename = filenames.split(".")[-1]

        if 'jpg' in filename or 'jpeg' in filename or 'ico' in filename or 'gif' in filename or 'png' in filename:
            filename = f"image/{filename}"
        elif 'js' in filename:
            filename = f"text/javascript"
        else:
            filename = f"text/{filename}"

        return filename

    @staticmethod
    def create_msg(body: bytes, body_type):
        # gets the message body and its type, and returns the full http request template for use
        header = f"HTTP/1.0 200 OK \r\nContent-Length:{len(body)}\r\nContent-Type:{body_type}; charset=utf-8\r\n\r\n"
        response = header.encode()
        response += body
        return response

    @staticmethod
    def create_msg_lasting(body: bytes, body_type):

        # gets the message body and its type, and returns the full http request template for use
        header = f"HTTP/1.0 200 OK\r\nConnection: keep-alive \r\nContent-Length:{len(body)}\r\nContent-Type:{body_type}; charset=utf-8\r\n\r\n"
        response = header.encode()
        response += body
        return response

    @staticmethod
    def update_json(rnd: int):

        styles = MemeMaker.getStyles(rnd)
        captions = MemeMaker.get_caption_amount(rnd)

        res = ("{" + f'''
                "is_ok": true,
               "memeIndex": {rnd},
               "captions": {captions},
               "caption_classes":{MemeMaker.classes(captions, rnd, "caption")},
               "caption_div_classes":{MemeMaker.classes(captions, rnd, "cap_div")},
               "meme_classes":"meme{rnd}",
               "styles":"{f'{styles}'[2:][:-1]}"
               
               ''').encode()
        return res

    @staticmethod
    def prepare_meme(meme, creator):
        player = creator
        styles = MemeMaker.getStyles(meme["index"])
        if player == -1:
            player = meme["creator"]
        contents = b"["
        for i in meme["captions"]:
            contents += b" \"" + str(i).encode() + b"\","
        contents = contents[:-1] + b"]"
        print(contents)
        res = ("{" + f'''
                "creator":{player},
                "captions":{len(meme["captions"])},
                "caption_classes":{MemeMaker.classes(len(meme["captions"]), meme["index"], "caption")},
                "caption_div_classes":{MemeMaker.classes(len(meme["captions"]), meme["index"], "cap_div")},
                "meme_classes":"meme{meme["index"]}",
                "styles":"{f'{styles}'[2:][:-1]}",
                "content":{f'{contents}'[2:][:-1]}
            ''' + "}").encode()
        print(res)

        return res
        # styles = MemeMaker.getStyles(index)
        # captions = MemeMaker.get_caption_amount(index)
        #
        # res = ("{" + f'''
        #                 "creator": {creator},
        #                "captions": {captions},
        #                "styles":"{f'{styles}'[2:][:-1]}",
        #                "content":{captions2},
        #                ''' + "}").encode()
        #
        # return res

    @staticmethod
    def generate_lobby_name():
        word = ""
        for i in range(8):
            word += chr(randint(ord('A'), ord('Z')))
        print(word)
        return word

    @staticmethod
    def new_lobby(username, ip):
        # #option 1
        # with open("lobbies.json","r") as f:
        #     lobbies = json.load(f)
        #     with open("cleanLobby.json","r") as f2:
        #         clean_lobby = json.load(f2)
        # clean_lobby["players"][ip] = username
        # lobbies[lobby] = clean_lobby
        # with open("lobbies.json", "w") as f:
        #     json.dump(lobbies, f)

        # option 2
        with open("cleanLobby.json", "r") as f:
            clean_lobby = json.load(f)

        clean_lobby["players"].append(username)
        clean_lobby["players_ip"].append(ip)
        clean_lobby["score"].append(0)
        clean_lobby["finished"].append(False)
        clean_lobby["remaining_rolls"].append(0)
        clean_lobby["started"].append(False)
        clean_lobby["players_meme"].append(-1)

        return clean_lobby

    @staticmethod
    def add_player(username, ip, lobby):

        lobby["players"].append(username)
        lobby["players_ip"].append(ip)
        lobby["score"].append(0)
        lobby["finished"].append(False)
        lobby["remaining_rolls"].append(0)
        lobby["started"].append(False)
        lobby["players_meme"].append(-1)

        return lobby

    @staticmethod
    def remove_player(ip, lobby):
        print("hey")
        player_index = lobby["players_ip"].index(ip)
        lobby["players_ip"].pop(player_index)
        lobby["players"].pop(player_index)
        lobby["score"].pop(player_index)
        lobby["finished"].pop(player_index)
        lobby["remaining_rolls"].pop(player_index)
        lobby["started"].pop(player_index)
        return lobby

    @staticmethod
    def get_phase(phase):
        return PHASES[phase]

    @staticmethod
    def show_all_memes(lobby):
        msg = '''{
                    "memes":[ '''

        memes = lobby["memes_this_round"]

        meme_types = []
        caption_classes = []
        stylesheet = b""
        contents = b"["

        for meme in memes:
            if meme["index"] not in meme_types:

                meme_types.append(meme["index"])
                stylesheet += MemeMaker.getStyles(meme["index"])  # currently also showing background images
            contents = b"[ "
            for i in meme["captions"]:

                contents += b" \"" + str(i).encode() + b"\","
            contents = contents[:-1] + b"]"

            msg += "{" + f'''
                "creator":{lobby["players"][meme["creator"]]},
                "background_image":"{MemeMaker.getImage(meme["index"])}",
                "content":{f'{contents}'[2:][:-1]},
                "caption_classes":{MemeMaker.classes(len(meme["captions"]), meme["index"], "caption")},
                "caption_div_classes":{MemeMaker.classes(len(meme["captions"]), meme["index"], "cap_div")},
                "meme_classes":"meme{meme["index"]}",
                "score":{meme["score"]},
                "meme_buddies":["defaultPic.png"]
            ''' + "},"
        msg = msg[:-1] + '],"players":['

        for player in range(len(lobby["players"])):
            msg += "{" + f'''
                "username":{lobby["players"][player]},
                "score":{lobby["score"][player]},
                "profile_picture":"defaultPic.png"
            ''' + "},"

        msg = msg[:-1] + "]," + '"info":{' + f'"round":"round {lobby["round"]}/{lobby["rounds"]}", "timer":30' + "},"
        msg += f"\"styles\":\"{f'{stylesheet}'[2:][:-1]}\"" + "}"

        return msg

    #NEED TO CREATE A SPECIAL CLASS NAMES FOR EVERY SINGLE MEME INCLUDING THE BI

    @staticmethod
    def add_memes(lobby):
        while len(lobby["memes_this_round"]) >= 1:
            lobby["all_memes_made"].append(lobby["memes_this_round"][0])
            lobby["memes_this_round"].pop(0)
        return lobby

    @staticmethod
    def leaderboard_show(lobby):
        memes = lobby["all_memes_made"]
        print(memes)
        meme_types = []

        msg = '''{
                            "memes":[ '''

        stylesheet = b""

        for meme in memes:
            print(meme)
            print(meme["index"])
            if meme["index"] not in meme_types:

                meme_types.append(meme["index"])
                stylesheet += MemeMaker.getStyles(meme["index"])  # currently also showing background images
            contents = b"["
            for i in meme["captions"]:

                contents += b" \"" + str(i).encode() + b"\","
            contents = contents[:-1] + b"]"

            msg += "{" + f'''
                "creator":{lobby["players"][meme["creator"]]},
                "background_image":"{MemeMaker.getImage(meme["index"])}",
                "content":{f'{contents}'[2:][:-1]},
                "caption_classes":{MemeMaker.classes(len(meme["captions"]), meme["index"], "caption")},
                "caption_div_classes":{MemeMaker.classes(len(meme["captions"]), meme["index"], "cap_div")},
                "meme_classes":"meme{meme["index"]}",
                "score":{meme["score"]},
                "meme_buddies":["defaultPic.png"]
            ''' + "},"
        msg = msg[:-1] + '],"winners":['
        top3 = []
        for i in range(len(lobby["score"])):
            for x in range(len(top3)):
                if lobby["score"][i] > lobby["score"][x]:
                    top3.insert(x, i)
            if i not in top3:
                top3.append(i)
        for i in range(len(top3)):
            msg += "{" + f'''
                           "username":{lobby["players"][top3[i]]},
                           "score":{lobby["score"][top3[i]]},
                           "profile_picture":"defaultPic.png"
                       ''' + "},"
            if i == 3:
                msg = msg[:-1] + '],"players":[ '
        msg = msg[:-1] + '],'

        msg += f"\"styles\":\"{f'{stylesheet}'[2:][:-1]}\"" + "}"

        return msg

    @staticmethod
    def get_all_users (lobby, ip):
        msg = "{ \"players\":[{"
        for i in range(len(lobby["players"])):
            msg += f'''
                "username":{lobby["players"][i]},
                "profile_picture":"defaultPic.png"
            ''' + "},{"
        player_index = lobby["players_ip"].index(ip)
        msg = msg[:-2] + "],\"is_incharge\":"
        if player_index == 0:
            msg += "true}"
        else:
            msg += "false}"
        return msg


    @staticmethod
    def check_lobbies(lobbies):
        new_lobby = {}
        counter = 0
        for i in lobbies:
            name = list(lobbies.keys())[counter]
            if i["last_call"] + 10 > time.time():
                new_lobby[name] = i
            counter += 1
        return new_lobby

    @staticmethod
    def reset_stats_round(lobby):
        for i in range(len(lobby["players"])):
            lobby["started"][i] = False
            lobby["finished"][i] = False
            lobby["players_meme"][i] = -1

        return lobby






