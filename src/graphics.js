module.exports = {
    //load all graphics of the field
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
    showWinnerCells: function(targetCell, directions){
        var rows = document.getElementById('cells').rows;
        directions.forEach(function(direction){
            var hor = parseInt(targetCell.attributes.hor.value);//get starting point
            var ver = parseInt(targetCell.attributes.ver.value);
            if(direction[3]=='w' && direction[2]>0){
                for(var c=0; c<direction[2]+1; c++){
                    for(var j=0;j<rows.length; j++){
                        var cells = rows[j].cells;
                        for(var i=0;i<cells.length;i++){
                            var cell = cells[i].children[0];
                            if((cell.attributes.hor.value==hor)&&(cell.attributes.ver.value==ver)){
                                cell.className = 'flash ' + cell.className;
                            }
                        }
                    }
                    hor = hor + direction[0];
                    ver = ver + direction[1];
                }
            }
        })
    }
};
