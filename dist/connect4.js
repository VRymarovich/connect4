(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
    loadGraphics: function (hor, ver) {
        var html =     '<div id="page">'+
                            '<h1>Connect-4</h1>'+
                            '<div id="content"></div>'+
                            '<button id="restart" class="button">Restart</button>'+
                            '<div id="field">'+
                                '<div id="cells"></div>'+
                            '</div>'+
                        '</div>';
        var connect4 = document.getElementById('connect4');
        connect4.innerHTML = html;
        
        var ix = document.getElementById('cells').style.left;
        var iy = document.getElementById('cells').style.top;
        for(var i=0;i<hor;i++){
            for(var j=0; j<ver; j++){
                var cell = document.createElement('div');
                cell.setAttribute('class','cell');
                cell.setAttribute('hor', i+1);
                cell.setAttribute('ver', j+1);
                cell.setAttribute('id','cell_'+i+'_'+j);
                cell.style.position = 'absolute';
                cell.style.top = iy + j*45+'px';
                cell.style.left = ix + i*45+'px';
                document.getElementById('cells').appendChild(cell);
            }
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
    updateField: function (cell, cells){
        for(var i=0;i<cells.length;i++){
            if((cells[i].attributes.ver.value == cell.attributes.ver.value - 1)&&(cells[i].attributes.hor.value == cell.attributes.hor.value)){
                 cells[i].setAttribute('busy', 'free');
                 cells[i].className = 'available cell';
            }
        }
    },
    setInitialField: function(cells, ver){
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
    checkField: function(field, players, targetCell){
        var cell = targetCell;
        var hor = parseInt(cell.hor.value)-1;
        var ver = parseInt(cell.ver.value)-1;
        var value = players[cell.player.value].value * 4;
        var sum1 = getFCV(field, hor, ver) + getFCV(field, hor+1, ver) + getFCV(field, hor+2, ver) + getFCV(field, hor+3, ver);
        var sum2 = getFCV(field, hor, ver) + getFCV(field, hor-1, ver) + getFCV(field, hor-2, ver) + getFCV(field, hor-3, ver);
        var sum3 = getFCV(field, hor, ver) + getFCV(field, hor, ver+1) + getFCV(field, hor, ver+2) + getFCV(field, hor, ver+3);
        var sum4 = getFCV(field, hor, ver) + getFCV(field, hor+1, ver+1) + getFCV(field, hor+2, ver+2) + getFCV(field, hor+3, ver+3);
        var sum5 = getFCV(field, hor, ver) + getFCV(field, hor-1, ver+1) + getFCV(field, hor-2, ver+2) + getFCV(field, hor-3, ver+3);
        if((sum1==value)||(sum2==value)||(sum3==value)||(sum4==value)||(sum5==value)){
            return true;
        }else{
            return false;
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
},{"./graphics.js":1,"./logic.js":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZ3JhcGhpY3MuanMiLCJzcmMvbG9naWMuanMiLCJzcmMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgbG9hZEdyYXBoaWNzOiBmdW5jdGlvbiAoaG9yLCB2ZXIpIHtcclxuICAgICAgICB2YXIgaHRtbCA9ICAgICAnPGRpdiBpZD1cInBhZ2VcIj4nK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxoMT5Db25uZWN0LTQ8L2gxPicrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cImNvbnRlbnRcIj48L2Rpdj4nK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxidXR0b24gaWQ9XCJyZXN0YXJ0XCIgY2xhc3M9XCJidXR0b25cIj5SZXN0YXJ0PC9idXR0b24+JytcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGlkPVwiZmllbGRcIj4nK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGlkPVwiY2VsbHNcIj48L2Rpdj4nK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nO1xyXG4gICAgICAgIHZhciBjb25uZWN0NCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb25uZWN0NCcpO1xyXG4gICAgICAgIGNvbm5lY3Q0LmlubmVySFRNTCA9IGh0bWw7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGl4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NlbGxzJykuc3R5bGUubGVmdDtcclxuICAgICAgICB2YXIgaXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2VsbHMnKS5zdHlsZS50b3A7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxob3I7aSsrKXtcclxuICAgICAgICAgICAgZm9yKHZhciBqPTA7IGo8dmVyOyBqKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKCdjbGFzcycsJ2NlbGwnKTtcclxuICAgICAgICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKCdob3InLCBpKzEpO1xyXG4gICAgICAgICAgICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoJ3ZlcicsIGorMSk7XHJcbiAgICAgICAgICAgICAgICBjZWxsLnNldEF0dHJpYnV0ZSgnaWQnLCdjZWxsXycraSsnXycraik7XHJcbiAgICAgICAgICAgICAgICBjZWxsLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICAgICAgICAgICAgICAgIGNlbGwuc3R5bGUudG9wID0gaXkgKyBqKjQ1KydweCc7XHJcbiAgICAgICAgICAgICAgICBjZWxsLnN0eWxlLmxlZnQgPSBpeCArIGkqNDUrJ3B4JztcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjZWxscycpLmFwcGVuZENoaWxkKGNlbGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGNoYW5nZVBsYXllcjogZnVuY3Rpb24gKGN1cnJlbnRQbGF5ZXIpe1xyXG4gICAgICAgIGlmIChjdXJyZW50UGxheWVyID09IDEpe1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHVwZGF0ZUZpZWxkOiBmdW5jdGlvbiAoY2VsbCwgY2VsbHMpe1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8Y2VsbHMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGlmKChjZWxsc1tpXS5hdHRyaWJ1dGVzLnZlci52YWx1ZSA9PSBjZWxsLmF0dHJpYnV0ZXMudmVyLnZhbHVlIC0gMSkmJihjZWxsc1tpXS5hdHRyaWJ1dGVzLmhvci52YWx1ZSA9PSBjZWxsLmF0dHJpYnV0ZXMuaG9yLnZhbHVlKSl7XHJcbiAgICAgICAgICAgICAgICAgY2VsbHNbaV0uc2V0QXR0cmlidXRlKCdidXN5JywgJ2ZyZWUnKTtcclxuICAgICAgICAgICAgICAgICBjZWxsc1tpXS5jbGFzc05hbWUgPSAnYXZhaWxhYmxlIGNlbGwnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHNldEluaXRpYWxGaWVsZDogZnVuY3Rpb24oY2VsbHMsIHZlcil7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxjZWxscy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgaWYoY2VsbHNbaV0uYXR0cmlidXRlcy52ZXIudmFsdWU9PXZlcil7XHJcbiAgICAgICAgICAgICAgICBjZWxsc1tpXS5zZXRBdHRyaWJ1dGUoJ2J1c3knLCAnZnJlZScpO1xyXG4gICAgICAgICAgICAgICAgY2VsbHNbaV0uY2xhc3NOYW1lID0gJ2F2YWlsYWJsZSBjZWxsJztcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBjZWxsc1tpXS5zZXRBdHRyaWJ1dGUoJ2J1c3knLCAnbmEnKTtcclxuICAgICAgICAgICAgICAgIGNlbGxzW2ldLmNsYXNzTmFtZSA9ICduYSBjZWxsJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjaGVja0ZpZWxkOiBmdW5jdGlvbihmaWVsZCwgcGxheWVycywgdGFyZ2V0Q2VsbCl7XHJcbiAgICAgICAgdmFyIGNlbGwgPSB0YXJnZXRDZWxsO1xyXG4gICAgICAgIHZhciBob3IgPSBwYXJzZUludChjZWxsLmhvci52YWx1ZSktMTtcclxuICAgICAgICB2YXIgdmVyID0gcGFyc2VJbnQoY2VsbC52ZXIudmFsdWUpLTE7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gcGxheWVyc1tjZWxsLnBsYXllci52YWx1ZV0udmFsdWUgKiA0O1xyXG4gICAgICAgIHZhciBzdW0xID0gZ2V0RkNWKGZpZWxkLCBob3IsIHZlcikgKyBnZXRGQ1YoZmllbGQsIGhvcisxLCB2ZXIpICsgZ2V0RkNWKGZpZWxkLCBob3IrMiwgdmVyKSArIGdldEZDVihmaWVsZCwgaG9yKzMsIHZlcik7XHJcbiAgICAgICAgdmFyIHN1bTIgPSBnZXRGQ1YoZmllbGQsIGhvciwgdmVyKSArIGdldEZDVihmaWVsZCwgaG9yLTEsIHZlcikgKyBnZXRGQ1YoZmllbGQsIGhvci0yLCB2ZXIpICsgZ2V0RkNWKGZpZWxkLCBob3ItMywgdmVyKTtcclxuICAgICAgICB2YXIgc3VtMyA9IGdldEZDVihmaWVsZCwgaG9yLCB2ZXIpICsgZ2V0RkNWKGZpZWxkLCBob3IsIHZlcisxKSArIGdldEZDVihmaWVsZCwgaG9yLCB2ZXIrMikgKyBnZXRGQ1YoZmllbGQsIGhvciwgdmVyKzMpO1xyXG4gICAgICAgIHZhciBzdW00ID0gZ2V0RkNWKGZpZWxkLCBob3IsIHZlcikgKyBnZXRGQ1YoZmllbGQsIGhvcisxLCB2ZXIrMSkgKyBnZXRGQ1YoZmllbGQsIGhvcisyLCB2ZXIrMikgKyBnZXRGQ1YoZmllbGQsIGhvciszLCB2ZXIrMyk7XHJcbiAgICAgICAgdmFyIHN1bTUgPSBnZXRGQ1YoZmllbGQsIGhvciwgdmVyKSArIGdldEZDVihmaWVsZCwgaG9yLTEsIHZlcisxKSArIGdldEZDVihmaWVsZCwgaG9yLTIsIHZlcisyKSArIGdldEZDVihmaWVsZCwgaG9yLTMsIHZlciszKTtcclxuICAgICAgICBpZigoc3VtMT09dmFsdWUpfHwoc3VtMj09dmFsdWUpfHwoc3VtMz09dmFsdWUpfHwoc3VtND09dmFsdWUpfHwoc3VtNT09dmFsdWUpKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgZ2VuZXJhdGVGaWVsZDogZnVuY3Rpb24oaG9yLCB2ZXIpe1xyXG4gICAgICAgIHZhciBmaWVsZCA9IFtdO1xyXG4gICAgICAgIGZvcih2YXIgaj0wO2o8dmVyO2orKyl7XHJcbiAgICAgICAgICAgIHZhciByb3cgPSBbXTtcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxob3I7aSsrKXtcclxuICAgICAgICAgICAgICAgIHJvdy5wdXNoKDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZpZWxkLnB1c2gocm93KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZpZWxkO1xyXG4gICAgfVxyXG59O1xyXG4vL2dldCBmaWVsZCBjZWxsIHZhbHVlXHJcbmZ1bmN0aW9uIGdldEZDVihmaWVsZCwgaG9yLCB2ZXIpe1xyXG4gICAgaWYoZmllbGRbdmVyXSA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIGlmKGZpZWxkW3Zlcl1baG9yXSA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiBmaWVsZFt2ZXJdW2hvcl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwidmFyIGdyYXBoaWNzID0gcmVxdWlyZSgnLi9ncmFwaGljcy5qcycpO1xyXG52YXIgbG9naWMgPSByZXF1aXJlKCcuL2xvZ2ljLmpzJyk7XHJcbmdyYXBoaWNzLmxvYWRHcmFwaGljcyg3LDYpO1xyXG52YXIgZmllbGQ9bG9naWMuZ2VuZXJhdGVGaWVsZCg3LDYpO1xyXG52YXIgcGxheWVycyA9IFt7J25hbWUnOidSZWQnLCAnY29sb3InOidyZWQnLCAndmFsdWUnOi0xfSwgeyduYW1lJzonWWVsbG93JywgJ2NvbG9yJzoneWVsbG93JywgJ3ZhbHVlJzoxfV07XHJcbnZhciBwbGF5ZXIgPSAwO1xyXG52YXIgY2VsbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2VsbHMnKS5jaGlsZHJlbjtcclxuZm9yKHZhciBpPTA7aTxjZWxscy5sZW5ndGg7aSsrKXtcclxuICAgIGNlbGxzW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIG1vdXNlT3Zlcik7XHJcbiAgICBjZWxsc1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsaWNrKTtcclxufTtcclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhcnQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJlc3RhcnQpO1xyXG5sb2dpYy5zZXRJbml0aWFsRmllbGQoY2VsbHMsIDYpO1xyXG5mdW5jdGlvbiBtb3VzZU92ZXIoZXZlbnQpe1xyXG4gICAgaWYoZXZlbnQudGFyZ2V0LmF0dHJpYnV0ZXMuYnVzeS52YWx1ZT09J2ZyZWUnKXtcclxuICAgICAgICBldmVudC50YXJnZXQuY2xhc3NOYW1lID0gJ2F2YWlsYWJsZSBjZWxsJztcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBjbGljayhldmVudCl7XHJcbiAgICBpZihldmVudC50YXJnZXQuYXR0cmlidXRlcy5idXN5LnZhbHVlPT0nZnJlZScpe1xyXG4gICAgICAgIGV2ZW50LnRhcmdldC5jbGFzc05hbWUgPSBwbGF5ZXJzW3BsYXllcl0uY29sb3IgKyAnIGNlbGwnO1xyXG4gICAgICAgIGV2ZW50LnRhcmdldC5zZXRBdHRyaWJ1dGUoJ2J1c3knLCBwbGF5ZXJzW3BsYXllcl0uY29sb3IpO1xyXG4gICAgICAgIGV2ZW50LnRhcmdldC5zZXRBdHRyaWJ1dGUoJ3BsYXllcicsIHBsYXllcik7XHJcbiAgICAgICAgZmllbGRbZXZlbnQudGFyZ2V0LmF0dHJpYnV0ZXMudmVyLnZhbHVlLTFdW2V2ZW50LnRhcmdldC5hdHRyaWJ1dGVzLmhvci52YWx1ZS0xXSA9IHBsYXllcnNbcGxheWVyXS52YWx1ZTtcclxuICAgICAgICBpZihsb2dpYy5jaGVja0ZpZWxkKGZpZWxkLCBwbGF5ZXJzLCBldmVudC50YXJnZXQuYXR0cmlidXRlcykpe1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpLmlubmVySFRNTCA9ICdQbGF5ZXIgJytwbGF5ZXJzW3BsYXllcl0ubmFtZSsnIHdpbnMhJztcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcGxheWVyID0gbG9naWMuY2hhbmdlUGxheWVyKHBsYXllcik7XHJcbiAgICAgICAgICAgIGxvZ2ljLnVwZGF0ZUZpZWxkKGV2ZW50LnRhcmdldCwgY2VsbHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiByZXN0YXJ0KCl7XHJcbiAgICBwbGF5ZXIgPSAwO1xyXG4gICAgbG9naWMuc2V0SW5pdGlhbEZpZWxkKGNlbGxzLCA2KTtcclxufSJdfQ==
