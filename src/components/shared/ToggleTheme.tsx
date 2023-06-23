// 'use client';

import React, { useEffect } from "react";
import getLocalStorageItem from "~/cache/localStorage/getLocalStorageItem";
import setLocalStorageItem from "~/cache/localStorage/setLocalStorageItem";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import { setDarkMode, setLightMode } from "~/redux/clientSlice";

const ToggleTheme = () => {
  const dispatch = useAppDispatch();
  const colorTheme = useAppSelector((state) => state.client.colorTheme);

  useEffect(() => {
    const localColorTheme = getLocalStorageItem("color-theme");
    if (
      localColorTheme === "dark" ||
      (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      dispatch(setDarkMode());
    } else {
      dispatch(setLightMode());
    }
  }, []);

  return (
    <>
      {colorTheme === "dark" ? (
        <button
          onClick={() => {
            dispatch(setLightMode());
            setLocalStorageItem("color-theme", "light");
          }}
        >
          Light
        </button>
      ) : (
        <button
          onClick={() => {
            dispatch(setDarkMode());
            setLocalStorageItem("color-theme", "dark");
          }}
        >
          Dark
        </button>
      )}
    </>
  );
};

export default ToggleTheme;
