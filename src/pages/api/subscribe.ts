import { query } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { NextRequest } from "next/server";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";
type User = {
    ref:{
        id:string,
     
    }
    data:{
        stripe_customer_id:string
    }
}
export default async(req:NextApiRequest,res:NextApiResponse) =>{
    if(req.method === "POST" ){
        const session = await getSession({req});
        //busca usuario com esse email
        const user  = await fauna.query <User>(query.Get(query.Match(query.Index("users_by_email"),query.Casefold(session.user.email)))) 
       let customerId = user.data.stripe_customer_id
       //se não tiver custom_id no banco cria um client no stripe e atualiza o banco com o custom_id
       if(!customerId){
            //cria um usuario/cliente
        const stripeCustomer = await stripe.customers.create({
            email:session.user.email,
            //metadata
        })  
        await fauna.query(
            query.Update(query.Ref(query.Collection("users"),user.ref.id) ,
            {
            data:{stripe_customer_id:stripeCustomer.id}
            })
        )
        customerId = stripeCustomer.id
       }
   
    //console.log(stripeCustomer)
const stripeCheckoutSession = await stripe.checkout.sessions.create({
    customer:customerId,
    payment_method_types:["card"], //PAGAMENTO DO TIPO CARTÃO
    billing_address_collection:"required", // ENDEREÇO É OBRIGATORIO 
    line_items:[{                       //LISTA DE ITEMS 
        price:"price_1KF4viAOSvy67ukjB1Z3Q4L1", //ID DO PRODUTO
        quantity:1                              //QUANTIDADE DO PRODUTO
    }],
    mode:"subscription",                       //PAGAMENTO RECORENTE
    allow_promotion_codes:true,               //ACEITA CUPOM DE DESCONTO
    success_url:process.env.STRIPE_SUCCESS_URL,    //SE FOR SUCESSO IR PARA
    cancel_url:process.env.STRIPE_CANCEL_URL     //SE NÃO IR PARA 
})
return res.status(200).json({sessionId:stripeCheckoutSession.id})
    }else{
        res.setHeader("Allow","POST");   // METODÓ TEM QUE SER POST
        res.status(405).end("método não permitido")  // 405 É O MÉTODO NÃO PERMITIDO
    }

}