import express from 'express';
import cors from 'cors';
import pg from 'pg'
const pool = new pg.Pool({
    host: 'dpg-cljq7518mmjc73dbb770-a.oregon-postgres.render.com',
    port: 5432,
    database: 'phonedb',
    user: 'phonedb_user',
    password: 'WMUxepEltg8kfNNAbM5WK1m7kVWWzIaI',
    ssl: {
        rejectUnauthorized: false
    }
});

import { scrapeAmazon, scrapeBestBuy } from './scrape.js';
const amazonURLArr = 
['https://www.amazon.com/Apple-iPhone-15-128GB-Black/dp/B0CMPMY9ZZ/ref=sr_1_2?crid=DO1RLUTNMN6Z&keywords=iphone+15+128gb&qid=1701483501&sprefix=iphone+15+128gb%2Caps%2C129&sr=8-2', 
'https://www.amazon.com/Apple-iPhone-Plus-128GB-Black/dp/B0CN7F4B5Q/ref=sr_1_3?crid=2R4ZQEULR5NEX&keywords=iphone+15+plus+128gb&qid=1701483530&sprefix=iphone+15+plus+128gb%2Caps%2C136&sr=8-3',
'https://www.amazon.com/Apple-iPhone-128GB-Natural-Titanium/dp/B0CMZG4M6H/ref=sr_1_3?crid=210E9CK0QYXV3&keywords=iphone+15+pro+128gb&qid=1701483553&sprefix=iphone+15+pro+128gb%2Caps%2C145&sr=8-3',
'https://www.amazon.com/Apple-iPhone-256GB-Natural-Titanium/dp/B0CMZD7VCV/ref=sr_1_1?crid=78YKTF467DLN&keywords=iphone+15+pro+max&qid=1701483583&sprefix=iphone+15+pro+max%2Caps%2C149&sr=8-1',
'https://www.amazon.com/Apple-iPhone-14-128GB-Midnight/dp/B0BYL93774/ref=sr_1_2?crid=3NETDLD7T7VAE&keywords=iphone+14+128gb+boost&qid=1701482552&sprefix=iphone+1+128gb+boost%2Caps%2C150&sr=8-2',
'https://www.amazon.com/Apple-iPhone-14-Plus-Midnight/dp/B0BYH9S5MT/ref=sr_1_3?crid=36J60LQ7HV2DG&keywords=iphone+14+plus+128gb+boost&qid=1701482577&sprefix=iphone+14+plus128gb+boost%2Caps%2C131&sr=8-3',
'https://www.amazon.com/SAMSUNG-Factory-Unlocked-Smartphone-Adaptive/dp/B0BLP2PY6N/ref=sr_1_3?crid=2HVALILXLH0MA&keywords=galaxy+s23&qid=1701484200&sprefix=galaxy+s2%2Caps%2C179&sr=8-3',
'https://www.amazon.com/SAMSUNG-Factory-Unlocked-Smartphone-Adaptive/dp/B0BLP4J9RR/ref=sr_1_2?crid=1ZY9NESOLQ163&keywords=galaxy+s23+plus&qid=1701484231&sprefix=galaxy+s23+plu%2Caps%2C144&sr=8-2',
'https://www.amazon.com/SAMSUNG-Factory-Unlocked-Android-Smartphone/dp/B0BLP45GY8/ref=sr_1_3?crid=1872S7S994AAK&keywords=galaxy+s23+ultra&qid=1701484242&sprefix=galaxy+s23+ult%2Caps%2C161&sr=8-3',
'https://www.amazon.com/SAMSUNG-Unlocked-Smartphone-Processor-Graphite/dp/B0CD9645MM/ref=sr_1_3?crid=1PEVI7CKBWHDN&keywords=galaxy+s23+fe&qid=1701484256&sprefix=galaxy+s23+f%2Caps%2C169&sr=8-3',
'https://www.amazon.com/Apple-iPhone-Pro-128GB-Gold/dp/B0BYLTKTY5/ref=sr_1_4?crid=UYTH1J4GOVSS&keywords=iphone+14+pro+128gb+boost&qid=1701482597&sprefix=iphone+14+pro+128gb+boost%2Caps%2C136&sr=8-4',
'https://www.amazon.com/Apple-iPhone-14-Pro-Max/dp/B0BN94DL3R/ref=sr_1_3?crid=SAX5GTT752P1&keywords=iphone+14+pro+max+128gb+boost&qid=1701482616&sprefix=iphone+14+pro+max+128gb+boost%2Caps%2C142&sr=8-3',
'https://www.amazon.com/SAMSUNG-Smartphone-Unlocked-Brightest-Processor/dp/B09MVZLWKJ/ref=sr_1_3?crid=SDKPVSNFLNLZ&keywords=galaxy+s22&qid=1701484841&sprefix=galaxy+s22%2Caps%2C182&sr=8-3',
'https://www.amazon.com/Samsung-Smartphone-Unlocked-Brightest-Processor/dp/B09VH9BKHS/ref=sr_1_2?crid=O8LPELTUOKOG&keywords=galaxy+s22%2B&qid=1701484867&sprefix=galaxy+s22%2B%2Caps%2C149&sr=8-2',
'https://www.amazon.com/SAMSUNG-Smartphone-Unlocked-Brightest-Processor/dp/B09MW17JQY/ref=sr_1_2?crid=1O05BV2YMJAGC&keywords=galaxy+s22+ultra&qid=1701484883&sprefix=galaxy+s22+ultr%2Caps%2C151&sr=8-2'];
const bestBuyURLArr = 
['https://www.bestbuy.com/site/apple-iphone-15-128gb-black-verizon/6418070.p?skuId=6418070',
'https://www.bestbuy.com/site/apple-iphone-15-plus-128gb-black-at-t/6525386.p?skuId=6525386',
'https://www.bestbuy.com/site/apple-iphone-15-pro-128gb-natural-titanium-at-t/6525406.p?skuId=6525406',
'https://www.bestbuy.com/site/apple-iphone-15-pro-max-256gb-blue-titanium-at-t/6525424.p?skuId=6525424',
'https://www.bestbuy.com/site/apple-iphone-14-128gb-unlocked-midnight/6507555.p?skuId=6507555',
'https://www.bestbuy.com/site/apple-iphone-14-plus-128gb-unlocked-midnight/6507549.p?skuId=6507549',
'https://www.bestbuy.com/site/samsung-galaxy-s23-128gb-unlocked-lavender/6529688.p?skuId=6529688',
'https://www.bestbuy.com/site/samsung-galaxy-s23-256gb-unlocked-phantom-black/6529715.p?skuId=6529715',
'https://www.bestbuy.com/site/samsung-galaxy-s23-ultra-256gb-unlocked-phantom-black/6529723.p?skuId=6529723',
'https://www.bestbuy.com/site/samsung-galaxy-s23-fe-128gb-unlocked-graphite/6561223.p?skuId=6561223',
'https://www.bestbuy.com/site/apple-iphone-14-pro-256gb-deep-purple-verizon/6487394.p?skuId=6487394',
'https://www.bestbuy.com/site/apple-iphone-14-pro-max-256gb-space-black-verizon/6487407.p?skuId=6487407',
'https://www.bestbuy.com/site/samsung-galaxy-s22-128gb-phantom-black-verizon/6494464.p?skuId=6494464',
'https://www.bestbuy.com/site/samsung-galaxy-s22-128gb-unlocked-phantom-black/6494432.p?skuId=6494432',
'https://www.bestbuy.com/site/samsung-galaxy-s22-ultra-128gb-phantom-black-verizon/6494471.p?skuId=6494471'];

