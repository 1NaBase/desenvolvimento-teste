/* dashboard.js - versão otimizada */

// =============== ELEMENTOS ===============
const leadsContainer = document.getElementById("leads");
const btnNewLead = document.getElementById("btn-new-lead");
const btnExport = document.getElementById("btn-export");
const btnDeleteSelected = document.getElementById("btn-delete-selected");
const filterStatus = document.getElementById("filter-status");
const filterSearch = document.getElementById("filter-search");
const btnApplyFilters = document.getElementById("btn-apply-filters");
const paginationInfo = document.querySelector(".pagination-info");
const paginationPrev = document.querySelector(".pagination-btn:first-child");
const paginationNext = document.querySelector(".pagination-btn:last-child");

const modalDetalhes = document.getElementById("modal-detalhes");
const detalhesContent = document.getElementById("detalhes-content");
const detalhesCommentsList = document.getElementById("detalhes-comments-list");
const newCommentInput = document.getElementById("new-comment-input");
const btnAddComment = document.getElementById("btn-add-comment");

const modalEditar = document.getElementById("modal-editar");
const formEditar = document.getElementById("form-editar");
const editNome = document.getElementById("edit-nome");
const editEmail = document.getElementById("edit-email");
const editTelefone = document.getElementById("edit-telefone");
const editMsg = document.getElementById("edit-msg");
const editStatus = document.getElementById("edit-status");

// =============== VARIÁVEIS GLOBAIS ===============
let leadsData = [];       // Todos os leads carregados
let currentLead = null;   // Lead atual para edição/detalhes
let currentPage = 1;      // Página atual
const leadsPerPage = 5;   // Leads por página

// =============== FUNÇÕES AUXILIARES ===============
function openModal(el) {
    if (typeof el === 'string') document.getElementById(el).classList.remove("hidden");
    else el.classList.remove("hidden");
}
function closeModal(el) {
    if (typeof el === 'string') document.getElementById(el).classList.add("hidden");
    else el.classList.add("hidden");
}

// Fecha modal ao clicar fora
[modalDetalhes, modalEditar].forEach(modal => {
    modal.addEventListener("click", e => { if(e.target === modal) closeModal(modal.id); });
});
// Fecha com ESC
document.addEventListener("keydown", e => {
    if(e.key === "Escape") { closeModal("modal-detalhes"); closeModal("modal-editar"); }
});

