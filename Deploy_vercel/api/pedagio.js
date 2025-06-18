const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    let browser = null;

    try {
        console.log("Iniciando navegador com Puppeteer + Sparticuz...");

        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();

        page.setDefaultTimeout(45000);
        page.setDefaultNavigationTimeout(45000);

        await page.setUserAgent(
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );

        console.log("Abrindo página de login...");
        await page.goto(
            "https://auth.conectcar.com/auth/realms/Atacado/protocol/openid-connect/auth?client_id=portal-atacado-web&scope=openid%20email%20profile&response_type=code&redirect_uri=https%3A%2F%2Fcliente-frotas.conectcar.com%2Fapi%2Fauth%2Fcallback%2Fkeycloak&state=BYXLl_zClxVuXNnJtIap-hG9RMazGyC3Jb85z-_sWWk&code_challenge=cO4VVOMDg1QOztW3sFM_S3Qm2VHXIrKrHfk6OCVG0qI&code_challenge_method=S256",
            { waitUntil: "domcontentloaded" }
        );

        await page.waitForSelector('input[name="username"]', { timeout: 15000 });
        await page.type('input[name="username"]', "paulo@dachery.com.br");
        await page.type('input[name="password"]', "Dachery@123");

        console.log("Logando...");
        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: "domcontentloaded" }),
        ]);

        console.log("Indo para página principal...");
        await page.goto("https://cliente-frotas.conectcar.com/home", {
            waitUntil: "domcontentloaded",
        });

        console.log("Esperando seletor com o dado...");
        await page.waitForSelector(".font-bold.text-blue-4", { timeout: 15000 });

        const dado = await page.$eval(".font-bold.text-blue-4", el => el.textContent.trim());

        console.log("Dado extraído:", dado);

        await browser.close();

        return res.status(200).json({
            success: true,
            data: dado,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Erro na extração:", error.message);

        if (browser) {
            try {
                await browser.close();
            } catch (err) {
                console.error("Erro ao fechar o navegador:", err.message);
            }
        }

        return res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
        });
    }
};
