const { chromium } = require("playwright-aws-lambda")

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  let browser

  try {
    console.log("Iniciando browser com Playwright...")

    browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process",
      ],
    })

    const page = await browser.newPage({
      viewport: { width: 1366, height: 768 },
      userAgent:
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    })

    console.log("Navegando para login...")
    await page.goto(
      "https://auth.conectcar.com/auth/realms/Atacado/protocol/openid-connect/auth?client_id=portal-atacado-web&scope=openid%20email%20profile&response_type=code&redirect_uri=https%3A%2F%2Fcliente-frotas.conectcar.com%2Fapi%2Fauth%2Fcallback%2Fkeycloak&state=BYXLl_zClxVuXNnJtIap-hG9RMazGyC3Jb85z-_sWWk&code_challenge=cO4VVOMDg1QOztW3sFM_S3Qm2VHXIrKrHfk6OCVG0qI&code_challenge_method=S256",
      { waitUntil: "domcontentloaded", timeout: 45000 },
    )

    await page.fill('input[name="username"]', "paulo@dachery.com.br")
    await page.fill('input[name="password"]', "Dachery@123")

    await Promise.all([page.click('button[type="submit"]'), page.waitForNavigation({ waitUntil: "domcontentloaded" })])

    await page.goto("https://cliente-frotas.conectcar.com/home", {
      waitUntil: "domcontentloaded",
    })

    await page.waitForSelector(".font-bold.text-blue-4", { timeout: 15000 })
    const dado = await page.textContent(".font-bold.text-blue-4")

    await browser.close()

    return res.status(200).json({
      success: true,
      data: dado.trim(),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro:", error)

    if (browser) {
      await browser.close()
    }

    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}
