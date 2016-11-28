var graphics = require('./graphics.js');
var logic = require('./logic.js');
graphics.loadGraphics(7,6);
var field=logic.generateField(7,6);
var players = [{'name':'Red', 'color':'red', 'value':-1}, {'name':'Yellow', 'color':'yellow', 'value':1}];
var player = 0;
var cells = document.getElementById('cells').children;
for(var i=0;i<cells.length;i++){
    cells[i].addEventListener('mouseover', mouseOver);
    cells[i].addEventListener('click', click);
};
document.getElementById('restart').addEventListener('click', restart);
logic.setInitialField(cells, 6);
function mouseOver(event){
    if(event.target.attributes.busy.value=='free'){
        event.target.className = 'available cell';
    }
}
function click(event){
    if(event.target.attributes.busy.value=='free'){
        event.target.className = players[player].color + ' cell';
        event.target.setAttribute('busy', players[player].color);
        event.target.setAttribute('player', player);
        field[event.target.attributes.ver.value-1][event.target.attributes.hor.value-1] = players[player].value;
        if(logic.checkField(field, players, event.target.attributes)){
            document.getElementById('content').innerHTML = 'Player '+players[player].name+' wins!';
        }else{
            player = logic.changePlayer(player);
            logic.updateField(event.target, cells);
        }
    }
}
function restart(){
    player = 0;
    logic.setInitialField(cells, 6);
}