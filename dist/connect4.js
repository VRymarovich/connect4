(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
    loadGraphics: function (hor, ver) {
        var html =     '<div id="page">'+
                            '<div style="text-align:center; font-family:Arial; color:white; font-size:32px;">Connect-4</div>'+
                            '<div id="content"></div>'+
                            '<div style="text-align:center"><button id="restart" class="button">Restart</button>'+
                            '<button id="reset" class="button">Reset Score</button></div>'+
                            '<div id="field">'+
                                    '<table style="width:100%"><tr>'+
                                    '<td><div class="red cell"></div></td>'+
                                    '<td id="result" class="result"><span style="">10/11</td></td>'+
                                    '<td style="float:right"><div class="yellow cell"></div></td>'+
                                    '</tr></table>'+
                                '<div id="cells"></div>'+
                            '</div>'+
                        '</div>';
        var connect4 = document.getElementById('connect4');
        connect4.innerHTML = html;
        
        for(var i=0;i<ver;i++){
            for(var j=0; j<hor; j++){
                var cell = document.createElement('div');
                cell.setAttribute('class','cell');
                cell.setAttribute('ver', i+1);
                cell.setAttribute('hor', j+1);
                cell.setAttribute('id','cell_'+i+1+'_'+j+1);
                //cell.style.position = 'absolute';
                //cell.style.top = iy + j*45+'px';
                //cell.style.left = ix + i*45+'px';
                document.getElementById('cells').appendChild(cell);
            }
        }
    },
    addEventListenersToCells: function(mouseOver, click){
        var cells = document.getElementById('cells').children;
        for(var i=0;i<cells.length;i++){
            cells[i].addEventListener('mouseover', mouseOver);
            cells[i].addEventListener('click', click);
        };
    },
    removeEventListenersToCells: function(mouseOver, click){
        var cells = document.getElementById('cells').children;
        for(var i=0;i<cells.length;i++){
            cells[i].removeEventListener('mouseover', mouseOver);
            cells[i].removeEventListener('click', click);
        };
    },
    addEventListenersToButtons: function(restart, reset){
        document.getElementById('restart').addEventListener('click', restart);
        document.getElementById('reset').addEventListener('click', reset);
    },
    writeStatus: function(text){
        var content = document.getElementById('content').innerHTML = text;
    },
    writeScore: function(score){
        var result = document.getElementById('result').innerHTML = score[0]+'/'+score[1];
    },
    updateField: function (cell){
        var cells = document.getElementById('cells').children;
        for(var i=0;i<cells.length;i++){
            if((cells[i].attributes.ver.value == cell.attributes.ver.value - 1)&&(cells[i].attributes.hor.value == cell.attributes.hor.value)){
                 cells[i].setAttribute('busy', 'free');
                 cells[i].className = 'available cell';
            }
        }
    },
    setInitialField: function(ver){
        var cells = document.getElementById('cells').children;
        for(var i=0;i<cells.length;i++){
            if(cells[i].attributes.ver.value==ver){
                cells[i].setAttribute('busy', 'free');
                cells[i].className = 'available cell';
            }else{
                cells[i].setAttribute('busy', 'na');
                cells[i].className = 'na cell';
            }
        }
    },
    showWinnerCells: function(cell, direction){
        var cells = document.getElementById('cells').children;
        var directions = [[0,0], [1,0], [-1,0], [0,1], [1,1], [-1,1]];//shows speed of direction
        var horCoord = parseInt(cell.attributes.hor.value);
        var verCoord = parseInt(cell.attributes.ver.value);
        for (var i=0;i<4;i++){
            for (var j=0;j<cells.length; j++){
                if((cells[j].attributes.hor.value==horCoord)&&(cells[j].attributes.ver.value==verCoord)){
                    cells[j].className = 'flash ' + cells[j].className;
                }
            }
            horCoord = horCoord + directions[direction][0];
            verCoord = verCoord + directions[direction][1];
        }
    }
};

},{}],2:[function(require,module,exports){
module.exports = {
    changePlayer: function (currentPlayer){
        if (currentPlayer == 1){
            return 0;
        }else{
            return 1;
        }
    },
    checkField: function(field, playerId, playerValues, targetCell){
        var cell = targetCell;
        var hor = parseInt(cell.hor.value)-1;
        var ver = parseInt(cell.ver.value)-1;
        var value = playerValues[playerId] * 4;
        var sum1 = getFCV(field, hor, ver) + getFCV(field, hor+1, ver) + getFCV(field, hor+2, ver) + getFCV(field, hor+3, ver);
        var sum2 = getFCV(field, hor, ver) + getFCV(field, hor-1, ver) + getFCV(field, hor-2, ver) + getFCV(field, hor-3, ver);
        var sum3 = getFCV(field, hor, ver) + getFCV(field, hor, ver+1) + getFCV(field, hor, ver+2) + getFCV(field, hor, ver+3);
        var sum4 = getFCV(field, hor, ver) + getFCV(field, hor+1, ver+1) + getFCV(field, hor+2, ver+2) + getFCV(field, hor+3, ver+3);
        var sum5 = getFCV(field, hor, ver) + getFCV(field, hor-1, ver+1) + getFCV(field, hor-2, ver+2) + getFCV(field, hor-3, ver+3);

        if((sum1==value)||(sum2==value)||(sum3==value)||(sum4==value)||(sum5==value)){
            if(sum1==value) return 1;
            if(sum2==value) return 2;
            if(sum3==value) return 3;
            if(sum4==value) return 4;
            if(sum5==value) return 5;
        }else{
            return 0;
        }
    },
    generateField: function(hor, ver){
        var field = [];
        for(var j=0;j<ver;j++){
            var row = [];
            for(var i=0;i<hor;i++){
                row.push(0);
            }
            field.push(row);
        }
        return field;
    }
};
//get field cell value
function getFCV(field, hor, ver){
    if(field[ver] === undefined){
        return 0;
    }else{
        if(field[ver][hor] === undefined){
            return 0;
        }else{
            return field[ver][hor];
        }
    }
}

},{}],3:[function(require,module,exports){
var graphics = require('./graphics.js');
var logic = require('./logic.js');



var options = {
    "horizontal": 7,
    "vertical": 6,
    "players": [{'name':'Red', 'color':'red'}, {'name':'Yellow', 'color':'yellow'}]
};
var playerValues = [-1,1];
var score = [0,0];
var field = [];

//load field, cells
graphics.loadGraphics(options.horizontal,options.vertical);

//generate field array
field = logic.generateField(options.horizontal,options.vertical);

//add events
graphics.addEventListenersToButtons(restart, reset);
//set initial field state and texts
start();

//events
function mouseOver(event){
    if(event.target.attributes.busy.value=='free'){
        event.target.className = 'available cell';
    }
}

function click(event){
    if(event.target.attributes.busy.value=='free'){
        event.target.className = options.players[player].color + ' cell';
        event.target.setAttribute('busy', options.players[player].color);
        field[event.target.attributes.ver.value-1][event.target.attributes.hor.value-1] = playerValues[player];
        var fieldStatus = logic.checkField(field, player, playerValues, event.target.attributes);
        if(fieldStatus==0){
            player = logic.changePlayer(player);
            graphics.updateField(event.target);
            graphics.writeStatus('Player '+options.players[player].name+'`s move');
        }else{
            graphics.writeStatus('Player '+options.players[player].name+' wins!');
            graphics.showWinnerCells(event.target, fieldStatus);
            var score1 = score[0] + (player==0?1:0);
            var score2 = score[1] + (player==1?1:0);
            score = [score1,score2];
            graphics.writeScore(score);
            graphics.removeEventListenersToCells(mouseOver, click);
        }
    }
}

function restart(){
    player = 0;
    logic.setInitialField(6);
}
function restart(){
    player = 0;
    graphics.setInitialField(options.horizontal-1);
    graphics.writeStatus('Player '+options.players[player].name+'`s move');
    graphics.addEventListenersToCells(mouseOver, click);
}
function reset(){
    start();
}
function start(){
    player = 0;
    graphics.setInitialField(options.horizontal-1);
    score=[0,0];
    graphics.writeStatus('Player '+options.players[player].name+'`s move');
    graphics.writeScore(score);
    graphics.addEventListenersToCells(mouseOver, click);
}
},{"./graphics.js":1,"./logic.js":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZ3JhcGhpY3MuanMiLCJzcmMvbG9naWMuanMiLCJzcmMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgbG9hZEdyYXBoaWNzOiBmdW5jdGlvbiAoaG9yLCB2ZXIpIHtcclxuICAgICAgICB2YXIgaHRtbCA9ICAgICAnPGRpdiBpZD1cInBhZ2VcIj4nK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOmNlbnRlcjsgZm9udC1mYW1pbHk6QXJpYWw7IGNvbG9yOndoaXRlOyBmb250LXNpemU6MzJweDtcIj5Db25uZWN0LTQ8L2Rpdj4nK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJjb250ZW50XCI+PC9kaXY+JytcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjpjZW50ZXJcIj48YnV0dG9uIGlkPVwicmVzdGFydFwiIGNsYXNzPVwiYnV0dG9uXCI+UmVzdGFydDwvYnV0dG9uPicrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGJ1dHRvbiBpZD1cInJlc2V0XCIgY2xhc3M9XCJidXR0b25cIj5SZXNldCBTY29yZTwvYnV0dG9uPjwvZGl2PicrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cImZpZWxkXCI+JytcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0YWJsZSBzdHlsZT1cIndpZHRoOjEwMCVcIj48dHI+JytcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0ZD48ZGl2IGNsYXNzPVwicmVkIGNlbGxcIj48L2Rpdj48L3RkPicrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8dGQgaWQ9XCJyZXN1bHRcIiBjbGFzcz1cInJlc3VsdFwiPjxzcGFuIHN0eWxlPVwiXCI+MTAvMTE8L3RkPjwvdGQ+JytcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0ZCBzdHlsZT1cImZsb2F0OnJpZ2h0XCI+PGRpdiBjbGFzcz1cInllbGxvdyBjZWxsXCI+PC9kaXY+PC90ZD4nK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC90cj48L3RhYmxlPicrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJjZWxsc1wiPjwvZGl2PicrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JytcclxuICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2Pic7XHJcbiAgICAgICAgdmFyIGNvbm5lY3Q0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nvbm5lY3Q0Jyk7XHJcbiAgICAgICAgY29ubmVjdDQuaW5uZXJIVE1MID0gaHRtbDtcclxuICAgICAgICBcclxuICAgICAgICBmb3IodmFyIGk9MDtpPHZlcjtpKyspe1xyXG4gICAgICAgICAgICBmb3IodmFyIGo9MDsgajxob3I7IGorKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywnY2VsbCcpO1xyXG4gICAgICAgICAgICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoJ3ZlcicsIGkrMSk7XHJcbiAgICAgICAgICAgICAgICBjZWxsLnNldEF0dHJpYnV0ZSgnaG9yJywgaisxKTtcclxuICAgICAgICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKCdpZCcsJ2NlbGxfJytpKzErJ18nK2orMSk7XHJcbiAgICAgICAgICAgICAgICAvL2NlbGwuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gICAgICAgICAgICAgICAgLy9jZWxsLnN0eWxlLnRvcCA9IGl5ICsgaio0NSsncHgnO1xyXG4gICAgICAgICAgICAgICAgLy9jZWxsLnN0eWxlLmxlZnQgPSBpeCArIGkqNDUrJ3B4JztcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjZWxscycpLmFwcGVuZENoaWxkKGNlbGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGFkZEV2ZW50TGlzdGVuZXJzVG9DZWxsczogZnVuY3Rpb24obW91c2VPdmVyLCBjbGljayl7XHJcbiAgICAgICAgdmFyIGNlbGxzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NlbGxzJykuY2hpbGRyZW47XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxjZWxscy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgY2VsbHNbaV0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgbW91c2VPdmVyKTtcclxuICAgICAgICAgICAgY2VsbHNbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGljayk7XHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbiAgICByZW1vdmVFdmVudExpc3RlbmVyc1RvQ2VsbHM6IGZ1bmN0aW9uKG1vdXNlT3ZlciwgY2xpY2spe1xyXG4gICAgICAgIHZhciBjZWxscyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjZWxscycpLmNoaWxkcmVuO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8Y2VsbHMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGNlbGxzW2ldLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIG1vdXNlT3Zlcik7XHJcbiAgICAgICAgICAgIGNlbGxzW2ldLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2spO1xyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgYWRkRXZlbnRMaXN0ZW5lcnNUb0J1dHRvbnM6IGZ1bmN0aW9uKHJlc3RhcnQsIHJlc2V0KXtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGFydCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVzdGFydCk7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc2V0JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZXNldCk7XHJcbiAgICB9LFxyXG4gICAgd3JpdGVTdGF0dXM6IGZ1bmN0aW9uKHRleHQpe1xyXG4gICAgICAgIHZhciBjb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKS5pbm5lckhUTUwgPSB0ZXh0O1xyXG4gICAgfSxcclxuICAgIHdyaXRlU2NvcmU6IGZ1bmN0aW9uKHNjb3JlKXtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3VsdCcpLmlubmVySFRNTCA9IHNjb3JlWzBdKycvJytzY29yZVsxXTtcclxuICAgIH0sXHJcbiAgICB1cGRhdGVGaWVsZDogZnVuY3Rpb24gKGNlbGwpe1xyXG4gICAgICAgIHZhciBjZWxscyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjZWxscycpLmNoaWxkcmVuO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8Y2VsbHMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGlmKChjZWxsc1tpXS5hdHRyaWJ1dGVzLnZlci52YWx1ZSA9PSBjZWxsLmF0dHJpYnV0ZXMudmVyLnZhbHVlIC0gMSkmJihjZWxsc1tpXS5hdHRyaWJ1dGVzLmhvci52YWx1ZSA9PSBjZWxsLmF0dHJpYnV0ZXMuaG9yLnZhbHVlKSl7XHJcbiAgICAgICAgICAgICAgICAgY2VsbHNbaV0uc2V0QXR0cmlidXRlKCdidXN5JywgJ2ZyZWUnKTtcclxuICAgICAgICAgICAgICAgICBjZWxsc1tpXS5jbGFzc05hbWUgPSAnYXZhaWxhYmxlIGNlbGwnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHNldEluaXRpYWxGaWVsZDogZnVuY3Rpb24odmVyKXtcclxuICAgICAgICB2YXIgY2VsbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2VsbHMnKS5jaGlsZHJlbjtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPGNlbGxzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBpZihjZWxsc1tpXS5hdHRyaWJ1dGVzLnZlci52YWx1ZT09dmVyKXtcclxuICAgICAgICAgICAgICAgIGNlbGxzW2ldLnNldEF0dHJpYnV0ZSgnYnVzeScsICdmcmVlJyk7XHJcbiAgICAgICAgICAgICAgICBjZWxsc1tpXS5jbGFzc05hbWUgPSAnYXZhaWxhYmxlIGNlbGwnO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGNlbGxzW2ldLnNldEF0dHJpYnV0ZSgnYnVzeScsICduYScpO1xyXG4gICAgICAgICAgICAgICAgY2VsbHNbaV0uY2xhc3NOYW1lID0gJ25hIGNlbGwnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHNob3dXaW5uZXJDZWxsczogZnVuY3Rpb24oY2VsbCwgZGlyZWN0aW9uKXtcclxuICAgICAgICB2YXIgY2VsbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2VsbHMnKS5jaGlsZHJlbjtcclxuICAgICAgICB2YXIgZGlyZWN0aW9ucyA9IFtbMCwwXSwgWzEsMF0sIFstMSwwXSwgWzAsMV0sIFsxLDFdLCBbLTEsMV1dOy8vc2hvd3Mgc3BlZWQgb2YgZGlyZWN0aW9uXHJcbiAgICAgICAgdmFyIGhvckNvb3JkID0gcGFyc2VJbnQoY2VsbC5hdHRyaWJ1dGVzLmhvci52YWx1ZSk7XHJcbiAgICAgICAgdmFyIHZlckNvb3JkID0gcGFyc2VJbnQoY2VsbC5hdHRyaWJ1dGVzLnZlci52YWx1ZSk7XHJcbiAgICAgICAgZm9yICh2YXIgaT0wO2k8NDtpKyspe1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqPTA7ajxjZWxscy5sZW5ndGg7IGorKyl7XHJcbiAgICAgICAgICAgICAgICBpZigoY2VsbHNbal0uYXR0cmlidXRlcy5ob3IudmFsdWU9PWhvckNvb3JkKSYmKGNlbGxzW2pdLmF0dHJpYnV0ZXMudmVyLnZhbHVlPT12ZXJDb29yZCkpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNlbGxzW2pdLmNsYXNzTmFtZSA9ICdmbGFzaCAnICsgY2VsbHNbal0uY2xhc3NOYW1lO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGhvckNvb3JkID0gaG9yQ29vcmQgKyBkaXJlY3Rpb25zW2RpcmVjdGlvbl1bMF07XHJcbiAgICAgICAgICAgIHZlckNvb3JkID0gdmVyQ29vcmQgKyBkaXJlY3Rpb25zW2RpcmVjdGlvbl1bMV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGNoYW5nZVBsYXllcjogZnVuY3Rpb24gKGN1cnJlbnRQbGF5ZXIpe1xyXG4gICAgICAgIGlmIChjdXJyZW50UGxheWVyID09IDEpe1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNoZWNrRmllbGQ6IGZ1bmN0aW9uKGZpZWxkLCBwbGF5ZXJJZCwgcGxheWVyVmFsdWVzLCB0YXJnZXRDZWxsKXtcclxuICAgICAgICB2YXIgY2VsbCA9IHRhcmdldENlbGw7XHJcbiAgICAgICAgdmFyIGhvciA9IHBhcnNlSW50KGNlbGwuaG9yLnZhbHVlKS0xO1xyXG4gICAgICAgIHZhciB2ZXIgPSBwYXJzZUludChjZWxsLnZlci52YWx1ZSktMTtcclxuICAgICAgICB2YXIgdmFsdWUgPSBwbGF5ZXJWYWx1ZXNbcGxheWVySWRdICogNDtcclxuICAgICAgICB2YXIgc3VtMSA9IGdldEZDVihmaWVsZCwgaG9yLCB2ZXIpICsgZ2V0RkNWKGZpZWxkLCBob3IrMSwgdmVyKSArIGdldEZDVihmaWVsZCwgaG9yKzIsIHZlcikgKyBnZXRGQ1YoZmllbGQsIGhvciszLCB2ZXIpO1xyXG4gICAgICAgIHZhciBzdW0yID0gZ2V0RkNWKGZpZWxkLCBob3IsIHZlcikgKyBnZXRGQ1YoZmllbGQsIGhvci0xLCB2ZXIpICsgZ2V0RkNWKGZpZWxkLCBob3ItMiwgdmVyKSArIGdldEZDVihmaWVsZCwgaG9yLTMsIHZlcik7XHJcbiAgICAgICAgdmFyIHN1bTMgPSBnZXRGQ1YoZmllbGQsIGhvciwgdmVyKSArIGdldEZDVihmaWVsZCwgaG9yLCB2ZXIrMSkgKyBnZXRGQ1YoZmllbGQsIGhvciwgdmVyKzIpICsgZ2V0RkNWKGZpZWxkLCBob3IsIHZlciszKTtcclxuICAgICAgICB2YXIgc3VtNCA9IGdldEZDVihmaWVsZCwgaG9yLCB2ZXIpICsgZ2V0RkNWKGZpZWxkLCBob3IrMSwgdmVyKzEpICsgZ2V0RkNWKGZpZWxkLCBob3IrMiwgdmVyKzIpICsgZ2V0RkNWKGZpZWxkLCBob3IrMywgdmVyKzMpO1xyXG4gICAgICAgIHZhciBzdW01ID0gZ2V0RkNWKGZpZWxkLCBob3IsIHZlcikgKyBnZXRGQ1YoZmllbGQsIGhvci0xLCB2ZXIrMSkgKyBnZXRGQ1YoZmllbGQsIGhvci0yLCB2ZXIrMikgKyBnZXRGQ1YoZmllbGQsIGhvci0zLCB2ZXIrMyk7XHJcblxyXG4gICAgICAgIGlmKChzdW0xPT12YWx1ZSl8fChzdW0yPT12YWx1ZSl8fChzdW0zPT12YWx1ZSl8fChzdW00PT12YWx1ZSl8fChzdW01PT12YWx1ZSkpe1xyXG4gICAgICAgICAgICBpZihzdW0xPT12YWx1ZSkgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIGlmKHN1bTI9PXZhbHVlKSByZXR1cm4gMjtcclxuICAgICAgICAgICAgaWYoc3VtMz09dmFsdWUpIHJldHVybiAzO1xyXG4gICAgICAgICAgICBpZihzdW00PT12YWx1ZSkgcmV0dXJuIDQ7XHJcbiAgICAgICAgICAgIGlmKHN1bTU9PXZhbHVlKSByZXR1cm4gNTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGdlbmVyYXRlRmllbGQ6IGZ1bmN0aW9uKGhvciwgdmVyKXtcclxuICAgICAgICB2YXIgZmllbGQgPSBbXTtcclxuICAgICAgICBmb3IodmFyIGo9MDtqPHZlcjtqKyspe1xyXG4gICAgICAgICAgICB2YXIgcm93ID0gW107XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8aG9yO2krKyl7XHJcbiAgICAgICAgICAgICAgICByb3cucHVzaCgwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmaWVsZC5wdXNoKHJvdyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmaWVsZDtcclxuICAgIH1cclxufTtcclxuLy9nZXQgZmllbGQgY2VsbCB2YWx1ZVxyXG5mdW5jdGlvbiBnZXRGQ1YoZmllbGQsIGhvciwgdmVyKXtcclxuICAgIGlmKGZpZWxkW3Zlcl0gPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBpZihmaWVsZFt2ZXJdW2hvcl0gPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmllbGRbdmVyXVtob3JdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ2YXIgZ3JhcGhpY3MgPSByZXF1aXJlKCcuL2dyYXBoaWNzLmpzJyk7XHJcbnZhciBsb2dpYyA9IHJlcXVpcmUoJy4vbG9naWMuanMnKTtcclxuXHJcblxyXG5cclxudmFyIG9wdGlvbnMgPSB7XHJcbiAgICBcImhvcml6b250YWxcIjogNyxcclxuICAgIFwidmVydGljYWxcIjogNixcclxuICAgIFwicGxheWVyc1wiOiBbeyduYW1lJzonUmVkJywgJ2NvbG9yJzoncmVkJ30sIHsnbmFtZSc6J1llbGxvdycsICdjb2xvcic6J3llbGxvdyd9XVxyXG59O1xyXG52YXIgcGxheWVyVmFsdWVzID0gWy0xLDFdO1xyXG52YXIgc2NvcmUgPSBbMCwwXTtcclxudmFyIGZpZWxkID0gW107XHJcblxyXG4vL2xvYWQgZmllbGQsIGNlbGxzXHJcbmdyYXBoaWNzLmxvYWRHcmFwaGljcyhvcHRpb25zLmhvcml6b250YWwsb3B0aW9ucy52ZXJ0aWNhbCk7XHJcblxyXG4vL2dlbmVyYXRlIGZpZWxkIGFycmF5XHJcbmZpZWxkID0gbG9naWMuZ2VuZXJhdGVGaWVsZChvcHRpb25zLmhvcml6b250YWwsb3B0aW9ucy52ZXJ0aWNhbCk7XHJcblxyXG4vL2FkZCBldmVudHNcclxuZ3JhcGhpY3MuYWRkRXZlbnRMaXN0ZW5lcnNUb0J1dHRvbnMocmVzdGFydCwgcmVzZXQpO1xyXG4vL3NldCBpbml0aWFsIGZpZWxkIHN0YXRlIGFuZCB0ZXh0c1xyXG5zdGFydCgpO1xyXG5cclxuLy9ldmVudHNcclxuZnVuY3Rpb24gbW91c2VPdmVyKGV2ZW50KXtcclxuICAgIGlmKGV2ZW50LnRhcmdldC5hdHRyaWJ1dGVzLmJ1c3kudmFsdWU9PSdmcmVlJyl7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9ICdhdmFpbGFibGUgY2VsbCc7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsaWNrKGV2ZW50KXtcclxuICAgIGlmKGV2ZW50LnRhcmdldC5hdHRyaWJ1dGVzLmJ1c3kudmFsdWU9PSdmcmVlJyl7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9IG9wdGlvbnMucGxheWVyc1twbGF5ZXJdLmNvbG9yICsgJyBjZWxsJztcclxuICAgICAgICBldmVudC50YXJnZXQuc2V0QXR0cmlidXRlKCdidXN5Jywgb3B0aW9ucy5wbGF5ZXJzW3BsYXllcl0uY29sb3IpO1xyXG4gICAgICAgIGZpZWxkW2V2ZW50LnRhcmdldC5hdHRyaWJ1dGVzLnZlci52YWx1ZS0xXVtldmVudC50YXJnZXQuYXR0cmlidXRlcy5ob3IudmFsdWUtMV0gPSBwbGF5ZXJWYWx1ZXNbcGxheWVyXTtcclxuICAgICAgICB2YXIgZmllbGRTdGF0dXMgPSBsb2dpYy5jaGVja0ZpZWxkKGZpZWxkLCBwbGF5ZXIsIHBsYXllclZhbHVlcywgZXZlbnQudGFyZ2V0LmF0dHJpYnV0ZXMpO1xyXG4gICAgICAgIGlmKGZpZWxkU3RhdHVzPT0wKXtcclxuICAgICAgICAgICAgcGxheWVyID0gbG9naWMuY2hhbmdlUGxheWVyKHBsYXllcik7XHJcbiAgICAgICAgICAgIGdyYXBoaWNzLnVwZGF0ZUZpZWxkKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgICAgICAgIGdyYXBoaWNzLndyaXRlU3RhdHVzKCdQbGF5ZXIgJytvcHRpb25zLnBsYXllcnNbcGxheWVyXS5uYW1lKydgcyBtb3ZlJyk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGdyYXBoaWNzLndyaXRlU3RhdHVzKCdQbGF5ZXIgJytvcHRpb25zLnBsYXllcnNbcGxheWVyXS5uYW1lKycgd2lucyEnKTtcclxuICAgICAgICAgICAgZ3JhcGhpY3Muc2hvd1dpbm5lckNlbGxzKGV2ZW50LnRhcmdldCwgZmllbGRTdGF0dXMpO1xyXG4gICAgICAgICAgICB2YXIgc2NvcmUxID0gc2NvcmVbMF0gKyAocGxheWVyPT0wPzE6MCk7XHJcbiAgICAgICAgICAgIHZhciBzY29yZTIgPSBzY29yZVsxXSArIChwbGF5ZXI9PTE/MTowKTtcclxuICAgICAgICAgICAgc2NvcmUgPSBbc2NvcmUxLHNjb3JlMl07XHJcbiAgICAgICAgICAgIGdyYXBoaWNzLndyaXRlU2NvcmUoc2NvcmUpO1xyXG4gICAgICAgICAgICBncmFwaGljcy5yZW1vdmVFdmVudExpc3RlbmVyc1RvQ2VsbHMobW91c2VPdmVyLCBjbGljayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByZXN0YXJ0KCl7XHJcbiAgICBwbGF5ZXIgPSAwO1xyXG4gICAgbG9naWMuc2V0SW5pdGlhbEZpZWxkKDYpO1xyXG59XHJcbmZ1bmN0aW9uIHJlc3RhcnQoKXtcclxuICAgIHBsYXllciA9IDA7XHJcbiAgICBncmFwaGljcy5zZXRJbml0aWFsRmllbGQob3B0aW9ucy5ob3Jpem9udGFsLTEpO1xyXG4gICAgZ3JhcGhpY3Mud3JpdGVTdGF0dXMoJ1BsYXllciAnK29wdGlvbnMucGxheWVyc1twbGF5ZXJdLm5hbWUrJ2BzIG1vdmUnKTtcclxuICAgIGdyYXBoaWNzLmFkZEV2ZW50TGlzdGVuZXJzVG9DZWxscyhtb3VzZU92ZXIsIGNsaWNrKTtcclxufVxyXG5mdW5jdGlvbiByZXNldCgpe1xyXG4gICAgc3RhcnQoKTtcclxufVxyXG5mdW5jdGlvbiBzdGFydCgpe1xyXG4gICAgcGxheWVyID0gMDtcclxuICAgIGdyYXBoaWNzLnNldEluaXRpYWxGaWVsZChvcHRpb25zLmhvcml6b250YWwtMSk7XHJcbiAgICBzY29yZT1bMCwwXTtcclxuICAgIGdyYXBoaWNzLndyaXRlU3RhdHVzKCdQbGF5ZXIgJytvcHRpb25zLnBsYXllcnNbcGxheWVyXS5uYW1lKydgcyBtb3ZlJyk7XHJcbiAgICBncmFwaGljcy53cml0ZVNjb3JlKHNjb3JlKTtcclxuICAgIGdyYXBoaWNzLmFkZEV2ZW50TGlzdGVuZXJzVG9DZWxscyhtb3VzZU92ZXIsIGNsaWNrKTtcclxufSJdfQ==
