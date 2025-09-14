// stats.js

const leadsHojeEl = document.getElementById("leads-hoje");
const leadsSemanaEl = document.getElementById("leads-semana");
const taxaConversaoEl = document.getElementById("taxa-conversao");
const fechamentosEl = document.getElementById("fechamentos");

// ===== Função para buscar leads da API =====
async function fetchLeads() {
    try {
        const res = await fetch("/api/leads");
        const data = await res.json();
        const leadsData = data.leads || [];
        atualizarStats(leadsData);
    } catch (err) {
        console.error("Erro ao buscar leads:", err);
    }
}

// ===== Função para atualizar os cards de estatísticas =====
function atualizarStats(leadsData) {
    const hoje = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const leadsHoje = leadsData.filter(l => l.created_at && l.created_at.startsWith(hoje)).length;

    const leadsSemana = leadsData.filter(l => {
        if (!l.created_at) return false;
        const data = new Date(l.created_at);
        const now = new Date();
        const diffDays = (now - data) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
    }).length;

    const fechamentos = leadsData.filter(l => l.status === "fechado").length;

    const taxaConversao = leadsHoje ? Math.round((fechamentos / leadsHoje) * 100) : 0;

    leadsHojeEl.textContent = leadsHoje;
    leadsSemanaEl.textContent = leadsSemana;
    taxaConversaoEl.textContent = `${taxaConversao}%`;
    fechamentosEl.textContent = fechamentos;
}

// ===== Inicialização =====
document.addEventListener("DOMContentLoaded", fetchLeads);


