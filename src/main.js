var graphics = require('./graphics.js');
var logic = require('./logic.js');

var options = {
    "horizontal": 7,
    "vertical": 6,
    "players": [{'name':'Red', 'color':'red'}, {'name':'Yellow', 'color':'yellow'}]
};
var playerValues = [-1,1];
var cells = document.getElementById('cells').children;

//load field, cells
graphics.loadGraphics(options.horizontal,options.vertical);

//generate field array
var field=logic.generateField(options.horizontal,options.vertical);
//add events
addEventListeners();

//set initial field state
var player = 0;
graphics.setInitialField(options.horizontal-1);

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
        var fieldStatus = logic.checkField(field, player, options.players, event.target.attributes);
        if(fieldStatus==0){
            player = logic.changePlayer(player);
            graphics.updateField(event.target);
        }else{
            document.getElementById('content').innerHTML = 'Player '+options.players[player].name+' wins!';
            graphics.showWinnerCells(event.target, fieldStatus);
        }
    }
}

function restart(){
    player = 0;
    logic.setInitialField(6);
}

