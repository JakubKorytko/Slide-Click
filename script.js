//Jakub Korytko 3ib
won = document.createElement("div"); won.setAttribute("id", "won"); won_under = document.createElement("div"); won_under.setAttribute("id", "won_under"); h1 = document.createElement("h1"); h1.innerText = "Wygrales!"; h2 = document.createElement("h2"); h2.innerText = "Twoj czas:"; span = document.createElement("span"); span.setAttribute("id", "wonTime"); h3 = document.createElement("h3"); h3.innerText = "Podaj swoj nick aby zapisac sie w hali slaw"; input = document.createElement("input"); input.setAttribute("type", "text"); input.setAttribute("id", "nickname"); button = document.createElement("button"); button.setAttribute("id", "saved"); button.innerText = "Zapisz!"; won.append(won_under); won_under.append(h1); won_under.append(h2); h2.append(span); won_under.append(h3); won_under.append(input); won_under.append(button); highscore = document.createElement("div"); highscore.setAttribute("id", "highscore"); won_under = document.createElement("div"); won_under.setAttribute("id", "won_under"); won_under.innerHTML = `<h1>Hala slaw <span id="scoreSize">3x3</span></h1><button class="highscoreButton">3x3</button><button class="highscoreButton">4x4</button><button class="highscoreButton">5x5</button><button class="highscoreButton">6x6</button><div id="scoresContainer"></div><button id="close" onclick="closeWindow()">Zamknij</button>`; highscore.append(won_under); document.body.append(won); document.body.append(highscore); document.body.innerHTML += `<div id="menu"><div id="choose_image"><img src="img/l_arrow.png" class="arrow"><div id="img_container"><div id="menu_img"></div></div><img src="img/r_arrow.png" class="arrow"></div><div id="buttons"><button class="puzzleButton">3x3</button><button class="puzzleButton">4x4</button><button class="puzzleButton">5x5</button><button class="puzzleButton">6x6</button></div><div id="timer"><div id="timerDigits"><img src="./img/timer/c0.gif" class="timerDigit"/><img src="./img/timer/c0.gif" class="timerDigit"/><img src="./img/timer/colon.gif" class="timerDigit"/><img src="./img/timer/c0.gif" class="timerDigit"/><img src="./img/timer/c0.gif" class="timerDigit"/><img src="./img/timer/colon.gif" class="timerDigit"/><img src="./img/timer/c0.gif" class="timerDigit"/><img src="./img/timer/c0.gif" class="timerDigit"/><img src="./img/timer/dot.gif" class="timerDigit"/><img src="./img/timer/c0.gif" class="timerDigit"/><img src="./img/timer/c0.gif" class="timerDigit"/><img src="./img/timer/c0.gif" class="timerDigit"/></div></div></div><br /><div id="puzzleContainer"></div><br /><button onclick="generateHighScore('3x3')">Highscores</button>`;
document.getElementsByClassName("arrow")[0].addEventListener("click", function () { moveMinature("left") })
document.getElementsByClassName("arrow")[1].addEventListener("click", function () { moveMinature("right") })
document.getElementById("menu_img").style.left = "-100px"
document.getElementById("saved").onclick = function () { saveToCookie() };
window.moveMinatureTurn = 0;
window.onems = 1;

