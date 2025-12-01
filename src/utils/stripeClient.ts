// utils/stripeClient.js
import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
    if (!stripePromise) {
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

        if (!publishableKey) {
            console.error('Stripe publishable key is missing. Please check your environment variables.');
            throw new Error('Stripe publishable key is not configured');
        }

        stripePromise = loadStripe(publishableKey);
    }
    return stripePromise;
};

export default getStripe;