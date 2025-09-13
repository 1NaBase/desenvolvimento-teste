function renderLeads(leads) {
  leadsList.innerHTML = "";

  if (!leads || leads.length === 0) {
    leadsList.innerHTML = "<p>Nenhum lead encontrado.</p>";
    return;
  }

  leads.forEach((lead) => {
    const card = document.createElement("article");
    card.className = "lead-note";
    card.setAttribute("data-id", lead.lead_id);

    // Define a classe de status
    let statusClass = "status-novo";
    let statusText = lead.status || "Novo";
    if (statusText.toLowerCase().includes("contato")) statusClass = "status-contato";
    if (statusText.toLowerCase().includes("proposta")) statusClass = "status-proposta";
    if (statusText.toLowerCase().includes("fechado")) statusClass = "status-fechado";

    // Comentários
    let comentariosHTML = "";
    if (lead.ultima_msg) {
      comentariosHTML += `<li class="lead-comment">Última mensagem: ${lead.ultima_msg}</li>`;
    }
    if (lead.followUp) {
      comentariosHTML += `<li class="lead-comment">Follow-up: ${lead.followUp}</li>`;
    }

    card.innerHTML = `
      <input type="checkbox" class="lead-select" title="Selecionar lead">
      <div class="lead-meta">
        <h3>${lead.nome}</h3>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Telefone:</strong> ${lead.telefone}</p>
        <p class="message">${lead.mensagem}</p>
        <span class="status ${statusClass}" data-status="${lead.status || 'novo'}">${statusText}</span>

        <ul class="lead-comments ${comentariosHTML ? '' : 'hidden'}">
          ${comentariosHTML}
        </ul>
      </div>
      <div class="actions">
        <button class="btn-small btn-edit">Editar</button>
        <button class="btn-small btn-detalhes">Detalhes</button>
        <button class="btn-small btn-delete">Excluir</button>
      </div>
    `;

    leadsList.appendChild(card);
  });
}