var Game = function() {
    this.reset = function() {
        closeWindow();
        this.stopTimer();
        document.getElementById("puzzleContainer").innerHTML = "";
    },
    this.startTimer = function() {
            window.datetoremember = Date.now();
            Game.time = 0;
            Game.timer = setInterval(function () {
                Game.time = Date.now() - window.datetoremember;
                Game.setTime(msToTime(Game.time));
            }, window.onems)
    },
    this.setTime = function(time) {
        for (i = 0; i < Array.from(document.getElementsByClassName("timerDigit")).length; i++) {
            if (i == 2 || i == 5) {
                document.getElementsByClassName("timerDigit")[i].src = "./img/timer/colon.gif";
            } else if (i == 8) {
                document.getElementsByClassName("timerDigit")[i].src = "./img/timer/dot.gif";
            } else {
                document.getElementsByClassName("timerDigit")[i].src = "./img/timer/c" + time[i] + ".gif";
            }
        }
    },
    this.stopTimer = function() {
        clearInterval(Game.timer);
        Game.setTime(msToTime(0));
    },
    this.canMove = function(x, y) {
        if (this.empty[0] == x) {
            if (Math.abs(this.empty[1] - y) == 1) {
                if (this.empty[1] - y == -1) {
                    return "up";
                } else {
                    return "down";
                }
            }
        } else if (this.empty[1] == y) {
            if (Math.abs(this.empty[0] - x) == 1) {
                if (this.empty[0] - x == -1) {
                    return "left";
                } else {
                    return "right";
                }
            }
        }
        return false;
    },
    this.createPuzzle = function(x) {
        if (window.tryingRandom == true) { return null }
        if (Number(document.getElementById("menu_img").style.left.slice(0, -2)) % 100 != 0) { return null }
        Game.stopTimer();
        document.getElementById("puzzleContainer").innerHTML = "";
        image = "img/pic" + String(document.getElementById("menu_img").style.left.slice(0, -2))[1] + ".jpg";
        table = x.split("x");
        Game.puzzles = [];
        for (i = 0; i < table[0]; i++) {
            Game.puzzles.push([])
        }
        for (let i = 0; i < table[0]; i++) {
            for (let o = 0; o < table[1]; o++) {
                puzzle = document.createElement("div")
                puzzle.setAttribute("class", "puzzle")
                puzzle.setAttribute("x", o)
                puzzle.setAttribute("y", i)
                puzzle.onclick = function () { Game.move(this.getAttribute("x"), this.getAttribute("y")) };
                puzzle.style.backgroundImage = "url('" + image + "')";
                puzzle.style.backgroundPosition = "-" + (640 / table[0] * o) + "px -" + (640 / table[0] * i) + "px"
                puzzle.style.left = ((640 / table[0] * o) - 0.1) + "px";
                puzzle.style.top = (640 / table[0] * i) + "px";
                puzzle.style.width = 640 / table[0] + "px"
                puzzle.style.height = 640 / table[0] + "px"
                puzzle.style.backgroundColor = "pink"
                if (!(o == table[1] - 1 && i == table[0] - 1)) {
                    document.getElementById("puzzleContainer").append(puzzle)
                    Game.puzzles[i].push("puzzle")
                } else {
                    this.empty = [i, o]
                    Game.puzzles[i].push("empty")
                }
            }
            br = document.createElement("br")
            document.getElementById("puzzleContainer").append(br)
        }
        random();
    },
    this.move = function(x, y) {
        number = divNumber(x, y);
        if (number == undefined) return false;
        if (window.isMoving == true) return false;
        topp = Number(document.getElementsByClassName("puzzle")[number].style.top.slice(0, -2));
        left = Number(document.getElementsByClassName("puzzle")[number].style.left.slice(0, -2));
        can = Game.canMove(x, y);
        switch (can) {
            case "up":
                if (window.tryingRandom != true) {
                    moveAnim(x, y, "up")
                } else {
                    topp -= (640 / Game.puzzles.length);
                }
                document.getElementsByClassName("puzzle")[number].style.top = topp + "px";
                document.getElementsByClassName("puzzle")[number].setAttribute("y", Number(y) - 1);
                break;
            case "down":
                if (window.tryingRandom != true) {
                    moveAnim(x, y, "down")
                } else {
                    topp += (640 / Game.puzzles.length);
                }
                document.getElementsByClassName("puzzle")[number].style.top = topp + "px";
                document.getElementsByClassName("puzzle")[number].setAttribute("y", Number(y) + 1);
                break;
            case "left":
                if (window.tryingRandom != true) {
                    moveAnim(x, y, "left")
                } else {
                    left -= (640 / Game.puzzles.length) - 0.1;
                }
                document.getElementsByClassName("puzzle")[number].style.left = left + "px";
                document.getElementsByClassName("puzzle")[number].setAttribute("x", Number(x) - 1);
                break;
            case "right":
                if (window.tryingRandom != true) {
                    moveAnim(x, y, "right")
                } else {
                    left += (640 / Game.puzzles.length) - 0.1;
                }
                document.getElementsByClassName("puzzle")[number].style.left = left + "px";
                document.getElementsByClassName("puzzle")[number].setAttribute("x", Number(x) + 1);
                break;
    
            default:
                break;
        }
    
        if (can == "up" || can == "right" || can == "left" || can == "down") {
            Game.puzzles[x][y] = "empty"
            Game.puzzles[this.empty[0]][this.empty[1]] = "puzzle";
            this.empty = [x, y];
            return true;
        } else {
            return false;
        }
    },
    this.pauseTimer = function() {
        clearInterval(Game.timer);
    }
}

Game = new Game();

