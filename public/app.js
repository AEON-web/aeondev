const btn = document.getElementById('btn');
const result = document.getElementById('result');

btn.addEventListener('click', handleclick);

async function handleclick() {

    const input = document.getElementById('currency-input');
    const currencyselect = document.getElementById('currency-select')
    const amount = input.value.trim();
    const basecurrency = currencyselect.value
    console.log(amount);

    if (!amount || isNaN(amount)) {
        alert('Enter A Valid Amount');
        return;
    }

    const url = `http://localhost:3000/api/${basecurrency}/${amount}`;
    try {
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data)
    
     if (!data.exchange_rates) {
            result.innerHTML = '<p>No exchange data found.</p>';
            return;
        }


// data.exchange_rates.forEach(rate => {
//     const currency = document.createElement('p');
//     currency.textContent = `${rate}: ${rate.rate}`;
//     result.appendChild(currency);
// });
for(let key in data.exchange_rates){
    const currency = document.createElement('p');
    currency.textContent = `${key}: ${data.exchange_rates[key]}`;
    result.appendChild(currency);
}

     //result.innerHTML = `<p>Exchange Rate: ${data.exchange_rates.EUR}</p>`;
    // result.innerHTML =`<table class="table">
    //     <tr>
    //         <th>
    //             <span class="cur">Currency</span>
    //             <span class="rate">Exchange Rate</span>
            
    //         <td class="EU">EUR</td>
    //         <td>${data.exchange_rates.EUR}</td>

    //         <td>AUD</td>
    //         <td>${data.exchange_rates.AUD}</td>

    //         <td>CAD</td>
    //         <td>${data.exchange_rates.CAD}</td>
    //     </th>
    // </table>`;

     result.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Currency</th>
                         <th style="margin-left: 20px;"> Converted Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="EU">EUR</td>
                        <td>${data.exchange_rates.EUR ? data.exchange_rates.EUR.toFixed(2) : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>AUD</td>
                        <td>${data.exchange_rates.AUD ? data.exchange_rates.AUD.toFixed(2) : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>CAD</td>
                        <td>${data.exchange_rates.CAD ? data.exchange_rates.CAD.toFixed(2) : 'N/A'}</td>
                    </tr>
                </tbody>
            </table>
        `;
    }catch(error){
        console.error(error.message)
        result.innerHTML = '<p>Error fetching exchange rate.</p>';
    }
}

