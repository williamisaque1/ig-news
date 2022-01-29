import { GetStaticProps } from "next";
import Head from "next/head";
import { getPrismicClient } from "../../services/prismic";
import styles from "./styles.module.scss";
import * as prismicH from "@prismicio/helpers";
interface conteudos {
  title: { type: string; text: string; span?: [] };
  content: [{ type: string; text: string; span?: [] }];
}
type post = {
  slug: string;
  title: string;
  excerpt: string;
  updateAt: string;
};
interface postsProps {
  posts: post[];
}

export default function Posts({ posts }: postsProps) {
  return (
    <>
      <Head>
        <title>Posts | ignews</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <a key={post.slug} href="#">
              <time>{post.updateAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}
export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient().client;
  // const prismicPredicate = getPrismicClient().predicate;
  const response = await prismic.getAllByType(
    "publication",

    {
      fetch: ["publication.title", "publication.content"],
      pageSize: 100,
    }
  );
  /*
  const responsea = await prismic.query(
    [prismicPredicate.at("document.type", "publication")],

    {
      fetch: ["publication.title", "publication.content"],
      pageSize: 100,
    }
  );
  */
  // console.log("respotassss", JSON.stringify(response, null, 2));

  const posts = response.map((post) => {
    //console.log(JSON.stringify(post, null, 2));
    let aux = post.data as any as conteudos;

    // console.log("jhjj", aux.content[0].text);
    return {
      slug: post.uid,
      title: prismicH.asText(aux.title[0]),
      excerpt: aux.content[0].text,
      updateAt: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        { day: "2-digit", month: "long", year: "numeric" }
      ),
    };
  });
  //console.log("respotassss", JSON.stringify(response, null, 2));
  //const results = await client.getAllByType('blog_post')

  return {
    props: { posts },
  };
};
