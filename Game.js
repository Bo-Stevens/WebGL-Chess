// const { Socket } = require("socket.io")

var checkerboard
var whitePieces
var brownPieces
var selectedPiece
var selectedPieceRow = 0
var selectedPieceCol = 0
var pieceType
var piecePosition
var playerNum = 0
var pieceLocked = false
var zRot = 0
var yRot = 0

var whitePiecePositions
var brownPiecePositions

var board = [
    ["B","E","B","E","B","E","B","E"],
    ["E","B","E","B","E","B","E","B"],
    ["B","E","B","E","B","E","B","E"],
    ["E","E","E","E","E","E","E","E"],
    ["E","E","E","E","E","E","E","E"],
    ["E","W","E","W","E","W","E","W"],
    ["W","E","W","E","W","E","W","E"],
    ["E","W","E","W","E","W","E","W"]
]

socket.on('connected', numPlayers =>{
    console.log("CONNECTED CLIENTSIDE" + numPlayers)
    playerNum = numPlayers
})

socket.on("receive-turn-ended", pieceType =>{
    console.log("PLAYER ENDED TURN ")
    if(pieceType == "brownPieces"){
        console.log("SET TO BROWN")
        this.pieceType = brownPieces

    }
    else{
        console.log("SET TO WHITE")
        this.pieceType = whitePieces

    }
})

socket.on("receive-piece-positions", piecePositions =>{
    console.log("RECEIVING POSITIONS " + piecePositions)
    whitePiecePositions = piecePositions["white"]
    brownPiecePositions = piecePositions["brown"]

})
async function main(){
    startEngine()
    console.log(playerNum)
    var checkersPieces = await createGameObjectsFromOBJ('Objects/checkers_obj.obj')
    checkerboard = checkersPieces[0]
    whitePieces = new Array(
        [checkersPieces[8],
        checkersPieces[3],
        checkersPieces[1],
        checkersPieces[2]],

        [checkersPieces[7],
        checkersPieces[11],
        checkersPieces[12],
        checkersPieces[14]],

        [checkersPieces[9],
        checkersPieces[10],
        checkersPieces[13],
        checkersPieces[15]]
    )

    whitePiecePositions = new Array(
        [[1,5],[3,5],[5,5],[7,5]],
        [[0,6],[2,6],[4,6],[6,6]],
        [[1,7],[3,7],[5,7],[7,7]],
    )
    brownPiecePositions = new Array(
        [[0,0],[2,0],[4,0],[6,0]],
        [[1,1],[3,1],[5,1],[7,1]],
        [[0,2],[2,2],[4,2],[6,2]],
    )
    brownPieces = new Array(
        [
            checkersPieces[23],
            checkersPieces[16],
            checkersPieces[24],
            checkersPieces[19]
        ],

        [
            checkersPieces[20],
            checkersPieces[17],
            checkersPieces[18],
            checkersPieces[5]
    ],

        [
            checkersPieces[4],
            checkersPieces[6],
            checkersPieces[21],
            checkersPieces[22]
    ]
    )
    for(var i = 0; i < brownPieces.length; i++){
        for(var x = 0; x < brownPieces[i].length; x++){
            setUniformBool(brownPieces[i][x].program, "brown", 1)            
        }
    }

    for(var i = 0; i < whitePieces.length; i++){
        for(var x = 0; x < whitePieces[i].length; x++){
            setUniformBool(whitePieces[i][x].program, "yellow", 1)            
        }
    }

    pieceType = whitePieces

    selectedPiece = pieceType[selectedPieceRow][selectedPieceCol]
    
    document.getElementById("positionY").value = 125
    document.getElementById("positionZ").value = -325
    if(playerNum == 1){
        var transforms = {
            camRotationX: 322,
            camRotationY: 0,
            camRotationZ: 180,
            objectRotationX: 0,
            objectRotationY: 0,
            objectRotationZ: 0,
            positionX: 0,
            positionY: 155,
            positionZ: -150,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scaleX: 2000,
            scaleY: 2000,
            scaleZ: 2000,
        }
        document.getElementById("positionX").value = transforms.positionX
        document.getElementById("positionY").value = transforms.positionY
        document.getElementById("positionZ").value = transforms.positionZ
    
        document.getElementById("rotationX").value = transforms.rotationX
        document.getElementById("rotationY").value = transforms.rotationY
        document.getElementById("rotationZ").value = transforms.rotationZ
        document.getElementById("camRotationX").value = transforms.camRotationX
        document.getElementById("camRotationY").value = transforms.camRotationY
        document.getElementById("camRotationZ").value = transforms.camRotationZ
        document.getElementById("scaleX").value = transforms.scaleX
        document.getElementById("scaleY").value = transforms.scaleY
        document.getElementById("scaleZ").value = transforms.scaleZ
    
        document.getElementById("objectRotationX").value = transforms.objectRotationX
        document.getElementById("objectRotationY").value = transforms.objectRotationY
        document.getElementById("objectRotationZ").value = transforms.objectRotationZ
        updateTransformations(transforms)
    }

    setTransformations()
    createEventListeners()
    selectPiece(0,0, pieceType)
}

