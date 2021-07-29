import { buffer } from "micro";
import * as admin from "firebase-admin";

// Secure a connection firebase from the backend
const serviceAccount = require("../../../permissions.json"); //got this file from online firebase service accounts
const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();

// Establish connection to stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//from stripe listen --forward-to localhost:3000/api/webhook, it can change
const webhookSecret = process.env.STRIPE_SIGNING_SECRET;

//adding to db after verifying stripe checkout session
const fulfillOrder = async (session) => {
  // console.log("Fulfilling order", session)
  return app
    .firestore()
    .collection("users")
    .doc(session.metadata.email)
    .collection("orders")
    .doc(session.id)
    .set({
      amount: session.amount_total / 100,
      amount_shipping: session.total_details.amount_shipping / 100,
      images: JSON.parse(session.metadata.images),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log(`SUCCESS: Order ${session.id} has been added to the DB`);
    });
};

export default async (req, res) => {
  if (req.method === "POST") {
    const requestBuffer = await buffer(req); // need to accept as info of buffer
    const payload = requestBuffer.toString();
    const sig = req.headers["stripe-signature"];

    let event;

    // verify the event posted came from stripe
    try {
      event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    } catch (error) {
      console.log(error.message);
      return res.status(400).send(`Webhook error: ${error.message}`);
    }

    //handle the checkout session completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Fulfill the order.....
      return fulfillOrder(session)
        .then(() => res.status(200))
        .catch((error) =>
          res.status(400).send(`Webhook Error: ${error.message}`)
        );
    }
  }
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true, //stripe is the external resolver
  },
};
