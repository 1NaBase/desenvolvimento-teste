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

// Função para renderizar os leads
function renderLeads(leads) {
  leadsList.innerHTML = "";

  if (!leads || leads.length === 0) {
    leadsList.innerHTML = "<p>Nenhum lead encontrado.</p>";
    return;
  }

  leads.forEach((lead, index) => {
    const card = document.createElement("article");
    card.className = "lead-card";
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="lead-info">
        <h3 class="text-neon-purple">${lead.nome}</h3>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Telefone:</strong> ${lead.telefone}</p>
        <p class="message">${lead.mensagem}</p>
      </div>
      <div class="lead-actions">
        <button class="btn-small">Editar</button>
        <button class="btn-secondary-small">Detalhes</button>
      </div>
    `;
    leadsList.appendChild(card);
  });
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
