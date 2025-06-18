const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

async function extrair() {
    let browser = null;
    let resultado = 'Extração pendente';

    try {
        const executablePath = await chromium.executablePath;
        
        console.log('Iniciando navegador...');
        // Substitua o lançamento do navegador por:
            browser = await puppeteer.launch({
                args: [
                    ...chromium.args,
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--single-process',
                    '--no-zygote',
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--memory-pressure-off'
                ],
                executablePath: process.env.IS_LOCAL 
                    ? '/usr/bin/chromium-browser' 
                    : await chromium.executablePath,
                headless: 'new',  // Usar o novo headless
                ignoreDefaultArgs: ['--disable-extensions'],
            });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0');

        console.log('Navegando para login...');
        await page.goto('https://auth.conectcar.com/auth/realms/Atacado/protocol/openid-connect/auth?client_id=portal-atacado-web&scope=openid%20email%20profile&response_type=code&redirect_uri=https%3A%2F%2Fcliente-frotas.conectcar.com%2Fapi%2Fauth%2Fcallback%2Fkeycloak&state=BYXLl_zClxVuXNnJtIap-hG9RMazGyC3Jb85z-_sWWk&code_challenge=cO4VVOMDg1QOztW3sFM_S3Qm2VHXIrKrHfk6OCVG0qI&code_challenge_method=S256', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        console.log('Preenchendo credenciais...');
        await page.type('input[name="username"]', 'paulo@dachery.com.br');
        await page.type('input[name="password"]', 'Dachery@123');

        console.log('Submetendo login...');
        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }),
        ]);

        console.log('Navegando para dashboard...');
        await page.goto('https://cliente-frotas.conectcar.com/home', {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        console.log('Aguardando seletor...');
        await page.waitForSelector('.font-bold.text-blue-4', { timeout: 30000 });
        resultado = await page.$eval('.font-bold.text-blue-4', el => el.textContent.trim());
        console.log('Valor encontrado:', resultado);

    } catch (err) {
        console.error('Erro ao extrair:', err);
        
        if (page) {
            try {
                const screenshot = await page.screenshot({ encoding: 'base64' });
                console.error('Screenshot (base64):', screenshot);
            } catch (e) {
                console.error('Erro ao capturar screenshot:', e);
            }
        }
        
        resultado = 'Erro na extração: ' + err.message;
    } finally {
        if (browser) await browser.close();
    }
    console.log('Extração concluída, resultado:', resultado);
    return resultado;
}

module.exports = async (req, res) => {
    try {
        const resultado = await extrair();
        res.status(200).json({ resultado });
    } catch (err) {
        // Garante resposta em JSON mesmo em erros
        res.status(500).json({
        error: "Erro interno",
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

