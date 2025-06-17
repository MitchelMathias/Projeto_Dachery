const puppeteer = require('puppeteer-core');

async function extrair() {
    let browser = null;
    try {
        console.log('Iniciando browser...');
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            ignoreHTTPSErrors: true,
            defaultViewport: null
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0');

        console.log('Navegando para a página de login...');
        await page.goto(
            'https://auth.conectcar.com/auth/realms/Atacado/protocol/openid-connect/auth?client_id=portal-atacado-web&scope=openid%20email%20profile&response_type=code&redirect_uri=https%3A%2F%2Fcliente-frotas.conectcar.com%2Fapi%2Fauth%2Fcallback%2Fkeycloak&state=BYXLl_zClxVuXNnJtIap-hG9RMazGyC3Jb85z-_sWWk&code_challenge=cO4VVOMDg1QOztW3sFM_S3Qm2VHXIrKrHfk6OCVG0qI&code_challenge_method=S256',
            { waitUntil: 'networkidle2' }
        );

        await page.waitForSelector('input[name="username"]', { timeout: 10000 });
        await page.type('input[name="username"]', 'paulo@dachery.com.br');
        await page.type('input[name="password"]', 'Dachery@123');

        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);

        console.log('Acessando home...');
        await page.goto('https://cliente-frotas.conectcar.com/home', { waitUntil: 'networkidle2' });

        await page.waitForSelector('.font-bold.text-blue-4', { timeout: 10000 });
        const dado = await page.$eval('.font-bold.text-blue-4', el => el.textContent.trim());

        console.log('Extração concluída:', dado);

        return dado;

    } catch (error) {
        console.error('Erro na extração:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
            console.log('Browser fechado');
        }
    }
}

module.exports = async (req, res) => {
    try {
        const dado = await extrair();
        if (!dado) {
            return res.status(503).json({ error: 'Dado ainda não disponível' });
        }
        res.status(200).json({ dado });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno no servidor', details: error.message });
    }
    
};
