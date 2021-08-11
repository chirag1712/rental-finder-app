const https = require('https');
const querystring = require('querystring');
const { Address } = require("../models/posting.model.js");

function addressAPI(city, street_name, street_num, myConsole = console) {
    return new Promise((resolve, reject) => {
        const parameters = { query: `${street_num} ${street_name}, ${city}` };
        const options = {
            hostname: 'canadapostalcode.net',
            port: 443,
            path: `/search?${querystring.stringify(parameters)}`,
            method: 'GET'
        };
        myConsole.log(`${options.method} ${options.hostname}${options.path}`);
        const req = https.request(options, res => {
            const all_chunks = [];
            res.on('data', chunk => {
                all_chunks.push(chunk);
            });
            res.on('end', () => {
                try {
                    const body = Buffer.concat(all_chunks).toString();
                    myConsole.log(
                        `RETURNED STATUS ${res.statusCode}\nHEADERS:`,
                        res.headers,
                        '\nBODY:\n',
                        body
                    );
                    resolve(JSON.parse(body).data);
                } catch (err) {
                    reject(err);
                }
            });
        }).end();
    });
}

async function getPostalCodeAPI(street_num, street_name, city, myConsole = console) {
    const data = await addressAPI(city, street_name, street_num, myConsole);
    return data[0].postal_code.replace(/ /g, '');
}

async function lookupAddress(request, response) {
    const { city, street_name, street_num } = request.params;
    try {
        const existingAddress = await Address.searchWithoutPostalCode({ city, street_name, street_num });
        if (existingAddress[0]) { // check for existing address in database
            return response.status(200).json(existingAddress[0]);
        }
        const data = await addressAPI(city, street_name, street_num);
        const addressRegex = /(\d*)\s(.*)/;
        return response.status(200).json({
            city: data[0].locality,
            postal_code: data[0].postal_code.replace(/ /g, ''),
            street_name: data[0].address.match(addressRegex)[2],
            street_num: data[0].address.match(addressRegex)[1]
        });
    } catch (err) {
        console.error(err);
        return response.status(404).json({ error: "Could not find postal code." });
    }
}

module.exports = {
    getPostalCodeAPI,
    lookupAddress
}