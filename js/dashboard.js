// dashboard.js
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
const modalEditar = document.getElementById("modal-editar");
const detalhesContent = document.getElementById("detalhes-content");
const detalhesCommentsList = document.getElementById("detalhes-comments-list");
const newCommentInput = document.getElementById("new-comment-input");

const editNome = document.getElementById("edit-nome");
const editEmail = document.getElementById("edit-email");
const editTelefone = document.getElementById("edit-telefone");
const editMsg = document.getElementById("edit-msg");
const editStatus = document.getElementById("edit-status");
const formEditar = document.getElementById("form-editar");

let leadsData = [];
let currentLead = null;
let currentPage = 1;
const leadsPerPage = 5;

// ================== FUNÇÕES AUXILIARES ==================
function openModal(el) { el.classList.remove("hidden"); }
function closeModal(el) { el.classList.add("hidden"); }

[modalDetalhes, modalEditar].forEach(modal => {
    modal.addEventListener("click", e => { if(e.target===modal) closeModal(modal); });
});
document.addEventListener("keydown", e => {
    if(e.key==="Escape"){ closeModal(modalDetalhes); closeModal(modalEditar); }
});

function statusText(status){
    return { novo:"Novo", contato:"Em Contato", proposta:"Proposta Enviada", fechado:"Fechado"}[status] || status;
}

// ================== BUSCAR LEADS DA API ==================
async function fetchLeadsFromAPI(page = 1, limit = 1000) {
    try {
        const res = await fetch(`/api/leads?page=${page}&limit=${limit}`);
        const data = await res.json();
        return data.leads.map(l => ({
            id: l.lead_id,
            nome: l.nome,
            email: l.email,
            telefone: l.telefone,
            mensagem: l.mensagem,
            status: l.status.replace("status-", ""),
            comments: l.ultima_msg ? [l.ultima_msg] : [],
            followUp: l.followUp
        })) || [];
    } catch(err){
        console.error("Erro ao buscar leads da API:", err);
        return [];
    }
}

