// filters.js - filtros de leads

import { filterStatus, filterSearch, btnApplyFilters, leadsData, currentPage } from "./config.js";
import { renderLeads } from "./render.js";

export function getFilteredLeads() {
  const status = filterStatus.value;
  const query = filterSearch.value.trim().toLowerCase();
  return leadsData.filter((lead) => {
    const matchesStatus = !status || lead.status === status;
    const matchesQuery = !query || lead.nome.toLowerCase().includes(query) || lead.email.toLowerCase().includes(query);
    return matchesStatus && matchesQuery;
  });
}

filterStatus.addEventListener("change", () => { currentPage = 1; renderLeads(); });
filterSearch.addEventListener("input", () => { currentPage = 1; renderLeads(); });
btnApplyFilters.addEventListener("click", () => { currentPage = 1; renderLeads(); });
