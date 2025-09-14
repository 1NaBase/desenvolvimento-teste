// events.js - eventos dos leads

import { leadsData, currentLead } from "./config.js";
import { openLeadDetails } from "./details.js";
import { openLeadEdit } from "./edit.js";
import { renderLeads } from "./render.js";

export function attachLeadEvents(lead) {
  lead.querySelector(".btn-detalhes").addEventListener("click", () => openLeadDetails(lead));
  lead.querySelector(".btn-edit").addEventListener("click", () => openLeadEdit(lead));
  lead.querySelector(".btn-delete").addEventListener("click", () => {
    if (confirm("Deseja realmente excluir este lead?")) {
      const id = parseInt(lead.dataset.id);
      leadsData = leadsData.filter((l) => l.id !== id);
      renderLeads();
    }
  });
}
