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