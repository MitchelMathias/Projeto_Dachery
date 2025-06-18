const { chromium } = require('playwright-core');

module.exports = async (req, res) => {
    let browser;

    try {
        console.log('Carregando módulo @sparticuz/chromium...');
        const chromiumModule = await import('@sparticuz/chromium');

        console.log('Iniciando Chromium...');
        browser = await chromium.launch({
            executablePath: await chromiumModule.executablePath(),
            args: chromiumModule.args,
            headless: chromiumModule.headless,
            defaultViewport: chromiumModule.defaultViewport,
        });
        console.log('Chromium iniciado.');

        const context = await browser.newContext();
        const page = await context.newPage();

        await page.setUserAgent('Mozilla/5.0');

        console.log('Indo para a página de login...');
        await page.goto(
            'https://auth.conectcar.com/auth/realms/Atacado/protocol/openid-connect/auth?client_id=portal-atacado-web&scope=openid%20email%20profile&response_type=code&redirect_uri=https%3A%2F%2Fcliente-frotas.conectcar.com%2Fapi%2Fauth%2Fcallback%2Fkeycloak&state=BYXLl_zClxVuXNnJtIap-hG9RMazGyC3Jb85z-_sWWk&code_challenge=cO4VVOMDg1QOztW3sFM_S3Qm2VHXIrKrHfk6OCVG0qI&code_challenge_method=S256',
            { waitUntil: 'networkidle' }
        );
        console.log('Página de login carregada.');

        console.log('Preenchendo username...');
        await page.fill('input[name="username"]', 'paulo@dachery.com.br');
        console.log('Preenchendo password...');
        await page.fill('input[name="password"]', 'Dachery@123');

        console.log('Enviando formulário e aguardando navegação...');
        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForLoadState('networkidle'),
        ]);
        console.log('Login realizado, indo para home...');

        await page.goto('https://cliente-frotas.conectcar.com/home', { waitUntil: 'networkidle' });
        console.log('Home carregada, esperando seletor...');
        await page.waitForSelector('.font-bold.text-blue-4');
        console.log('Seletor encontrado, extraindo dado...');

        const dado = await page.textContent('.font-bold.text-blue-4');
        console.log('Dado extraído:', dado);

        await browser.close();
        res.status(200).json({ sucesso: true, dado });
    } catch (err) {
        console.error('Erro na extração:', err.stack);
        if (browser) await browser.close();
        res.status(500).json({ sucesso: false, mensagem: err.message, erro: err.stack });
    }
};
