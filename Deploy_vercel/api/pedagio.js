const puppeteer = require('puppeteer');

let dado = 'Extração pendente';

async function extrair() {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0');

        console.log('Acessando página de login...');
        await page.goto('https://auth.conectcar.com/auth/realms/Atacado/protocol/openid-connect/auth?client_id=portal-atacado-web&scope=openid%20email%20profile&response_type=code&redirect_uri=https%3A%2F%2Fcliente-frotas.conectcar.com%2Fapi%2Fauth%2Fcallback%2Fkeycloak&state=BYXLl_zClxVuXNnJtIap-hG9RMazGyC3Jb85z-_sWWk&code_challenge=cO4VVOMDg1QOztW3sFM_S3Qm2VHXIrKrHfk6OCVG0qI&code_challenge_method=S256', { waitUntil: 'networkidle2' });

        console.log('Preenchendo login...');
        await page.type('input[name="username"]', 'paulo@dachery.com.br');
        await page.type('input[name="password"]', 'Dachery@123');

        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);

        console.log('Indo para o dashboard...');
        await page.goto('https://cliente-frotas.conectcar.com/home', { waitUntil: 'networkidle2' });

        console.log('Aguardando seletor...');
        await page.waitForSelector('.font-bold.text-blue-4', { timeout: 10000 });

        dado = await page.$eval('.font-bold.text-blue-4', el => el.textContent.trim());

        console.log('Extração concluída:', dado);
    } catch (erro) {
        console.error('Erro ao extrair:', erro);
        dado = 'Erro na extração';
    } finally {
        if (browser) await browser.close();
    }
}


module.exports = async (req, res) => {
    if (!dado || dado === 'Extração pendente') {
        await extrair();
    }
    res.status(200).json({ dado });
}
