// stats.js
const leadsHoje = document.getElementById("leads-hoje");
const leadsSemana = document.getElementById("leads-semana");
const taxaConversao = document.getElementById("taxa-conversao");
const fechamentos = document.getElementById("fechamentos");

async function atualizarStats() {
  try {
    const res = await fetch("/api/leads?limit=1000"); // pega todos os leads
    const data = await res.json();
    const leads = data.leads || [];

    // Cálculo de leads de hoje
    const hoje = new Date().toISOString().slice(0,10); // "YYYY-MM-DD"
    const leadsHojeCount = leads.filter(l => l.created_at?.slice(0,10) === hoje).length;

    // Leads da semana
    const leadsSemanaCount = leads.filter(l => {
      const d = new Date(l.created_at);
      const now = new Date();
      const diffDias = (now - d) / (1000*60*60*24);
      return diffDias <= 7;
    }).length;

    // Fechamentos
    const fechamentosCount = leads.filter(l => l.status === "fechado").length;

    // Taxa de conversão (%)
    const taxa = leads.length ? Math.round((fechamentosCount / leads.length) * 100) : 0;

    // Atualiza os cards do HTML
    leadsHoje.textContent = leadsHojeCount;
    leadsSemana.textContent = leadsSemanaCount;
    taxaConversao.textContent = taxa + "%";
    fechamentos.textContent = fechamentosCount;

  } catch(err) {
    console.error("Erro ao atualizar stats:", err);
  }
}

// Atualiza ao carregar a página
document.addEventListener("DOMContentLoaded", atualizarStats);
