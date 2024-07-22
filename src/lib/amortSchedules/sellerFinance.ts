import {
  type PaymentSchedule,
  calcMortgagePayment,
  getInterestPayment,
} from "./core";

export interface ARMSchedule {
  first: number;
  then: number;
  firstMargin: number;
  thenMargin: number;
}

export interface LumpSumPaymentSchedule {
  [month: number]: number;
}

export interface SellerFinanceAmortizationType {
  interest: number;
  loanAmount: number;
  loanTerm: number;
  interestOnlyPeriod?: number;
  ARMSchedule?: ARMSchedule;
  lumpSumPayments?: LumpSumPaymentSchedule;
}

export class SellerFinanceAmortizationSchedule {
  interest: number;
  loanAmount: number;
  loanTerm: number;
  interestOnlyPeriod: number;
  ARMSchedule: ARMSchedule;
  lumpSumPayments: LumpSumPaymentSchedule;

  constructor(props: {
    interest: number;
    loanAmount: number;
    loanTerm: number;
    interestOnlyPeriod?: number;
    ARMSchedule?: ARMSchedule;
    lumpSumPayments?: { month: number; amount: number }[];
  }) {
    this.interest = props.interest;
    this.loanAmount = props.loanAmount;
    this.loanTerm = props.loanTerm;
    this.interestOnlyPeriod = props.interestOnlyPeriod || 0;
    this.ARMSchedule = props.ARMSchedule || {
      first: 0,
      then: 0,
      firstMargin: 0,
      thenMargin: 0,
    };
    let lumpSumPayments: LumpSumPaymentSchedule = {};
    if (props.lumpSumPayments) {
      props.lumpSumPayments.forEach((lumpSumPayment) => {
        lumpSumPayments[lumpSumPayment.month] = lumpSumPayment.amount;
      });
    } else {
      lumpSumPayments = {};
    }
    this.lumpSumPayments = lumpSumPayments;
  }

  getAmortizationSchedule = () => {
    const output: PaymentSchedule = {};
    let remainingBalance: number = this.loanAmount;
    let loanTerm = this.loanTerm;
    let accruedInterest = 0;
    let accruedPrincipal = 0;
    let month = 1;

    while (month <= this.loanTerm) {
      if (Object.keys(this.lumpSumPayments).includes(month.toString())) {
        remainingBalance -= this.lumpSumPayments[month] as number;
        accruedPrincipal += this.lumpSumPayments[month] as number;
      }

      if (month <= this.interestOnlyPeriod) {
        const interestPayment = getInterestPayment(
          remainingBalance,
          this.interest / 100
        );
        accruedInterest += interestPayment;
        const monthlyPayment = {
          month,
          payment: interestPayment,
          principal: 0,
          interest: interestPayment,
          accruedInterest,
          accruedPrincipal,
          remainingBalance,
        };
        output[month] = monthlyPayment;
        month++;
        loanTerm--;
      } else {
        const payment = calcMortgagePayment(
          remainingBalance,
          this.interest / 100,
          loanTerm
        );
        const interestPayment = getInterestPayment(
          remainingBalance,
          this.interest / 100
        );
        const principalPayment = payment - interestPayment;
        accruedInterest += interestPayment;
        accruedPrincipal += principalPayment;
        const monthlyPayment = {
          month,
          payment,
          principal: principalPayment,
          interest: interestPayment,
          accruedInterest,
          accruedPrincipal,
          remainingBalance,
        };
        output[month] = monthlyPayment;
        remainingBalance -= principalPayment;
        loanTerm--;
        month++;
      }
    }

    return output;
  };

  getWorstCaseAmortSchedule = () => {
    const output: PaymentSchedule = {};
    let interest = this.interest;
    let remainingBalance: number = this.loanAmount;
    let loanTerm = this.loanTerm;
    let accruedInterest = 0;
    let accruedPrincipal = 0;
    let month = 1;

    while (month <= this.loanTerm) {
      if (month === this.ARMSchedule.first) {
        interest = this.interest + this.ARMSchedule.firstMargin;
      }

      if ((month - this.ARMSchedule.first) % this.ARMSchedule.then === 0) {
        interest = this.interest + this.ARMSchedule.thenMargin;
      }

      if (Object.keys(this.lumpSumPayments).includes(month.toString())) {
        remainingBalance -= this.lumpSumPayments[month] as number;
      }

      if (month <= this.interestOnlyPeriod) {
        const interestPayment = getInterestPayment(remainingBalance, interest);
        accruedInterest += interestPayment;
        const monthlyPayment = {
          month,
          payment: interestPayment,
          principal: 0,
          interest: interestPayment,
          accruedInterest,
          accruedPrincipal,
          remainingBalance,
        };
        output[month] = monthlyPayment;
        month++;
        loanTerm--;
      } else {
        const payment = calcMortgagePayment(
          remainingBalance,
          interest,
          loanTerm
        );
        const interestPayment = getInterestPayment(remainingBalance, interest);
        const principalPayment = payment - interestPayment;
        accruedInterest += interestPayment;
        accruedPrincipal += principalPayment;
        const monthlyPayment = {
          month,
          payment,
          principal: principalPayment,
          interest: interestPayment,
          accruedInterest,
          accruedPrincipal,
          remainingBalance,
        };
        output[month] = monthlyPayment;
        remainingBalance -= principalPayment;
        loanTerm--;
        month++;
      }
    }

    return output;
  };
}
