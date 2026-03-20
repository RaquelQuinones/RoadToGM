import { useEffect, useState } from 'react';
import { Chessboard, ChessboardProvider, defaultPieces, fenStringToPositionObject, SparePiece, type PieceDropHandlerArgs, } from 'react-chessboard'
const sisterPort = 'http://localhost:3000';

 //fetch(sisterPort + '/create', {method:'POST', headers: { 'Content-Type' : 'application/json' }, body: JSON.stringify(move)})
        //.then((res) => res.json())
        //.then((data) => setPos(data.fen));
const CBoard = () => {
    //Keeps track if kings have been placed
    var [wKing, setW] = useState(true);
    var [bKing, setB] = useState(true);

    //all board information needed
    var [boardPos, setPos] = useState(fenStringToPositionObject('8/8/8/8/8/8/8/8',8,8));
    var [squareSize, setSquare] = useState<number | null>(null);
    const refBoard = structuredClone(boardPos);
    //Gets size of squares so spare pieces can be same size
    useEffect(()=>{
        const square = document.querySelector(`[data-column="a"][data-row="1"]`)?.getBoundingClientRect();
        setSquare(square?.width ?? null);
    }, []);

    //makes moves when pieces are drop inside board
    const makeMove = (move) => {
        var currPos = refBoard;
        currPos[move.to] = {pieceType: move.piece.pieceType};
        delete currPos[move.from]
        setPos(refBoard);
    } 
    //creates new piece when spares are set inside
    const placePiece = (move) => {
        var currPos = refBoard;
        var piece = move.piece.pieceType;
        currPos[move.to] = {pieceType: piece};
        if(piece[1] == 'K'){
            if(piece[0] == 'b'){
                setB(false);
            }else{setW(false);}
        }
        setPos(refBoard);
        
    }
    //removes pieces when dropped off board
    const removePiece = (move) => {
        var currPos = refBoard;
        var piece = move.piece.pieceType;
        delete currPos[move.from];
        if(piece[1] == 'K'){
            if(piece[0] == 'b'){
                setB(true);
            }else{setW(true);}
        }
        setPos(refBoard);
    }

    function onPieceDrop({sourceSquare, targetSquare, piece}:PieceDropHandlerArgs){
        const move = {from: sourceSquare, to:targetSquare, piece:piece};
        if(piece.isSparePiece){
            placePiece(move);
        }else if(targetSquare == null){
            removePiece(move);
        }else{
            makeMove(move);
        }
       

        return true;
    }

    const blackPieceSelector: string[] = [];
    const whitePieceSelector: string[] = [];
    for(const pieceType of Object.keys(defaultPieces)){
        if(pieceType[1] != 'K'){
            if(pieceType[0] == 'b'){
                blackPieceSelector.push(pieceType as string);
            }else{
                whitePieceSelector.push(pieceType as string);
            }
        }else{
            console.log(pieceType);
            if(pieceType[0] == 'b' && bKing){
                blackPieceSelector.push(pieceType as string);
            }else if(pieceType[0] == 'w' && wKing){
                whitePieceSelector.push(pieceType as string);
            }
        }
    }

    var boardOptions = {position: boardPos, onPieceDrop};
    return(
        <>
        
        <ChessboardProvider  options = {boardOptions}>
         {squareSize ? <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${blackPieceSelector.length}, 1fr)`,
            width: 'fit-content',
            margin: '0 auto'
         }}>
            {blackPieceSelector.map(pieceType => <div key={pieceType} style={{
                width: `${squareSize}px`,
                height: `${squareSize}px`
            }}>
                <SparePiece pieceType={pieceType} />
                </div>)}
         </div> : null}

        <Chessboard/>

         {squareSize ? <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${whitePieceSelector.length}, 1fr)`,
            width: 'fit-content',
            margin: '0 auto'
         }}>
            {whitePieceSelector.map(pieceType => <div key={pieceType} style={{
                width: `${squareSize}px`,
                height: `${squareSize}px`
            }}>
                <SparePiece pieceType={pieceType} />

                </div>)}

         </div> : null}

        </ChessboardProvider>
        
        </>
    )
}

export default CBoard