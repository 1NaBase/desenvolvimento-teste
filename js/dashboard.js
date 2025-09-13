// Seletores
const leadsList = document.querySelector(".leads-list");
const prevBtn = document.querySelector(".pagination-btn:first-child");
const nextBtn = document.querySelector(".pagination-btn:last-child");
const pageInfo = document.querySelector(".pagination-info");

let currentPage = 1;
const limit = 5; // leads por página

// Função para buscar leads da API
async function fetchLeads(page = 1) {
  try {
    const res = await fetch(`/api/leads?page=${page}&limit=${limit}`);
    const data = await res.json();

    renderLeads(data.leads);
    updatePagination(data.leads.length);
  } catch (err) {
    console.error("Erro ao buscar leads:", err);
    leadsList.innerHTML = "<p class='text-red-500'>Erro ao carregar leads.</p>";
  }
}

// Função para renderizar os leads no formato lead-note
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
        <span class="status status-${lead.status}" data-status="${lead.status}">
          ${formatarStatus(lead.status)}
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

// Função para exibir o nome do status
function formatarStatus(status) {
  switch (status) {
    case "novo": return "Novo";
    case "contato": return "Em Contato";
    case "proposta": return "Proposta Enviada";
    case "fechado": return "Fechado";
    default: return "Novo";
  }
}

// Atualiza estado dos botões de paginação
function updatePagination(fetchedLength) {
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = fetchedLength < limit;
  pageInfo.textContent = `Página ${currentPage}`;
}

// Eventos de paginação
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchLeads(currentPage);
  }
});

nextBtn.addEventListener("click", () => {
  currentPage++;
  fetchLeads(currentPage);
});

// Inicializar
fetchLeads(currentPage);

