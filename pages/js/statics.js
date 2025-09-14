// stats.js

// Seleciona os elementos do HTML
const leadsHojeEl = document.getElementById("leads-hoje");
const leadsSemanaEl = document.getElementById("leads-semana");
const taxaConversaoEl = document.getElementById("taxa-conversao");
const fechamentosEl = document.getElementById("fechamentos");

// Função para atualizar os cards
async function atualizarStats() {
  try {
    const res = await fetch("/api/leads"); // sua API de leads
    const data = await res.json();
    const leads = data.leads || [];

    const hoje = new Date();
    const semana = hoje.getDay(); // dia da semana 0-6

    // Leads hoje
    const leadsHoje = leads.filter(l => {
      const createdAt = new Date(l.created_at || l.date); // ajuste conforme seu campo
      return createdAt.toDateString() === hoje.toDateString();
    }).length;

    // Leads na semana (segunda a domingo)
    const primeiroDiaSemana = new Date();
    primeiroDiaSemana.setDate(hoje.getDate() - hoje.getDay()); // domingo
    const ultimoDiaSemana = new Date();
    ultimoDiaSemana.setDate(primeiroDiaSemana.getDate() + 6);

    const leadsSemana = leads.filter(l => {
      const createdAt = new Date(l.created_at || l.date);
      return createdAt >= primeiroDiaSemana && createdAt <= ultimoDiaSemana;
    }).length;

    // Fechamentos (status = "fechado")
    const fechamentos = leads.filter(l => l.status === "fechado").length;

    // Taxa de conversão: fechamentos / total leads
    const taxaConversao = leads.length ? Math.round((fechamentos / leads.length) * 100) : 0;

    // Atualiza HTML
    leadsHojeEl.textContent = leadsHoje;
    leadsSemanaEl.textContent = leadsSemana;
    fechamentosEl.textContent = fechamentos;
    taxaConversaoEl.textContent = `${taxaConversao}%`;

  } catch(err) {
    console.error("Erro ao atualizar stats:", err);
  }
}

// Atualiza os stats ao carregar a página
document.addEventListener("DOMContentLoaded", atualizarStats);

// Atualização automática a cada 30 segundos (opcional)
setInterval(atualizarStats, 30000);

