const { chromium } = require('playwright-core');

module.exports = async (req, res) => {
    let browser;

    try {
        console.log('Importando chromium...');
        const { default: chromiumModule } = await import('@sparticuz/chromium');

        browser = await chromium.launch({
            executablePath: await chromiumModule.executablePath(),
            args: [
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-setuid-sandbox',
            ],
            headless: true,
            timeout: 60000,
        });

        const page = await browser.newPage();

        console.log('Acessando página de login...');
        await page.goto(
            'https://auth.conectcar.com/auth/realms/Atacado/protocol/openid-connect/auth?client_id=portal-atacado-web&scope=openid%20email%20profile&response_type=code&redirect_uri=https%3A%2F%2Fcliente-frotas.conectcar.com%2Fapi%2Fauth%2Fcallback%2Fkeycloak&state=BYXLl_zClxVuXNnJtIap-hG9RMazGyC3Jb85z-_sWWk&code_challenge=cO4VVOMDg1QOztW3sFM_S3Qm2VHXIrKrHfk6OCVG0qI&code_challenge_method=S256',
            { waitUntil: 'load', timeout: 20000 }
        );

        await page.fill('input[name="username"]', 'paulo@dachery.com.br');
        await page.fill('input[name="password"]', 'Dachery@123');

        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'load', timeout: 20000 }),
        ]);

        await page.goto('https://cliente-frotas.conectcar.com/home', {
            waitUntil: 'load',
            timeout: 20000
        });

        await page.waitForSelector('.font-bold.text-blue-4', { timeout: 10000 });
        const dado = await page.textContent('.font-bold.text-blue-4');

        await page.close();
        await browser.close();

        console.log('Dado extraído:', dado);
        res.status(200).json({ sucesso: true, dado });

    } catch (err) {
        if (browser) await browser.close();
        console.error('Erro:', err.message);
        res.status(500).json({ sucesso: false, mensagem: err.message, erro: err.stack });
    }
};
