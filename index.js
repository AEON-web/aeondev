const { error } = require('console');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join('public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/:currency/:amount', async (req, res) => {
  try {
  const {currency,amount} = req.params;
  const numamount = parseFloat(amount);

  if(isNaN(numamount) || numamount <= 0){
    return res.status(400).json({error: 'provide valid number for amount'});
  }
  console.log(`Calculating ${numamount} units of base currency :${currency}`);
  console.log(currency);
  const options = {method: 'GET'};

  const API_KEY = process.env.ABSTRACT_API_KEY || '58f971b4c9a043698323ad8ba3687f0c';
  const url = `https://exchange-rates.abstractapi.com/v1/live?api_key=${API_KEY}&base=${currency.toUpperCase()}&target=EUR,AUD,GBP,CAD,JPY,CHF,INR,CNY,SGD`;

  const response = await fetch(url, {method: 'GET'});
  if (!response.ok){
    throw new Error(`API responded with status: ${response.status}`);
  }
  const data = await response.json(); 

  if (data.exchange_rates){
    for (let targetCurrency in data.exchange_rates){

      data.exchange_rates[targetCurrency] = data.exchange_rates[targetCurrency] * numamount;
    }
    data.amount = numamount
  }

  //console.log(data);
  res.json(data);
  }

  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching exchange rates.' });
  }
});

app.listen(PORT, () => {
    console.log(`Aeon Exchange Rates is running on http://localhost:${PORT}`);
});