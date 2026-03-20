import { useState } from 'react'
import { Chessboard, fenStringToPositionObject, type PieceDropHandlerArgs } from 'react-chessboard'
const sisterPort = 'http://localhost:3000';


const ExBoard = () =>{
    var [boardPos, setPos] = useState(fenStringToPositionObject('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',8,8));
    
    function onPieceDrop({sourceSquare, targetSquare, piece}:PieceDropHandlerArgs){
        const move = {from: sourceSquare, to:targetSquare ,piece: piece};
        fetch( sisterPort + '/test',{method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(move)})
        .then(res => res.json())
        .then(data => setPos(data.fen))
        
        console.log(boardPos);

        return true;
    }

    const resetPos = () =>{
        setPos(fenStringToPositionObject('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',8,8));
        fetch( sisterPort + '/reset');
    }

    var boardOptions = {position: boardPos,onPieceDrop};
    return(
        <>
        
        <Chessboard options = {boardOptions} />
        
        <button onClick={resetPos}>
        reset
        </button>

        </>
    )
}
export default ExBoard