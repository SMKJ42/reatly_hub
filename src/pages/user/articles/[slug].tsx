import { type ReactElement, useState, useEffect } from "react";
import UserLayout from "../../../components/layouts/UserLayout";
import { api } from "~/utils/api";
import { StandardLoadingSpinner } from "~/components/shared/StandardLoadingSpinner";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { serverHelperWithContext } from "~/lib/serverHelperWithContext";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const helpers = await serverHelperWithContext(context);

  const query = context.query;
  /*
   * Prefetching the `post.byId` query.
   * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
   */
  await helpers.articles.getArticleById.prefetch({
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
  const { query } = props;
  const slug = query?.slug as string;

  console.log(slug);

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
    <article className="prose dark:prose-invert lg:prose-xl">
      <h1 id={`title-${articleData.title}`}>{articleData.title}</h1>
      <p>Views: {articleData.viewCount}</p>
      <div
        className={`article-${slug}`}
        dangerouslySetInnerHTML={article ? { __html: article } : undefined}
      ></div>
    </article>
  );
};

Articles.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default Articles;
