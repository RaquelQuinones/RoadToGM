import { useEffect, useImperativeHandle, useRef, useState} from 'react';
import { Chessboard, ChessboardProvider, defaultPieces, SparePiece, type DraggingPieceDataType, type PieceDropHandlerArgs, } from 'react-chessboard'
import { Chess, type PieceSymbol, type Square, type Color } from 'chess.js';

const sisterPort = 'http://localhost:3000';

const CBoard = ({ ref }:{ref?: any}) => {
    //Keeps track if kings have been placed
    var [wKing, setW] = useState(true);
    var [bKing, setB] = useState(true);
    var [trigger, setOff] = useState({});
    var initialPos = useRef(true);
    const setInitial = (set: boolean) => {initialPos.current = set;}

    //all board information needed
    var [boardPos, setPos] = useState('8/8/8/8/8/8/8/8 w - - 0 1');
    var [squareSize, setSquare] = useState<number | null>(null);
    
    //Saves the initial position selected by the user
    const refInitial = useRef('');

    const refChess = useRef(new Chess(boardPos,{skipValidation: true}));
    const currChess = refChess.current;

    type move = { from: string, to: string | null, pieceType: DraggingPieceDataType , promotion: string};
    type exercise = { ipos: string, solution: string[], color: boolean };

    //Saves an exercise to the Data Base
    const saveExercise = async (exData :exercise) =>{
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

    //Player has set an initial position for his exercise if already an initial postion is chosen save the exercise in the DB
    const savePos = () => {
        if(initialPos.current){
        currChess.setCastlingRights('w', {k:true ,q:true});
        currChess.setCastlingRights('b',{k:true , q:true});
        try{
        currChess.load(currChess.fen());
        }catch(err){
            console.log(err);
            return false;
        }
        refInitial.current = currChess.fen();
        }else{
            let exSolution = currChess.history();
            const turnColor = currChess.history()[0] == '--';
            
            if(turnColor){exSolution = exSolution.slice(1);}

            const exData = {ipos: refInitial.current, solution: exSolution, color: turnColor}
            console.log(exSolution);
            return exData;
            //saveExercise(exData);
        }
        setInitial(false);
        setOff({});
        return false;
    }

    //Player wishes to change something about initial position or change plays made beforehand
    const cancelPos = () => {
        if(refInitial.current == ''){
            clearBoard();
            return true;
        }
        try{currChess.load(refInitial.current)}
        catch(err){
            console.log(err)
            return false;
        }
        setPos(refInitial.current);
        setInitial(true);
        setOff({});
        return true;
    }

    const clearBoard = ()=> {
        currChess.clear();
        setPos(currChess.fen());
        setB(true);
        setW(true);
        setInitial(true);
    }

    //makes moves when pieces are drop inside board
    const movePiece = ({ from, to, pieceType, promotion}:move) => {
        var piece = pieceType.pieceType;
        if(to){
            if(initialPos.current){
                const remove = currChess.remove(from as Square); 
                const place = currChess.put({color: piece[0] as Color, type: piece[1].toLowerCase() as PieceSymbol},to as Square);
            }else{
                //plays moves with rules attached
                if(currChess.history().length == 0){currChess.setTurn(piece[0] as Color)}
                //plays moves with rules attached
                currChess.move({from: from, to:to, promotion:promotion});
            }
        }
        setPos(currChess.fen());
    } 
    //creates new piece when spares are set inside
    const placePiece = ({ from, to, pieceType }:move) => {
        var piece = pieceType.pieceType;
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
        if(sourceSquare == targetSquare){return false;}
        const move = {from: sourceSquare, to:targetSquare, pieceType: piece, promotion:'q'};
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
    if(initialPos.current){
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
    function showFen(){
        console.log(currChess.fen());
        console.log(currChess.history())
    }

    useImperativeHandle(ref,()=> ({
        onPieceDrop,
        savePos,
        cancelPos,
        clearBoard,
        getCurrBoard: () => currChess,
        getInitialPos: () => initialPos,
    }), [onPieceDrop, savePos, cancelPos, clearBoard, setInitial]);

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