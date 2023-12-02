import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';

dotenv.config();

const scrapeAmazon = async url => {
    try {
        const res = await axios.get(url);
        const $ = cheerio.load(res.data);

        // const title = $('#productTitle').text().trim();
        const price = $('span.a-price > span.a-offscreen').first().text().trim();

        // console.log(`Title: ${title}`);
        // console.log(`Price: ${price}`);

        return price;
    } catch (err) {
        throw err;
    }
}

const scrapeBestBuy = async url => {
    try {
        const browser = await puppeteer.launch({
            args: [
                "--disable-setuid-sandbox",
                "--no-sandbox",
                "--single-process",
                "--no-zygote"
            ],
            executablePath: process.env.NODE_ENV = 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath()
        });

        const page = await browser.newPage();

        await page.goto(url, {
            waitUntil: "domcontentloaded",
        });

        const price = await page.evaluate(() => {
            const priceDiv = document.querySelector("div.priceView-hero-price");
            const price = priceDiv.querySelector("span").innerText;

            return price;
        });

        await browser.close();
        
        return price;
    } catch (err) {
        throw err;
    }
}

export {
    scrapeAmazon,
    scrapeBestBuy
}

// scrapeAmazon('https://www.amazon.com/dp/B09V3JJT5D/ref=fs_a_ipt2_us2');
// scrapeBestBuy('https://www.bestbuy.com/site/apple-iphone-14-128gb-unlocked-midnight/6507555.p?skuId=6507555');