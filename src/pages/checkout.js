import Image from "next/image";
import { Header } from "../components/header";
import { useSelector } from "react-redux";
import { selectItems, selectTotal } from "../slices/basketSlice";
import CheckoutProduct from "../components/CheckoutProduct";
import { useSession } from "next-auth/client";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(process.env.stripe_public_key);

const Checkout = () => {
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const [session] = useSession();

  const createCheckoutSesison = async () => {
    const stripe = await stripePromise;

    //Call the backend to create a checkout session
    const checkoutSession = await axios.post("/api/create-checkout-session", {
      items,
      email: session.user.email,
    });
    //Redirect customer to the checkout
    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });
    if (result.error) alert(result.error.message);
  };

  return (
    <div className="bg-gray-100">
      <Header />

      <main className="lg:flex max-w-screen-2xl mx-auto">
        {/* LHS: CART ITEMS */}
        <div className="flex-grow shadow-sm m-5">
          <Image
            src="https://links.papareact.com/ikj"
            width={1020}
            height={250}
            objectFit="contain"
          />
          <div className="flex flex-col space-y-5 bg-white p-5">
            <h1 className="text-3xl border-b pb-4">
              {!items.length
                ? "Your shopping basket is empty"
                : "Shopping Basket"}
            </h1>
            {items.map((item, index) => {
              return <CheckoutProduct key={item.id} {...item} />;
            })}
          </div>
        </div>
        {/* RHS: CheckOut SECTION */}
        <div className="flex flex-col p-10 bg-white">
          {items.length > 0 ? (
            <>
              <h2 className="whitespace-nowrap">
                Subtotal ({items.length} items):
                <span className="font-bold"> {total}</span>
              </h2>
            </>
          ) : null}
          <div>
            <button
              onClick={createCheckoutSesison}
              role="link"
              disabled={!session}
              className={`button mt-2 ${
                !session &&
                "from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed"
              }`}
            >
              {!session ? "Sign in to checkout" : "Proceed to checkout"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
