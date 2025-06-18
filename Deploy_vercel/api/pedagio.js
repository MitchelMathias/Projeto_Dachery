const axios = require('axios');
const cheerio = require('cheerio');
const tough = require('tough-cookie');

async function extrair() {
  const cookieJar = new tough.CookieJar();
  const client = axios.create({
    jar: cookieJar,
    withCredentials: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  // 1. Fazer login
  await client.post('https://auth.conectcar.com/auth/realms/Atacado/protocol/openid-connect/auth?client_id=portal-atacado-web&scope=openid%20email%20profile&response_type=code&redirect_uri=https%3A%2F%2Fcliente-frotas.conectcar.com%2Fapi%2Fauth%2Fcallback%2Fkeycloak&state=NOndPnk8gasVytWxoBXMgIHhiEB_Ca2LEDYwIeU8LXM&code_challenge=p9BqLoeFBQsQP8qHL2cNddLC6aVRz2QP18S9m-fzLNA&code_challenge_method=S256', {
    username: 'paulo@dachery.com.br',
    password: 'Dachery@123'
  });

  // 2. Acessar dashboard
  const { data } = await client.get('https://cliente-frotas.conectcar.com/home');
  
  // 3. Parsear HTML
  const $ = cheerio.load(data);
  const resultado = $('.font-bold.text-blue-4').text().trim();
  
  return resultado || 'Valor não encontrado';
}