const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

async function extrair() {
    let browser = null;
    let resultado = 'Extração pendente';
    console.log('Iniciando extração...');
    console.log('Chromium executablePath:', await chromium.executablePath);
    console.log('Chromium version:', await chromium.version);

    try {
        const executablePath = await chromium.executablePath;
    
        // Configuração otimizada para Vercel
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
            defaultViewport: chromium.defaultViewport,
            executablePath: executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
            timeout: 30000
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        // Navegação com timeout reduzido
        await page.goto('https://auth.conectcar.com/auth/realms/Atacado/protocol/openid-connect/auth?client_id=portal-atacado-web&scope=openid%20email%20profile&response_type=code&redirect_uri=https%3A%2F%2Fcliente-frotas.conectcar.com%2Fapi%2Fauth%2Fcallback%2Fkeycloak&state=Dfhzs9ANCgpbtG8iECQRM6edK3StTrGrpSmgWGVnd1s&code_challenge=2K7OXxECj2qTcsDEHt5FILKkz6PQa6MKL--K9oCPfWo&code_challenge_method=S256', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });

        // Preenchimento mais robusto
        await page.waitForSelector('input[name="username"]', { timeout: 10000 });
        await page.type('input[name="username"]', 'paulo@dachery.com.br', { delay: 50 });
        await page.type('input[name="password"]', 'Dachery@123', { delay: 50 });
    
        // Submissão com espera inteligente
        const navigationPromise = page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.click('button[type="submit"]');
        await navigationPromise;

        // Acesso direto ao elemento alvo
        await page.goto('https://cliente-frotas.conectcar.com/home', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });

        // Espera flexível pelo elemento
        await page.waitForSelector('.font-bold.text-blue-4', {
            timeout: 10000,
            visible: true
        });
    
        resultado = await page.$eval('.font-bold.text-blue-4', el => el.textContent.trim());
        console.log('Valor encontrado:', resultado);

    } catch (err) {
        console.error('Erro ao extrair:', err);
        resultado = 'Erro na extração: ' + err.message;
    
        // Log adicional para debug
        if (browser) {
            const pages = await browser.pages();
            for (const p of pages) {
                console.log('URL da página:', p.url());
            }
        }
    } finally {
        if (browser) await browser.close();
    }

    return resultado;
}

module.exports = async (req, res) => {
    try {
        // Limitar chamadas simultâneas
        if (global.isExtracting) {
            return res.status(429).json({ error: 'Extração em andamento' });
        }
    
        global.isExtracting = true;
        const resultado = await extrair();
        global.isExtracting = false;
    
        res.status(200).json({ resultado });
    } catch (err) {
        global.isExtracting = false;
        console.error('Erro na API:', err);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};