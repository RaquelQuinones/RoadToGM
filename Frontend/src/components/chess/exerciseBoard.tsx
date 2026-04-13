import { useImperativeHandle, useRef, useState } from 'react'
import { Chessboard, type DraggingPieceDataType, type PieceDropHandlerArgs } from 'react-chessboard'
import { Chess, type Color } from 'chess.js'
const sisterPort = 'http://localhost:3000';


const ExBoard = ({ ref }: {ref?: any}) =>{
    var [boardPos, setPos] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    const currExercise = useRef({} as exercise);
    const turnCount = useRef(0);
    const refBoard = useRef(new Chess());
    const currBoard = refBoard.current

    type move = { from: string, to: string | null, pieceType: DraggingPieceDataType };
    type exercise = { ipos: string, solution: string[], color: boolean };
    
    const autoMove = () => {
        currBoard.move(currExercise.current.solution[turnCount.current]);
        turnCount.current = turnCount.current + 1;
        setPos(currBoard.fen());
    }

    if(turnCount.current % 2 != 0){console.log(currExercise.current.solution[turnCount.current])
        autoMove();
    }

    const makeMove = (move:move) => {
        if(move.to){
            currBoard.move({from: move.from, to: move.to})
        }
        if(currBoard.history().pop() != currExercise.current.solution[turnCount.current]){
            currBoard.undo();
            turnCount.current = turnCount.current - 1;
        }
        setPos(currBoard.fen());
        turnCount.current = turnCount.current + 1;
    }

    function onPieceDrop({sourceSquare, targetSquare, piece}:PieceDropHandlerArgs){
        if(sourceSquare == targetSquare){return false;}
        const moveAttempt = {from: sourceSquare, to:targetSquare ,pieceType: piece};
        makeMove(moveAttempt);
        
        return true;
    }

    const fetchExercise = async (id: any) => {
        const res = await fetch( sisterPort + `/build/${id}`,{method: 'GET', headers: { 'Content-Type': 'application/json' }});
        const data = await res.json();
        currExercise.current = data;
        setPos(data.ipos);
        currBoard.load(data.ipos);
        if(data.color){currBoard.setTurn('b' as Color);}
        turnCount.current = 0;
    }

    const resetPos = () =>{
        setPos('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
        currBoard.reset();
    }
    const buttonFetch = () => {
        fetchExercise(1);
    }
    useImperativeHandle(ref,()=> ({
            onPieceDrop,
            fetchExercise,
            autoMove
        }), [onPieceDrop,fetchExercise,autoMove]);

    var boardOptions = {position: boardPos,onPieceDrop};
    return(
        <>
        
        <Chessboard options = {boardOptions} />
        
        <button onClick={resetPos}>
        reset
        </button>

        <button onClick={buttonFetch}>
        build exercise
        </button>
        </>
    )
}
export default ExBoard