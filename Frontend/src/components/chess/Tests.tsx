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

//manual solution insertions
const solution_white = [['g1','f3','wN'],['g8','f6','bN'],['b1','c3','wN'],['b8','c6','bN']];
const play_white = [['g1','f3','wN'],['b1','c3','wN']];
const solution_black = [['g8','f6','bN'],['g1','f3','wN'],['b8','c6','bN'],['b1','c3','wN']];
const play_black = [['g8','f6','bN'],['b8','c6','bN']];

const castling_enpassant_Pos = [
    ['a8','bR'],['h8','bR'],['e8','bK'],['e1','wK'],['a1','wR'],['h1','wR'],
    ['d7','bP'],['f4','bP'],['e2','wP'],['c5','wP']
]

const special_moves = [
    ['e2','e4','wP'],['f4','e3','bP'],['e1','g1','wK'],['d7','d5','bP'],['c5','d6','wP'],['e8','c8','bK']
]

const illegal_king_test = [
    ['e8','bK'],['e1','wK'],['d1','wK'],['d8','bK']
]


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

    const loadExercise = async (id: number) =>{
        await exerciseBoard.current.fetchExercise(id);
    }

    const playExercise = (from: any, to: any, type: any) => {
        exerciseBoard.current.onPieceDrop({sourceSquare: from, targetSquare: to, piece:{pieceType: type}});
    }

    function insertTest(){
        console.log('Insert Test started');
        //manually insert pieces
        defaultPos.forEach(([square,piece]) => {
            insertPiece(square,piece);
            console.log('Piece Inserted');
        }); 
        //sets the initial position of exercise
        creationBoard.current.savePos();
        console.log('Initial Position set');
        //plays solution white starting turn
        solution_white.forEach(([from,to,type]) => {
            movePiece(from,to,type);
            console.log('Piece played');
        });
        //saves exercise in DB
        creationBoard.current.savePos();
        console.log('Exercise saved for white pieces');  
        //returns to the initial position to modify
        creationBoard.current.cancelPos();
        console.log('Reverting to previous selected initial position');
        //sets the initial position of exercise
        creationBoard.current.savePos();
        console.log('Initial Position set');
        //plays solution black starting turn
        solution_black.forEach(([from,to,type]) => {
            movePiece(from,to,type)
            console.log('Piece played');
        });
        //saves exercise to DB
        creationBoard.current.savePos();
        console.log('Exercise saved for black pieces');
        console.log('Insert test ended');
   
    }

    const loadTest = async() => {
        console.log('Load Test started');
        //Load white exercise
        await loadExercise(1);
        console.log('Exercise for white loaded');
        play_white.forEach(([from,to,type]) => {
            playExercise(from,to,type);
            console.log('Move from solution made')
            exerciseBoard.current.autoMove();
        });
        console.log('Exercise played to completion');

        //Load black exercise
        await loadExercise(2);
        console.log('Exercise for black loaded');
        play_black.forEach(([from,to,type]) => {
            playExercise(from,to,type);
            console.log('Move from solution made');
            exerciseBoard.current.autoMove();
        });
        console.log('Exercise played to completion');
        //unexistent id

        console.log('Load Test ended');
    }

    function chessRules(){
        //normal piece movement

        //special move cases (enpassant and castling)
        castling_enpassant_Pos.forEach(([square,piece]) => {insertPiece(square,piece)});
        creationBoard.current.savePos();
        console.log('savePos after')
        special_moves.forEach(([from,to,type]) => {movePiece(from,to,type)});
    }

    function runTests(){
        insertTest();
        loadTest();
        creationBoard.current.clearBoard();
        chessRules();
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