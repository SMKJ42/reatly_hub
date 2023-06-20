import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";

const RennovationRadio = () => {
  const dispatch = useAppDispatch();
  const SFH = useAppSelector((state) => state.SFH);

  return (
    <div className="rennovation-radios-container">
      <label htmlFor="" className="rennovations">
        Rennovations?
      </label>
      <div className="rennovation-radios input-container">
        <div>
          <input
            type="radio"
            id="rennovation-yes"
            name="rennovations"
            onChange={() => {
              SFH.rennovationsRadio
                ? dispatch({
                    type: "UPDATE_RENNOVATIONS_RADIO",
                    payload: false,
                  })
                : dispatch({
                    type: "UPDATE_RENNOVATIONS_RADIO",
                    payload: true,
                  });
            }}
          />
          <label htmlFor="rennovation-yes">yes</label>
        </div>

        <div>
          <input
            type="radio"
            id="rennovation-no"
            name="rennovations"
            defaultChecked
            onChange={() => {
              SFH.rennovationsRadio
                ? dispatch({ type: "UPDATE_RENNOVATIONS_RADIO", payload: true })
                : dispatch({
                    type: "UPDATE_RENNOVATIONS_RADIO",
                    payload: false,
                  });
            }}
          />
          <label htmlFor="rennovation-no">no</label>
        </div>
      </div>
    </div>
  );
};

export default RennovationRadio;
