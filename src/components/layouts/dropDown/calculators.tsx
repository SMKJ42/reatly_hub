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
    <div className="absolute flex flex-1 flex-col bg-primary200 dark:bg-primary200">
      <Link href="/user/calculators/single-family">SFH</Link>
      <Link href="/user/calculators/multi-family">MFH</Link>
      <Link href="/user/calculators/history">History</Link>
    </div>
  );
};
