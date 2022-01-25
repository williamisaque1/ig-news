import { signIn, useSession } from "next-auth/react";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";
interface SubscribeButtonProps {
  priceId: string;
}
//lugares onde podem utilizar key_secret
// getServerSideProps(SSR)
// getStaticProps(SSG)
//API routes
export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { status: session } = useSession();
  async function handleSubscripe() {
    if (!session) {
      signIn("github");
      return;
    }
    try {
      const response = await api.post("/subscribe");
      const { sessionId } = response.data;
      const stripe = await getStripeJs();
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
    }
  }
  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscripe}
    >
      Subscribe now
    </button>
  );
}
