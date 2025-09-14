// ====== ATUALIZAR ESTATÍSTICAS ======
function atualizarStats() {
    const hoje = new Date();
    const leadsHoje = leadsData.filter(l => {
        const created = l.createdAt ? new Date(l.createdAt) : null;
        return created && created.toDateString() === hoje.toDateString();
    }).length;

    const semana = leadsData.filter(l => {
        const created = l.createdAt ? new Date(l.createdAt) : null;
        if (!created) return false;
        const diff = hoje - created; // diferença em ms
        return diff <= 7 * 24 * 60 * 60 * 1000; // 7 dias
    }).length;

    const fechamentos = leadsData.filter(l => l.status === "fechado").length;
    const taxaConversao = leadsData.length ? Math.round((fechamentos / leadsData.length) * 100) : 0;

    document.getElementById("leads-hoje").textContent = leadsHoje;
    document.getElementById("leads-semana").textContent = semana;
    document.getElementById("fechamentos").textContent = fechamentos;
    document.getElementById("taxa-conversao").textContent = `${taxaConversao}%`;
}
