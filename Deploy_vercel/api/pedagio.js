const puppeteer = require('puppeteer');

let dado = 'Extração pendente';

async function extrair() {
    let browser;
    try {
        console.log('Iniciando browser...');
        browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        console.log('Navegando para a página de login...');
        await page.setUserAgent('Mozilla/5.0');
        await page.goto('https://auth.conectcar.com/auth/realms/Atacado/protocol/openid-connect/auth?...', { waitUntil: 'networkidle2' });
        console.log('Preenchendo login...');
        await page.type('input[name="username"]', 'paulo@dachery.com.br');
        await page.type('input[name="password"]', 'Dachery@123');
        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);
        console.log('Acessando home...');
        await page.goto('https://cliente-frotas.conectcar.com/home', { waitUntil: 'networkidle2' });
        await page.waitForSelector('.font-bold.text-blue-4');
        dado = await page.$eval('.font-bold.text-blue-4', el => el.textContent.trim());
        console.log('Extração concluída:', dado);
    } catch (error) {
        dado = 'Erro na extração';
        console.error('Erro na extração:', error);
    } finally {
        if (browser) {
            await browser.close();
            console.log('Browser fechado');
        }
    }
}


// Executa a extração a cada 15 minutos
setInterval(extrair, 900000);
// Executa uma vez na carga do módulo
extrair();

module.exports = async (req, res) => {
    try {
        if (!dado || dado === 'Erro na extração' || dado === 'Extração pendente') {
            return res.status(503).json({ error: 'Dado ainda não disponível' });
        }
        res.send(dado);
    } catch (error) {
        console.error('Erro no endpoint:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};
