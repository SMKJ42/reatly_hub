import type { singleFamilyInterface } from "./redux";

export interface PodInterface extends singleFamilyInterface {
  id: string;
  loanTypeOptions?: mortgageRates[];
  rennovationsRadio?: boolean;
  speculation?: boolean;
  variable?: string;
}
