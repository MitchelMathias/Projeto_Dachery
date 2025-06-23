const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
    let browser = null;

    try {
        console.log('Iniciando browser...');
        browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();

        console.log('Acessando página...');
        await page.goto('https://www.google.com', { waitUntil: 'load', timeout: 10000 });

        const title = await page.title();
        await browser.close();

        res.status(200).json({ sucesso: true, titulo: title });
    } catch (err) {
        if (browser) await browser.close();
        console.error('Erro:', err.stack);
        res.status(500).json({ sucesso: false, mensagem: err.message, erro: err.stack });
    }
};
