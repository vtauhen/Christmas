import $ from 'jquery';
import Maze from './maze';

import "./index.css";

let currentPosition = { x: 0, y: 0 };
let allowedKeys = [37, 38, 39, 40];
let disp = new Maze(20, 20);
disp[19][19][1] = 1;

drawMaze();

$('#newGame').click(function (e) {
    e.preventDefault();

    disp = new Maze(20, 20);
    disp[19][19][1] = 1;
    currentPosition = { x: 0, y: 0 };
    drawMaze();
});

$(document).keydown(function (e) {
    if (allowedKeys.indexOf(e.which) == -1) {
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
        }
        $('#maze > tbody').append("</tr>");
    }
    $('#' + currentPosition.y + '-' + currentPosition.x).append("<img id='santa' src='./img/download.png' />");
};
