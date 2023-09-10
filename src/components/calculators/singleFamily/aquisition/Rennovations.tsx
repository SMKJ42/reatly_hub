import React, { useEffect } from "react";
import { strNumsInput } from "../../../../lib/numberDisplay";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import { updateARV, updateRennovations } from "~/redux/slice/singleFamilySlice";

const Rennovations = () => {
  const dispatch = useAppDispatch();
  const singleFamily = useAppSelector((state) => state.singleFamily);

  useEffect(() => {
    dispatch(updateARV(singleFamily.price));
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
          value={singleFamily.rennovations}
          onChange={(e) => {
            dispatch(
              // need to strip commas away before reasserting them
              updateRennovations(strNumsInput(e.target.value))
            );
          }}
        />
      </div>
      <div className="value-after-rennovations input-container">
        <label>Value after Renno: </label>
        <input
          type="text"
          value={
            singleFamily.ARV === "0" ? singleFamily.price : singleFamily.ARV
          }
          onChange={(e) => {
            // need to strip commas away before reasserting them
            dispatch(updateARV(strNumsInput(e.target.value)));
          }}
        ></input>
      </div>
    </>
  );
};

export default Rennovations;