function createEventListeners(){
    document.body.addEventListener('keydown', keyPressed)
}

function keyPressed(event){
    if((playerNum == 0 && pieceType == whitePieces) || (playerNum == 1 && pieceType == brownPieces)){
        if(!pieceLocked){
            if(event.code== "KeyD"){
                if(selectedPieceRow < pieceType[selectedPieceCol].length-1){
                    selectedPieceRow += 1
                    selectPiece(selectedPieceRow, selectedPieceCol, pieceType)
                }
        
            }
            if(event.code == "KeyA"){
                if(selectedPieceRow > 0){
                    selectedPieceRow -= 1
                    selectPiece(selectedPieceRow, selectedPieceCol, pieceType)
                }
            }
            if(event.code == "KeyS"){
                if(selectedPieceCol < pieceType.length-1){
                    selectedPieceCol += 1
                    selectPiece(selectedPieceRow, selectedPieceCol, pieceType)
                }
            }    
            if(event.code == "KeyW"){
                if(selectedPieceCol > 0){
                    selectedPieceCol -= 1
                    selectPiece(selectedPieceRow, selectedPieceCol, pieceType)
                }
            }
        }
        else{
            var pos = selectedPiece.getPosition()    
    
            if(event.code== "KeyD"){
                selectedPiece.moveTo([pos[0] + 7, pos[1], pos[2]], 10)
            }
            if(event.code == "KeyA"){
                selectedPiece.moveTo([pos[0] - 7, pos[1], pos[2]], 10)
            }
            if(event.code == "KeyS"){
                selectedPiece.moveTo([pos[0], pos[1], pos[2] + 7], 10)
            }    
            if(event.code == "KeyW"){
                selectedPiece.moveTo([pos[0], pos[1], pos[2] - 7], 10)
            }
        }   
    
        if(event.code == "Space"){
            pieceLocked = !pieceLocked
            if(pieceLocked){
                piecePosition = selectedPiece.getPosition()
                selectedPiece.moveTo([piecePosition[0], piecePosition[1] - 5, piecePosition[2]], 25)
    
            }
            if(!pieceLocked){
                var pos = selectedPiece.getPosition()
                var xDir = Math.round(piecePosition[0]-pos[0])/7
                var zDir = Math.round(piecePosition[2]-pos[2])/7
                if((xDir == 1 || xDir == -1) && (zDir == 1 || zDir == -1)){
                    var boardPosition
                    if(pieceType == whitePieces){
                        boardPosition = whitePiecePositions[selectedPieceCol][selectedPieceRow]
                    }
                    else{
                        boardPosition = brownPiecePositions[selectedPieceCol][selectedPieceRow]
                    }
                    boardPosition[0] += xDir
                    boardPosition[1] += zDir
    
                    if(pieceType == whitePieces){
                        whitePiecePositions[selectedPieceCol][selectedPieceRow] = boardPosition
                    }
                    else{
                        brownPiecePositions[selectedPieceCol][selectedPieceRow] = boardPosition
                    }
                    socket.emit("send-piece-positions", {white: whitePiecePositions, brown: brownPiecePositions})
                    if(board[boardPosition[1]][boardPosition[0]] != "B" && board[boardPosition[1]][boardPosition[0]] != "W"){
                        if(pieceType == whitePieces){
                            board[boardPosition[1]][boardPosition[0]] = "W"
                            board[boardPosition[1]-zDir][boardPosition[0]-xDir] = "E"
                            console.log("SETTING BROWN PIECES")
                            pieceType = brownPieces
                            socket.emit("send-turn-ended", "brownPieces")

                        }
                        else{
                            board[boardPosition[1]][boardPosition[0]] = "B"
                            board[boardPosition[1]-zDir][boardPosition[0]-xDir] = "E"
                            pieceType = whitePieces
                            socket.emit("send-turn-ended", "whitePieces")

                        }
                        selectedPiece.setPosition(pos[0],300, pos[2])
                        selectPiece(selectedPieceRow, selectedPieceCol, pieceType)
                    }
                    else{
                        console.log("OVERLAPPING")
                        console.log(board, boardPosition[1],boardPosition[0])
                        selectedPiece.setPosition(piecePosition[0], piecePosition[1], piecePosition[2])
                    }
                }
                else if((xDir == 2 && zDir == 2) || (xDir == 2 && zDir ==-2) || (xDir == -2 && zDir == 2) || (xDir == -2 && zDir == -2)){
                    var boardPosition
                    if(pieceType == whitePieces){
                        boardPosition = whitePiecePositions[selectedPieceCol][selectedPieceRow]
                    }
                    else{
                        boardPosition = brownPiecePositions[selectedPieceCol][selectedPieceRow]
                    }

                    boardPosition[0] += xDir
                    boardPosition[1] += zDir
    
                    if(pieceType == whitePieces){
                        whitePiecePositions[selectedPieceCol][selectedPieceRow] = boardPosition
                    }
                    else{
                        brownPiecePositions[selectedPieceCol][selectedPieceRow] = boardPosition
                    }
                    socket.emit("send-piece-positions", {white: whitePiecePositions, brown: brownPiecePositions})

                    if(xDir == 2 && zDir == 2 && (board[boardPosition[1]-1][boardPosition[0]-1] == "B" || board[boardPosition[1]-1][boardPosition[0]-1] == "W")){
                        console.log("one")
                        board[boardPosition[1]-zDir][boardPosition[0]-xDir] = "E"
                        if(pieceType == whitePieces)
                            board[boardPosition[0]][boardPosition[1]] = "W"
                        else
                            board[boardPosition[0]][boardPosition[1]] = "B"
                        board[boardPosition[1]-1][boardPosition[0]-1] = "E"
                        removePiece(boardPosition[1]-1,boardPosition[0]-1)
                        selectedPiece.setPosition(pos[0],300, pos[2])
                    }
                    else if(xDir == 2 && zDir == -2 && (board[boardPosition[1]-1][boardPosition[0]+1] == "B" || board[boardPosition[1]-1][boardPosition[0]+1] == "W")){
                        
                        console.log("two")
                        board[boardPosition[1]-zDir][boardPosition[0]-xDir] = "E"
                        if(pieceType == whitePieces)
                            board[boardPosition[0]][boardPosition[1]] = "W"
                        else
                            board[boardPosition[0]][boardPosition[1]] = "B"
                        board[boardPosition[0]+1][boardPosition[1]-1] = "E"
                        removePiece((boardPosition[1]+1),(boardPosition[0]-1))
                        selectedPiece.setPosition(pos[0],300, pos[2])
                    }
                    else if(xDir == -2 && zDir == 2 && (board[boardPosition[1]+1][boardPosition[0]-1] == "B" || board[boardPosition[1]+1][boardPosition[0]-1] == "W")){
                        console.log("tree")
                        board[boardPosition[1]-zDir][boardPosition[0]-xDir] = "E"
                        if(pieceType == whitePieces)
                            board[boardPosition[0]][boardPosition[1]] = "W"
                        else
                            board[boardPosition[0]][boardPosition[1]] = "B"
                        board[boardPosition[1]+1][boardPosition[0]-1] = "E"
                        removePiece(boardPosition[1]+1,boardPosition[0]-1)
                        selectedPiece.setPosition(pos[0],300, pos[2])
                    }
                    else if(xDir == -2 && zDir == -2 && (board[boardPosition[1]+1][boardPosition[0]+1] == "B" || board[boardPosition[1]+1][boardPosition[0]+1] == "W")){
                        console.log("for")
                        board[boardPosition[1]-zDir][boardPosition[0]-xDir] = "E"
                        if(pieceType == whitePieces)
                            board[boardPosition[0]][boardPosition[1]] = "W"
                        else
                            board[boardPosition[0]][boardPosition[1]] = "B"
    
                        board[boardPosition[1]+1][boardPosition[0]+1] = "E"
                        removePiece(boardPosition[1]+1,boardPosition[0]+1)
                        selectedPiece.setPosition(pos[0],300, pos[2])
                    }
                    else{
                        boardPosition[0] -= xDir
                        boardPosition[1] -= zDir
                        if(pieceType == whitePieces){
                            whitePiecePositions[selectedPieceCol][selectedPieceRow] = boardPosition
                        }
                        else{
                            brownPiecePositions[selectedPieceCol][selectedPieceRow] = boardPosition
                        }
                        socket.emit("send-piece-positions", {white: whitePiecePositions, brown: brownPiecePositions})

                        selectedPiece.setPosition(piecePosition[0], piecePosition[1], piecePosition[2])
                    }
                }
                else{
                    
                    selectedPiece.setPosition(piecePosition[0], piecePosition[1], piecePosition[2])
                }   
    
                draw() 
                placeInCorrectSpot()
            }
        }
    }


    if(event.code == "ArrowRight"){
        zRot += 10
        viewProjectionMatrix = camera.rotate((-zRot/4) * (Math.PI / 180), 0 * (Math.PI / 180), zRot * (Math.PI / 180))
        viewProjectionMatrix = mat4.multiply(viewProjectionMatrix, viewMatrix)
    }
}

