var graphics = require('./graphics.js');
var logic = require('./logic.js');

var Connect4 = function(options){
    if(options!=undefined){
        this.options = options;
    }
    //load field, cells
    graphics.loadGraphics(options.horizontal,options.vertical);
    //generate field array
    field = logic.generateField(options.horizontal,options.vertical);
    //add events
    graphics.addEventListenersToButtons(restart, reset);
}
Connect4.prototype.start = function(){
    //set initial field state and texts
    start();
}
module.export = Connect4;

var options = {
    "horizontal": 7,
    "vertical": 6,
    "players": [{'name':'Red', 'color':'red'}, {'name':'Yellow', 'color':'yellow'}]
};
var playerValues = [-1,1];
var score = [0,0];
var field = [];

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
