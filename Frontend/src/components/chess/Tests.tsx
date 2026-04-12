import ExBoard from './exerciseBoard';
import CBoard from './creationBoard';
import { createRef } from 'react';

//manual piece insertions
const defaultPos = [
    ['a8','bR'],['b8','bN'],['c8','bB'],['d8','bQ'],['e8','bK'],['f8','bB'],['g8','bN'],['h8','bR'],
    ['a7','bP'],['b7','bP'],['c7','bP'],['d7','bP'],['e7','bP'],['f7','bP'],['g7','bP'],['h7','bP'],
    ['a2','wP'],['b2','wP'],['c2','wP'],['d2','wP'],['e2','wP'],['f2','wP'],['g2','wP'],['h2','wP'],
    ['a1','wR'],['b1','wN'],['c1','wB'],['d1','wQ'],['e1','wK'],['f1','wB'],['g1','wN'],['h1','wR']

]

const illegal_king_test = [
    ['e8','bK'],['e1','wK'],['d1','wK'],['d8','bK']
]

//manual solution insertions
const solution_white = [['g1','f3','wN'],['g8','f6','bN'],['b1','c3','wN'],['b8','c6','bN']];

const solution_black = [['g8','f6','bN'],['g1','f3','wN'],['b8','c6','bN'],['b1','c3','wN']];

const Tests = () => {
    const creationBoard = createRef<any>();
    const exerciseBoard = createRef<any>();
    
    const insertPiece = (to: string, type: string) => {
        creationBoard.current.onPieceDrop({targetSquare:to ,piece: {isSparePiece: true, pieceType: type}});
    }

    const removePiece = (from: string,type: string) => {
        creationBoard.current.onPieceDrop({sourceSquare: from,piece:{pieceType: type}});
    }

    const movePiece = (from: string, to: string, type: string) => {
        creationBoard.current.onPieceDrop({sourceSquare: from, targetSquare: to, piece:{pieceType: type}});
    }

    const loadExercise = (id: number) =>{
        console.log(exerciseBoard.current.fetchExercise(id));
    }

    function insertTest(){
        //manually insert pieces
        defaultPos.forEach(([square,piece]) => {insertPiece(square,piece)}); 
        //sets the initial position of exercise
        creationBoard.current.savePos();
        //plays solution white starting turn
        solution_white.forEach(([from,to,type]) => {movePiece(from,to,type)});
        //saves exercise in DB
        creationBoard.current.savePos();  
        //returns to the initial position to modify
        creationBoard.current.cancelPos();
        //sets the initial position of exercise
        creationBoard.current.savePos();
        //plays solution black starting turn
        solution_black.forEach(([from,to,type]) => {movePiece(from,to,type)});
        //saves exercise to DB
        creationBoard.current.savePos();
   
    }

    function loadTest(){
        //load first exercise
        loadExercise(1);
        //play exercise
        
        //load second exercise
        loadExercise(2);
        //play exercise

        //unexistent id
    }

    function chessRules(){
        //normal piece movement

        //special move cases (enpassant and castling)
    }

    function runTests(){
        insertTest();
        loadTest();
    }

    return(
    <>  
        <div style={{
          width:'400px',
          height:'400px'
        }}>
          
        <ExBoard ref={exerciseBoard}/>
          
        </div>
        <br />
        <button onClick={runTests}>button</button>
        <br />
        <div style={{
          width: '400px',
          height:'400px'
          }}>
    
        <CBoard ref={creationBoard}/>
    
        </div>
        
    </>
    )
}
export default Tests;