import React from 'react';
import { useState } from 'react';

import Layout from './client/components/Layout'; // путь зависит от вашей структуры

function App() {
  const [count, setCount] = useState(0);
  return (
    <Layout />
  );
}

export default App;