function msToTime(s) {

    function pad(n, z) {
        z = z || 2;
        return ('00' + n).slice(-z);
    }

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
}


function moveMinature(x) {
    if (window.moveMinatureTurn != 0) { return null }
    if (x == "right") {
        window.moveMinatureInterval = setInterval(function () {
            if (window.moveMinatureTurn != 100) {
                document.getElementById("menu_img").style.left = (document.getElementById("menu_img").style.left.slice(0, -2) - 1) + "px";
                window.moveMinatureTurn += 1;
            } else {
                if (Number(document.getElementById("menu_img").style.left.slice(0, -2)) == -500) { document.getElementById("menu_img").style.left = "-100px" }
                clearInterval(window.moveMinatureInterval);
                window.moveMinatureTurn = 0;
            }
        }, 5)
    } else {
        window.moveMinatureInterval = setInterval(function () {
            if (window.moveMinatureTurn != 100) {
                document.getElementById("menu_img").style.left = (Number(document.getElementById("menu_img").style.left.slice(0, -2)) + 1) + "px";
                window.moveMinatureTurn += 1;
            } else {
                if (Number(document.getElementById("menu_img").style.left.slice(0, -2)) == 0) { document.getElementById("menu_img").style.left = "-400px" }
                clearInterval(window.moveMinatureInterval);
                window.moveMinatureTurn = 0;
            }
        }, 5)
    }
}

document.getElementsByClassName("puzzleButton")[0].addEventListener("click", function () { Game.createPuzzle("3x3") })
document.getElementsByClassName("puzzleButton")[1].addEventListener("click", function () { Game.createPuzzle("4x4") })
document.getElementsByClassName("puzzleButton")[2].addEventListener("click", function () { Game.createPuzzle("5x5") })
document.getElementsByClassName("puzzleButton")[3].addEventListener("click", function () { Game.createPuzzle("6x6") })
document.getElementsByClassName("highscoreButton")[0].addEventListener("click", function () { generateHighScore("3x3") })
document.getElementsByClassName("highscoreButton")[1].addEventListener("click", function () { generateHighScore("4x4") })
document.getElementsByClassName("highscoreButton")[2].addEventListener("click", function () { generateHighScore("5x5") })
document.getElementsByClassName("highscoreButton")[3].addEventListener("click", function () { generateHighScore("6x6") })

function divNumber(x, y) {
    number = undefined;
    Array.from(document.getElementsByClassName("puzzle")).forEach(function (o, p) {
        if (o.getAttribute("x") == x && o.getAttribute("y") == y) {
            number = p;
        }
    })
    return number;
}

async function moveAnim(x, y, can) {
    window.isMoving = true;
    where = "";
    if (can == "down" || can == "up") { where = "top" }
    if (can == "right" || can == "left") { where = "left" }
    trial = 0;
    number = divNumber(x, y);
    topp = Number(document.getElementsByClassName("puzzle")[number].style.top.slice(0, -2));
    left = Number(document.getElementsByClassName("puzzle")[number].style.left.slice(0, -2));
    which = 0;
    if (where == "top") which = topp;
    if (where == "left") which = left;
    while (Math.round(trial) != Math.round(640 / Game.puzzles.length)) {
        trial += (Math.round(640 / Game.puzzles.length) / 15)
        document.getElementsByClassName("puzzle")[number].style[where] = (can == "up" || can == "left" ? which - trial : which + trial) + "px";
        await sleep(10);
    }
    if (where == "left" && can == "left") left -= (640 / Game.puzzles.length);
    if (where == "left" && can == "right") left += (640 / Game.puzzles.length);
    if (where == "top" && can == "up") topp -= (640 / Game.puzzles.length);
    if (where == "top" && can == "down") topp += (640 / Game.puzzles.length);
    document.getElementsByClassName("puzzle")[number].style.left = left + "px";
    document.getElementsByClassName("puzzle")[number].style.top = topp + "px";
    window.isMoving = false;
    checkwin();
}

