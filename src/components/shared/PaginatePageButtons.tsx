import { useEffect, useState } from "react";

interface PaginatePageProps {
  paginateTo: (num: number) => void;
  pageMax: number | undefined;
}

export function PaginatePageButtons(props: PaginatePageProps) {
  const { paginateTo, pageMax } = props;
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  function handlePageChange(changePage: number) {
    if (changePage + page < 0) {
      return;
    } else if (pageMax && changePage + page > pageMax) {
      return;
    }
    setPage((prev) => prev + changePage);
  }

  const [pageOpts, setPageOpts] = useState<number[] | null>([]);

  useEffect(() => {
    setPageOpts(changePage(page || 1, pageMax || 1));
  }, [page]);

  return (
    <div className="flex w-full justify-center">
      <div className="flex">
        <NavButton
          onClick={() => {
            handlePageChange(-2);
          }}
        >
          <ArrowLeft />
        </NavButton>

        {pageOpts &&
          pageOpts.map((value) => {
            if ((pageMax && value > pageMax) || value < 1) return null;
            return (
              <NavButton
                currentPage={currentPage}
                value={value}
                key={value}
                onClick={() => {
                  paginateTo(value);
                  setCurrentPage(value);
                }}
              >
                <p>{value}</p>
              </NavButton>
            );
          })}

        <NavButton
          onClick={() => {
            handlePageChange(2);
          }}
        >
          <ArrowRight />
        </NavButton>
      </div>
    </div>
  );
}

function changePage(page: number, pageMax: number) {
  const arr = [];
  for (let i = 0; i < 3; i++) {
    if (page + i <= pageMax) {
      arr.push(page + i);
    }
  }
  return arr;
}

function ArrowLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5L8.25 12l7.5-7.5"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
      />
    </svg>
  );
}

function NavButton({
  children,
  onClick,
  currentPage,
  value,
}: {
  children: React.ReactNode;
  onClick: () => void;
  currentPage?: number;
  value?: number;
}) {
  return (
    <button
      className={`mx-1 flex h-8 w-8 items-center justify-center rounded-lg dark:text-black ${
        currentPage && currentPage === value
          ? "bg-bg200 dark:bg-bg300"
          : "bg-bg300 dark:bg-white"
      } `}
      onClick={() => {
        onClick();
      }}
    >
      {children}
    </button>
  );
}
