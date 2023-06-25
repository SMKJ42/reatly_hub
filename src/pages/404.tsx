import type { ReactElement } from "react";
import PublicLayout from "../components/layouts/PublicLayout";
import type { NextPageWithLayout } from "./_app";

const PageNotFound = () => {
  //TODO: this needs styling
  return (
    <div>
      <h1 className=""> Error: 404 </h1>
      <p>Whoops, looks like this page does not exist!</p>
    </div>
  );
};

export default PageNotFound;
