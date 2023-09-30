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
      className="flex flex-col"
      onMouseEnter={() => {
        setDropDownOption("calculators");
        setActiveDropDown(true);
      }}
    >
      Calculators
      {dropDownOption === "calculators" && activeDropDown ? (
        <>
          <LargeCalculatorsDropDown />
          <MiniCalculatorsDropDown />
        </>
      ) : null}
    </div>
  );
};

const LargeCalculatorsDropDown = () => {
  return (
    <div className="drop-down absolute hidden w-28 flex-1 flex-col bg-primary200 dark:bg-primary200 md:flex">
      <Link href="/user/calculators/single-family">SFH</Link>
      <Link href="/user/calculators/multi-family">MFH</Link>
      <Link href="/user/calculators/history">History</Link>
    </div>
  );
};
const MiniCalculatorsDropDown = () => {
  return (
    <div className="mini-drop-down relative flex w-28 flex-1 flex-col text-base md:hidden">
      <Link href="/user/calculators/single-family" className="mb-1">
        SFH
      </Link>
      <Link href="/user/calculators/multi-family" className="mb-1">
        MFH
      </Link>
      <Link href="/user/calculators/history">History</Link>
    </div>
  );
};
