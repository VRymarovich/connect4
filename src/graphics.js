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
    showWinnerCells: function(cell, direction){
        var cells = document.getElementById('cells');
        var directions = [[0,0], [-1,0], [0,1], [-1,1], [1, 1]];//shows speed of direction
        var horCoord = cell.hor;
        var verCoord = cell.ver;
        for (var i=0;i<4;i++){
            horCoord = horCoord + directions[direction][0];
            verCoord = verCoord + directions[direction][1];
            for (var j=0;j<cells.length, j++){
                if((cells[j].hor==horCoord)&&(cells[j].ver==verCoord)){
                    cells[j].className = 'flash ' + cells[j].className;
                }
            }
        }
    }
};
