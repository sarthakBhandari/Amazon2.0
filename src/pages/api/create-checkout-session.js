const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const { items, email } = req.body;
  //   console.log(items);
  //   console.log(email);
  //converting the data for stripe configuration
  const transformedItems = items.map((item) => ({
    quantity: 1,
    description: item.description,
    price_data: {
      currency: "gbp",
      unit_amount: item.price * 100,
      product_data: {
        name: item.title,
        images: [item.image],
      },
    },
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: transformedItems,
    shipping_rates: ["shr_1JIEjOCvT2ZX0tQvJC4gDskK"],
    shipping_address_collection: {
      allowed_countries: ["GB", "US", "CA"],
    },
    mode: "payment",
    success_url: `${process.env.HOST}/success`, //redirect link if successfull
    cancel_url: `${process.env.HOST}/checkout`, //redirect link if unsuccessfull
    metadata: {
      //this will be used when savind data to firebase db
      email,
      images: JSON.stringify(items.map((item) => item.image)),
    },
  });

  res.status(200).json({ id: session.id }); //sending back the session id
};
