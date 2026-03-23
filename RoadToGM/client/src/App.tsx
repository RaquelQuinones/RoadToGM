import { useState } from 'react'

import './App.css'

import ExBoard from './Components/exerciseBoard'
import CBoard from './Components/creationBoard';

const sisterPort = 'http://localhost:3000';


function App() {
  var [signal, setSignal] = useState(false); 
  const fetchData = ()=>{
    fetch( sisterPort + '/test')
    .then(res => res.json())
    .then(data => console.log(data));
    setSignal(!signal)
  }
  return (
    <>
    <button onClick={fetchData}>{'test button'}</button>
    <div style={{
      width:'400px',
      height:'400px'
    }}>
      
     <ExBoard />
      
    </div>
    <br />
    <br />
    <div style={{
      width: '400px',
      height:'400px'
      }}>

      <CBoard />

    </div>
    </>
  )
}

export default App
