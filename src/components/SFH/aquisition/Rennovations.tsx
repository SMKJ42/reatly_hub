import React, { useEffect } from "react";
import { convertToNum, strNumsInput } from "../../../homeBrews/numberDisplay";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import { updateARV, updateRennovations } from "~/redux/SFHSlice";

const Rennovations = () => {
  const dispatch = useAppDispatch();
  const SFH = useAppSelector((state) => state.SFH);

  useEffect(() => {
    dispatch(updateARV(SFH.price));
    return () => {
      dispatch(updateARV("0"));
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
            dispatch(
              // need to strip commas away before reasserting them
              updateRennovations(strNumsInput(convertToNum(e.target.value)))
            );
          }}
        />
      </div>
      <div className="value-after-rennovations input-container">
        <label>Value after Renno: </label>
        <input
          type="text"
          value={SFH.ARV === "0" ? SFH.price : SFH.ARV}
          onChange={(e) => {
            // need to strip commas away before reasserting them
            dispatch(updateARV(strNumsInput(convertToNum(e.target.value))));
          }}
        ></input>
      </div>
    </>
  );
};

export default Rennovations;
