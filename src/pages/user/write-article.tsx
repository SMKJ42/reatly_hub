import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import UserLayout from "~/components/layouts/UserLayout";
import dynamic from "next/dynamic";

// const availableTags = [
//   "finance",
//   "pick it right",
//   "investing",
//   "saving",
//   "strategy",
//   "single family",
//   "multi family",
// ];

const ReactQuill = dynamic(
  () =>
    import("../../components/blog/ReactQuil").then(
      (element) => element.ReactQuil
    ),
  {
    ssr: false,
  }
);

const WriteArticle: NextPageWithLayout = () => {
  //value holds the content of the editor in HTML format
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex justify-center pb-4 pt-8">
          <input
            type="text"
            placeholder="Title"
            required
            className="w-1/2 px-1 text-xl"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <ReactQuill theme="snow" value={value} onChange={setValue} />
        <div className="flex w-full justify-center pt-4">
          <div className="flex w-1/3 justify-between">
            <button className="rounded-lg bg-bg200 px-2 py-1 text-black">
              Save
            </button>
            <button className="rounded-lg bg-bg200 px-2 py-1 text-black">
              Publish
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

WriteArticle.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default WriteArticle;
