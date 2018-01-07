export class LoanTerm {
  id: number;
  current: boolean;
  interestRate: number;
  tenure: number;
  firstLoanLimit: number;
  minAmt: number;
  maxAmt: number;

  constructor(id: number, current: boolean, interestRate: number,
              tenure: number, minAmt: number,
              firstLoanLimit: number, maxAmt: number) {

    this.id = id;
    this.current = current;
    this.interestRate = interestRate;
    this.tenure = tenure;
    this.minAmt = minAmt;
    this.firstLoanLimit = firstLoanLimit;
    this.maxAmt = maxAmt;

  }
}
