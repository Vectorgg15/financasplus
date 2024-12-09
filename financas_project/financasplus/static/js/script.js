document.addEventListener("DOMContentLoaded", () => {
    const transacoes = [];
    const transacaoForm = document.getElementById("transacaoForm");
    const transacoesEl = document.getElementById("transacoes");
    const saldoEl = document.getElementById("saldo");
    const totalReceitasEl = document.getElementById("totalReceitas");
    const totalDespesasEl = document.getElementById("totalDespesas");
    const receitasChartEl = document.getElementById("receitasChart").getContext("2d");
    const despesasChartEl = document.getElementById("despesasChart").getContext("2d");
    let receitasChart, despesasChart;

    function atualizarResumo() {
        const receitas = transacoes.filter(t => t.categoria === "receita").reduce((acc, t) => acc + t.valor, 0);
        const despesas = transacoes.filter(t => t.categoria === "despesa").reduce((acc, t) => acc + t.valor, 0);
        const saldo = receitas - despesas;

        saldoEl.textContent = `R$ ${saldo.toFixed(2).replace('.', ',')}`;
        totalReceitasEl.textContent = `R$ ${receitas.toFixed(2).replace('.', ',')}`;
        totalDespesasEl.textContent = `R$ ${despesas.toFixed(2).replace('.', ',')}`;
        
        return saldo; // Retorna o saldo para uso posterior
    }

    function adicionarTransacao(event) {
        event.preventDefault();

        const descricao = document.getElementById("descricao").value;
        const valorStr = document.getElementById("valor").value;

        // Converte o valor monetário para um número
        const valor = parseFloat(valorStr.replace(/\./g, "").replace(",", "."));
        const categoria = document.getElementById("categoria").value;

        transacoes.push({ descricao, valor, categoria });
        const saldo = atualizarResumo(); // Atualiza o resumo e captura o saldo
        atualizarTabela();
        atualizarGraficos(saldo); // Passa o saldo para atualizar os gráficos
        transacaoForm.reset();
        document.getElementById("valor").value = "0,00"; // Reseta o valor para "0,00" após adicionar
    }

    function atualizarTabela() {
        transacoesEl.innerHTML = transacoes.map(t => `
            <tr>
                <td>${t.descricao}</td>
                <td>R$ ${t.valor.toFixed(2).replace('.', ',')}</td>
                <td>${t.categoria}</td>
            </tr>
        `).join('');
    }

    function atualizarGraficos(saldo) {
        const receitasTotal = transacoes.filter(t => t.categoria === "receita").reduce((acc, t) => acc + t.valor, 0);
        const despesasTotal = transacoes.filter(t => t.categoria === "despesa").reduce((acc, t) => acc + t.valor, 0);

        const pieData = {
            labels: ['Receitas', 'Despesas'],
            datasets: [{
                data: [receitasTotal, despesasTotal],
                backgroundColor: ['#4e73df', '#e74a3b'],
                hoverBackgroundColor: ['#2e59d9', '#c92a31'],
                hoverBorderColor: '#ffffff'
            }]
        };

        if (receitasChart) receitasChart.destroy();
        receitasChart = new Chart(receitasChartEl, {
            type: 'pie',
            data: pieData,
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        const barData = {
            labels: ['Receitas', 'Despesas', 'Saldo Atual'],
            datasets: [{
                label: 'Total',
                data: [receitasTotal, despesasTotal, saldo],
                backgroundColor: ['#1cc88a', '#e74a3b', '#4e73df'],
            }]
        };

        if (despesasChart) despesasChart.destroy();
        despesasChart = new Chart(despesasChartEl, {
            type: 'bar',
            data: barData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Valor (R$)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Categorias'
                        }
                    }
                }
            }
        });
    }

    transacaoForm.addEventListener("submit", adicionarTransacao);
});

document.addEventListener("DOMContentLoaded", () => {
    const valorInput = document.getElementById("valor");

    valorInput.addEventListener("input", () => {
        const formattedValue = formatCurrency(valorInput.value);
        valorInput.value = formattedValue;
    });

    function formatCurrency(value) {
        const cleanValue = value.replace(/\D/g, "");
        const numberValue = parseFloat(cleanValue) / 100;
        return numberValue.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
});
