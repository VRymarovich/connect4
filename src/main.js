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
