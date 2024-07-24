import PlusIcon from "~/components/shared/icons/plus";
import XIcon from "~/components/shared/icons/x";
import { convertToNum, strNumsInput } from "~/lib/numberDisplay";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import {
  addLumpSumPayment,
  removeLumpSumPayment,
  updateLumpSumPayment,
} from "~/redux/slice/SellerFinanceSlice";

export function LumpSumOptions() {
  const lumpSumPayments = useAppSelector(
    (state) => state.sellerFinance.lumpSumPayments
  );
  const dispatch = useAppDispatch();

  function handleAdd() {
    dispatch(addLumpSumPayment());
  }

  function handleRemove(idx: number) {
    dispatch(removeLumpSumPayment({ idx }));
  }

  return (
    <div>
      <PlusIcon propsFunction={handleAdd} />
      {lumpSumPayments.map((item, idx) => {
        return (
          <div key={idx}>
            <label>Month</label>
            <input
              value={strNumsInput(item.month)}
              onChange={(e) => {
                dispatch(
                  updateLumpSumPayment({
                    month: convertToNum(e.target.value).toString(),
                    amount: item.amount.toString(),
                    idx,
                  })
                );
              }}
            />
            <label>Amount</label>
            <input
              value={strNumsInput(item.amount)}
              onChange={(e) => {
                dispatch(
                  updateLumpSumPayment({
                    month: item.month.toString(),
                    amount: convertToNum(e.target.value).toString(),
                    idx,
                  })
                );
              }}
            />
            <XIcon onClick={() => handleRemove(idx)} />
          </div>
        );
      })}
    </div>
  );
}
