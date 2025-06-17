const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

async function extrair() {
    let browser = null;
    let resultado = 'Extração pendente';

    try {
        const executablePath = await chromium.executablePath;
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: executablePath || '/usr/bin/chromium-browser',
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0');

        await page.goto('https://auth.conectcar.com/auth/realms/Atacado/protocol/openid-connect/auth?client_id=portal-atacado-web&scope=openid%20email%20profile&response_type=code&redirect_uri=https%3A%2F%2Fcliente-frotas.conectcar.com%2Fapi%2Fauth%2Fcallback%2Fkeycloak&state=BYXLl_zClxVuXNnJtIap-hG9RMazGyC3Jb85z-_sWWk&code_challenge=cO4VVOMDg1QOztW3sFM_S3Qm2VHXIrKrHfk6OCVG0qI&code_challenge_method=S256', {
            waitUntil: 'networkidle2'
        });

        await page.type('input[name="username"]', 'paulo@dachery.com.br');
        await page.type('input[name="password"]', 'Dachery@123');

        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);

        await page.goto('https://cliente-frotas.conectcar.com/home', { waitUntil: 'networkidle2' });
        await page.waitForSelector('.font-bold.text-blue-4', { timeout: 15000 });
        resultado = await page.$eval('.font-bold.text-blue-4', el => el.textContent.trim());

    } catch (err) {
        console.error('Erro ao extrair:', err);
        resultado = 'Erro na extração: ' + err.message;
    } finally {
        if (browser !== null) await browser.close();
    }

    return resultado;
}

module.exports = async (req, res) => {
    const dado = await extrair();
    res.status(200).json({ dado });
};

extrair()