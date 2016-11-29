module.exports = {
    loadGraphics: function (hor, ver) {
        var html =     '<div id="page">'+
                            '<div style="text-align:center; font-family:Arial; color:white; font-size:32px;">Connect-4</div>'+
                            '<div id="content"></div>'+
                            '<div style="text-align:center"><button id="restart" class="button">Restart</button>'+
                            '<button id="reset" class="button">Reset Score</button></div>'+
                            '<div id="field">'+
                                    '<table style="width:100%"><tr>'+
                                    '<td><div class="red cell"></div></td>'+
                                    '<td id="result" class="result"><span style="">10/11</td></td>'+
                                    '<td style="float:right"><div class="yellow cell"></div></td>'+
                                    '</tr></table>'+
                                '<div id="cells"></div>'+
                            '</div>'+
                        '</div>';
        var connect4 = document.getElementById('connect4');
        connect4.innerHTML = html;
        
        for(var i=0;i<ver;i++){
            for(var j=0; j<hor; j++){
                var cell = document.createElement('div');
                cell.setAttribute('class','cell');
                cell.setAttribute('ver', i+1);
                cell.setAttribute('hor', j+1);
                cell.setAttribute('id','cell_'+i+1+'_'+j+1);
                //cell.style.position = 'absolute';
                //cell.style.top = iy + j*45+'px';
                //cell.style.left = ix + i*45+'px';
                document.getElementById('cells').appendChild(cell);
            }
        }
    },
    addEventListenersToCells: function(mouseOver, click){
        var cells = document.getElementById('cells').children;
        for(var i=0;i<cells.length;i++){
            cells[i].addEventListener('mouseover', mouseOver);
            cells[i].addEventListener('click', click);
        };
    },
    removeEventListenersToCells: function(mouseOver, click){
        var cells = document.getElementById('cells').children;
        for(var i=0;i<cells.length;i++){
            cells[i].removeEventListener('mouseover', mouseOver);
            cells[i].removeEventListener('click', click);
        };
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
    updateField: function (cell){
        var cells = document.getElementById('cells').children;
        for(var i=0;i<cells.length;i++){
            if((cells[i].attributes.ver.value == cell.attributes.ver.value - 1)&&(cells[i].attributes.hor.value == cell.attributes.hor.value)){
                 cells[i].setAttribute('busy', 'free');
                 cells[i].className = 'available cell';
            }
        }
    },
    setInitialField: function(ver){
        var cells = document.getElementById('cells').children;
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
        var cells = document.getElementById('cells').children;
        var directions = [[0,0], [1,0], [-1,0], [0,1], [1,1], [-1,1]];//shows speed of direction
        var horCoord = parseInt(cell.attributes.hor.value);
        var verCoord = parseInt(cell.attributes.ver.value);
        for (var i=0;i<4;i++){
            for (var j=0;j<cells.length; j++){
                if((cells[j].attributes.hor.value==horCoord)&&(cells[j].attributes.ver.value==verCoord)){
                    cells[j].className = 'flash ' + cells[j].className;
                }
            }
            horCoord = horCoord + directions[direction][0];
            verCoord = verCoord + directions[direction][1];
        }
    }
};
