const chromium = require("@sparticuz/chromium")
const puppeteer = require("puppeteer-core")

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  let browser

  try {
    console.log("Iniciando configuração do browser...")

    // Configuração específica para Vercel
    const isLocal = process.env.NODE_ENV !== "production"

    let options

    if (isLocal) {
      // Configuração para desenvolvimento local
      options = {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      }
    } else {
      // Configuração para produção (Vercel)
      options = {
        args: [
          ...chromium.args,
          "--hide-scrollbars",
          "--disable-web-security",
          "--disable-features=VizDisplayCompositor",
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--disable-extensions",
          "--disable-background-timer-throttling",
          "--disable-backgrounding-occluded-windows",
          "--disable-renderer-backgrounding",
          "--single-process",
        ],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath("/tmp"),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      }
    }

    console.log("Lançando browser com configurações:", JSON.stringify(options, null, 2))
    browser = await puppeteer.launch(options)

    const page = await browser.newPage()

    // Configurar timeouts
    page.setDefaultTimeout(45000)
    page.setDefaultNavigationTimeout(45000)

    // User agent mais realista
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    )

    // Configurações adicionais da página
    await page.setViewport({ width: 1366, height: 768 })
    await page.setExtraHTTPHeaders({
      "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
    })

    console.log("Navegando para página de login...")
    await page.goto(
      "https://auth.conectcar.com/auth/realms/Atacado/protocol/openid-connect/auth?client_id=portal-atacado-web&scope=openid%20email%20profile&response_type=code&redirect_uri=https%3A%2F%2Fcliente-frotas.conectcar.com%2Fapi%2Fauth%2Fcallback%2Fkeycloak&state=BYXLl_zClxVuXNnJtIap-hG9RMazGyC3Jb85z-_sWWk&code_challenge=cO4VVOMDg1QOztW3sFM_S3Qm2VHXIrKrHfk6OCVG0qI&code_challenge_method=S256",
      {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      },
    )

    // Aguardar um pouco para a página carregar completamente
    await page.waitForTimeout(2000)

    // Verificar se os campos existem
    const usernameExists = await page.$('input[name="username"]')
    const passwordExists = await page.$('input[name="password"]')

    if (!usernameExists || !passwordExists) {
      throw new Error("Campos de login não encontrados na página")
    }

    console.log("Preenchendo credenciais...")
    await page.type('input[name="username"]', "paulo@dachery.com.br", { delay: 100 })
    await page.type('input[name="password"]', "Dachery@123", { delay: 100 })

    console.log("Fazendo login...")
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({
        waitUntil: "domcontentloaded",
        timeout: 45000,
      }),
    ])

    console.log("Navegando para home...")
    await page.goto("https://cliente-frotas.conectcar.com/home", {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    })

    // Aguardar um pouco para a página carregar
    await page.waitForTimeout(3000)

    console.log("Procurando elemento...")

    // Tentar diferentes seletores
    let dado = null
    const selectors = [".font-bold.text-blue-4", ".font-bold", "[class*='text-blue']", "[class*='font-bold']"]

    for (const selector of selectors) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 })
        dado = await page.$eval(selector, (el) => el.textContent.trim())
        console.log(`Dado encontrado com seletor ${selector}:`, dado)
        break
      } catch (err) {
        console.log(`Seletor ${selector} não encontrado, tentando próximo...`)
      }
    }

    if (!dado) {
      // Se não encontrou, pegar screenshot para debug
      const screenshot = await page.screenshot({ encoding: "base64" })
      console.log("Screenshot da página:", screenshot.substring(0, 100) + "...")
      throw new Error("Elemento com dados não encontrado na página")
    }

    await browser.close()

    return res.status(200).json({
      success: true,
      data: dado,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro detalhado:", error)

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
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })
  }
}
