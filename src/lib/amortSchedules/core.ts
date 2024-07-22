// export class MonthlyPayment {
//   month: number;
//   payment: number;
//   principal: number;
//   interest: number;
//   accruedInterest: number;
//   accruedPrincipal: number;
//   remainingBalance: number;

//   constructor(props: {
//     month: number;
//     payment: number;
//     principal: number;
//     interest: number;
//     accruedInterest: number;
//     accruedPrincipal: number;
//     remainingBalance: number;
//   }) {
//     const {
//       payment,
//       principal,
//       interest,
//       month,
//       accruedInterest,
//       accruedPrincipal,
//       remainingBalance,
//     } = props;
//     this.payment = payment;
//     this.principal = principal;
//     this.interest = interest;
//     this.month = month;
//     this.accruedInterest = accruedInterest;
//     this.accruedPrincipal = accruedPrincipal;
//     this.remainingBalance = remainingBalance;
//   }

//   /*
//    * I dont really like this implementation, requires maintenance as
//    * new properties are added to the class. maybe try where val != func
//    * in the future
//    */

//   getValues() {
//     return {
//       payment: this.payment,
//       principal: this.principal,
//       interest: this.interest,
//       month: this.month,
//       accruedInterest: this.accruedInterest,
//       accruedPrincipal: this.accruedPrincipal,
//       remainingBalance: this.remainingBalance,
//     };
//   }
// }

interface MonthlyPayment {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  accruedInterest: number;
  accruedPrincipal: number;
  remainingBalance: number;
}

export interface PaymentSchedule {
  [key: number]: MonthlyPayment;
}

export type AmortizationSchedule = { [key: number]: MonthlyPayment };

export const calcMortgagePayment = (
  loanValue: number,
  interest: number,
  totalPayments: number
) => {
  const term = totalPayments / 12;
  const output =
    ((interest / 12) * loanValue) /
    (1 - Math.pow(1 + interest / 12, -term * 12));
  return output;
};

export const getInterestPayment = (loanValue: number, interest: number) => {
  return loanValue * (interest / 12);
};
