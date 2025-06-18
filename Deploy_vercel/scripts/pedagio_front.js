async function fetchDado() {
  try {
    const res = await fetch('/api/pedagio');
    
    // Verificar se a resposta é JSON
    const contentType = res.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      throw new Error(`Resposta inesperada: ${text.slice(0, 100)}...`);
    }

    // Exibir resultado ou erro
    if (data.resultado) {
      document.getElementById('resultado').innerHTML = data.resultado;
    } else if (data.error) {
      document.getElementById('resultado').innerHTML = 'Erro: ' + data.error;
    } else {
      document.getElementById('resultado').innerHTML = 'Sem resultado';
    }
    
  } catch (err) {
    document.getElementById('resultado').innerHTML = 'Erro: ' + err.message;
    console.error('Detalhes do erro:', err);
  }
}

// Iniciar e atualizar a cada 5 segundos
fetchDado();
setInterval(fetchDado, 5000);