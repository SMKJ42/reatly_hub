import { type ReactElement, useEffect } from "react";
import type { NextPageWithLayout } from "../../_app";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import {
  resetSFH,
  updateAddress,
  updateInterest,
  updateLoanTerm,
  updateLoanType,
  updateLoanTypeOptions,
} from "~/redux/slice/singleFamilySlice";
import SFHAquisitionInputs from "~/components/calculators/singleFamily/aquisition/Inputs";
import SFHAquisitionOutputs from "~/components/calculators/singleFamily/aquisition/Outputs";
import SFHEXpensesInputs from "~/components/calculators/singleFamily/expenses/inputs";
import SFHExpensesOutputs from "~/components/calculators/singleFamily/expenses/outputs";
import SFHIncomeInputs from "~/components/calculators/singleFamily/incomes/inputs";
import SFHIncomeOutputs from "~/components/calculators/singleFamily/incomes/outputs";
import { api } from "~/utils/api";
import { strNumsInput } from "~/lib/numberDisplay";
import { StandardLoadingSpinner } from "~/components/shared/StandardLoadingSpinner";
import PublicLayout from "~/components/layouts/PublicLayout";
import Head from "next/head";

const SingleFamilyCalc: NextPageWithLayout = () => {
  const dispatch = useAppDispatch();
  const address = useAppSelector((state) => state.singleFamily?.address);

  const { data: loanProducts, isLoading: loanProductsLoading } =
    api.mortgageRates.getAll.useQuery(null, {
      refetchOnWindowFocus: false,
    });

  useEffect(() => {
    if (!loanProductsLoading && loanProducts) {
      dispatch(updateLoanTypeOptions(loanProducts));
      loanProducts[0] ? dispatch(updateLoanType(loanProducts[0].name)) : null;
      loanProducts[0]
        ? dispatch(updateInterest(strNumsInput(loanProducts[0].rate, 3)))
        : null;
      const term = loanProducts[0]?.name.includes("15") ? "15" : "30";
      dispatch(updateLoanTerm(term));
    }
    // eslint-disable-next-line
  }, [loanProducts]);

  if (loanProductsLoading) return <StandardLoadingSpinner size={88} />;

  return (
    <>
      <Head>
        <title>Realty-hub SFH Calculator</title>
      </Head>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="sfh-deal-analysis flex w-full flex-col items-center px-8">
          <div className="container mx-4 grid w-fit grid-cols-1 justify-center gap-x-12 md:w-full md:grid-cols-2">
            <div className="address col-s flex flex-col items-center justify-center py-2 md:col-span-2 md:flex-row">
              <label className="mx-4 text-lg font-semibold" aria-required>
                Address:
              </label>

              <input
                value={address}
                type="text"
                className="mx-4 w-full md:w-1/3 "
                onChange={(e) => {
                  dispatch(updateAddress(e.target.value));
                }}
                required
              />
              <button
                type="reset"
                className="mx-2 mt-2 rounded-lg bg-darkBg200 px-4 py-1 text-white hover:cursor-pointer dark:bg-white dark:text-black"
                onClick={() => {
                  dispatch(resetSFH());
                }}
              >
                Reset
              </button>
            </div>
            <SFHAquisitionInputs loanProducts={loanProducts} />
            <SFHAquisitionOutputs />
            <div>
              <SFHEXpensesInputs />
              <SFHIncomeInputs />
            </div>
            <div>
              <SFHExpensesOutputs />
              <SFHIncomeOutputs />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

SingleFamilyCalc.getLayout = function getLayout(page: ReactElement) {
  return <PublicLayout>{page}</PublicLayout>;
};

export default SingleFamilyCalc;
