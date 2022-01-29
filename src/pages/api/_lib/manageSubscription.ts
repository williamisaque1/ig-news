import { query } from "faunadb";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false
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

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: useRef,
    status: subscription.status,
    prices_id: subscription.items.data[0].price.id,
  };

  if (createAction) {
    console.log("inicio da acao");
    await fauna.query(
      query.If(
        query.Not(
          query.Exists(
            query.Match(query.Index("subscription_by_id"), subscription.id)
          )
        ),
        query.Create(query.Collection("subscriptions"), {
          data: subscriptionData,
        }),
        null
      )
    );
  } else {
    await fauna.query(
      query.Replace(
        query.Select(
          "ref",
          query.Get(
            query.Match(query.Index("subscription_by_id"), subscriptionId)
          )
        ),
        { data: subscriptionData }
      )
    );
  }
}

//Buscar o usuario no banco com o id (customer_id)
//Salvar os dados da subscription no FaunaDB
