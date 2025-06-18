const { chromium } = require('playwright-core');
const chromiumModule = require('@sparticuz/chromium');

module.exports = async (req, res) => {
    let browser;
    try {
        browser = await chromium.launch({
            executablePath: await chromiumModule.executablePath(),
            args: chromiumModule.args,
            headless: chromiumModule.headless,
            defaultViewport: chromiumModule.defaultViewport,
        });

        const context = await browser.newContext();
        const page = await context.newPage();

        await page.setUserAgent('Mozilla/5.0');

        await page.goto(
            'https://auth.conectcar.com/auth/realms/Atacado/protocol/openid-connect/auth?client_id=portal-atacado-web&scope=openid%20email%20profile&response_type=code&redirect_uri=https%3A%2F%2Fcliente-frotas.conectcar.com%2Fapi%2Fauth%2Fcallback%2Fkeycloak&state=BYXLl_zClxVuXNnJtIap-hG9RMazGyC3Jb85z-_sWWk&code_challenge=cO4VVOMDg1QOztW3sFM_S3Qm2VHXIrKrHfk6OCVG0qI&code_challenge_method=S256',
            { waitUntil: 'networkidle' }
        );

        await page.fill('input[name="username"]', 'paulo@dachery.com.br');
        await page.fill('input[name="password"]', 'Dachery@123');

        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForLoadState('networkidle'),
        ]);

        await page.goto('https://cliente-frotas.conectcar.com/home', { waitUntil: 'networkidle' });
        await page.waitForSelector('.font-bold.text-blue-4');

        const dado = await page.textContent('.font-bold.text-blue-4');

        res.status(200).json({
            sucesso: true,
            dado,
        });

    } catch (err) {
        console.error('Erro na extração:', err.stack);

        res.status(500).json({
            sucesso: false,
            mensagem: err.message,
            erro: err.stack,
        });
    } finally {
        if (browser) await browser.close();
    }
};
