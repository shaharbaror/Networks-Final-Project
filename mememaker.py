
CAPTIONS = {
        3: 2,
        2: 2,
        1: 2,
        4: 2,
        5: 2,
        6: 2,
        7: 2,
        8: 2
}
class MemeMaker:



    def __init__(self):
        pass
    @staticmethod
    def getStyles(number:int):
        with open("paths.txt", "rb") as f:
            style = f.read().split(b"__SHEETBREAKER__")[number - 1]
            style = style.replace(b"\r\n", b"")
        return style


    @staticmethod
    def getImage(number):
        return f"./MemeBank/meme{get_path(number)}"


    @staticmethod
    def get_caption_amount(rnd: int):
        return CAPTIONS[rnd]

    @staticmethod
    def classes(captions, index, type):
        cc = "["
        for i in range(captions):
            cc += (f"\"{type}" + str(index) + str(i) + "\",")
        cc = cc[:-1] + "]"
        return cc

def get_path(number):
    if number < 10:
        return f"0{number}"
    else:
        return number