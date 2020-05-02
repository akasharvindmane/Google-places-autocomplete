import React from 'react';
import logo from './logo.svg';
import './App.css';
import React, { useCallback } from 'react' 
import Map from './Map.js'

const MemoMap = useCallback(<Map />, []) 

export default () => (
  <div>
    <h1>Google memoized map</h1>
    {MemoMap} 
  </div>
)