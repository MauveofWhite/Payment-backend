const express = require('express');
const app = express();

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
// ** TODO **
const stripe = require('stripe')('sk_test_51I3BFMI3ZT5zMzrzoXcz2Yn7pA1jppyLkYJqZFekuZrFpUAoBCmrokZwFl9s5G12A9QuePQkOJtMpIXPUSzOwZmi00WfPXwlv2');
const paypal = require('paypal-rest-sdk');

// configure paypal with the credentials you got when you created your paypal app
paypal.configure({
  'mode': 'sandbox', //sandbox or live 
  'client_id': 'YOUR_CLIENT_ID_HERE', // please provide your client id here 
  'client_secret': 'YOUR_CLIENT_SECRET_HERE' // provide your client secret here 
});

app.get('/', (req, res) => {
  res.send("Welcome to the homepage!");
});

// // stripe endpoints
// app.get('/create-checkout-session', async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     line_items: [
//       {
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: 'T-shirt',
//           },
//           unit_amount: 2000,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: 'https://localhost:3000',
//     cancel_url: 'https://example.com/cancel',
//   });

//   res.json({ id: session.id });
//   console.log('STATUS: ' + res.statusCode);
//   console.log('HEADERS: ' + JSON.stringify(res.headers));
// });

// stripe endpoints
app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://www.google.com/',
    cancel_url: 'https://www.youtube.com/',
  });

  res.json({ id: session.id });
});

// paypal payment
app.get('/create', function(req, res){
  //build PayPal payment request
  var payReq = JSON.stringify({
      'intent':'sale',
      'redirect_urls':{
          'return_url':'http://localhost:3000/process',
          'cancel_url':'http://localhost:3000/cancel'
      },
      'payer':{
          'payment_method':'paypal'
      },
      'transactions':[{
          'amount':{
              'total':'7.47',
              'currency':'USD'
          },
          'description':'This is the payment transaction description.'
      }]
  });

  paypal.payment.create(payReq, function(error, payment){
      if(error){
          console.error(error);
      } else {
          //capture HATEOAS links
          var links = {};
          payment.links.forEach(function(linkObj){
              links[linkObj.rel] = {
                  'href': linkObj.href,
                  'method': linkObj.method
              };
          })
      
          //if redirect url present, redirect user
          if (links.hasOwnProperty('approval_url')){
              res.redirect(links['approval_url'].href);
          } else {
              console.error('no redirect URI present');
          }
      }
  });
});

app.get('/process', function(req, res){
  var paymentId = req.query.paymentId;
  var payerId = { 'payer_id': req.query.PayerID };

  paypal.payment.execute(paymentId, payerId, function(error, payment){
      if(error){
          console.error(error);
      } else {
          if (payment.state == 'approved'){ 
              res.send('payment completed successfully');
          } else {
              res.send('payment not successful');
          }
      }
  });

  
});

const port = process.env.port || 8080


app.listen(port, () => console.log(`Listening on port ${port}!`));
