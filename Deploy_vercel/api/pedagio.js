const { PuppeteerCrawler } = require('crawlee');
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
    let resultado = 'Extração pendente';

    const crawler = new PuppeteerCrawler({
        launchContext: {
            launcher: puppeteer,
            launchOptions: {
                headless: chromium.headless,
                args: chromium.args,
                executablePath: await chromium.executablePath(),
                defaultViewport: chromium.defaultViewport,
            },
        },
        maxRequestsPerCrawl: 1, // Controla execução única

        async requestHandler({ page, request, log }) {
            try {
                log.info(`Acessando ${request.url}`);

                // Preencher login
                await page.type('input[name="username"]', 'paulo@dachery.com.br');
                await page.type('input[name="password"]', 'Dachery@123');

                await Promise.all([
                    page.click('button[type="submit"]'),
                    page.waitForNavigation({ waitUntil: 'networkidle2' }),
                ]);

                await page.goto('https://cliente-frotas.conectcar.com/home', { waitUntil: 'networkidle2' });
                await page.waitForSelector('.font-bold.text-blue-4');

                resultado = await page.$eval('.font-bold.text-blue-4', el => el.textContent.trim());
                log.info(`Dado extraído: ${resultado}`);
            } catch (err) {
                log.error('Erro na extração', { error: err });
                resultado = 'Erro na extração';
            }
        },
    });

    // Inicia o processo com a URL inicial
    await crawler.run([
        'https://auth.conectcar.com/auth/realms/Atacado/protocol/openid-connect/auth?client_id=portal-atacado-web&scope=openid%20email%20profile&response_type=code&redirect_uri=https%3A%2F%2Fcliente-frotas.conectcar.com%2Fapi%2Fauth%2Fcallback%2Fkeycloak&state=BYXLl_zClxVuXNnJtIap-hG9RMazGyC3Jb85z-_sWWk&code_challenge=cO4VVOMDg1QOztW3sFM_S3Qm2VHXIrKrHfk6OCVG0qI&code_challenge_method=S256',
    ]);

    res.status(200).send(resultado);
};
