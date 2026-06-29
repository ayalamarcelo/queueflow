import { useState } from 'react';
import ClientQueue from './ClientQueue';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ClientQueue></ClientQueue>
    </>
  )
};

export default App;
