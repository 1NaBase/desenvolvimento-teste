// edit.js - edição de leads

import { formEditar, editNome, editEmail, editTelefone, editMsg, editStatus, modalEditar, currentLead } from "./config.js";
import { openModal, closeModal } from "./utils.js";
import { renderLeads } from "./render.js";

export function openLeadEdit(leadEl) {
  const id = parseInt(leadEl.dataset.id);
  currentLead = leadsData.find((l) => l.id === id);

  editNome.value = currentLead.nome;
  editEmail.value = currentLead.email;
  editTelefone.value = currentLead.telefone;
  editMsg.value = currentLead.mensagem;
  editStatus.value = currentLead.status;

  openModal(modalEditar);
}

formEditar.addEventListener("submit", (e) => {
  e.preventDefault();
  Object.assign(currentLead, {
    nome: editNome.value,
    email: editEmail.value,
    telefone: editTelefone.value,
    mensagem: editMsg.value,
    status: editStatus.value,
  });
  closeModal(modalEditar);
  renderLeads();
});
