import { type ReactElement, useState, useEffect } from "react";
import UserLayout from "~/components/layouts/UserLayout";
import { api } from "~/utils/api";
import { StandardLoadingSpinner } from "~/components/shared/StandardLoadingSpinner";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { serverHelperWithContext } from "~/lib/serverHelperWithContext";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { adminPriveledges } from "~/lib/priviledges";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const helpers = await serverHelperWithContext(context);
  const query = context.query;
  /*
   * Prefetching the `post.byId` query.
   * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
   */
  await helpers.articles.getStagedArticleById.prefetch({
    articleId: query.slug as string,
  });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      query,
    },
  };
}

const Articles = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const userStatus = useUser();
  const router = useRouter();
  const { query } = props;
  const slug = query?.slug as string;

  const { mutate: publish } = api.author.acceptPublishRequest.useMutation({
    onSuccess: (opts) => {
      void router.push(`/articles/${slug}}`);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: deny } = api.author.denyPublishRequest.useMutation({
    onSuccess: (opts) => {
      void router.push("/admin/review-articles");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { data: articleData, isLoading } =
    api.articles.getStagedArticleById.useQuery(
      {
        articleId: slug,
      },
      { enabled: !!slug }
    );

  const [article, setArticle] = useState<undefined | string>(undefined);

  useEffect(() => {
    if (!articleData) return;
    const _article = articleData?.content;
    setArticle(_article);
  }, [articleData]);

  if (isLoading) return <StandardLoadingSpinner />;

  if (!articleData) return <div>Article not found</div>;

  return (
    <div className="flex w-full flex-col items-center">
      <div className="px-4 pt-8 text-center text-3xl font-bold sm:text-3xl lg:text-4xl">
        <h1 id={`title-${articleData.title}`}>{articleData.title}</h1>
      </div>
      <article className="prose w-[100vw] px-6 pt-4 dark:prose-invert lg:prose-xl">
        {/* <p>Views: {articleData.viewCount}</p> */}
        <div
          className={`article-${slug}`}
          dangerouslySetInnerHTML={article ? { __html: article } : undefined}
        ></div>
      </article>
      <div>
        {adminPriveledges.includes(
          userStatus.user?.publicMetadata?.role as string
        ) && (
          <>
            <button
              className="mb-8 mr-8 rounded-lg bg-white px-4 py-1 text-black"
              onClick={() => {
                publish({ articleId: slug });
              }}
            >
              Publish
            </button>
            <button
              className="mb-8 rounded-lg bg-white px-4 py-1 text-black"
              onClick={() => {
                deny({ articleId: slug });
              }}
            >
              Deny
            </button>
          </>
        )}
        <button
          onClick={() => {
            void router.back();
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
};

Articles.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default Articles;
