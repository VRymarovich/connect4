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