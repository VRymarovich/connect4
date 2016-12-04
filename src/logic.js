module.exports = {
    changePlayer: function (currentPlayer){
        if (currentPlayer == 1){
            return 0;
        }else{
            return 1;
        }
    },
    checkField: function(field, playerId, playerValues, targetCell, valueToWin){
        var cell = targetCell;
        var value = playerValues[playerId] * valueToWin;
        var directions = [[1,0],//East
                          [-1,0],//West
                          [0,1],//South
                          [1,1],//SouthEast
                          [-1,1],//SouthWest
                          [1,-1],//NorthEast
                          [-1,-1]];//NorthWest
        //shows speed of direction
        directions.forEach(function(direction){
            var hor = parseInt(cell.hor.value)-1;
            var ver = parseInt(cell.ver.value)-1;
            var sum = 0;
            do{
                hor = hor + direction[0];
                ver = ver + direction[1];
                if(getFCV(field, hor, ver)==playerValues[playerId])
                sum = getFCV(field, hor, ver) + sum;
            }
            while (getFCV(field, hor, ver)==playerValues[playerId]);
            direction[2] = Math.abs(sum);
        });
        var isWin = false;
        if (directions[2][2]>=valueToWin-1) {//check South direction
            directions[2][3]='w';
            isWin = true;
            
        }
        if (directions[0][2]>=valueToWin-1){//check East direction
            directions[0][3]='w';
            isWin = true;
        }
        if (directions[1][2]>=valueToWin-1){//check West direction
            directions[1][3]='w';
            isWin = true;
        }
        if (directions[1][2] + directions[0][2]>=valueToWin-1){//check East and West directions
            directions[0][3]='w';
            directions[1][3]='w';
            isWin = true;
        }
        
        if (directions[4][2]>=valueToWin-1){//check SouthWest direction
            directions[4][3]='w';
            isWin = true;
        }
        if (directions[5][2]>=valueToWin-1){//check NorthEast direction
            directions[5][3]='w';
            isWin = true;
        }
        if (directions[4][2] + directions[5][2]>=valueToWin-1){//check NorthEast and SouthWest West directions
            directions[4][3]='w';
            directions[5][3]='w';
            isWin = true;
        }
        
        if (directions[6][2]>=valueToWin-1){//check NorthWest direction
            directions[6][3]='w';
            isWin = true;
        }
        if (directions[3][2]>=valueToWin-1){//check SouthEast direction
            directions[3][3]='w';
            isWin = true;
        }
        if (directions[6][2] + directions[3][2]>=valueToWin-1){//check NorthWest and SouthEast West directions
            directions[6][3]='w';
            directions[3][3]='w';
            isWin = true;
        }
        return (isWin?directions:0);
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
