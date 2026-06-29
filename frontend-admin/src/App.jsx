import { useState } from 'react';
import AdminQueue from './AdminQueue';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AdminQueue></AdminQueue>
    </>
  )
};

export default App;
