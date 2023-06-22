// 'use client';

import React from "react";
import getLocalStorageItem from "~/cache/localStorage/getLocalStorageItem";
import setLocalStorageItem from "~/cache/localStorage/setLocalStorageItem";
import {useEffect, useState} from 'react'

const ToggleTheme = () => {
  const [mode, setMode] = useState('')

  useEffect(() => {
    setMode(getLocalStorageItem('color-theme'))
  }, [mode])

  return (<>
    {mode === 'dark' ?
      <button onClick={() => {
        setLocalStorageItem('color-theme', 'light')
      }}>Light</button>
    :
      <button onClick={() => {
        setLocalStorageItem('color-theme', 'dark')
      }}>Dark</button>
     }  
  </>)
};

export default ToggleTheme;
