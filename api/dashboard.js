async function carregarLeads() {
  try {
    const res = await fetch("/api/leads");
    const json = await res.json();

    const tbody = document.querySelector("table.crm-table tbody");
    tbody.innerHTML = "";

    json.leads.forEach((lead) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${lead.nome}</td>
        <td>${lead.email}</td>
        <td>${lead.telefone}</td>
        <td class="max-w-xs truncate">${lead.mensagem}</td>
        <td><span class="status-badge status-${lead.status}">${lead.status}</span></td>
        <td>${new Date(lead.created_at).toLocaleDateString()}</td>
        <td>
          <button class="text-blue-400 hover:text-blue-300 mr-2">Editar</button>
          <button class="text-purple-400 hover:text-purple-300">Detalhes</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao carregar leads:", err);
  }
}

// Carrega os leads ao abrir a página
window.addEventListener("DOMContentLoaded", carregarLeads);
