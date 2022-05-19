const express = require('express');
const app = express();
const { resolve } = require('path');
require('dotenv').config({ path: './.env' });

app.use(express.json());

checkEnv();

const stripe = require('stripe')('sk_test_51JyTdRjJdZS5U8YbLx84cZCUZekZ1AOmWqbmbVDZB1o8RUrP5mvKa1P2JNhef4600riYWq166');
// Use body-parser to retrieve the raw body as a buffer
const bodyParser = require('body-parser');

function checkEnv() {
    const price = process.env.PRICE;
    console.log('Price is ' + price);
    if (price === "price_12345" || !price) {
        console.log("You must set a Price ID in the environment variables. Please see the README.");
    }
}



app.post('/create-checkout-session', async(req, res) => {
    console.log('in create checkout session ');
    //  console.log(req.body);
    const domainURL = 'https://teststripeonetimepayment-698833516.development.catalystserverless.com/app';

    var quantity = req.body.data;
    console.log(JSON.stringify(quantity));

    const pmTypes = ('card').split(',').map((m) => m.trim());

    // const session = await stripe.checkout.sessions.create({
    //     payment_method_types: pmTypes,
    //     mode: 'payment',
    //     line_items: [{
    //         price: process.env.PRICE,
    //         quantity: quantity
    //     }, ],
    //     success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    //     cancel_url: `${domainURL}/canceled.html`,
    // });


    const session = await stripe.checkout.sessions.create({
        payment_method_types: pmTypes,
        mode: 'payment',
        line_items: [

            {
                name: req.body.data.item1,
                amount: req.body.data.item1price,
                currency: 'inr',
                quantity: req.body.data.item1qty
            },
            {
                name: req.body.data.item2,
                amount: req.body.data.item2price,
                currency: 'inr',
                quantity: req.body.data.item2qty
            },
            {
                name: req.body.data.item3,
                amount: req.body.data.item3price,
                currency: 'inr',
                quantity: req.body.data.item3qty
            },

            {
                name: req.body.data.item4,
                amount: req.body.data.item4price,
                currency: 'inr',
                quantity: req.body.data.item4qty
            }


        ],
        success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${domainURL}/canceled.html`,
    });


    console.log(session);
    return res.json({ url: session.url })
});


app.post('/getAllTransactions', async(req, res) => {

    const events = await stripe.events.list({
        limit: 10,
    });
    console.log(events.data);
    return res.send(events.data);
})


app.post('/getAllInvoices', async(req, res) => {

    const invoices = await stripe.invoices.list({
        limit: 10,
    });
    console.log(invoices.data);
    return res.send(invoices.data);
})

app.get('/testing', (req, res) => {
    res.send('testing get');
})


app.post('/webhook', express.json({ type: 'application/json' }), (request, response) => {
    console.log('in webhook ');
    const event = request.body;
    console.log(event);
    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(paymentIntent);
            // Then define and call a method to handle the successful payment intent.
            // handlePaymentIntentSucceeded(paymentIntent);
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            console.log(paymentMethod);

            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;

        case 'charge.succeeded':
            // const paymentMethod = event.data.object;
            console.log('charge succeeded');
            console.log(event.data.object);

            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;

        case 'charge.failed':
            // const paymentMethod = event.data.object;
            console.log('charge failed');
            console.log(event.data.object);

            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;
            // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
})

// Webhook handler for asynchronous events.
// app.post('/webhook', async(req, res) => {
//     let data;
//     let eventType;
//     // Check if webhook signing is configured.
//     if (process.env.STRIPE_WEBHOOK_SECRET) {
//         // Retrieve the event by verifying the signature using the raw body and secret.
//         let event;
//         let signature = req.headers['stripe-signature'];

//         try {
//             event = stripe.webhooks.constructEvent(
//                 req.rawBody,
//                 signature,
//                 process.env.STRIPE_WEBHOOK_SECRET
//             );
//         } catch (err) {
//             console.log(`⚠️  Webhook signature verification failed.`);
//             return res.sendStatus(400);
//         }
//         // Extract the object from the event.
//         data = event.data;
//         eventType = event.type;
//     } else {
//         // Webhook signing is recommended, but if the secret is not configured in `config.js`,
//         // retrieve the event data directly from the request body.
//         data = req.body.data;
//         eventType = req.body.type;
//     }

//     if (eventType === 'checkout.session.completed') {
//         console.log(`🔔  Payment received!`);
//     }

//     res.sendStatus(200);
// });


module.exports = app;
