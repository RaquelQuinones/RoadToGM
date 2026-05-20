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
    ['e2','e4','wP',1],['f4','e3','bP',1],['e1','g1','wK',1],['d7','d5','bP'],['c5','d6','wP'],['e8','c8','bK',1]
]

const piece_diagnosis = [
    ['a8','bR'],['b8','bN'],['c8','bB'],['d8','bQ'],['e8','bK'],['h2','bP'],['g1','wN'],
    ['a1','wR'],['b1','wN'],['c1','wB'],['d1','wQ'],['e1','wK'],['a5','wP']
]

const regular_moves = [
    ['h2','h1','bP',1],['a5','a6','wP',1],['a8','a6','bR',1],['c1','e3','wB',1],['b8','c6','bN',1],['e1','e2','wK',1],
    ['c8','b7','bB'],['b1','d2','wN',1],['d8','d5','bQ',1],['d1','a4','wQ'],['e8','d8','bK'],['a1','c1','wR']
]


const metricsList = [];

function logMetric(testName, metricName, valueMs) {
    metricsList.push({
        test: testName,
        metric: metricName,
        value_ms: typeof valueMs === 'number' ? valueMs.toFixed(2) : valueMs
    });
}

function printMetrics() { 
    console.log('Test,Metric,Value (ms)');
    metricsList.forEach(m => {
        console.log(`${m.test},${m.metric},${m.value_ms}`);
    });
}

window.copyMetrics = () => {
    const data = metricsList.map(m => `${m.value_ms}`).join('\n');
    copy(data);
    
};


const avg_time = (original: number, incoming: number) => {
    if(original == 0){
        return incoming;
    }return (original + incoming)/2;
}

const Tests = () => {

    const creationBoard = createRef<any>();
    const exerciseBoard = createRef<any>();
    
    let testedmoves = 0;
    const promotion_penalty = 3/4;

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

    function insertTest(callback: any){
        console.log('--------------Insert Test started--------------');
        const start = performance.now();

        //manually insert pieces
        let avg_insert = 0;
        defaultPos.forEach(([square,piece]) => {
            const iStart = performance.now();
            insertPiece(square,piece);
            console.log('Piece Inserted');
            avg_insert = avg_time(avg_insert,performance.now()-iStart);
        }); 
        
        // ADD THIS: Log average insertion time
        logMetric('Insert Test', 'Average piece insertion', avg_insert);
        
        //sets the initial position of exercise
        const default_set = performance.now();
        creationBoard.current.savePos();
        const default_end = performance.now()
        const default_position_setting_time = default_end - default_set;
        
        // ADD THIS: Log position saving time
        logMetric('Insert Test', 'Initial position save', default_position_setting_time);
        
        console.log('Initial Position set in',avg_insert,'ms');
        console.log('Position saved in',default_end - default_set,'ms');
        
        //plays solution white starting turn
        solution_white.forEach(([from,to,type]) => {
            movePiece(from,to,type);
            console.log('Piece played');
        });
        
        //saves exercise in DB
        const wSave = performance.now();
        creationBoard.current.savePos();
        const wEnd = performance.now();
        
        // ADD THIS: Log white exercise save time
        logMetric('Insert Test', 'White exercise save', wEnd - wSave);
        
        console.log('Exercise saved for white pieces in',wEnd - wSave,'ms');  
        
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
        const bSave = performance.now();
        creationBoard.current.savePos();
        const bEnd = performance.now();
        
        // ADD THIS: Log black exercise save time
        logMetric('Insert Test', 'Black exercise save', bEnd - bSave);
        
        console.log('Exercise saved for black pieces in',bEnd - bSave,'ms');
        const end = performance.now();
        console.log('--------------Insert test ended--------------');
        console.log('Time to completion',end - start,'ms');
        
        // ADD THIS: Log total insert test time
        logMetric('Insert Test', 'Total test time', end - start);
        
        callback();
    }

    const loadTest = async(callback: any) => {
        console.log('--------------Load Test started--------------');
        const start = performance.now();
        
        //Load white exercise
        const wLoad = performance.now()
        await loadExercise(144);
        const wEnd = performance.now();

        // ADD THIS: Log white exercise load time
        logMetric('Load Test', 'White exercise load', wEnd - wLoad);
        
        console.log('Exercise for white loaded in',wEnd - wLoad,'ms');
        let avg_w_play = 0;
        play_white.forEach(([from,to,type]) => {
            const wStart = performance.now();
            playExercise(from,to,type);
            console.log('Move from solution made')
            exerciseBoard.current.autoMove();
            avg_w_play = avg_time(avg_w_play, performance.now() - wStart);
        });
        
        // ADD THIS: Log white play time
        logMetric('Load Test', 'White average move time', avg_w_play);
        
        console.log('Exercise played to completion in average', avg_w_play,'ms');

        //Load black exercise
        const bLoad = performance.now();
        await loadExercise(145);
        const bEnd = performance.now();
        
        // ADD THIS: Log black exercise load time
        logMetric('Load Test', 'Black exercise load', bEnd - bLoad);
        
        console.log('Exercise for black loaded in', bEnd - bLoad,'ms');
        let avg_b_play = 0;
        play_black.forEach(([from,to,type]) => {
            const bStart = performance.now();
            playExercise(from,to,type);
            console.log('Move from solution made');
            exerciseBoard.current.autoMove();
            avg_b_play = avg_time(avg_b_play, performance.now() - bStart);
        });
        
        // ADD THIS: Log black play time
        logMetric('Load Test', 'Black average move time', avg_b_play);
        
        console.log('Exercise played to completion in average', avg_b_play,'ms');

        const end = performance.now()
        console.log('--------------Load Test ended--------------');
        console.log('Time to completion',end - start,'ms');
        
        // ADD THIS: Log total load test time
        logMetric('Load Test', 'Total test time', end - start);

        callback();
    }

    function chessRules(){
        creationBoard.current.clearBoard();
        //normal piece movement
        console.log('--------------Chess rules test started--------------')
        const start = performance.now();
        piece_diagnosis.forEach(([square,piece]) => {insertPiece(square,piece)});
        creationBoard.current.savePos();
        console.log('Pieces set');
        regular_moves.forEach(([from,to,type,unique]) => {
            if(unique){testedmoves = testedmoves + 1;}
            movePiece(from,to,type)
            console.log('Moved piece', type);
        });

        creationBoard.current.clearBoard();
        //special move cases (enpassant and castling)
        console.log('--------------Special moves test started--------------');
        castling_enpassant_Pos.forEach(([square,piece]) => {insertPiece(square,piece)});
        console.log('Pieces set');
        creationBoard.current.savePos();
        special_moves.forEach(([from,to,type,unique]) => {
            if(unique){testedmoves = testedmoves + 1;}
            movePiece(from,to,type)
            console.log('Moved piece', type);
        });
        const end = performance.now();
        console.log('--------------Chess rule test ended--------------')
        console.log('Time to completion',end - start,'ms');
        
        console.log('Average Legal Rule validation: ',((testedmoves-promotion_penalty) / 12)*100,'%');
        
        logMetric('Chess Rules', 'Total test time', end - start);
    }

    function runTests(){
        metricsList.length = 0;
        const attemps = 25;
        for(let i =0;i< attemps;i++){
        insertTest(() => {loadTest( () => {chessRules();
            printMetrics();
        })});
        }
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
        <br />
        <button onClick={runTests}>Run Tests</button>
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