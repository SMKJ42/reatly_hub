import Link from "next/link";

export function AccountArticleSection() {

  return (
    <>
      <h1 className="w-full text-center text-lg">Articles</h1>
      <div className="flex w-full justify-around">
        <Link href="/user/articles/write-article">Create</Link>
        <Link href="/user/articles/write-article">Review</Link>
      </div>
      <h2>Resume work...</h2>
    </>
  );
}
