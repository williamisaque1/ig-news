import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";
async function buffer(readable: Readable) {
  const chucks = [];
  for await (const chunk of readable) {
    chucks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chucks);
}
export const config = {
  api: {
    bodyParser: false,
  },
};
const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const secret = req.headers["stripe-signature"];
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send("webhook error: " + err.message);
    }
    const { type } = event;
    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case "customer.subscription.created":
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            const subscriptions = event.data.object as Stripe.Subscription;
            console.log("deletado", event.data.object);
            await saveSubscription(
              subscriptions.id,
              subscriptions.customer.toString(),
              type === "customer.subscription.created"
            );
          case "checkout.session.completed":
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;
            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            );
            break;
          default:
            throw new Error("unhandled event.");
        }
      } catch (err) {
        return res.json({ error: "webhook handle fail" });
      }
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST"); // METODÓ TEM QUE SER POST
    res.status(405).end("método não permitido"); // 405 É O MÉTODO NÃO PERMITIDO
  }
};
