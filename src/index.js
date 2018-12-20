import $ from 'jquery';
import Maze from './maze';

import "./index.scss";

const maxCountDown = 4;
const childrenInterval = 5;
let allowedKeys = [37, 38, 39, 40];

let disp;
let currentPosition;
let currentSantaPosition;
let currentBadSantaPosition;
let totalGifts;
let foundGifts;
let countdown;
let timer;
let isStarted = false;

function newGame() {
    totalGifts = 40;
    foundGifts = 0;

    $('.gift-counter').show();

    disp = new Maze(20, 20, totalGifts);
    currentPosition = {
        x: 0,
        y: 0
    };
    currentSantaPosition = {
        x: 19,
        y: 19
    };
    currentBadSantaPosition = {
        x: 10,
        y: 10
    };
    foundGifts = 0;
    countdown = maxCountDown;
    autocollectLastGift();
    drawMaze();
    updateGiftCount();
    
    reset();
    start();
}

$('#newGame').click(function(e) {
    e.preventDefault();

    newGame();
});

$(document).keydown(function(e) {
    if (allowedKeys.indexOf(e.which) == -1 || !isStarted) {
        return;
    }

    let {
        x,
        y
    } = currentPosition;
    switch (e.which) {
        case 37: // left
            if (disp[y][x][3] !== 0) {
                x--;
            }
            break;
        case 38: // up
            if (disp[y][x][0] !== 0) {
                y--;
            }
            break;
        case 39: // right
            if (disp[y][x][1] !== 0) {
                x++;
            }
            break;
        case 40: // down
            if (disp[y][x][2] !== 0) {
                y++;
            }
            break;
        default:
            return; // exit this handler for other keys
    }
    currentPosition = {
        x: x,
        y: y
    };
    e.preventDefault(); // prevent the default action (scroll / move caret)
    drawMaze();
});

function autocollectLastGift() {
    let line = disp[currentSantaPosition.y];
    if (line[currentSantaPosition.x][4] ==  1) {
        foundGifts++;
        line[currentSantaPosition.x][4] = 0;
        updateGiftCount();
    }
}

function updateGiftCount() {
    $('#found-gifts').text(foundGifts);
    $('#total-gifts').text(totalGifts);
}

function winGame() {
    let winningText = "You won!";
    if (totalGifts != foundGifts) {
        winningText += "\nBut kids are still crying…";
    }
    alert(winningText);
    newGame();
}

function randomMove(x,y) {
    switch (Math.floor(Math.random() * 5)) {
        case 0: // left
            if (disp[y][x][3] !== 0) {
                x--;
            }
            break;
        case 1: // up
            if (disp[y][x][0] !== 0) {
                y--;
            }
            break;
        case 2: // right
            if (disp[y][x][1] !== 0) {
                x++;
            }
            break;
        case 3: // down
            if (disp[y][x][2] !== 0) {
                y++;
            }
            break;
        default:
            // No move
            break;
    }
    return {x: x, y: y};
}

function santaMove() {
    currentSantaPosition = randomMove(currentSantaPosition.x, currentSantaPosition.y);
    autocollectLastGift();
    drawMaze();
}

function drawMaze() {
    $('#maze > tbody').empty();
    for (var i = 0; i < disp.length; i++) {
        $('#maze > tbody').append("<tr>");
        for (var j = 0; j < disp[i].length; j++) {
            var selector = i + "-" + j;
            $('#maze > tbody').append("<td id='" + selector + "'>&nbsp;</td>");
            if (disp[i][j][0] == 0) {
                $('#' + selector).css('border-top', '2px solid black');
            }
            if (disp[i][j][1] == 0) {
                $('#' + selector).css('border-right', '2px solid black');
            }
            if (disp[i][j][2] == 0) {
                $('#' + selector).css('border-bottom', '2px solid black');
            }
            if (disp[i][j][3] == 0) {
                $('#' + selector).css('border-left', '2px solid black');
            }
            if (disp[i][j][4] == 1) {
                $('#' + selector).append("<svg class='gift'><use xlink:href='#gift' /></svg>");
            }
        }
        $('#maze > tbody').append("</tr>");
    }

    if (disp[currentPosition.y][currentPosition.x][4] == 1) {
        $('#' + currentPosition.y + '-' + currentPosition.x + ' svg').remove();
        disp[currentPosition.y][currentPosition.x][4] = 0;
        foundGifts++;
        $("#cryingChild img:first").fadeOut(500, function() {
            $(this).remove();
        });
        updateGiftCount();
    }

    $('#' + currentPosition.y + '-' + currentPosition.x).append("<img id='oleg' src='./img/oleg.png' />");

    if (currentPosition.x != currentSantaPosition.x || currentPosition.y != currentSantaPosition.y) {
        $('#' + currentSantaPosition.y + '-' + currentSantaPosition.x).append("<img id='santa' src='./img/download.png' />");
    } else {
        winGame();
    }
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function reset() {
    $('#cryingChild').empty();
    clearInterval(timer);
}

function start() {
    isStarted = true;
    timer = setInterval(function() {
        countdown--;
        if (countdown <= 0 && $("#cryingChild img").length < (totalGifts - foundGifts) && countdown % childrenInterval == 0) {
            let img = getRandomInt(1, 6);
            $('#cryingChild').append(`<img class='child' src='./img/${img}.gif' style='left: ` + Math.random() * 100 + `%; top: ` + Math.random() * 100 + `%' />`);
            $("#cryingChild img:last").delay(3000).fadeTo(500, 0.6)
        }
        $("#countdown").text(countdown);
        santaMove();
    }, 1000);
}
