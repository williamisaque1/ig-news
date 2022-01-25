import { query } from "faunadb";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string
) {
  console.log(
    "iniciooooo ----------------" + subscriptionId + " | " + customerId
  );
  const useRef = await fauna.query(
    query.Select(
      "ref",
      query.Get(
        query.Match(query.Index("user_by_stripe_customer_id"), customerId)
      )
    )
  );
  console.log("parte 1 ");
  console.log("siume", useRef);
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  console.log("subscription", subscription);
  const subscriptionData = {
    id: subscription.id,
    userId: useRef,
    status: subscription.status,
    prices_id: subscription.items.data[0].price.id,
  };
  console.log("dados", subscriptionData);
  await fauna.query(
    query.Create(query.Collection("subscriptions"), {
      data: subscriptionData,
    })
  );
}

//Buscar o usuario no banco com o id (customer_id)
//Salvar os dados da subscription no FaunaDB
