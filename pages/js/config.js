// config.js - variáveis globais e elementos DOM

export const leadsContainer = document.getElementById("leads");
export const btnNewLead = document.getElementById("btn-new-lead");
export const btnExport = document.getElementById("btn-export");
export const btnDeleteSelected = document.getElementById("btn-delete-selected");
export const filterStatus = document.getElementById("filter-status");
export const filterSearch = document.getElementById("filter-search");
export const btnApplyFilters = document.getElementById("btn-apply-filters");
export const paginationInfo = document.querySelector(".pagination-info");
export const paginationPrev = document.querySelector(".pagination-btn:first-child");
export const paginationNext = document.querySelector(".pagination-btn:last-child");

export const modalDetalhes = document.getElementById("modal-detalhes");
export const detalhesContent = document.getElementById("detalhes-content");
export const detalhesCommentsList = document.getElementById("detalhes-comments-list");
export const newCommentInput = document.getElementById("new-comment-input");
export const btnAddComment = document.getElementById("btn-add-comment");

export const modalEditar = document.getElementById("modal-editar");
export const formEditar = document.getElementById("form-editar");
export const editNome = document.getElementById("edit-nome");
export const editEmail = document.getElementById("edit-email");
export const editTelefone = document.getElementById("edit-telefone");
export const editMsg = document.getElementById("edit-msg");
export const editStatus = document.getElementById("edit-status");

// Variáveis globais
export let leadsData = [];
export let currentLead = null;
export let currentPage = 1;
export const leadsPerPage = 5;