// ================== RENDERIZAR LEADS ==================
function renderLeads() {
    leadsContainer.innerHTML = "";
    const filtered = leadsData.filter(l => {
        const matchesStatus = !filterStatus.value || l.status === filterStatus.value;
        const query = filterSearch.value.trim().toLowerCase();
        const matchesQuery = !query || l.nome.toLowerCase().includes(query) || l.email.toLowerCase().includes(query);
        return matchesStatus && matchesQuery;
    });

    const totalPages = Math.ceil(filtered.length / leadsPerPage);
    if(currentPage > totalPages) currentPage = totalPages || 1;

    const start = (currentPage-1)*leadsPerPage;
    const end = start + leadsPerPage;
    const pageLeads = filtered.slice(start,end);

    pageLeads.forEach(lead => {
        const article = document.createElement("article");
        article.className = "lead-note";
        article.dataset.id = lead.id;
        article.innerHTML = `
            <input type="checkbox" class="lead-select">
            <div class="lead-meta">
                <h3>${lead.nome}</h3>
                <p><strong>Email:</strong> ${lead.email}</p>
                <p><strong>Telefone:</strong> ${lead.telefone}</p>
                <p>${lead.mensagem}</p>
                <span class="status status-${lead.status}">${statusText(lead.status)}</span>
                <ul class="lead-comments hidden">
                    ${lead.comments.map(c=>`<li>${c}</li>`).join("")}
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
    paginationPrev.disabled = currentPage===1;
    paginationNext.disabled = currentPage===totalPages || totalPages===0;
}

// ================== EVENTOS DE LEAD ==================
function attachLeadEvents(leadEl){
    leadEl.querySelector(".btn-detalhes").addEventListener("click",()=>{
        const id = parseInt(leadEl.dataset.id);
        currentLead = leadsData.find(l=>l.id===id);
        detalhesContent.innerHTML = `
            <p><strong>Nome:</strong> ${currentLead.nome}</p>
            <p><strong>Email:</strong> ${currentLead.email}</p>
            <p><strong>Telefone:</strong> ${currentLead.telefone}</p>
            <p><strong>Mensagem:</strong> ${currentLead.mensagem}</p>
            <p><strong>Status:</strong> ${statusText(currentLead.status)}</p>
        `;
        detalhesCommentsList.innerHTML = currentLead.comments.length ?
            currentLead.comments.map(c=>`<li>${c}</li>`).join("") : "<li class='text-sm text-gray-500'>Sem comentários</li>";
        newCommentInput.value="";
        openModal(modalDetalhes);
        newCommentInput.focus();
    });

    leadEl.querySelector(".btn-edit").addEventListener("click",()=>{
        const id = parseInt(leadEl.dataset.id);
        currentLead = leadsData.find(l=>l.id===id);
        editNome.value=currentLead.nome;
        editEmail.value=currentLead.email;
        editTelefone.value=currentLead.telefone;
        editMsg.value=currentLead.mensagem;
        editStatus.value=currentLead.status;
        openModal(modalEditar);
    });

    leadEl.querySelector(".btn-delete").addEventListener("click",()=>{
        if(confirm("Deseja realmente excluir este lead?")){
            leadsData = leadsData.filter(l=>l.id!==parseInt(leadEl.dataset.id));
            renderLeads();
        }
    });
}

// ================== MODAL COMENTÁRIOS ==================
document.getElementById("btn-add-comment").addEventListener("click",()=>{
    if(!currentLead) return;
    const text = newCommentInput.value.trim();
    if(!text) return alert("Digite um comentário");
    currentLead.comments.push(text);
    renderLeads();
    document.querySelector(`.lead-note[data-id="${currentLead.id}"] .btn-detalhes`).click();
});
newCommentInput.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault(); document.getElementById("btn-add-comment").click();}});

// ================== MODAL EDITAR ==================
formEditar.addEventListener("submit", e=>{
    e.preventDefault();
    Object.assign(currentLead,{
        nome: editNome.value,
        email: editEmail.value,
        telefone: editTelefone.value,
        mensagem: editMsg.value,
        status: editStatus.value
    });
    closeModal(modalEditar);
    renderLeads();
});

// ================== FILTROS ==================
filterStatus.addEventListener("change",()=>{currentPage=1; renderLeads();});
filterSearch.addEventListener("input",()=>{currentPage=1; renderLeads();});
btnApplyFilters.addEventListener("click",()=>{currentPage=1; renderLeads();});

// ================== PAGINAÇÃO ==================
paginationPrev.addEventListener("click",()=>{if(currentPage>1){currentPage--; renderLeads();}});
paginationNext.addEventListener("click",()=>{currentPage++; renderLeads();});

// ================== NOVO LEAD ==================
btnNewLead.addEventListener("click", async()=>{
    const nome = prompt("Digite o nome do novo lead:");
    if(!nome) return;
    const res = await fetch("/api/leads",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({nome,email:"email@exemplo.com",telefone:"(00) 00000-0000",mensagem:"Mensagem de exemplo"})
    });
    const data = await res.json();
    leadsData.unshift({
        id: data.lead.lead_id,
        nome: data.lead.nome,
        email: data.lead.email,
        telefone: data.lead.telefone,
        mensagem: data.lead.mensagem,
        status: data.lead.status.replace("status-",""),
        comments: []
    });
    currentPage=1;
    renderLeads();
});

// ================== EXPORTAR JSON ==================
btnExport.addEventListener("click",()=>{
    const blob = new Blob([JSON.stringify(leadsData,null,2)],{type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download="leads.json";
    a.click();
    a.remove();
});

// ================== INICIAR ==================
document.addEventListener("DOMContentLoaded", async()=>{
    leadsData = await fetchLeadsFromAPI();
    renderLeads();
});



