(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Connect4 = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
    //load all graphics of the field
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
                cell.setAttribute('id','cell_'+parseInt(j+1)+'_'+parseInt(i+1));
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
    showWinnerCells: function(targetCell, directions){
        var rows = document.getElementById('cells').rows;
        directions.forEach(function(direction){
            var hor = parseInt(targetCell.attributes.hor.value);//get starting point
            var ver = parseInt(targetCell.attributes.ver.value);
            if(direction[3]=='w' && direction[2]>0){
                for(var c=0; c<direction[2]+1; c++){
                    for(var j=0;j<rows.length; j++){
                        var cells = rows[j].cells;
                        for(var i=0;i<cells.length;i++){
                            var cell = cells[i].children[0];
                            if((cell.attributes.hor.value==hor)&&(cell.attributes.ver.value==ver)){
                                cell.className = 'flash ' + cell.className;
                            }
                        }
                    }
                    hor = hor + direction[0];
                    ver = ver + direction[1];
                }
            }
        })
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
    checkField: function(field, playerId, playerValues, targetCell, valueToWin){
        var cell = targetCell;
        var value = playerValues[playerId] * valueToWin;
        var directions = [[1,0],//East
                          [-1,0],//West
                          [0,1],//South
                          [1,1],//SouthEast
                          [-1,1],//SouthWest
                          [1,-1],//NorthEast
                          [-1,-1]];//NorthWest
        //shows speed of direction
        directions.forEach(function(direction){
            var hor = parseInt(cell.hor.value)-1;
            var ver = parseInt(cell.ver.value)-1;
            var sum = 0;
            do{
                hor = hor + direction[0];
                ver = ver + direction[1];
                if(getFCV(field, hor, ver)==playerValues[playerId])
                sum = getFCV(field, hor, ver) + sum;
            }
            while (getFCV(field, hor, ver)==playerValues[playerId]);
            direction[2] = Math.abs(sum);
        });
        var isWin = false;
        if (directions[2][2]>=valueToWin-1) {//check South direction
            directions[2][3]='w';
            isWin = true;
            
        }
        if (directions[0][2]>=valueToWin-1){//check East direction
            directions[0][3]='w';
            isWin = true;
        }
        if (directions[1][2]>=valueToWin-1){//check West direction
            directions[1][3]='w';
            isWin = true;
        }
        if (directions[1][2] + directions[0][2]>=valueToWin-1){//check East and West directions
            directions[0][3]='w';
            directions[1][3]='w';
            isWin = true;
        }
        
        if (directions[4][2]>=valueToWin-1){//check SouthWest direction
            directions[4][3]='w';
            isWin = true;
        }
        if (directions[5][2]>=valueToWin-1){//check NorthEast direction
            directions[5][3]='w';
            isWin = true;
        }
        if (directions[4][2] + directions[5][2]>=valueToWin-1){//check NorthEast and SouthWest West directions
            directions[4][3]='w';
            directions[5][3]='w';
            isWin = true;
        }
        
        if (directions[6][2]>=valueToWin-1){//check NorthWest direction
            directions[6][3]='w';
            isWin = true;
        }
        if (directions[3][2]>=valueToWin-1){//check SouthEast direction
            directions[3][3]='w';
            isWin = true;
        }
        if (directions[6][2] + directions[3][2]>=valueToWin-1){//check NorthWest and SouthEast West directions
            directions[6][3]='w';
            directions[3][3]='w';
            isWin = true;
        }
        return (isWin?directions:0);
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
var valueToWin = 4;//number of cells to win
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
        field[event.target.attributes.ver.value-1][event.target.attributes.hor.value-1] = playerValues[player];// set field value.
        var fieldStatus = logic.checkField(field, player, playerValues, event.target.attributes, valueToWin);//check if this move is winning.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZ3JhcGhpY3MuanMiLCJzcmMvbG9naWMuanMiLCJzcmMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgLy9sb2FkIGFsbCBncmFwaGljcyBvZiB0aGUgZmllbGRcclxuICAgIGxvYWRHcmFwaGljczogZnVuY3Rpb24gKGhvciwgdmVyKSB7XHJcbiAgICAgICAgdmFyIGh0bWwgPSAgICAgJzxkaXYgaWQ9XCJwYWdlXCI+JytcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjpjZW50ZXI7IGZvbnQtZmFtaWx5OkFyaWFsOyBjb2xvcjp3aGl0ZTsgZm9udC1zaXplOjMycHg7XCI+Q29ubmVjdC00PC9kaXY+JytcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGlkPVwiY29udGVudFwiPjwvZGl2PicrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBzdHlsZT1cInRleHQtYWxpZ246Y2VudGVyXCI+PGJ1dHRvbiBpZD1cInJlc3RhcnRcIiBjbGFzcz1cImJ1dHRvblwiPlJlc3RhcnQ8L2J1dHRvbj4nK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxidXR0b24gaWQ9XCJyZXNldFwiIGNsYXNzPVwiYnV0dG9uXCI+UmVzZXQgU2NvcmU8L2J1dHRvbj48L2Rpdj4nK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJmaWVsZFwiPicrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0YWJsZSBzdHlsZT1cIndpZHRoOjEwMCVcIj48dHI+JytcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0ZD48ZGl2IHN0eWxlPVwiZmxvYXQ6bGVmdDsgbWFyZ2luOjEwcHg7XCIgY2xhc3M9XCJyZWQgY2VsbFwiPjwvZGl2PjwvdGQ+JytcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0ZCBpZD1cInJlc3VsdFwiIGNsYXNzPVwicmVzdWx0XCI+PHNwYW4gc3R5bGU9XCJcIj4wLzA8L3RkPjwvdGQ+JytcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0ZCBzdHlsZT1cImZsb2F0OnJpZ2h0O21hcmdpbjoxMHB4O1wiPjxkaXYgY2xhc3M9XCJ5ZWxsb3cgY2VsbFwiPjwvZGl2PjwvdGQ+JytcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvdHI+JytcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC90YWJsZT4nK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8dGFibGUgaWQ9XCJjZWxsc1wiPjwvdGFibGU+JytcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JztcclxuICAgICAgICB2YXIgY29ubmVjdDQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29ubmVjdDQnKTtcclxuICAgICAgICBjb25uZWN0NC5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dmVyO2krKyl7XHJcbiAgICAgICAgICAgIHZhciB0ciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaj0wOyBqPGhvcjsgaisrKXtcclxuICAgICAgICAgICAgICAgIHZhciB0ZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywnY2VsbCcpO1xyXG4gICAgICAgICAgICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoJ3ZlcicsIGkrMSk7XHJcbiAgICAgICAgICAgICAgICBjZWxsLnNldEF0dHJpYnV0ZSgnaG9yJywgaisxKTtcclxuICAgICAgICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKCdpZCcsJ2NlbGxfJytwYXJzZUludChqKzEpKydfJytwYXJzZUludChpKzEpKTtcclxuICAgICAgICAgICAgICAgIHRyLmFwcGVuZENoaWxkKHRkKTtcclxuICAgICAgICAgICAgICAgIHRkLmFwcGVuZENoaWxkKGNlbGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjZWxscycpLmFwcGVuZENoaWxkKHRyKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgYWRkRXZlbnRMaXN0ZW5lcnNUb0NlbGxzOiBmdW5jdGlvbihtb3VzZU92ZXIsIGNsaWNrKXtcclxuICAgICAgICB2YXIgcm93cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjZWxscycpLnJvd3M7XHJcbiAgICAgICAgZm9yKHZhciBqPTA7ajxyb3dzLmxlbmd0aDsgaisrKXtcclxuICAgICAgICAgICAgdmFyIGNlbGxzID0gcm93c1tqXS5jZWxscztcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxjZWxscy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBjZWxsID0gY2VsbHNbaV0uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIG1vdXNlT3Zlcik7XHJcbiAgICAgICAgICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJlbW92ZUV2ZW50TGlzdGVuZXJzVG9DZWxsczogZnVuY3Rpb24obW91c2VPdmVyLCBjbGljayl7XHJcbiAgICAgICAgdmFyIHJvd3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2VsbHMnKS5yb3dzO1xyXG4gICAgICAgIGZvcih2YXIgaj0wO2o8cm93cy5sZW5ndGg7IGorKyl7XHJcbiAgICAgICAgICAgIHZhciBjZWxscyA9IHJvd3Nbal0uY2VsbHM7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8Y2VsbHMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IGNlbGxzW2ldLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgICAgICAgICAgY2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBtb3VzZU92ZXIpO1xyXG4gICAgICAgICAgICAgICAgY2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGNsaWNrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBhZGRFdmVudExpc3RlbmVyc1RvQnV0dG9uczogZnVuY3Rpb24ocmVzdGFydCwgcmVzZXQpe1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXJ0JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZXN0YXJ0KTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzZXQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJlc2V0KTtcclxuICAgIH0sXHJcbiAgICB3cml0ZVN0YXR1czogZnVuY3Rpb24odGV4dCl7XHJcbiAgICAgICAgdmFyIGNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpLmlubmVySFRNTCA9IHRleHQ7XHJcbiAgICB9LFxyXG4gICAgd3JpdGVTY29yZTogZnVuY3Rpb24oc2NvcmUpe1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdWx0JykuaW5uZXJIVE1MID0gc2NvcmVbMF0rJy8nK3Njb3JlWzFdO1xyXG4gICAgfSxcclxuICAgIHVwZGF0ZUZpZWxkOiBmdW5jdGlvbiAodGFyZ2V0Q2VsbCl7XHJcbiAgICAgICAgdmFyIHJvd3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2VsbHMnKS5yb3dzO1xyXG4gICAgICAgIGZvcih2YXIgaj0wO2o8cm93cy5sZW5ndGg7IGorKyl7XHJcbiAgICAgICAgICAgIHZhciBjZWxscyA9IHJvd3Nbal0uY2VsbHM7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8Y2VsbHMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IGNlbGxzW2ldLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgICAgICAgICAgaWYoKGNlbGwuYXR0cmlidXRlcy52ZXIudmFsdWUgPT0gdGFyZ2V0Q2VsbC5hdHRyaWJ1dGVzLnZlci52YWx1ZSAtIDEpICYmIChjZWxsLmF0dHJpYnV0ZXMuaG9yLnZhbHVlID09IHRhcmdldENlbGwuYXR0cmlidXRlcy5ob3IudmFsdWUpKXtcclxuICAgICAgICAgICAgICAgICAgICBjZWxsLnNldEF0dHJpYnV0ZSgnYnVzeScsICdmcmVlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2VsbC5jbGFzc05hbWUgPSAnYXZhaWxhYmxlIGNlbGwnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHNldEluaXRpYWxGaWVsZDogZnVuY3Rpb24odmVyKXtcclxuICAgICAgICB2YXIgcm93cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjZWxscycpLnJvd3M7XHJcbiAgICAgICAgZm9yKHZhciBqPTA7ajxyb3dzLmxlbmd0aDsgaisrKXtcclxuICAgICAgICAgICAgdmFyIGNlbGxzID0gcm93c1tqXS5jZWxscztcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxjZWxscy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBjZWxsID0gY2VsbHNbaV0uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgICAgICAgICBpZihjZWxsLmF0dHJpYnV0ZXMudmVyLnZhbHVlPT12ZXIpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKCdidXN5JywgJ2ZyZWUnKTtcclxuICAgICAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTmFtZSA9ICdhdmFpbGFibGUgY2VsbCc7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBjZWxsLnNldEF0dHJpYnV0ZSgnYnVzeScsICduYScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NOYW1lID0gJ25hIGNlbGwnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfSxcclxuICAgIHNob3dXaW5uZXJDZWxsczogZnVuY3Rpb24odGFyZ2V0Q2VsbCwgZGlyZWN0aW9ucyl7XHJcbiAgICAgICAgdmFyIHJvd3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2VsbHMnKS5yb3dzO1xyXG4gICAgICAgIGRpcmVjdGlvbnMuZm9yRWFjaChmdW5jdGlvbihkaXJlY3Rpb24pe1xyXG4gICAgICAgICAgICB2YXIgaG9yID0gcGFyc2VJbnQodGFyZ2V0Q2VsbC5hdHRyaWJ1dGVzLmhvci52YWx1ZSk7Ly9nZXQgc3RhcnRpbmcgcG9pbnRcclxuICAgICAgICAgICAgdmFyIHZlciA9IHBhcnNlSW50KHRhcmdldENlbGwuYXR0cmlidXRlcy52ZXIudmFsdWUpO1xyXG4gICAgICAgICAgICBpZihkaXJlY3Rpb25bM109PSd3JyAmJiBkaXJlY3Rpb25bMl0+MCl7XHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGM9MDsgYzxkaXJlY3Rpb25bMl0rMTsgYysrKXtcclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGo9MDtqPHJvd3MubGVuZ3RoOyBqKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbHMgPSByb3dzW2pdLmNlbGxzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDtpPGNlbGxzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGwgPSBjZWxsc1tpXS5jaGlsZHJlblswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKChjZWxsLmF0dHJpYnV0ZXMuaG9yLnZhbHVlPT1ob3IpJiYoY2VsbC5hdHRyaWJ1dGVzLnZlci52YWx1ZT09dmVyKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5jbGFzc05hbWUgPSAnZmxhc2ggJyArIGNlbGwuY2xhc3NOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGhvciA9IGhvciArIGRpcmVjdGlvblswXTtcclxuICAgICAgICAgICAgICAgICAgICB2ZXIgPSB2ZXIgKyBkaXJlY3Rpb25bMV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGNoYW5nZVBsYXllcjogZnVuY3Rpb24gKGN1cnJlbnRQbGF5ZXIpe1xyXG4gICAgICAgIGlmIChjdXJyZW50UGxheWVyID09IDEpe1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNoZWNrRmllbGQ6IGZ1bmN0aW9uKGZpZWxkLCBwbGF5ZXJJZCwgcGxheWVyVmFsdWVzLCB0YXJnZXRDZWxsLCB2YWx1ZVRvV2luKXtcclxuICAgICAgICB2YXIgY2VsbCA9IHRhcmdldENlbGw7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gcGxheWVyVmFsdWVzW3BsYXllcklkXSAqIHZhbHVlVG9XaW47XHJcbiAgICAgICAgdmFyIGRpcmVjdGlvbnMgPSBbWzEsMF0sLy9FYXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgWy0xLDBdLC8vV2VzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFswLDFdLC8vU291dGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBbMSwxXSwvL1NvdXRoRWFzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFstMSwxXSwvL1NvdXRoV2VzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFsxLC0xXSwvL05vcnRoRWFzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFstMSwtMV1dOy8vTm9ydGhXZXN0XHJcbiAgICAgICAgLy9zaG93cyBzcGVlZCBvZiBkaXJlY3Rpb25cclxuICAgICAgICBkaXJlY3Rpb25zLmZvckVhY2goZnVuY3Rpb24oZGlyZWN0aW9uKXtcclxuICAgICAgICAgICAgdmFyIGhvciA9IHBhcnNlSW50KGNlbGwuaG9yLnZhbHVlKS0xO1xyXG4gICAgICAgICAgICB2YXIgdmVyID0gcGFyc2VJbnQoY2VsbC52ZXIudmFsdWUpLTE7XHJcbiAgICAgICAgICAgIHZhciBzdW0gPSAwO1xyXG4gICAgICAgICAgICBkb3tcclxuICAgICAgICAgICAgICAgIGhvciA9IGhvciArIGRpcmVjdGlvblswXTtcclxuICAgICAgICAgICAgICAgIHZlciA9IHZlciArIGRpcmVjdGlvblsxXTtcclxuICAgICAgICAgICAgICAgIGlmKGdldEZDVihmaWVsZCwgaG9yLCB2ZXIpPT1wbGF5ZXJWYWx1ZXNbcGxheWVySWRdKVxyXG4gICAgICAgICAgICAgICAgc3VtID0gZ2V0RkNWKGZpZWxkLCBob3IsIHZlcikgKyBzdW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgd2hpbGUgKGdldEZDVihmaWVsZCwgaG9yLCB2ZXIpPT1wbGF5ZXJWYWx1ZXNbcGxheWVySWRdKTtcclxuICAgICAgICAgICAgZGlyZWN0aW9uWzJdID0gTWF0aC5hYnMoc3VtKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgaXNXaW4gPSBmYWxzZTtcclxuICAgICAgICBpZiAoZGlyZWN0aW9uc1syXVsyXT49dmFsdWVUb1dpbi0xKSB7Ly9jaGVjayBTb3V0aCBkaXJlY3Rpb25cclxuICAgICAgICAgICAgZGlyZWN0aW9uc1syXVszXT0ndyc7XHJcbiAgICAgICAgICAgIGlzV2luID0gdHJ1ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkaXJlY3Rpb25zWzBdWzJdPj12YWx1ZVRvV2luLTEpey8vY2hlY2sgRWFzdCBkaXJlY3Rpb25cclxuICAgICAgICAgICAgZGlyZWN0aW9uc1swXVszXT0ndyc7XHJcbiAgICAgICAgICAgIGlzV2luID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRpcmVjdGlvbnNbMV1bMl0+PXZhbHVlVG9XaW4tMSl7Ly9jaGVjayBXZXN0IGRpcmVjdGlvblxyXG4gICAgICAgICAgICBkaXJlY3Rpb25zWzFdWzNdPSd3JztcclxuICAgICAgICAgICAgaXNXaW4gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGlyZWN0aW9uc1sxXVsyXSArIGRpcmVjdGlvbnNbMF1bMl0+PXZhbHVlVG9XaW4tMSl7Ly9jaGVjayBFYXN0IGFuZCBXZXN0IGRpcmVjdGlvbnNcclxuICAgICAgICAgICAgZGlyZWN0aW9uc1swXVszXT0ndyc7XHJcbiAgICAgICAgICAgIGRpcmVjdGlvbnNbMV1bM109J3cnO1xyXG4gICAgICAgICAgICBpc1dpbiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChkaXJlY3Rpb25zWzRdWzJdPj12YWx1ZVRvV2luLTEpey8vY2hlY2sgU291dGhXZXN0IGRpcmVjdGlvblxyXG4gICAgICAgICAgICBkaXJlY3Rpb25zWzRdWzNdPSd3JztcclxuICAgICAgICAgICAgaXNXaW4gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGlyZWN0aW9uc1s1XVsyXT49dmFsdWVUb1dpbi0xKXsvL2NoZWNrIE5vcnRoRWFzdCBkaXJlY3Rpb25cclxuICAgICAgICAgICAgZGlyZWN0aW9uc1s1XVszXT0ndyc7XHJcbiAgICAgICAgICAgIGlzV2luID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRpcmVjdGlvbnNbNF1bMl0gKyBkaXJlY3Rpb25zWzVdWzJdPj12YWx1ZVRvV2luLTEpey8vY2hlY2sgTm9ydGhFYXN0IGFuZCBTb3V0aFdlc3QgV2VzdCBkaXJlY3Rpb25zXHJcbiAgICAgICAgICAgIGRpcmVjdGlvbnNbNF1bM109J3cnO1xyXG4gICAgICAgICAgICBkaXJlY3Rpb25zWzVdWzNdPSd3JztcclxuICAgICAgICAgICAgaXNXaW4gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiAoZGlyZWN0aW9uc1s2XVsyXT49dmFsdWVUb1dpbi0xKXsvL2NoZWNrIE5vcnRoV2VzdCBkaXJlY3Rpb25cclxuICAgICAgICAgICAgZGlyZWN0aW9uc1s2XVszXT0ndyc7XHJcbiAgICAgICAgICAgIGlzV2luID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRpcmVjdGlvbnNbM11bMl0+PXZhbHVlVG9XaW4tMSl7Ly9jaGVjayBTb3V0aEVhc3QgZGlyZWN0aW9uXHJcbiAgICAgICAgICAgIGRpcmVjdGlvbnNbM11bM109J3cnO1xyXG4gICAgICAgICAgICBpc1dpbiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkaXJlY3Rpb25zWzZdWzJdICsgZGlyZWN0aW9uc1szXVsyXT49dmFsdWVUb1dpbi0xKXsvL2NoZWNrIE5vcnRoV2VzdCBhbmQgU291dGhFYXN0IFdlc3QgZGlyZWN0aW9uc1xyXG4gICAgICAgICAgICBkaXJlY3Rpb25zWzZdWzNdPSd3JztcclxuICAgICAgICAgICAgZGlyZWN0aW9uc1szXVszXT0ndyc7XHJcbiAgICAgICAgICAgIGlzV2luID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIChpc1dpbj9kaXJlY3Rpb25zOjApO1xyXG4gICAgfSxcclxuICAgIGdlbmVyYXRlRmllbGQ6IGZ1bmN0aW9uKGhvciwgdmVyKXtcclxuICAgICAgICB2YXIgZmllbGQgPSBbXTtcclxuICAgICAgICBmb3IodmFyIGo9MDtqPHZlcjtqKyspe1xyXG4gICAgICAgICAgICB2YXIgcm93ID0gW107XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8aG9yO2krKyl7XHJcbiAgICAgICAgICAgICAgICByb3cucHVzaCgwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmaWVsZC5wdXNoKHJvdyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmaWVsZDtcclxuICAgIH1cclxufTtcclxuLy9nZXQgZmllbGQgY2VsbCB2YWx1ZVxyXG5mdW5jdGlvbiBnZXRGQ1YoZmllbGQsIGhvciwgdmVyKXtcclxuICAgIGlmKGZpZWxkW3Zlcl0gPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBpZihmaWVsZFt2ZXJdW2hvcl0gPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmllbGRbdmVyXVtob3JdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ2YXIgZ3JhcGhpY3MgPSByZXF1aXJlKCcuL2dyYXBoaWNzLmpzJyk7XHJcbnZhciBsb2dpYyA9IHJlcXVpcmUoJy4vbG9naWMuanMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29ubmVjdDQ7XHJcblxyXG5mdW5jdGlvbiBDb25uZWN0NCh1c2VyT3B0aW9ucykge1xyXG4gICAgaWYodXNlck9wdGlvbnMhPXVuZGVmaW5lZCl7XHJcbiAgICAgICAgb3B0aW9ucyA9IHVzZXJPcHRpb25zO1xyXG4gICAgfVxyXG59O1xyXG5cclxuQ29ubmVjdDQucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZyhvcHRpb25zLCBzY29yZSk7XHJcbiAgICAvL2xvYWQgZmllbGQsIGNlbGxzXHJcbiAgICBncmFwaGljcy5sb2FkR3JhcGhpY3Mob3B0aW9ucy5ob3Jpem9udGFsLG9wdGlvbnMudmVydGljYWwpO1xyXG4gICAgLy9nZW5lcmF0ZSBmaWVsZCBhcnJheVxyXG4gICAgZmllbGQgPSBsb2dpYy5nZW5lcmF0ZUZpZWxkKG9wdGlvbnMuaG9yaXpvbnRhbCxvcHRpb25zLnZlcnRpY2FsKTtcclxuICAgIC8vYWRkIGV2ZW50c1xyXG4gICAgZ3JhcGhpY3MuYWRkRXZlbnRMaXN0ZW5lcnNUb0J1dHRvbnMocmVzdGFydCwgcmVzZXQpO1xyXG4gICAgc3RhcnQoKTtcclxufVxyXG5cclxuLy9nbG9iYWwgdmFyc1xyXG52YXIgcGxheWVyVmFsdWVzID0gWy0xLDFdO1xyXG52YXIgc2NvcmUgPSBbMCwwXTtcclxudmFyIGZpZWxkID0gW107XHJcbnZhciBwbGF5ZXIgPSAwO1xyXG52YXIgdmFsdWVUb1dpbiA9IDQ7Ly9udW1iZXIgb2YgY2VsbHMgdG8gd2luXHJcbnZhciBvcHRpb25zID0geydob3Jpem9udGFsJzogNywgJ3ZlcnRpY2FsJzogNiwncGxheWVycyc6IFxyXG4gICAgICAgICAgICAgICAgICAgW3snbmFtZSc6J1N1cGVyTWFuJywgJ2NvbG9yJzoncmVkJ30sIHsnbmFtZSc6J0lyb25NYW4nLCAnY29sb3InOid5ZWxsb3cnfV19O1xyXG5cclxuXHJcbi8vZXZlbnRzXHJcbmZ1bmN0aW9uIG1vdXNlT3ZlcihldmVudCl7XHJcbiAgICBpZihldmVudC50YXJnZXQuYXR0cmlidXRlcy5idXN5LnZhbHVlPT0nZnJlZScpe1xyXG4gICAgICAgIGV2ZW50LnRhcmdldC5jbGFzc05hbWUgPSAnYXZhaWxhYmxlIGNlbGwnO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGNsaWNrKGV2ZW50KXtcclxuICAgIGlmKGV2ZW50LnRhcmdldC5hdHRyaWJ1dGVzLmJ1c3kudmFsdWU9PSdmcmVlJyl7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9IG9wdGlvbnMucGxheWVyc1twbGF5ZXJdLmNvbG9yICsgJyBjZWxsJztcclxuICAgICAgICBldmVudC50YXJnZXQuc2V0QXR0cmlidXRlKCdidXN5Jywgb3B0aW9ucy5wbGF5ZXJzW3BsYXllcl0uY29sb3IpO1xyXG4gICAgICAgIGZpZWxkW2V2ZW50LnRhcmdldC5hdHRyaWJ1dGVzLnZlci52YWx1ZS0xXVtldmVudC50YXJnZXQuYXR0cmlidXRlcy5ob3IudmFsdWUtMV0gPSBwbGF5ZXJWYWx1ZXNbcGxheWVyXTsvLyBzZXQgZmllbGQgdmFsdWUuXHJcbiAgICAgICAgdmFyIGZpZWxkU3RhdHVzID0gbG9naWMuY2hlY2tGaWVsZChmaWVsZCwgcGxheWVyLCBwbGF5ZXJWYWx1ZXMsIGV2ZW50LnRhcmdldC5hdHRyaWJ1dGVzLCB2YWx1ZVRvV2luKTsvL2NoZWNrIGlmIHRoaXMgbW92ZSBpcyB3aW5uaW5nLlxyXG4gICAgICAgIGlmKGZpZWxkU3RhdHVzPT0wKXtcclxuICAgICAgICAgICAgcGxheWVyID0gbG9naWMuY2hhbmdlUGxheWVyKHBsYXllcik7XHJcbiAgICAgICAgICAgIGdyYXBoaWNzLnVwZGF0ZUZpZWxkKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgICAgICAgIGdyYXBoaWNzLndyaXRlU3RhdHVzKCdQbGF5ZXIgJytvcHRpb25zLnBsYXllcnNbcGxheWVyXS5uYW1lKydgcyBtb3ZlJyk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGdyYXBoaWNzLndyaXRlU3RhdHVzKCdQbGF5ZXIgJytvcHRpb25zLnBsYXllcnNbcGxheWVyXS5uYW1lKycgd2lucyEnKTtcclxuICAgICAgICAgICAgZ3JhcGhpY3Muc2hvd1dpbm5lckNlbGxzKGV2ZW50LnRhcmdldCwgZmllbGRTdGF0dXMpO1xyXG4gICAgICAgICAgICB2YXIgc2NvcmUxID0gc2NvcmVbMF0gKyAocGxheWVyPT0wPzE6MCk7XHJcbiAgICAgICAgICAgIHZhciBzY29yZTIgPSBzY29yZVsxXSArIChwbGF5ZXI9PTE/MTowKTtcclxuICAgICAgICAgICAgc2NvcmUgPSBbc2NvcmUxLHNjb3JlMl07XHJcbiAgICAgICAgICAgIGdyYXBoaWNzLndyaXRlU2NvcmUoc2NvcmUpO1xyXG4gICAgICAgICAgICBncmFwaGljcy5yZW1vdmVFdmVudExpc3RlbmVyc1RvQ2VsbHMobW91c2VPdmVyLCBjbGljayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByZXN0YXJ0KCl7XHJcbiAgICBwbGF5ZXIgPSAwO1xyXG4gICAgbG9naWMuc2V0SW5pdGlhbEZpZWxkKDYpO1xyXG59XHJcbmZ1bmN0aW9uIHJlc3RhcnQoKXtcclxuICAgIHBsYXllciA9IDA7XHJcbiAgICBncmFwaGljcy5zZXRJbml0aWFsRmllbGQob3B0aW9ucy5ob3Jpem9udGFsLTEpO1xyXG4gICAgZ3JhcGhpY3Mud3JpdGVTdGF0dXMoJ1BsYXllciAnK29wdGlvbnMucGxheWVyc1twbGF5ZXJdLm5hbWUrJ2BzIG1vdmUnKTtcclxuICAgIGdyYXBoaWNzLmFkZEV2ZW50TGlzdGVuZXJzVG9DZWxscyhtb3VzZU92ZXIsIGNsaWNrKTtcclxuICAgIGZpZWxkID0gbG9naWMuZ2VuZXJhdGVGaWVsZChvcHRpb25zLmhvcml6b250YWwsb3B0aW9ucy52ZXJ0aWNhbCk7XHJcbn1cclxuZnVuY3Rpb24gcmVzZXQoKXtcclxuICAgIHN0YXJ0KCk7XHJcbn1cclxuZnVuY3Rpb24gc3RhcnQoKXtcclxuICAgIHBsYXllciA9IDA7XHJcbiAgICBncmFwaGljcy5zZXRJbml0aWFsRmllbGQob3B0aW9ucy5ob3Jpem9udGFsLTEpO1xyXG4gICAgc2NvcmU9WzAsMF07XHJcbiAgICBncmFwaGljcy53cml0ZVN0YXR1cygnUGxheWVyICcrb3B0aW9ucy5wbGF5ZXJzW3BsYXllcl0ubmFtZSsnYHMgbW92ZScpO1xyXG4gICAgZ3JhcGhpY3Mud3JpdGVTY29yZShzY29yZSk7XHJcbiAgICBncmFwaGljcy5hZGRFdmVudExpc3RlbmVyc1RvQ2VsbHMobW91c2VPdmVyLCBjbGljayk7XHJcbn1cclxuIl19
