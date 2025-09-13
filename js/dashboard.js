function renderLeads(leads) {
  leadsList.innerHTML = "";

  if (!leads || leads.length === 0) {
    leadsList.innerHTML = "<p>Nenhum lead encontrado.</p>";
    return;
  }

  leads.forEach((lead) => {
    const card = document.createElement("article");
    card.className = "lead-note";
    card.dataset.id = lead.id;

    card.innerHTML = `
      <input type="checkbox" class="lead-select" title="Selecionar lead">
      <div class="lead-meta">
        <h3>${lead.nome}</h3>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Telefone:</strong> ${lead.telefone}</p>
        <p class="message">${lead.mensagem}</p>
        <span class="status ${lead.status}" data-status="${lead.status}">
          ${lead.status.replace("status-", "").toUpperCase()}
        </span>

        <ul class="lead-comments hidden">
          ${lead.comentarios ? lead.comentarios.map(c => `<li class="lead-comment">${c}</li>`).join("") : ""}
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

