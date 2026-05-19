import { useImperativeHandle, useRef, useState } from 'react'
import { Chessboard, type DraggingPieceDataType, type PieceDropHandlerArgs } from 'react-chessboard'
import { Chess, type Color } from 'chess.js'
const sisterPort = 'http://localhost:3000';

type ExerciseBoardProps = {
    ref?: any;
    exercise?: any;
    solutionMoves?: string[];
    moveIndex?: number;
    isExerciseDone?: boolean;
    onCorrectMove?: () => void;
    onExerciseComplete?: () => void;
};

const ExBoard = ({
    ref,
    exercise,
    solutionMoves,
    moveIndex,
    isExerciseDone,
    onCorrectMove,
    onExerciseComplete,
}: ExerciseBoardProps) =>{
    var [boardPos, setPos] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    const currExercise = useRef({} as exercise);
    const turnCount = useRef(0);
    const refBoard = useRef(new Chess());
    const currBoard = refBoard.current

    type move = { from: string, to: string | null, pieceType: DraggingPieceDataType ,promotion: string};
    type exercise = { ipos: string, solution: string[], color: boolean };
    
    const autoMove = () => {
        const nextMove = currExercise.current.solution?.[turnCount.current];
    
        if (!nextMove) {
            return;
        }
    
        currBoard.move(nextMove);
        turnCount.current = turnCount.current + 1;
        setPos(currBoard.fen());

        if (
            currExercise.current.solution &&
            turnCount.current >= currExercise.current.solution.length
        ) {
            onExerciseComplete?.();
        }
    }
    
    if (
        turnCount.current % 2 != 0 &&
        currExercise.current.solution &&
        turnCount.current < currExercise.current.solution.length
    ) {
        console.log(currExercise.current.solution[turnCount.current]);
        autoMove();
    }

    const makeMove = (move:move) => {
        if (isExerciseDone) {
            return;
        }

        if(move.to){
            currBoard.move({from: move.from, to: move.to, promotion: move.promotion})
        }

        if(currBoard.history().pop() != currExercise.current.solution[turnCount.current]){
            currBoard.undo();
            turnCount.current = turnCount.current - 1;
        } else {
            onCorrectMove?.();
        }

        setPos(currBoard.fen());
        turnCount.current = turnCount.current + 1;

        if (
            currExercise.current.solution &&
            turnCount.current >= currExercise.current.solution.length
        ) {
            onExerciseComplete?.();
        }
    }

    function onPieceDrop({sourceSquare, targetSquare, piece}:PieceDropHandlerArgs){
        if(sourceSquare == targetSquare){return false;}
        const moveAttempt = {from: sourceSquare, to:targetSquare ,pieceType: piece, promotion:'q'};
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
        fetchExercise(5);
    }
    useImperativeHandle(ref,()=> ({
            onPieceDrop,
            fetchExercise,
            autoMove,
            getColor: () => currBoard.turn()
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