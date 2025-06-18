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
  await client.post('https://auth.conectcar.com/auth/realms/Atacado/login-actions/authenticate', {
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