import React, { useEffect } from "react";
import { strNumsInput } from "../../../homeBrews/numberDisplay";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";

const Rennovations = () => {
  const dispatch = useAppDispatch();
  const SFH = useAppSelector((state) => state.SFH);

  useEffect(() => {
    dispatch({
      type: "UPDATE_ARV",
      payload: SFH.price,
    });
    return () => {
      dispatch({
        type: "UPDATE_RENNOVATIONS",
        payload: "0",
      });
      dispatch({
        type: "UPDATE_ARV",
        payload: "0",
      });
    };
    //eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="rennovations input-container">
        <label>Rennovations: </label>
        <input
          type="text"
          value={SFH.rennovations}
          onChange={(e) => {
            dispatch({
              type: "UPDATE_RENNOVATIONS",
              payload: strNumsInput(e.target.value, 2),
            });
          }}
        />
      </div>
      <div className="value-after-rennovations input-container">
        <label>Value after Renno: </label>
        <input
          type="text"
          value={SFH.ARV === "0" ? SFH.price : SFH.ARV}
          onChange={(e) => {
            dispatch({
              type: "UPDATE_ARV",
              payload: strNumsInput(e.target.value, 2),
            });
          }}
        ></input>
      </div>
    </>
  );
};

export default Rennovations;
