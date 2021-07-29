import Header from "../components/header";
import { useSession, getSession } from "next-auth/client";
import db from "../../firebase";
import moment from "moment";
import Order from "../components/Order";

const Orders = ({ orders }) => {
  const [session] = useSession(); //only for client side

  return (
    <div>
      <Header />
      <main className="max-w-screen-lg mx-auto p-10">
        <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">
          Your Orders
        </h1>

        {session ? (
          <h2>{orders.length} Orders</h2>
        ) : (
          <h2>Please sign in to see your orders</h2>
        )}

        <div className="mt-5 space-y-4">
          {orders?.map((order) => {
            return <Order key={order.id} {...order} />;
          })}
        </div>
      </main>
    </div>
  );
};
export default Orders;

// getting the data from both the db and the stripe checkout session
export async function getServerSideProps(context) {
  const session = await getSession(context); //for both client and server side

  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  //get the users logged in credentials
  if (!session) {
    return {
      props: {},
    };
  }

  //Firebase db
  const stripeOrders = await db
    .collection("users")
    .doc(session.user.email)
    .collection("orders")
    .orderBy("timestamp", "desc")
    .get();

  //Stripe orders
  const orders = await Promise.all(
    stripeOrders.docs.map(async (order) => ({
      //implicit return
      //   we added these details into the db in the webhook
      id: order.id,
      amount: order.data().amount,
      amountShipping: order.data().amount_shipping,
      images: order.data().images,
      timestamp: moment(order.data().timestamp.toDate()).unix(), //u have to convert timestamp to unix when getting from client
      items: (
        await stripe.checkout.sessions.listLineItems(order.id, {
          limit: 100,
        })
      ).data,
    }))
  );

  return {
    props: {
      orders,
    },
  };
}
