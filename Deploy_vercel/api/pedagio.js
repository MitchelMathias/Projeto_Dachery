const chromium = require("@sparticuz/chromium")
const puppeteer = require("puppeteer-core")

module.exports = async (req, res) => {
  // Configurar headers CORS
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  let browser

  try {
    console.log("Iniciando extração...")

    // Configuração otimizada para Vercel
    const options = {
      args: [
        ...chromium.args,
        "--hide-scrollbars",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process",
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    }

    browser = await puppeteer.launch(options)
    const page = await browser.newPage()

    // Configurar timeout
    page.setDefaultTimeout(30000)
    page.setDefaultNavigationTimeout(30000)

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    )

    console.log("Navegando para página de login...")
    await page.goto(
      "https://auth.conectcar.com/auth/realms/Atacado/protocol/openid-connect/auth?client_id=portal-atacado-web&scope=openid%20email%20profile&response_type=code&redirect_uri=https%3A%2F%2Fcliente-frotas.conectcar.com%2Fapi%2Fauth%2Fcallback%2Fkeycloak&state=BYXLl_zClxVuXNnJtIap-hG9RMazGyC3Jb85z-_sWWk&code_challenge=cO4VVOMDg1QOztW3sFM_S3Qm2VHXIrKrHfk6OCVG0qI&code_challenge_method=S256",
      {
        waitUntil: "networkidle2",
        timeout: 30000,
      },
    )

    // Aguardar campos de login
    await page.waitForSelector('input[name="username"]', { timeout: 10000 })
    await page.waitForSelector('input[name="password"]', { timeout: 10000 })

    console.log("Preenchendo credenciais...")
    await page.type('input[name="username"]', "paulo@dachery.com.br")
    await page.type('input[name="password"]', "Dachery@123")

    console.log("Fazendo login...")
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 }),
    ])

    console.log("Navegando para home...")
    await page.goto("https://cliente-frotas.conectcar.com/home", {
      waitUntil: "networkidle2",
      timeout: 30000,
    })

    console.log("Aguardando elemento...")
    await page.waitForSelector(".font-bold.text-blue-4", { timeout: 15000 })

    const dado = await page.$eval(".font-bold.text-blue-4", (el) => el.textContent.trim())
    console.log("Dado extraído:", dado)

    await browser.close()

    return res.status(200).json({
      success: true,
      data: dado,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro na extração:", error)

    if (browser) {
      try {
        await browser.close()
      } catch (closeError) {
        console.error("Erro ao fechar browser:", closeError)
      }
    }

    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}
