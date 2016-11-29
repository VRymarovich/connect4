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
    },
    updateField: function (cell){
        var cells = document.getElementById('cells');
        for(var i=0;i<cells.length;i++){
            if((cells[i].attributes.ver.value == cell.attributes.ver.value - 1)&&(cells[i].attributes.hor.value == cell.attributes.hor.value)){
                 cells[i].setAttribute('busy', 'free');
                 cells[i].className = 'available cell';
            }
        }
    },
    setInitialField: function(ver){
        var cells = document.getElementById('cells');
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
    showWinnerCells: function(cell, direction){
        var cells = document.getElementById('cells');
        var directions = [[0,0], [-1,0], [0,1], [-1,1], [1, 1]];//shows speed of direction
        var horCoord = cell.hor;
        var verCoord = cell.ver;
        for (var i=0;i<4;i++){
            horCoord = horCoord + directions[direction][0];
            verCoord = verCoord + directions[direction][1];
            for (var j=0;j<cells.length, j++){
                if((cells[j].attributes.hor.value==horCoord)&&(cells[j].attributes.ver.value==verCoord)){
                    cells[j].className = 'flash ' + cells[j].className;
                }
            }
        }
    }
};
