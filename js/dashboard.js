const leadsList = document.querySelector(".leads-list");

// Função que busca do banco (via API)
async function fetchLeads() {
  try {
    const res = await fetch("/api/leads");
    const leads = await res.json();
    renderLeads(leads);
  } catch (err) {
    console.error("Erro ao carregar leads:", err);
    leadsList.innerHTML = "<p class='text-red-500'>Erro ao carregar leads.</p>";
  }
}

// Função que renderiza no HTML
function renderLeads(leads) {
  leadsList.innerHTML = ""; // limpa antes

  if (!leads || leads.length === 0) {
    leadsList.innerHTML = "<p>Nenhum lead encontrado.</p>";
    return;
  }

  leads.forEach((lead) => {
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
        <span class="status status-${lead.status}" data-status="${lead.status}">
          ${formatarStatus(lead.status)}
        </span>
        <ul class="lead-comments hidden">
          ${
            lead.comentarios
              ? lead.comentarios.map(c => `<li class="lead-comment">${c}</li>`).join("")
              : ""
          }
        </ul>
      </div>
      <div class="actions">
        <button class="btn-small btn-edit">Editar</button>
        <button class="btn-small btn-detalhes">Detalhes</button>
        <button class="btn-small btn-delete">Excluir</button>
      </div>
    `;

    leadsList.appendChild(article);
  });
}

// Traduz o status para exibir bonito
function formatarStatus(status) {
  switch (status) {
    case "novo": return "Novo";
    case "contato": return "Em Contato";
    case "proposta": return "Proposta Enviada";
    case "fechado": return "Fechado";
    default: return "Novo";
  }
}

// Carregar quando a página abrir
fetchLeads();


