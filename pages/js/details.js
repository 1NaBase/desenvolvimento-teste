// details.js - modal de detalhes

import { detalhesContent, detalhesCommentsList, newCommentInput, btnAddComment, modalDetalhes, currentLead, leadsData } from "./config.js";
import { openModal } from "./utils.js";
import { renderLeads } from "./render.js";

export function openLeadDetails(leadEl) {
  const id = parseInt(leadEl.dataset.id);
  currentLead = leadsData.find((l) => l.id === id);
  const l = currentLead;

  detalhesContent.innerHTML = `
    <p><strong>Nome:</strong> ${l.nome}</p>
    <p><strong>Email:</strong> ${l.email}</p>
    <p><strong>Telefone:</strong> ${l.telefone}</p>
    <p><strong>Mensagem:</strong> ${l.mensagem}</p>
    <p><strong>Status:</strong> ${l.status}</p>
  `;

  detalhesCommentsList.innerHTML = l.comments.length
    ? l.comments.map((c) => `<li>${c}</li>`).join("")
    : "<li class='text-sm text-gray-500'>Sem comentários</li>";

  newCommentInput.value = "";
  openModal(modalDetalhes);
  newCommentInput.focus();
}

btnAddComment.addEventListener("click", () => {
  if (!currentLead) return;
  const text = newCommentInput.value.trim();
  if (!text) return alert("Digite um comentário antes.");
  currentLead.comments.push(text);
  renderLeads();
  openLeadDetails(document.querySelector(`.lead-note[data-id='${currentLead.id}']`));
});
