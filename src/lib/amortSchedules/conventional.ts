import {
  type PaymentSchedule,
  calcMortgagePayment,
  getInterestPayment,
} from "./core";

class ConventionalAmortizationSchedule {
  loanAmount: number;
  interest: number;
  loanTerm: number;

  constructor(props: {
    loanAmount: number;
    interest: number;
    loanTerm: number;
  }) {
    if (props.loanAmount < 0) {
      throw new Error("Loan amount must be greater than 0");
    }
    if (props.loanTerm < 0) {
      throw new Error("Loan term must be greater than 0");
    }

    const { loanAmount, interest, loanTerm } = props;
    this.loanAmount = loanAmount;
    this.interest = interest;
    this.loanTerm = loanTerm;
  }

  getAmortizationSchedule = () => {
    const output: PaymentSchedule = {};
    let remainingBalance = this.loanAmount;
    let loanTerm = this.loanTerm;
    let accruedInterest = 0;
    let accruedPrincipal = 0;
    let month = 1;
    while (this.loanTerm > 0) {
      const payment = calcMortgagePayment(
        remainingBalance,
        this.interest,
        loanTerm
      );
      const interestPayment = getInterestPayment(
        remainingBalance,
        this.interest
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
    return output;
  };
}

export { ConventionalAmortizationSchedule };
