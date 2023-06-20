import React from "react";
import { useDispatch, useSelector } from "react-redux";

const RennovationRadio = () => {
  const dispatch = useDispatch();
  const SFH = useSelector((state) => state.SFH);

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
            value={true}
            name="rennovations"
            onChange={() => {
              SFH.RennovationRadio
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
            value={false}
            name="rennovations"
            defaultChecked
            onChange={() => {
              SFH.RennovationRadio
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