function test() {
    setCookie("highscores3x3", `[{"test":"4324324"},{"test1":"32466"},{"test2":"5465466"},{"test3":"546546546"},{"test4":"324324234234"},{"test5":"1000"},{"test6":"3454354355"},{"test7":"2435235435"},{"test8":"234543252234"},{"test9":"234543252234"},{"test10":"4355543"},{"test11":"3455555"},{"test12":"3423423"},{"test13":"4335555"}]`, 1000)
    setCookie("highscores4x4", `[{"test":"34232"},{"test1":"765777"},{"test2":"45555"},{"test3":"4323443324342"},{"test4":"65465654"},{"test5":"34323443"},{"test6":"65465546"},{"test7":"2435235435"},{"test8":"234543252234"},{"test9":"234543252234"},{"test10":"4355543"},{"test11":"3455555"},{"test12":"3423423"},{"test13":"4335555"}]`, 1000)
    setCookie("highscores5x5", `[{"test":"2222222"},{"test1":"4567654"},{"test2":"54355"},{"test3":"32432"},{"test4":"654666"},{"test5":"657657675"},{"test6":"3454354355"},{"test7":"2435235435"},{"test8":"234543252234"},{"test9":"234543252234"},{"test10":"4355543"},{"test11":"3455555"},{"test12":"3423423"},{"test13":"4335555"}]`, 1000)
    setCookie("highscores6x6", `[{"test":"543534"},{"test1":"45756754"},{"test2":"765777"},{"test3":"7655767567"},{"test4":"765767657"},{"test5":"765765756"},{"test6":"3454354355"},{"test7":"2435235435"},{"test8":"234543252234"},{"test9":"234543252234"},{"test10":"4355543"},{"test11":"3455555"},{"test12":"3423423"},{"test13":"4335555"}]`, 1000)
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function saveToCookie() {
    table = JSON.parse(getCookie("highscores" + Game.puzzles.length + "x" + Game.puzzles.length))
    nickname = document.getElementById("nickname").value;
    time = Game.time;
    if (table == null) {
        table = [];
        table.push({ [nickname]: time })
        setCookie("highscores" + Game.puzzles.length + "x" + Game.puzzles.length, JSON.stringify(table), 1000);
    } else {
        table.push({ [nickname]: time })
        setCookie("highscores" + Game.puzzles.length + "x" + Game.puzzles.length, JSON.stringify(table), 1000);
    }
    Game.reset();
}

function closeWindow() {
    window.highopen = false;
    document.getElementById("highscore").style.display = "none"
    document.getElementById("won").style.display = "none"
}

function generateHighScore(size) {
    document.getElementById("scoreSize").innerHTML = size;
    document.getElementById("scoresContainer").innerHTML = "";
    window.highopen = true;
    document.getElementById("highscore").style.display = "flex"
    table = JSON.parse(getCookie("highscores" + size))
    if (table == null) return undefined
    table = table.sort(function (a, b) {
        console.log(a[Object.keys(a)[0]])
        return a[Object.keys(a)[0]] - b[Object.keys(b)[0]];
    });
    const MAX = 10;
    turn = 1;
    table.forEach(function (x) {
        if (turn != 11) {
            score = document.createElement("h3")
            score.innerText = `${turn}. ${Object.keys(x)[0]}: ${msToTime(Object.values(x)[0])}`
            document.getElementById("scoresContainer").append(score)
            turn += 1
        }
    })
}

function isPlacedProperly(x, y) {
    number = divNumber(x, y)
    if (number == undefined) return true
    splited = document.getElementsByClassName("puzzle")[number].style.backgroundPosition.split("px")
    splited[1] = Math.round(Math.abs(Number(splited[1].trim())));
    splited[0] = Math.round(Math.abs(Number(splited[0].trim())));
    splited.pop();
    need = [Math.round(x * (640 / Game.puzzles.length)), Math.round(y * (640 / Game.puzzles.length))]
    if (need[0] == splited[0] && need[1] == splited[1]) return true
    else return false
}

function generateWin(x) {
    if (!x) return undefined
    Game.pauseTimer();
    document.getElementById("wonTime").innerText = msToTime(Game.time);
    document.getElementById("highscore").style.display = "none"
    document.getElementById("won").style.display = "flex"
}

function checkwin() {
    areYouWinningSon = true;
    for (let i = 0; i < Game.puzzles.length; i++) {
        for (let o = 0; o < Game.puzzles.length; o++) {
            if (!isPlacedProperly(i, o)) areYouWinningSon = false;
        }
    }
    generateWin(areYouWinningSon)
}

async function random() {
    sleeped = atob("b25lbXM=")
    window.tryingRandom = true;
    for (let i = 0; i < Game.puzzles.length * 30; i++) {
        done = false;
        while (!done) {
            done = Game.move(rand(0, Game.puzzles.length), rand(0, Game.puzzles.length))
        }
        await sleep(25);
    }
    window[sleeped] = 13;
    Game.startTimer();
    window.tryingRandom = false;
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}