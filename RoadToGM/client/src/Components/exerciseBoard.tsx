import { useRef, useState } from 'react'
import { Chessboard, fenStringToPositionObject, type PieceDropHandlerArgs } from 'react-chessboard'
import { Chess } from 'chess.js'
const sisterPort = 'http://localhost:3000';


const ExBoard = () =>{
    var [boardPos, setPos] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    
    const refBoard = useRef(new Chess());
    const currBoard = refBoard.current

    function onPieceDrop({sourceSquare, targetSquare, piece}:PieceDropHandlerArgs){
        const move = {from: sourceSquare, to:targetSquare ,piece: piece};
        if(targetSquare){currBoard.move({from: sourceSquare, to:targetSquare})}
        setPos(currBoard.fen());
        
        console.log(boardPos);

        return true;
    }
    const fetchExercise = () => {
        fetch( sisterPort + '/build',{method: 'GET', headers: { 'Content-Type': 'application/json' }})
        .then(res => res.json())
        .then(data => setPos(data.ipos))
    }
    const resetPos = () =>{
        setPos('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
        currBoard.reset();
    }

    var boardOptions = {position: boardPos,onPieceDrop};
    return(
        <>
        
        <Chessboard options = {boardOptions} />
        
        <button onClick={resetPos}>
        reset
        </button>

        <button onClick={fetchExercise}>
        build exercise
        </button>
        </>
    )
}
export default ExBoard