import { useState, type ReactElement, useEffect } from "react";
import UserLayout from "../../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../../_app";
// import { SellerFinanceAmortizationSchedule } from "~/lib/amortSchedules/sellerFinance";
import {
  LumpSumPaymentSchedule,
  SellerFinanceAmortizationSchedule,
} from "~/lib/amortSchedules/sellerFinance";
import {
  resetSellerFinance,
  setInterest,
  setLoanAmount,
  setTerm,
} from "~/redux/slice/SellerFinanceSlice";
import { ARMOptions } from "~/components/calculators/sellerFinance/ArmOptions";
import { LumpSumOptions } from "~/components/calculators/sellerFinance/LumpSumOptions";
import { InterestOnlyOptions } from "~/components/calculators/sellerFinance/InterestOnlyOptions";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import { convertToNum, strNumsInput } from "~/lib/numberDisplay";

/*
 * ARM
 * Interest Rate
 * Interest only
 * Loan Amount
 * Loan Term
 * balloon payments
 */

const SellerFinance: NextPageWithLayout = () => {
  const amort = useAppSelector((state) => state.sellerFinance);
  const dispatch = useAppDispatch();

  let test = new SellerFinanceAmortizationSchedule(amort);

  useEffect(() => {
    test = new SellerFinanceAmortizationSchedule(amort);
  }, [amort]);

  console.log();

  const [arm, setArm] = useState(false);
  const [interestOnly, setInterestOnly] = useState(false);
  const [lumpSum, setLumpSum] = useState(false);

  function handleToggleArm(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.id === "yesArm") {
      setArm(true);
    } else if (e.target.id === "noArm") {
      setArm(false);
    } else {
      throw new Error("input Error");
    }
  }

  function handleToggleIO(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.id === "yesIO") {
      setInterestOnly(true);
    } else if (e.target.id === "noIO") {
      setInterestOnly(false);
    } else {
      throw new Error("input Error");
    }
  }

  function handleToggleLS(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e);
    if (e.target.id === "yesLS") {
      setLumpSum(true);
    } else if (e.target.id === "noLS") {
      setLumpSum(false);
    } else {
      throw new Error("input Error");
    }
  }

  useEffect(() => {
    return () => {
      resetSellerFinance();
    };
  }, []);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div>
          <label htmlFor="loanAmount">Loan amount: </label>
          <input
            id="loanAmount"
            name="loanAmount"
            value={strNumsInput(amort.loanAmount)}
            onChange={(e) => {
              dispatch(setLoanAmount(strNumsInput(e.target.value, 2)));
            }}
          />
        </div>
        <div>
          <label htmlFor="interest">Interest: </label>
          <input
            id="interest"
            name="interest"
            value={strNumsInput(amort.interest)}
            onChange={(e) => {
              dispatch(setInterest(strNumsInput(e.target.value, 3)));
            }}
          />
        </div>
        <div>
          <label htmlFor="term">Loan Term: </label>
          <input
            id="term"
            name="term"
            value={strNumsInput(amort.loanTerm)}
            onChange={(e) => {
              dispatch(setTerm(e.target.value));
            }}
          />
        </div>
        <fieldset className="flex">
          <legend>ARM</legend>
          <input
            type="radio"
            id="yesArm"
            name="arm"
            onChange={(e) => handleToggleArm(e)}
          />
          <label htmlFor="yesArm">yes</label>
          <input
            type="radio"
            id="noArm"
            name="arm"
            onChange={(e) => handleToggleArm(e)}
          />
          <label htmlFor="noArm">no</label>
        </fieldset>
        {arm && <ARMOptions />}
        <fieldset className="flex">
          <legend>Interest Only: </legend>
          <input
            type="radio"
            id="yesIO"
            name="InterestOnly"
            onChange={(e) => handleToggleIO(e)}
          />
          <label htmlFor="yesIO">yes</label>
          <input
            type="radio"
            id="noIO"
            name="InterestOnly"
            onChange={(e) => handleToggleIO(e)}
          />
          <label htmlFor="noIO">no</label>
        </fieldset>
        {interestOnly && <InterestOnlyOptions />}
        <fieldset className="flex">
          <legend>Lump Sum Payments: </legend>
          <input
            type="radio"
            id="yesLS"
            name="lumpSum"
            onChange={(e) => handleToggleLS(e)}
          />
          <label htmlFor="yesLS">yes</label>
          <input
            type="radio"
            id="noLS"
            name="lumpSum"
            onChange={(e) => handleToggleLS(e)}
          />
          <label htmlFor="noLS">no</label>
        </fieldset>
        {lumpSum && <LumpSumOptions />}
      </form>
      <div>{JSON.stringify(test.getAmortizationSchedule())}</div>
    </div>
  );
};

SellerFinance.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default SellerFinance;
