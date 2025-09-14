// render.js - renderização dos leads

import { leadsContainer, paginationInfo, paginationPrev, paginationNext, leadsPerPage, currentPage, leadsData } from "./config.js";
import { statusText } from "./utils.js";
import { attachLeadEvents } from "./events.js";
import { getFilteredLeads } from "./filters.js";

export function renderLeads() {
  leadsContainer.innerHTML = "";
  const filtered = getFilteredLeads();
  const totalPages = Math.ceil(filtered.length / leadsPerPage);
  if (currentPage > totalPages) currentPage = totalPages || 1;

  const start = (currentPage - 1) * leadsPerPage;
  const end = start + leadsPerPage;
  const pageLeads = filtered.slice(start, end);

  pageLeads.forEach((lead) => {
    const article = document.createElement("article");
    article.className = "lead-note";
    article.dataset.id = lead.id;
    article.innerHTML = `
      <input type="checkbox" class="lead-select" title="Selecionar lead">
      <div class="lead-meta">
          <h3>${lead.nome}</h3>
          <p><strong>Email:</strong> ${lead.email}</p>
          <p><strong>Telefone:</strong> ${lead.telefone}</p>
          <p class="message">${lead.mensagem}</p>
          <span class="status status-${lead.status}" data-status="${lead.status}">${statusText(lead.status)}</span>
          <ul class="lead-comments hidden">
              ${lead.comments.map((c) => `<li class="lead-comment">${c}</li>`).join("")}
          </ul>
      </div>
      <div class="actions">
          <button class="btn-small btn-edit">Editar</button>
          <button class="btn-small btn-detalhes">Detalhes</button>
          <button class="btn-small btn-delete">Excluir</button>
      </div>
    `;
    leadsContainer.appendChild(article);
    attachLeadEvents(article);
  });

  paginationInfo.textContent = `Página ${currentPage} de ${totalPages || 1}`;
  paginationPrev.disabled = currentPage === 1;
  paginationNext.disabled = currentPage === totalPages || totalPages === 0;
}