const app = express();

app.use(cors());

app.listen(1121, () => {
    console.log("Listening on port 1121.");
});

app.get('/phone/:id', async (req, res) => {
    try {
        const client = await pool.connect()
        const result = await client.query(`SELECT * FROM mobilephone WHERE phone_id = ${req.params.id};`);
        res.send(result.rows);
        console.log(result.rows);
        client.release();
    } catch (err) {
        console.log(err);
    }
});

app.get('/phone/:id/price', async (req, res) => {
    try {
        const client = await pool.connect()
        const result = await client.query(`SELECT name, price FROM retailer JOIN retrieveprice ON retailer.retailer_id = retrieveprice.retailer_id WHERE phone_id = ${req.params.id};`);
        res.send(result.rows);
        console.log(result.rows);
        client.release();
    } catch (err) {
        console.log(err);
    }
});

app.get('/update', async (req, res) => {
    res.send("Web Scrape Refresh");
    for(let i = 0; i < amazonURLArr.length; i++) {
        try {
            let price = (await scrapeAmazon(amazonURLArr[i])).replace(/[^0-9.]/g, "");
            price = parseFloat(price);

            if(price < 100) {
                price = (price * 36).toFixed(2);
            }
            console.log(price);

            const client = await pool.connect()
            const result = await client.query(`UPDATE retrieveprice SET price = ${price} WHERE phone_id = ${i + 1} AND retailer_id = 1;`);
            // console.log(result);
            client.release();
        } catch (err) {
            console.log(err);
        }
    }

    for (let i = 0; i < bestBuyURLArr.length; i++) {
        try {
            let price = (await scrapeBestBuy(bestBuyURLArr[i])).replace(/[^0-9.]/g, "");
            price = parseFloat(price);

            if(price < 100) {
                price = (price * 36).toFixed(2);
            }
            console.log(price);

            const client = await pool.connect()
            const result = await client.query(`UPDATE retrieveprice SET price = ${price} WHERE phone_id = ${i + 1} AND retailer_id = 2;`);
            // console.log(result);
            client.release();
        } catch (err) {
            console.log(err);
        }
    }

    // console.log(await scrapeAmazon('https://www.amazon.com/dp/B09V3JJT5D/ref=fs_a_ipt2_us2'));
    // console.log(await scrapeBestBuy('https://www.bestbuy.com/site/apple-iphone-14-128gb-unlocked-midnight/6507555.p?skuId=6507555'));

    // res.send("Update Complete!");
});