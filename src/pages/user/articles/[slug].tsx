import { type ReactElement, useState, useEffect } from "react";
import UserLayout from "../../../components/layouts/UserLayout";
import { api } from "~/utils/api";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { serverHelperWithContext } from "~/lib/serverHelperWithContext";

interface ArticleProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  preview: string;
  authorId: string;
  viewCount?: number;
  likeCount?: number;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const helpers = await serverHelperWithContext(context);

  const query = context.query;

  const queryType: null | "staged" | "published" = null;

  try {
    await helpers.articles.getArticleById.prefetch({
      articleId: query.slug as string,
    });
  } catch (error) {
    console.log(error);
  }
  try {
    await helpers.articles.getStagedArticleById.prefetch({
      articleId: query.slug as string,
    });
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      trpcState: helpers.dehydrate(),
      queryType,
      query,
    },
  };
}

const Articles = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { query } = props;
  const slug = query?.slug as string;

  const { data: articleData } = api.articles.getArticleById.useQuery(
    {
      articleId: slug,
    },
    { enabled: !!slug && props.queryType === "published" }
  );

  const { data: stagedArticleData } =
    api.articles.getStagedArticleById.useQuery(
      {
        articleId: slug,
      },
      { enabled: !!slug && props.queryType === "staged" }
    );

  return (
    <div className="flex w-full flex-col items-center">
      {articleData && <HydratedArticle {...articleData} slug={slug} />}
      {stagedArticleData && (
        <HydratedArticle {...stagedArticleData} slug={slug} />
      )}
    </div>
  );
};

function HydratedArticle(articleData: ArticleProps & { slug: string }) {
  const [article, setArticle] = useState<undefined | string>(undefined);

  const { title, content, viewCount, likeCount, slug } = articleData;

  useEffect(() => {
    if (!articleData) return;
    const _article = content;
    setArticle(_article);
  }, [articleData, content]);

  return (
    <>
      <div className="px-4 pt-8 text-center text-3xl font-bold sm:text-3xl lg:text-4xl">
        <h1 id={`title-${title}`}>{title}</h1>
      </div>
      <article className="prose w-[100vw] px-6 pt-4 dark:prose-invert lg:prose-xl">
        {/* {viewCount && <p>Views: {viewCount}</p>}
        {likeCount && <p>Likes: {likeCount}</p>} */}
        <div
          className={`article-${slug}`}
          dangerouslySetInnerHTML={article ? { __html: article } : undefined}
        ></div>
      </article>
    </>

  );
}

Articles.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default Articles;