function removePiece(column, row){
    console.log(board)
    console.log(column,row)
    var dataset = whitePiecePositions
    var setToRemoveFrom = whitePieces
    if(pieceType == whitePieces){
        dataset = brownPiecePositions
        console.log(dataset)
        setToRemoveFrom = brownPieces
    }
    for(var i = 0; i < dataset.length; i++){
        for(var x = 0; x < dataset[i].length; x++){
            if(dataset[i][x][0] == row && dataset[i][x][1] ==  column){
                var temp = new Array()

                setToRemoveFrom[i][x].setPosition(0,9000,0)

                for(var y = 0; y < setToRemoveFrom[i].length; y++){
                    if(y != x){
                        temp.push(setToRemoveFrom[i][y])
                    }
                }
                setToRemoveFrom[i] = temp
                console.log(setToRemoveFrom)
                draw()

            }
        }
    }

}

function placeInCorrectSpot(){

}

async function selectPiece(pieceRow, pieceCol, pieceType){
    setUniform3f(selectedPiece.program, "u_highlight", [0,0,0])
    var pos = selectedPiece.getPosition()    
    selectedPiece.setPosition(pos[0],300, pos[2])
    selectedPiece = pieceType[pieceCol][pieceRow]

    selectedPieceCol = pieceCol
    selectedPieceRow = pieceRow

    var rowModifier = 1
    while(selectedPiece == null && rowModifier < 4){
        selectedPiece = pieceType[selectedPieceCol+rowModifier][pieceRow]
        if(selectedPiece == null)
            selectedPiece = pieceType[selectedPieceCol-rowModifier][pieceRow]
        rowModifier += 1
            
    }

    setUniform3f(selectedPiece.program, "u_highlight", [.25,.25,.25])
    draw()
}


main()

