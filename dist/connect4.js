(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Connect4 = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
    loadGraphics: function (hor, ver) {
        var html =     '<div id="page">'+
                            '<div style="text-align:center; font-family:Arial; color:white; font-size:32px;">Connect-4</div>'+
                            '<div id="content"></div>'+
                            '<div style="text-align:center"><button id="restart" class="button">Restart</button>'+
                            '<button id="reset" class="button">Reset Score</button></div>'+
                            '<div id="field">'+
                                '<table style="width:100%"><tr>'+
                                    '<td><div style="float:left; margin:10px;" class="red cell"></div></td>'+
                                    '<td id="result" class="result"><span style="">0/0</td></td>'+
                                    '<td style="float:right;margin:10px;"><div class="yellow cell"></div></td>'+
                                    '</tr>'+
                                '</table>'+
                                '<table id="cells"></table>'+
                            '</div>'+
                        '</div>';
        var connect4 = document.getElementById('connect4');
        connect4.innerHTML = html;
        
        for(var i=0;i<ver;i++){
            var tr = document.createElement('tr');
            for(var j=0; j<hor; j++){
                var td = document.createElement('td');
                var cell = document.createElement('div');
                cell.setAttribute('class','cell');
                cell.setAttribute('ver', i+1);
                cell.setAttribute('hor', j+1);
                cell.setAttribute('id','cell');
                tr.appendChild(td);
                td.appendChild(cell);
            }
            document.getElementById('cells').appendChild(tr);
        }
    },
    addEventListenersToCells: function(mouseOver, click){
        var rows = document.getElementById('cells').rows;
        for(var j=0;j<rows.length; j++){
            var cells = rows[j].cells;
            for(var i=0;i<cells.length;i++){
                var cell = cells[i].children[0];
                cell.addEventListener('mouseover', mouseOver);
                cell.addEventListener('click', click);
            }
        }
    },
    removeEventListenersToCells: function(mouseOver, click){
        var rows = document.getElementById('cells').rows;
        for(var j=0;j<rows.length; j++){
            var cells = rows[j].cells;
            for(var i=0;i<cells.length;i++){
                var cell = cells[i].children[0];
                cell.removeEventListener('mouseover', mouseOver);
                cell.removeEventListener('click', click);
            }
        }
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
    updateField: function (targetCell){
        var rows = document.getElementById('cells').rows;
        for(var j=0;j<rows.length; j++){
            var cells = rows[j].cells;
            for(var i=0;i<cells.length;i++){
                var cell = cells[i].children[0];
                if((cell.attributes.ver.value == targetCell.attributes.ver.value - 1) && (cell.attributes.hor.value == targetCell.attributes.hor.value)){
                    cell.setAttribute('busy', 'free');
                    cell.className = 'available cell';
                }
            }
        }
    },
    setInitialField: function(ver){
        var rows = document.getElementById('cells').rows;
        for(var j=0;j<rows.length; j++){
            var cells = rows[j].cells;
            for(var i=0;i<cells.length;i++){
                var cell = cells[i].children[0];
                if(cell.attributes.ver.value==ver){
                    cell.setAttribute('busy', 'free');
                    cell.className = 'available cell';
                }else{
                    cell.setAttribute('busy', 'na');
                    cell.className = 'na cell';
                }
            }
        }
        
    },
    showWinnerCells: function(targetCell, direction){
        var rows = document.getElementById('cells').rows;
        var directions = [[0,0], [1,0], [-1,0], [0,1], [1,1], [-1,1]];//shows speed of direction
        var horCoord = parseInt(targetCell.attributes.hor.value);
        var verCoord = parseInt(targetCell.attributes.ver.value);
        
        for (var c=0;c<4;c++){
            for(var j=0;j<rows.length; j++){
                var cells = rows[j].cells;
                for(var i=0;i<cells.length;i++){
                    var cell = cells[i].children[0];
                    if((cell.attributes.hor.value==horCoord)&&(cell.attributes.ver.value==verCoord)){
                        cell.className = 'flash ' + cell.className;
                    }
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

module.exports = Connect4;

function Connect4(userOptions) {
    if(userOptions!=undefined){
        options = userOptions;
    }

};

Connect4.prototype.start = function() {
    console.log(options, score);
    //load field, cells
    graphics.loadGraphics(options.horizontal,options.vertical);
    //generate field array
    field = logic.generateField(options.horizontal,options.vertical);
    //add events
    graphics.addEventListenersToButtons(restart, reset);
    start();
}

//global vars
var playerValues = [-1,1];
var score = [0,0];
var field = [];
var player = 0;
var options = {'horizontal': 7, 'vertical': 6,'players': 
                   [{'name':'SuperMan', 'color':'red'}, {'name':'IronMan', 'color':'yellow'}]};

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
    field = logic.generateField(options.horizontal,options.vertical);
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
},{"./graphics.js":1,"./logic.js":2}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZ3JhcGhpY3MuanMiLCJzcmMvbG9naWMuanMiLCJzcmMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgbG9hZEdyYXBoaWNzOiBmdW5jdGlvbiAoaG9yLCB2ZXIpIHtcclxuICAgICAgICB2YXIgaHRtbCA9ICAgICAnPGRpdiBpZD1cInBhZ2VcIj4nK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOmNlbnRlcjsgZm9udC1mYW1pbHk6QXJpYWw7IGNvbG9yOndoaXRlOyBmb250LXNpemU6MzJweDtcIj5Db25uZWN0LTQ8L2Rpdj4nK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJjb250ZW50XCI+PC9kaXY+JytcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjpjZW50ZXJcIj48YnV0dG9uIGlkPVwicmVzdGFydFwiIGNsYXNzPVwiYnV0dG9uXCI+UmVzdGFydDwvYnV0dG9uPicrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGJ1dHRvbiBpZD1cInJlc2V0XCIgY2xhc3M9XCJidXR0b25cIj5SZXNldCBTY29yZTwvYnV0dG9uPjwvZGl2PicrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cImZpZWxkXCI+JytcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHRhYmxlIHN0eWxlPVwid2lkdGg6MTAwJVwiPjx0cj4nK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHRkPjxkaXYgc3R5bGU9XCJmbG9hdDpsZWZ0OyBtYXJnaW46MTBweDtcIiBjbGFzcz1cInJlZCBjZWxsXCI+PC9kaXY+PC90ZD4nK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHRkIGlkPVwicmVzdWx0XCIgY2xhc3M9XCJyZXN1bHRcIj48c3BhbiBzdHlsZT1cIlwiPjAvMDwvdGQ+PC90ZD4nK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHRkIHN0eWxlPVwiZmxvYXQ6cmlnaHQ7bWFyZ2luOjEwcHg7XCI+PGRpdiBjbGFzcz1cInllbGxvdyBjZWxsXCI+PC9kaXY+PC90ZD4nK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC90cj4nK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L3RhYmxlPicrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0YWJsZSBpZD1cImNlbGxzXCI+PC90YWJsZT4nK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nO1xyXG4gICAgICAgIHZhciBjb25uZWN0NCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb25uZWN0NCcpO1xyXG4gICAgICAgIGNvbm5lY3Q0LmlubmVySFRNTCA9IGh0bWw7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTx2ZXI7aSsrKXtcclxuICAgICAgICAgICAgdmFyIHRyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcclxuICAgICAgICAgICAgZm9yKHZhciBqPTA7IGo8aG9yOyBqKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIHRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcclxuICAgICAgICAgICAgICAgIHZhciBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgICAgICBjZWxsLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCdjZWxsJyk7XHJcbiAgICAgICAgICAgICAgICBjZWxsLnNldEF0dHJpYnV0ZSgndmVyJywgaSsxKTtcclxuICAgICAgICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKCdob3InLCBqKzEpO1xyXG4gICAgICAgICAgICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoJ2lkJywnY2VsbCcpO1xyXG4gICAgICAgICAgICAgICAgdHIuYXBwZW5kQ2hpbGQodGQpO1xyXG4gICAgICAgICAgICAgICAgdGQuYXBwZW5kQ2hpbGQoY2VsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NlbGxzJykuYXBwZW5kQ2hpbGQodHIpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBhZGRFdmVudExpc3RlbmVyc1RvQ2VsbHM6IGZ1bmN0aW9uKG1vdXNlT3ZlciwgY2xpY2spe1xyXG4gICAgICAgIHZhciByb3dzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NlbGxzJykucm93cztcclxuICAgICAgICBmb3IodmFyIGo9MDtqPHJvd3MubGVuZ3RoOyBqKyspe1xyXG4gICAgICAgICAgICB2YXIgY2VsbHMgPSByb3dzW2pdLmNlbGxzO1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPGNlbGxzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIGNlbGwgPSBjZWxsc1tpXS5jaGlsZHJlblswXTtcclxuICAgICAgICAgICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgbW91c2VPdmVyKTtcclxuICAgICAgICAgICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGljayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcnNUb0NlbGxzOiBmdW5jdGlvbihtb3VzZU92ZXIsIGNsaWNrKXtcclxuICAgICAgICB2YXIgcm93cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjZWxscycpLnJvd3M7XHJcbiAgICAgICAgZm9yKHZhciBqPTA7ajxyb3dzLmxlbmd0aDsgaisrKXtcclxuICAgICAgICAgICAgdmFyIGNlbGxzID0gcm93c1tqXS5jZWxscztcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxjZWxscy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBjZWxsID0gY2VsbHNbaV0uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgICAgICAgICBjZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIG1vdXNlT3Zlcik7XHJcbiAgICAgICAgICAgICAgICBjZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGFkZEV2ZW50TGlzdGVuZXJzVG9CdXR0b25zOiBmdW5jdGlvbihyZXN0YXJ0LCByZXNldCl7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhcnQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJlc3RhcnQpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNldCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVzZXQpO1xyXG4gICAgfSxcclxuICAgIHdyaXRlU3RhdHVzOiBmdW5jdGlvbih0ZXh0KXtcclxuICAgICAgICB2YXIgY29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50JykuaW5uZXJIVE1MID0gdGV4dDtcclxuICAgIH0sXHJcbiAgICB3cml0ZVNjb3JlOiBmdW5jdGlvbihzY29yZSl7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHQnKS5pbm5lckhUTUwgPSBzY29yZVswXSsnLycrc2NvcmVbMV07XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlRmllbGQ6IGZ1bmN0aW9uICh0YXJnZXRDZWxsKXtcclxuICAgICAgICB2YXIgcm93cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjZWxscycpLnJvd3M7XHJcbiAgICAgICAgZm9yKHZhciBqPTA7ajxyb3dzLmxlbmd0aDsgaisrKXtcclxuICAgICAgICAgICAgdmFyIGNlbGxzID0gcm93c1tqXS5jZWxscztcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxjZWxscy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBjZWxsID0gY2VsbHNbaV0uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgICAgICAgICBpZigoY2VsbC5hdHRyaWJ1dGVzLnZlci52YWx1ZSA9PSB0YXJnZXRDZWxsLmF0dHJpYnV0ZXMudmVyLnZhbHVlIC0gMSkgJiYgKGNlbGwuYXR0cmlidXRlcy5ob3IudmFsdWUgPT0gdGFyZ2V0Q2VsbC5hdHRyaWJ1dGVzLmhvci52YWx1ZSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKCdidXN5JywgJ2ZyZWUnKTtcclxuICAgICAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTmFtZSA9ICdhdmFpbGFibGUgY2VsbCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2V0SW5pdGlhbEZpZWxkOiBmdW5jdGlvbih2ZXIpe1xyXG4gICAgICAgIHZhciByb3dzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NlbGxzJykucm93cztcclxuICAgICAgICBmb3IodmFyIGo9MDtqPHJvd3MubGVuZ3RoOyBqKyspe1xyXG4gICAgICAgICAgICB2YXIgY2VsbHMgPSByb3dzW2pdLmNlbGxzO1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPGNlbGxzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIGNlbGwgPSBjZWxsc1tpXS5jaGlsZHJlblswXTtcclxuICAgICAgICAgICAgICAgIGlmKGNlbGwuYXR0cmlidXRlcy52ZXIudmFsdWU9PXZlcil7XHJcbiAgICAgICAgICAgICAgICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoJ2J1c3knLCAnZnJlZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NOYW1lID0gJ2F2YWlsYWJsZSBjZWxsJztcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKCdidXN5JywgJ25hJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2VsbC5jbGFzc05hbWUgPSAnbmEgY2VsbCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgc2hvd1dpbm5lckNlbGxzOiBmdW5jdGlvbih0YXJnZXRDZWxsLCBkaXJlY3Rpb24pe1xyXG4gICAgICAgIHZhciByb3dzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NlbGxzJykucm93cztcclxuICAgICAgICB2YXIgZGlyZWN0aW9ucyA9IFtbMCwwXSwgWzEsMF0sIFstMSwwXSwgWzAsMV0sIFsxLDFdLCBbLTEsMV1dOy8vc2hvd3Mgc3BlZWQgb2YgZGlyZWN0aW9uXHJcbiAgICAgICAgdmFyIGhvckNvb3JkID0gcGFyc2VJbnQodGFyZ2V0Q2VsbC5hdHRyaWJ1dGVzLmhvci52YWx1ZSk7XHJcbiAgICAgICAgdmFyIHZlckNvb3JkID0gcGFyc2VJbnQodGFyZ2V0Q2VsbC5hdHRyaWJ1dGVzLnZlci52YWx1ZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgYz0wO2M8NDtjKyspe1xyXG4gICAgICAgICAgICBmb3IodmFyIGo9MDtqPHJvd3MubGVuZ3RoOyBqKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIGNlbGxzID0gcm93c1tqXS5jZWxscztcclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8Y2VsbHMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGwgPSBjZWxsc1tpXS5jaGlsZHJlblswXTtcclxuICAgICAgICAgICAgICAgICAgICBpZigoY2VsbC5hdHRyaWJ1dGVzLmhvci52YWx1ZT09aG9yQ29vcmQpJiYoY2VsbC5hdHRyaWJ1dGVzLnZlci52YWx1ZT09dmVyQ29vcmQpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5jbGFzc05hbWUgPSAnZmxhc2ggJyArIGNlbGwuY2xhc3NOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBob3JDb29yZCA9IGhvckNvb3JkICsgZGlyZWN0aW9uc1tkaXJlY3Rpb25dWzBdO1xyXG4gICAgICAgICAgICB2ZXJDb29yZCA9IHZlckNvb3JkICsgZGlyZWN0aW9uc1tkaXJlY3Rpb25dWzFdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBjaGFuZ2VQbGF5ZXI6IGZ1bmN0aW9uIChjdXJyZW50UGxheWVyKXtcclxuICAgICAgICBpZiAoY3VycmVudFBsYXllciA9PSAxKXtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjaGVja0ZpZWxkOiBmdW5jdGlvbihmaWVsZCwgcGxheWVySWQsIHBsYXllclZhbHVlcywgdGFyZ2V0Q2VsbCl7XHJcbiAgICAgICAgdmFyIGNlbGwgPSB0YXJnZXRDZWxsO1xyXG4gICAgICAgIHZhciBob3IgPSBwYXJzZUludChjZWxsLmhvci52YWx1ZSktMTtcclxuICAgICAgICB2YXIgdmVyID0gcGFyc2VJbnQoY2VsbC52ZXIudmFsdWUpLTE7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gcGxheWVyVmFsdWVzW3BsYXllcklkXSAqIDQ7XHJcbiAgICAgICAgdmFyIHN1bTEgPSBnZXRGQ1YoZmllbGQsIGhvciwgdmVyKSArIGdldEZDVihmaWVsZCwgaG9yKzEsIHZlcikgKyBnZXRGQ1YoZmllbGQsIGhvcisyLCB2ZXIpICsgZ2V0RkNWKGZpZWxkLCBob3IrMywgdmVyKTtcclxuICAgICAgICB2YXIgc3VtMiA9IGdldEZDVihmaWVsZCwgaG9yLCB2ZXIpICsgZ2V0RkNWKGZpZWxkLCBob3ItMSwgdmVyKSArIGdldEZDVihmaWVsZCwgaG9yLTIsIHZlcikgKyBnZXRGQ1YoZmllbGQsIGhvci0zLCB2ZXIpO1xyXG4gICAgICAgIHZhciBzdW0zID0gZ2V0RkNWKGZpZWxkLCBob3IsIHZlcikgKyBnZXRGQ1YoZmllbGQsIGhvciwgdmVyKzEpICsgZ2V0RkNWKGZpZWxkLCBob3IsIHZlcisyKSArIGdldEZDVihmaWVsZCwgaG9yLCB2ZXIrMyk7XHJcbiAgICAgICAgdmFyIHN1bTQgPSBnZXRGQ1YoZmllbGQsIGhvciwgdmVyKSArIGdldEZDVihmaWVsZCwgaG9yKzEsIHZlcisxKSArIGdldEZDVihmaWVsZCwgaG9yKzIsIHZlcisyKSArIGdldEZDVihmaWVsZCwgaG9yKzMsIHZlciszKTtcclxuICAgICAgICB2YXIgc3VtNSA9IGdldEZDVihmaWVsZCwgaG9yLCB2ZXIpICsgZ2V0RkNWKGZpZWxkLCBob3ItMSwgdmVyKzEpICsgZ2V0RkNWKGZpZWxkLCBob3ItMiwgdmVyKzIpICsgZ2V0RkNWKGZpZWxkLCBob3ItMywgdmVyKzMpO1xyXG5cclxuICAgICAgICBpZigoc3VtMT09dmFsdWUpfHwoc3VtMj09dmFsdWUpfHwoc3VtMz09dmFsdWUpfHwoc3VtND09dmFsdWUpfHwoc3VtNT09dmFsdWUpKXtcclxuICAgICAgICAgICAgaWYoc3VtMT09dmFsdWUpIHJldHVybiAxO1xyXG4gICAgICAgICAgICBpZihzdW0yPT12YWx1ZSkgcmV0dXJuIDI7XHJcbiAgICAgICAgICAgIGlmKHN1bTM9PXZhbHVlKSByZXR1cm4gMztcclxuICAgICAgICAgICAgaWYoc3VtND09dmFsdWUpIHJldHVybiA0O1xyXG4gICAgICAgICAgICBpZihzdW01PT12YWx1ZSkgcmV0dXJuIDU7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBnZW5lcmF0ZUZpZWxkOiBmdW5jdGlvbihob3IsIHZlcil7XHJcbiAgICAgICAgdmFyIGZpZWxkID0gW107XHJcbiAgICAgICAgZm9yKHZhciBqPTA7ajx2ZXI7aisrKXtcclxuICAgICAgICAgICAgdmFyIHJvdyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPGhvcjtpKyspe1xyXG4gICAgICAgICAgICAgICAgcm93LnB1c2goMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZmllbGQucHVzaChyb3cpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmllbGQ7XHJcbiAgICB9XHJcbn07XHJcbi8vZ2V0IGZpZWxkIGNlbGwgdmFsdWVcclxuZnVuY3Rpb24gZ2V0RkNWKGZpZWxkLCBob3IsIHZlcil7XHJcbiAgICBpZihmaWVsZFt2ZXJdID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgaWYoZmllbGRbdmVyXVtob3JdID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIGZpZWxkW3Zlcl1baG9yXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidmFyIGdyYXBoaWNzID0gcmVxdWlyZSgnLi9ncmFwaGljcy5qcycpO1xyXG52YXIgbG9naWMgPSByZXF1aXJlKCcuL2xvZ2ljLmpzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbm5lY3Q0O1xyXG5cclxuZnVuY3Rpb24gQ29ubmVjdDQodXNlck9wdGlvbnMpIHtcclxuICAgIGlmKHVzZXJPcHRpb25zIT11bmRlZmluZWQpe1xyXG4gICAgICAgIG9wdGlvbnMgPSB1c2VyT3B0aW9ucztcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5Db25uZWN0NC5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnNvbGUubG9nKG9wdGlvbnMsIHNjb3JlKTtcclxuICAgIC8vbG9hZCBmaWVsZCwgY2VsbHNcclxuICAgIGdyYXBoaWNzLmxvYWRHcmFwaGljcyhvcHRpb25zLmhvcml6b250YWwsb3B0aW9ucy52ZXJ0aWNhbCk7XHJcbiAgICAvL2dlbmVyYXRlIGZpZWxkIGFycmF5XHJcbiAgICBmaWVsZCA9IGxvZ2ljLmdlbmVyYXRlRmllbGQob3B0aW9ucy5ob3Jpem9udGFsLG9wdGlvbnMudmVydGljYWwpO1xyXG4gICAgLy9hZGQgZXZlbnRzXHJcbiAgICBncmFwaGljcy5hZGRFdmVudExpc3RlbmVyc1RvQnV0dG9ucyhyZXN0YXJ0LCByZXNldCk7XHJcbiAgICBzdGFydCgpO1xyXG59XHJcblxyXG4vL2dsb2JhbCB2YXJzXHJcbnZhciBwbGF5ZXJWYWx1ZXMgPSBbLTEsMV07XHJcbnZhciBzY29yZSA9IFswLDBdO1xyXG52YXIgZmllbGQgPSBbXTtcclxudmFyIHBsYXllciA9IDA7XHJcbnZhciBvcHRpb25zID0geydob3Jpem9udGFsJzogNywgJ3ZlcnRpY2FsJzogNiwncGxheWVycyc6IFxyXG4gICAgICAgICAgICAgICAgICAgW3snbmFtZSc6J1N1cGVyTWFuJywgJ2NvbG9yJzoncmVkJ30sIHsnbmFtZSc6J0lyb25NYW4nLCAnY29sb3InOid5ZWxsb3cnfV19O1xyXG5cclxuLy9ldmVudHNcclxuZnVuY3Rpb24gbW91c2VPdmVyKGV2ZW50KXtcclxuICAgIGlmKGV2ZW50LnRhcmdldC5hdHRyaWJ1dGVzLmJ1c3kudmFsdWU9PSdmcmVlJyl7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9ICdhdmFpbGFibGUgY2VsbCc7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gY2xpY2soZXZlbnQpe1xyXG4gICAgaWYoZXZlbnQudGFyZ2V0LmF0dHJpYnV0ZXMuYnVzeS52YWx1ZT09J2ZyZWUnKXtcclxuICAgICAgICBldmVudC50YXJnZXQuY2xhc3NOYW1lID0gb3B0aW9ucy5wbGF5ZXJzW3BsYXllcl0uY29sb3IgKyAnIGNlbGwnO1xyXG4gICAgICAgIGV2ZW50LnRhcmdldC5zZXRBdHRyaWJ1dGUoJ2J1c3knLCBvcHRpb25zLnBsYXllcnNbcGxheWVyXS5jb2xvcik7XHJcbiAgICAgICAgZmllbGRbZXZlbnQudGFyZ2V0LmF0dHJpYnV0ZXMudmVyLnZhbHVlLTFdW2V2ZW50LnRhcmdldC5hdHRyaWJ1dGVzLmhvci52YWx1ZS0xXSA9IHBsYXllclZhbHVlc1twbGF5ZXJdO1xyXG4gICAgICAgIHZhciBmaWVsZFN0YXR1cyA9IGxvZ2ljLmNoZWNrRmllbGQoZmllbGQsIHBsYXllciwgcGxheWVyVmFsdWVzLCBldmVudC50YXJnZXQuYXR0cmlidXRlcyk7XHJcbiAgICAgICAgaWYoZmllbGRTdGF0dXM9PTApe1xyXG4gICAgICAgICAgICBwbGF5ZXIgPSBsb2dpYy5jaGFuZ2VQbGF5ZXIocGxheWVyKTtcclxuICAgICAgICAgICAgZ3JhcGhpY3MudXBkYXRlRmllbGQoZXZlbnQudGFyZ2V0KTtcclxuICAgICAgICAgICAgZ3JhcGhpY3Mud3JpdGVTdGF0dXMoJ1BsYXllciAnK29wdGlvbnMucGxheWVyc1twbGF5ZXJdLm5hbWUrJ2BzIG1vdmUnKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgZ3JhcGhpY3Mud3JpdGVTdGF0dXMoJ1BsYXllciAnK29wdGlvbnMucGxheWVyc1twbGF5ZXJdLm5hbWUrJyB3aW5zIScpO1xyXG4gICAgICAgICAgICBncmFwaGljcy5zaG93V2lubmVyQ2VsbHMoZXZlbnQudGFyZ2V0LCBmaWVsZFN0YXR1cyk7XHJcbiAgICAgICAgICAgIHZhciBzY29yZTEgPSBzY29yZVswXSArIChwbGF5ZXI9PTA/MTowKTtcclxuICAgICAgICAgICAgdmFyIHNjb3JlMiA9IHNjb3JlWzFdICsgKHBsYXllcj09MT8xOjApO1xyXG4gICAgICAgICAgICBzY29yZSA9IFtzY29yZTEsc2NvcmUyXTtcclxuICAgICAgICAgICAgZ3JhcGhpY3Mud3JpdGVTY29yZShzY29yZSk7XHJcbiAgICAgICAgICAgIGdyYXBoaWNzLnJlbW92ZUV2ZW50TGlzdGVuZXJzVG9DZWxscyhtb3VzZU92ZXIsIGNsaWNrKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc3RhcnQoKXtcclxuICAgIHBsYXllciA9IDA7XHJcbiAgICBsb2dpYy5zZXRJbml0aWFsRmllbGQoNik7XHJcbn1cclxuZnVuY3Rpb24gcmVzdGFydCgpe1xyXG4gICAgcGxheWVyID0gMDtcclxuICAgIGdyYXBoaWNzLnNldEluaXRpYWxGaWVsZChvcHRpb25zLmhvcml6b250YWwtMSk7XHJcbiAgICBncmFwaGljcy53cml0ZVN0YXR1cygnUGxheWVyICcrb3B0aW9ucy5wbGF5ZXJzW3BsYXllcl0ubmFtZSsnYHMgbW92ZScpO1xyXG4gICAgZ3JhcGhpY3MuYWRkRXZlbnRMaXN0ZW5lcnNUb0NlbGxzKG1vdXNlT3ZlciwgY2xpY2spO1xyXG4gICAgZmllbGQgPSBsb2dpYy5nZW5lcmF0ZUZpZWxkKG9wdGlvbnMuaG9yaXpvbnRhbCxvcHRpb25zLnZlcnRpY2FsKTtcclxufVxyXG5mdW5jdGlvbiByZXNldCgpe1xyXG4gICAgc3RhcnQoKTtcclxufVxyXG5mdW5jdGlvbiBzdGFydCgpe1xyXG4gICAgcGxheWVyID0gMDtcclxuICAgIGdyYXBoaWNzLnNldEluaXRpYWxGaWVsZChvcHRpb25zLmhvcml6b250YWwtMSk7XHJcbiAgICBzY29yZT1bMCwwXTtcclxuICAgIGdyYXBoaWNzLndyaXRlU3RhdHVzKCdQbGF5ZXIgJytvcHRpb25zLnBsYXllcnNbcGxheWVyXS5uYW1lKydgcyBtb3ZlJyk7XHJcbiAgICBncmFwaGljcy53cml0ZVNjb3JlKHNjb3JlKTtcclxuICAgIGdyYXBoaWNzLmFkZEV2ZW50TGlzdGVuZXJzVG9DZWxscyhtb3VzZU92ZXIsIGNsaWNrKTtcclxufSJdfQ==
