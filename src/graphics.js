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
        var directions = [[0,0], [1,0], [-1,0], [0,1], [1,1], [-1,1]];//shows speed of direction
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
