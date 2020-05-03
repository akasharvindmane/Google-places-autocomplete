import React from 'react';
import './App.css';
import { useCallback } from 'react' 
import Map from '../map/Map.js'

const MemoMap = useCallback(<Map />, []) 

export default () => (
  <div>
    <h1>Google memoized map</h1>
    {MemoMap} 
  </div>
)