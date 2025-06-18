async function fetchDado() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 10 segundos
    
    const res = await fetch('/api/pedagio', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    // Verificação de erro HTTP
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Exibição segura do resultado
    const resultadoElement = document.getElementById('resultado');
    if (resultadoElement) {
      resultadoElement.textContent = data.resultado || data.error || 'Sem resultado';
    }
    
  } catch (err) {
    const resultadoElement = document.getElementById('resultado');
    if (resultadoElement) {
      resultadoElement.textContent = err.name === 'AbortError' 
        ? 'Timeout: A requisição demorou muito'
        : 'Erro: ' + err.message;
    }
    console.error('Detalhes do erro:', err);
  }
}

// Iniciar e atualizar com intervalo maior
fetchDado();
setInterval(fetchDado, 30000); // 30 segundos