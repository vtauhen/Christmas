import $ from 'jquery';
import Maze from './maze';

import "./index.scss";

const maxCountDown = 5;
let allowedKeys = [37, 38, 39, 40];

let disp;
let currentPosition;
let totalGifts;
let foundGifts;
let countdown;
let timer;
let isStarted = false;

$('#newGame').click(function (e) {
    e.preventDefault();

    totalGifts = 40;
    foundGifts = 0;

    $('.gift-counter').show();

    disp = new Maze(20, 20, totalGifts);
    disp[19][19][1] = 1;
    currentPosition = { x: 0, y: 0 };
    foundGifts = 0;
    countdown = maxCountDown;
    drawMaze();
    updateGiftCount();

    drawMaze();
    updateGiftCount();
    start();
});

$(document).keydown(function (e) {
    if (allowedKeys.indexOf(e.which) == -1 || !isStarted) {
        return;
    }

    let { x, y } = currentPosition;
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
        default: return; // exit this handler for other keys
    }
    currentPosition = { x: x, y: y };
    e.preventDefault(); // prevent the default action (scroll / move caret)
    drawMaze();
});

function updateGiftCount() {
    $('#found-gifts').text(foundGifts);
    $('#total-gifts').text(totalGifts);
}

function drawMaze() {
    $('#maze > tbody').empty();
    for (var i = 0; i < disp.length; i++) {
        $('#maze > tbody').append("<tr>");
        for (var j = 0; j < disp[i].length; j++) {
            var selector = i + "-" + j;
            $('#maze > tbody').append("<td id='" + selector + "'>&nbsp;</td>");
            if (disp[i][j][0] == 0) { $('#' + selector).css('border-top', '2px solid black'); }
            if (disp[i][j][1] == 0) { $('#' + selector).css('border-right', '2px solid black'); }
            if (disp[i][j][2] == 0) { $('#' + selector).css('border-bottom', '2px solid black'); }
            if (disp[i][j][3] == 0) { $('#' + selector).css('border-left', '2px solid black'); }
            if (disp[i][j][4] == 1) { $('#' + selector).append("<svg class='gift'><use xlink:href='#gift' /></svg>"); }
        }
        $('#maze > tbody').append("</tr>");
    }
    if (disp[currentPosition.y][currentPosition.x][4] == 1) {
        $('#' + currentPosition.y + '-' + currentPosition.x + ' svg').remove();
        disp[currentPosition.y][currentPosition.x][4] = 0;
        foundGifts++;
        updateGiftCount();
    }
    $('#' + currentPosition.y + '-' + currentPosition.x).append("<img id='santa' src='./img/download.png' />");
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function start() {
    isStarted = true;
    $('#cryingChild').empty();
    timer = setInterval(function () {
        countdown--;
        if (countdown == 0) {
            isStarted = false;
            clearInterval(timer);
            let img = getRandomInt(1, 6);
            $('#cryingChild').append(`<img id='santa' src='./img/${img}.gif' />`);
            $("#cryingChild").fadeTo(500, 0.2)
        }
        $("#countdown").text(countdown);
    }, 1000);
}
