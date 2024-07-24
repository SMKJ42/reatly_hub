import Link from "next/link";

type dropDownProps = {
  setDropDownOption: (string: string) => void;
  dropDownOption: string;
  setActiveDropDown: (boolean: boolean) => void;
  activeDropDown: boolean;
};

export const CalculatorsDropdown: React.FunctionComponent<dropDownProps> = (
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
    <div className="drop-down z-20 absolute hidden mt-2 [&>*]:pt-1 [&>*]:px-4 [&>*]:w-full flex-1 flex-col bg-darkBg300 md:flex h-fit rounded-lg border-2 border-white">
      <Link href="/user/calculators/single-family" className="hover:bg-darkBg200 rounded-t-lg">Single Family</Link>
      <Link href="/user/calculators/multi-family" className="hover:bg-darkBg200">Multi Family</Link>
      <Link href="/user/calculators/seller-finance" className="hover:bg-darkBg200">Seller Finance</Link>
      <Link href="/user/calculators/history" className="hover:bg-darkBg200 rounded-b-lg">History</Link>
    </div>
  );
};
const MiniCalculatorsDropDown = () => {
  return (
    <div className="mini-drop-down relative flex w-28 flex-1 flex-col text-base md:hidden">
      <Link href="/user/calculators/single-family"
        className="mb-1"
      >
        Single Family
      </Link>
      <Link href="/user/calculators/multi-family"
        className="mb-1"
      >
        Multi Family
      </Link>
      <Link href="/user/calculators/seller-finance"
        className="mb-1"
      >
        Seller Finance
      </Link>
      <Link href="/user/calculators/history">History</Link>
    </div>
  );
};
