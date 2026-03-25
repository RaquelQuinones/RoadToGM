import { useEffect, useRef, useState } from 'react';
import { Chessboard, ChessboardProvider, defaultPieces, fenStringToPositionObject, SparePiece, type DraggingPieceDataType, type PieceDropHandlerArgs, } from 'react-chessboard'
import { Chess, type PieceSymbol, type Square, type Color } from 'chess.js';

const sisterPort = 'http://localhost:3000';

const CBoard = () => {
    //Keeps track if kings have been placed
    var [wKing, setW] = useState(true);
    var [bKing, setB] = useState(true);
    var [initialPos, setInitial] = useState(true);

    //all board information needed
    var [boardPos, setPos] = useState('8/8/8/8/8/8/8/8 w - - 0 1');
    var [squareSize, setSquare] = useState<number | null>(null);
    
    //Saves the initial position selected by the user
    const refInitial = useRef('');
    const selectedInitial = refInitial.current;

    const refChess = useRef(new Chess(boardPos,{skipValidation: true}));
    const currChess = refChess.current;

    type move = { from: string, to: string | null, pieceType: DraggingPieceDataType };
    type exercise = { iPos: string, solution: string[], color: boolean }

    const saveExercise = async (exData :exercise) =>{
        console.log(exData);
        const res = await fetch(sisterPort + '/create',{method:'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({exData})})
        console.log(res);
    }
    //Gets size of squares so spare pieces can be same size
    useEffect(()=>{
        const square = document.querySelector(`[data-column="a"][data-row="1"]`)?.getBoundingClientRect();
        setSquare(square?.width ?? null);
    }, []);

    const savePos = () => {
        if(initialPos){
        currChess.setCastlingRights('w', {k:true ,q:true});
        currChess.setCastlingRights('b',{k:true , q:true});
        console.log(currChess.fen());
        refInitial.current = currChess.fen();
        }else{
            const exData = {iPos: selectedInitial, solution: currChess.history(), color: true}
            saveExercise(exData);
        }
        setInitial(false);
    }

    const cancelPos = () => {
        currChess.load(selectedInitial);
        setPos(selectedInitial);
        setInitial(true);

    }

    //makes moves when pieces are drop inside board
    const movePiece = ({ from, to, pieceType }:move) => {
        var piece = pieceType.pieceType;
        if(to){
            if(initialPos){
                const remove = currChess.remove(from as Square); 
                const place = currChess.put({color: piece[0] as Color, type: piece[1].toLowerCase() as PieceSymbol},to as Square);
            }else{
                //plays moves with rules attached
                currChess.move({from: from, to:to });
            }
        }
        setPos(currChess.fen());
    } 
    //creates new piece when spares are set inside
    const placePiece = ({ from, to, pieceType }:move) => {
        var piece = pieceType.pieceType;
        //error throwing posible?
        const success = currChess.put({color: piece[0] as Color, type: piece[1].toLowerCase() as PieceSymbol},to as Square);
        if(piece[1] == 'K'){
            if(piece[0] == 'b'){
                setB(false);
            }else{setW(false);}
        }
        setPos(currChess.fen());
        
    }
    //removes pieces when dropped off board
    const removePiece = ({ from, to, pieceType }:move) => {
        var piece = pieceType.pieceType;
        const remove = currChess.remove(from as Square); 
        if(piece[1] == 'K'){
            if(piece[0] == 'b'){
                setB(true);
            }else{setW(true);}
        }
        setPos(currChess.fen());
    }

    function onPieceDrop({sourceSquare, targetSquare, piece}:PieceDropHandlerArgs){
        const move = {from: sourceSquare, to:targetSquare, pieceType: piece};
        if(piece.isSparePiece){
            placePiece(move);
        }else if(targetSquare == null){
            removePiece(move);
        }else{
            movePiece(move);
        }
        return true;
    }

    const blackPieceSelector: string[] = [];
    const whitePieceSelector: string[] = [];
    if(initialPos){
        for(const pieceType of Object.keys(defaultPieces)){
            if(pieceType[1] != 'K'){
                if(pieceType[0] == 'b'){
                    blackPieceSelector.push(pieceType as string);
                }else{
                    whitePieceSelector.push(pieceType as string);
                }
            }else{
                if(pieceType[0] == 'b' && bKing){
                    blackPieceSelector.push(pieceType as string);
                }else if(pieceType[0] == 'w' && wKing){
                    whitePieceSelector.push(pieceType as string);
                }
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
        <button onClick={savePos}> Save </button>
        <button onClick={cancelPos}> Cancel </button>
        </>
    )
}

export default CBoard