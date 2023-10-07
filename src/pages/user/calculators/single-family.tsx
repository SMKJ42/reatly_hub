import { useState, type ReactElement, useEffect } from "react";
import UserLayout from "../../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../../_app";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import {
  resetSFH,
  updateAddress,
  updateId,
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
import { getSFHSubmit } from "~/components/calculators/singleFamily/getSFSubmit";
import { useRouter } from "next/router";
import { strNumsInput } from "~/lib/numberDisplay";
import { StandardLoadingSpinner } from "~/components/shared/StandardLoadingSpinner";
import Head from "next/head";

const SingleFamilyCalc: NextPageWithLayout = () => {
  const dispatch = useAppDispatch();
  const ctx = api.useContext();

  const id = useAppSelector((state) => state.singleFamily?.id);
  const address = useAppSelector((state) => state.singleFamily?.address);

  const [success, setSuccess] = useState(false);

  const { mutate: create, isLoading: isSaving } =
    api.singleFamily.create.useMutation({
      onSuccess: (opts) => {
        dispatch(resetSFH());
        dispatch(updateId(opts.id));
        setSuccess(true);
      },
      onError: (error) => {
        console.log(error);
      },
    });

  const { mutate: update, isLoading: isUpdating } =
    api.singleFamily.update.useMutation({
      onSuccess: () => {
        dispatch(resetSFH());
        setSuccess(true);
        void ctx.singleFamily.getAll.invalidate();
      },
      onError: (error) => {
        console.log(error);
      },
    });

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

  function handlePDF() {
    //TODO: do something
  }

  return (
    <div>
      <Head>
        <title>Realty-hub SFH Calculator</title>
      </Head>
      {success && <Success setSuccess={setSuccess} />}
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="sfh-deal-analysis flex w-full flex-col items-center">
          <div className="container mx-4 grid w-fit grid-cols-1 justify-center gap-x-12 md:w-full md:grid-cols-2">
            <div className="address col-s flex flex-col items-center justify-center py-2 md:col-span-2 md:flex-row">
              <label className="mx-4 text-lg font-semibold" aria-required>
                Address:
              </label>

              <input
                value={address}
                type="text"
                className="mx-4 w-full md:w-1/3"
                onChange={(e) => {
                  dispatch(updateAddress(e.target.value));
                }}
                required
              />
              <input
                type="button"
                value="reset"
                className="px-2"
                onClick={() => {
                  dispatch(resetSFH());
                }}
              />
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
          <div className="button-container my-4 flex w-60 justify-around  md:w-96">
            <button
              type="submit"
              className="mr-4 rounded-md px-4 py-1 dark:bg-white dark:text-black"
              disabled={isSaving || isUpdating}
              onClick={() => {
                if (isSaving || isUpdating) return;
                if (!id) {
                  create({ ...getSFHSubmit() });
                } else if (typeof id === "string") {
                  update({ ...getSFHSubmit(), id });
                }
              }}
            >
              {id ? "update" : "save"}
            </button>
            <button
              type="button"
              value="PDF"
              className="mr-4 rounded-md px-4 py-1 dark:bg-white dark:text-black"
              onClick={() => {
                handlePDF();
              }}
            >
              PDF
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

type SuccessProps = {
  setSuccess: (boolean: boolean) => void;
};

function Success(props: SuccessProps) {
  const { setSuccess } = props;
  const router = useRouter();
  return (
    <div className="absolute flex h-full w-full items-center justify-center">
      <div className="flex h-auto flex-col justify-center rounded-lg bg-primary200 p-8">
        <h1 className="text-center">Success!</h1>
        <h2 className="text-center">Your deal has been saved</h2>
        <div className="mt-4 flex justify-center">
          <input
            type="button"
            value="History"
            className="mr-4 rounded-md px-3"
            onClick={() => {
              void router.push("/user/calculators/history");
            }}
          />
          <input
            type="button"
            value="Dismiss"
            className="rounded-md px-3"
            onClick={() => {
              setSuccess(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}

SingleFamilyCalc.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default SingleFamilyCalc;
