import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

console.log("Stripe type:", typeof stripe);
console.log("Checkout:", stripe.checkout);
console.log("Sessions:", stripe.checkout?.sessions);

export default stripe