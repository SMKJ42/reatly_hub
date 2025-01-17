import { type ReactElement, useEffect } from "react";
import type { NextPageWithLayout } from "../../_app";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import UserLayout from "~/components/layouts/UserLayout";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const ReactQuill = dynamic(
  () =>
    import("~/components/articles/ReactQuil").then(
      (element) => element.ReactQuil
    ),
  {
    ssr: false,
  }
);

const WriteArticle: NextPageWithLayout = () => {
  const router = useRouter();
  const articleId = router.query.slug as string;

  const { data: article, isLoading } =
    api.articles.getStagedArticleById.useQuery(
      {
        articleId: articleId,
      },
      { enabled: !!articleId }
    );

  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!article) return;
    setValue(article.content);
    setTitle(article.title);
  }, [article]);

  const { mutate: create, isLoading: isSaving } =
    api.author.stageArticle.useMutation({
      onSuccess: (opts) => {
        console.log("success");
      },
      onError: (error) => {
        console.log(error);
      },
    });

  return (
    <>
      <form
        onSubmit={(e) => {
          console.log(e);
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="flex justify-center pb-4 pt-8">
          <input
            type="text"
            placeholder="Title"
            required
            className="w-1/2 px-1 text-xl"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div className=" mx-8 ">
          <ReactQuill theme="snow" value={value} onChange={setValue} />
        </div>
        <div className="flex w-full justify-center pb-8 pt-4">
          <div className="flex w-1/3 justify-between">
            <button className="rounded-lg bg-bg200 px-2 py-1 text-black">
              Save
            </button>
            <button className="rounded-lg bg-bg200 px-2 py-1 text-black">
              Request to Publish
            </button>
            {articleId && (
              <button
                className="rounded-lg bg-bg200 px-2 py-1 text-black"
                onClick={() => {
                  // deleteArticle({ articleId: articleId });
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </form>
    </>
  );

  function handleSubmit() {
    create({
      title: title,
      content: value,
    });
    void router.push("/user/dashboard");
  }
};

WriteArticle.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default WriteArticle;
