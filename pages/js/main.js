// main.js - inicialização

import { btnNewLead, btnDeleteSelected, btnExport, leadsData, currentPage } from "./config.js";
import { renderLeads } from "./render.js";

btnNewLead.addEventListener("click", () => {
  const nome = prompt("Digite o nome do novo lead:");
  if (!nome) return;

  const newLead = {
    id: Date.now(),
    nome,
    email: "email@exemplo.com",
    telefone: "(00) 00000-0000",
    mensagem: "Mensagem de exemplo",
    status: "novo",
    comments: [],
  };
  leadsData.unshift(newLead);
  currentPage = 1;
  renderLeads();
});

btnDeleteSelected.addEventListener("click", () => {
  const checkedIds = Array.from(document.querySelectorAll(".lead-select:checked")).map((cb) => parseInt(cb.closest(".lead-note").dataset.id));
  if (!checkedIds.length) return alert("Nenhum lead selecionado.");
  if (!confirm(`Deseja excluir ${checkedIds.length} lead(s) selecionado(s)?`)) return;
  leadsData = leadsData.filter((l) => !checkedIds.includes(l.id));
  renderLeads();
});

btnExport.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(leadsData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "leads.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  alert("Arquivo leads.json gerado (download).");
});

async function carregarLeads() {
  try {
    const res = await fetch("/leads.json");
    leadsData = await res.json();
    renderLeads();
  } catch (err) {
    console.error("Erro ao carregar leads:", err);
    leadsData = [];
  }
}
document.addEventListener("DOMContentLoaded", carregarLeads);
