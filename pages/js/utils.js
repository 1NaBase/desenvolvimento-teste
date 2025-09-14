// utils.js - funções auxiliares

export function openModal(el) {
  if (typeof el === "string") document.getElementById(el).classList.remove("hidden");
  else el.classList.remove("hidden");
}

export function closeModal(el) {
  if (typeof el === "string") document.getElementById(el).classList.add("hidden");
  else el.classList.add("hidden");
}

export function statusText(status) {
  return {
    novo: "Novo",
    contato: "Em Contato",
    proposta: "Proposta Enviada",
    fechado: "Fechado",
  }[status] || status;
}
