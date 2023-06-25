import Link from "next/link";

type dropDownProps = {
  setDropDownOption: (string: string) => void;
  dropDownOption: string;
  setActiveDropDown: (boolean: boolean) => void;
  activeDropDown: boolean;
};

export const CalculatorsNav: React.FunctionComponent<dropDownProps> = (
  props
) => {
  const setDropDownOption = props.setDropDownOption;
  const dropDownOption = props.dropDownOption;
  const setActiveDropDown = props.setActiveDropDown;
  const activeDropDown = props.activeDropDown;

  return (
    <div
      onMouseEnter={() => {
        setDropDownOption("calculators");
        setActiveDropDown(true);
      }}
    >
      Calculators
      {dropDownOption === "calculators" && activeDropDown ? (
        <CalculatorsDropDown />
      ) : null}
    </div>
  );
};

const CalculatorsDropDown = () => {
  return (
    <div>
      <Link href="/user/calculators/sFH">SFH</Link>
      <Link href="/user/calculators/mFH">MFH</Link>
      <Link href="/user/calculators/history">History</Link>
    </div>
  );
};
