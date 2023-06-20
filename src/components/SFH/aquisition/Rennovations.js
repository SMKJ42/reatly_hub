import React, { useEffect } from "react";
import { strNumsInput } from "../../../app/homeBrews/numberDisplay";
import { useDispatch, useSelector } from "react-redux";

const Rennovations = () => {
  const dispatch = useDispatch();
  const SFH = useSelector((state) => state.SFH);

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
        {console.log(SFH.ARV, SFH.price)}
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
