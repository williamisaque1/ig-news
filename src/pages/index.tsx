import { GetServerSideProps, GetStaticProps } from "next";
import Head from "next/head";
import { SubscribeButton } from "../components/subscripeButton";
import { stripe } from "../services/stripe";
import styles from "./home.module.scss";
// 3 formas de fazer uma chamada api com next.js
//Client-Side
//Server-Side
//Static Site Generation
interface HomeProps {
  product: {
    pricesId: string;
    amount: number;
  };
}
export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <div style={{ fontSize: "1.3rem", display: "inline-block" }}>👏</div>{" "}
          <span> Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.pricesId} />
        </section>
        <img src="/imagens/avatar.svg" alt="Girl coding"></img>
      </main>
    </>
  );
}
export const getStaticProps: GetStaticProps = async () => {
  const prices = await stripe.prices.retrieve(
    "price_1KF4viAOSvy67ukjB1Z3Q4L1" /*,
    {
      expand: ["product"],
    }*/
  );
  console.log(prices.product);
  const product = {
    pricesId: prices.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(prices.unit_amount / 100),
  };
  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 horas
  };
};
/*
export const getServerSideProps: GetServerSideProps = async () => {
  const prices = await stripe.prices.retrieve(
    "price_1KF4viAOSvy67ukjB1Z3Q4L1" /*,
    {
      expand: ["product"],
    }
  );
  console.log(prices.product);
  const product = {
    pricesId: prices.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(prices.unit_amount / 100),
  };
  return {
    props: {
      product,
    },
  };
};
*/