// =============== RENDERIZAÇÃO DE LEADS ===============
function renderLeads() {
    leadsContainer.innerHTML = "";
    const filtered = getFilteredLeads();
    const totalPages = Math.ceil(filtered.length / leadsPerPage);
    if(currentPage > totalPages) currentPage = totalPages || 1;

    const start = (currentPage - 1) * leadsPerPage;
    const end = start + leadsPerPage;
    const pageLeads = filtered.slice(start, end);

    pageLeads.forEach(lead => {
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
                    ${lead.comments.map(c => `<li class="lead-comment">${c}</li>`).join("")}
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

function statusText(status) {
    return { novo: "Novo", contato: "Em Contato", proposta: "Proposta Enviada", fechado: "Fechado" }[status] || status;
}

// =============== FILTROS ===============
function getFilteredLeads() {
    const status = filterStatus.value;
    const query = filterSearch.value.trim().toLowerCase();
    return leadsData.filter(lead => {
        const matchesStatus = !status || lead.status === status;
        const matchesQuery = !query || lead.nome.toLowerCase().includes(query) || lead.email.toLowerCase().includes(query);
        return matchesStatus && matchesQuery;
    });
}

filterStatus.addEventListener("change", () => { currentPage = 1; renderLeads(); });
filterSearch.addEventListener("input", () => { currentPage = 1; renderLeads(); });
btnApplyFilters.addEventListener("click", () => { currentPage = 1; renderLeads(); });

// =============== PAGINAÇÃO ===============
paginationPrev.addEventListener("click", () => { if(currentPage>1){ currentPage--; renderLeads(); }});
paginationNext.addEventListener("click", () => { currentPage++; renderLeads(); });

// =============== ANEXAR EVENTOS ===============
function attachLeadEvents(lead) {
    lead.querySelector(".btn-detalhes").addEventListener("click", () => openLeadDetails(lead));
    lead.querySelector(".btn-edit").addEventListener("click", () => openLeadEdit(lead));
    lead.querySelector(".btn-delete").addEventListener("click", () => {
        if(confirm("Deseja realmente excluir este lead?")){
            const id = parseInt(lead.dataset.id);
            leadsData = leadsData.filter(l => l.id !== id);
            renderLeads();
        }
    });
}

// =============== DETALHES ===============
function openLeadDetails(leadEl) {
    const id = parseInt(leadEl.dataset.id);
    currentLead = leadsData.find(l => l.id === id);
    const l = currentLead;

    detalhesContent.innerHTML = `
        <p><strong>Nome:</strong> ${l.nome}</p>
        <p><strong>Email:</strong> ${l.email}</p>
        <p><strong>Telefone:</strong> ${l.telefone}</p>
        <p><strong>Mensagem:</strong> ${l.mensagem}</p>
        <p><strong>Status:</strong> ${statusText(l.status)}</p>
    `;

    detalhesCommentsList.innerHTML = l.comments.length ? 
        l.comments.map(c => `<li>${c}</li>`).join("") : "<li class='text-sm text-gray-500'>Sem comentários</li>";

    newCommentInput.value = "";
    openModal(modalDetalhes);
    newCommentInput.focus();
}

// Adicionar comentário
btnAddComment.addEventListener("click", () => {
    if(!currentLead) return;
    const text = newCommentInput.value.trim();
    if(!text) return alert("Digite um comentário antes.");
    currentLead.comments.push(text);
    renderLeads();
    openLeadDetails(document.querySelector(`.lead-note[data-id="${currentLead.id}"]`));
});

// Enter para adicionar comentário
newCommentInput.addEventListener("keydown", e => { if(e.key === "Enter"){ e.preventDefault(); btnAddComment.click(); }});

// =============== EDIÇÃO ===============
function openLeadEdit(leadEl){
    const id = parseInt(leadEl.dataset.id);
    currentLead = leadsData.find(l => l.id === id);

    editNome.value = currentLead.nome;
    editEmail.value = currentLead.email;
    editTelefone.value = currentLead.telefone;
    editMsg.value = currentLead.mensagem;
    editStatus.value = currentLead.status;

    openModal(modalEditar);
}

formEditar.addEventListener("submit", e => {
    e.preventDefault();
    Object.assign(currentLead, {
        nome: editNome.value,
        email: editEmail.value,
        telefone: editTelefone.value,
        mensagem: editMsg.value,
        status: editStatus.value
    });
    closeModal(modalEditar);
    renderLeads();
});

// =============== NOVO LEAD ===============
btnNewLead.addEventListener("click", () => {
    const nome = prompt("Digite o nome do novo lead:");
    if(!nome) return;

    const newLead = {
        id: Date.now(),
        nome,
        email: "email@exemplo.com",
        telefone: "(00) 00000-0000",
        mensagem: "Mensagem de exemplo",
        status: "novo",
        comments: []
    };
    leadsData.unshift(newLead);
    currentPage = 1;
    renderLeads();
});

// =============== EXCLUIR SELECIONADOS ===============
btnDeleteSelected.addEventListener("click", () => {
    const checkedIds = Array.from(document.querySelectorAll(".lead-select:checked"))
        .map(cb => parseInt(cb.closest(".lead-note").dataset.id));

    if(!checkedIds.length) return alert("Nenhum lead selecionado.");
    if(!confirm(`Deseja excluir ${checkedIds.length} lead(s) selecionado(s)?`)) return;

    leadsData = leadsData.filter(l => !checkedIds.includes(l.id));
    renderLeads();
});

// =============== EXPORTAR JSON ===============
btnExport.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(leadsData, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    alert("Arquivo leads.json gerado (download).");
});

// =============== CARREGAR LEADS INICIALMENTE ===============
async function carregarLeads() {
    try {
        // Pode substituir por /api/leads para buscar da API
        const res = await fetch("/leads.json"); 
        leadsData = await res.json();
        renderLeads();
    } catch(err) {
        console.error("Erro ao carregar leads:", err);
        leadsData = []; 
    }
}
document.addEventListener("DOMContentLoaded", carregarLeads);




