document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3001/aniversariantes')
        .then(response => response.json())
        .then(data => {
            // Mês atual
            const listaAtual = data.mesAtual.map(p => `<p>${p.nome} - No dia ${p.aniversario}</p>`).join('');
            document.getElementById('mesAtual').innerHTML = listaAtual;
;

            // Mês próximo
            const listaProximo = data.mesProximo.map(p => `<p>${p.nome} - No dia ${p.aniversario}</p>`).join('');
            document.getElementById('mesProximo').innerHTML = listaProximo;

            // Mês posterior
            const listaPosterior = data.mesPosterior.map(p => `<p>${p.nome} - No dia ${p.aniversario}</p>`).join('');
            document.getElementById('mesPosterior').innerHTML = listaPosterior
        })
        .catch(error => console.error('Erro ao buscar aniversariantes:', error));
});

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3001/ataMedica')
        .then(response => response.json())
        .then(data => {
            const listaAtual = data.mesAtual.map(p => `<p>${p.nome} - Vencimento: ${p.vencimento}</p>`).join('')
            document.getElementById('vencida').innerHTML = listaAtual

            const listaProximo = data.mesProximo.map(p => `<p>${p.nome} - Vencimento: ${p.vencimento}</p>`).join('')
            document.getElementById('vencemProximoMes').innerHTML = listaProximo

            const listaPosterior = data.mesPosterior.map(p => `<p>${p.nome} - Vencimento: ${p.vencimento}</p>`).join('')
            document.getElementById('vigentes').innerHTML = listaPosterior
        })
        .catch(error => {
            console.error('Erro ao carregar atas médicas:', error);
        });
});

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3001/ferias')
        .then(response => response.json())
        .then(data => {
            const listaAtual = data.mesAtual.map(p => `<p>${p.nome} - Vencimento: ${p.vencimento}</p>`).join('');
            document.getElementById('feriasAtual').innerHTML = listaAtual;

            const listaProximo = data.mesProximo.map(p => `<p>${p.nome} - Vencimento: ${p.vencimento}</p>`).join('');
            document.getElementById('feriasProximo').innerHTML = listaProximo;

            const listaPosterior = data.mesPosterior.map(p => `<p>${p.nome} - Vencimento: ${p.vencimento}</p>`).join('');
            document.getElementById('feriasPosterior').innerHTML = listaPosterior;
        })
        .catch(error => {
            console.error('Erro ao carregar férias:', error);
        });
});





