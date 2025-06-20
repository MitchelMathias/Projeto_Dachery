const { chromium } = require('playwright-core');

module.exports = async (req, res) => {
    let browser;
    
    try {
        const { default: chromiumModule } = await import('@sparticuz/chromium');
        
        browser = await chromium.launch({
            executablePath: await chromiumModule.executablePath(),
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--disable-background-networking',
                '--disable-extensions',
                '--disable-sync',
                '--disable-default-apps',
                '--disable-gpu',
                '--disable-software-rasterizer',
                '--no-first-run',
                '--enable-automation',
                '--disable-blink-features=AutomationControlled'
            ],
            headless: true,
            timeout: 30000 // Timeout para launch
        });

        // Verificar se browser ainda está ativo
        if (!browser.isConnected()) {
            throw new Error('Browser desconectou após launch');
        }

        const context = await browser.newContext();
        const page = await context.newPage();
        
        // Bloquear recursos desnecessários
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            const resourceType = req.resourceType();
            if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.goto(
            'https://auth.conectcar.com/auth/realms/Atacado/protocol/openid-connect/auth?client_id=portal-atacado-web&scope=openid%20email%20profile&response_type=code&redirect_uri=https%3A%2F%2Fcliente-frotas.conectcar.com%2Fapi%2Fauth%2Fcallback%2Fkeycloak&state=BYXLl_zClxVuXNnJtIap-hG9RMazGyC3Jb85z-_sWWk&code_challenge=cO4VVOMDg1QOztW3sFM_S3Qm2VHXIrKrHfk6OCVG0qI&code_challenge_method=S256',
            { waitUntil: 'domcontentloaded', timeout: 20000 }
        );

        await page.fill('input[name="username"]', 'paulo@dachery.com.br');
        await page.fill('input[name="password"]', 'Dachery@123');

        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForLoadState('domcontentloaded')
        ]);

        await page.goto('https://cliente-frotas.conectcar.com/home', {
            waitUntil: 'domcontentloaded',
            timeout: 20000
        });

        await page.waitForSelector('.font-bold.text-blue-4', { timeout: 10000 });
        const dado = await page.textContent('.font-bold.text-blue-4');

        await browser.close();
        res.status(200).json({ sucesso: true, dado });
        
    } catch (err) {
        console.error('Erro:', err.message);
        if (browser && browser.isConnected()) {
            try { 
                await browser.close(); 
            } catch (closeErr) {
                console.error('Erro ao fechar browser:', closeErr.message);
            }
        }
        res.status(500).json({ 
            sucesso: false, 
            mensagem: err.message 
        });
    }
};