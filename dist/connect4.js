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
    showWinnerCells: function(targetCell, direction){
        var rows = document.getElementById('cells').rows;
        var directions = [[0,0], [1,0], [-1,0], [0,1], [1,1], [-1,1], [1,-1], [-1,-1]];//shows speed of direction
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
        var sum6 = getFCV(field, hor, ver) + getFCV(field, hor+1, ver-1) + getFCV(field, hor+2, ver-2) + getFCV(field, hor+3, ver-3);
        var sum7 = getFCV(field, hor, ver) + getFCV(field, hor-1, ver-1) + getFCV(field, hor-2, ver-2) + getFCV(field, hor-3, ver-3);
        if((sum1==value)||(sum2==value)||(sum3==value)||(sum4==value)||(sum5==value)||(sum6==value)||(sum7==value)){
            if(sum1==value) return 1;
            if(sum2==value) return 2;
            if(sum3==value) return 3;
            if(sum4==value) return 4;
            if(sum5==value) return 5;
            if(sum6==value) return 6;
            if(sum7==value) return 7;
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
        field[event.target.attributes.ver.value-1][event.target.attributes.hor.value-1] = playerValues[player];// set field value.
        var fieldStatus = logic.checkField(field, player, playerValues, event.target.attributes);//check if this move is winning.
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
