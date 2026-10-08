const DATA_URL = 'data/leads.json';

const form = document.getElementById('filters');
const searchInput = document.getElementById('search');
const statusSelect = document.getElementById('status');
const countEl = document.getElementById('count');
const errorEl = document.getElementById('error');
const emptyEl = document.getElementById('empty');
const listEl = document.getElementById('lead-list');

let allLeads = [];

// Lowercase and strip accents so "joao" matches "João".
function normalize(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function filterLeads(leads, query, status) {
  const term = normalize(query.trim());
  return leads.filter((lead) => {
    const matchesStatus = !status || lead.status === status;
    const haystack = normalize(`${lead.name} ${lead.company} ${lead.email}`);
    return matchesStatus && haystack.includes(term);
  });
}

function statusClass(status) {
  return 'badge--' + normalize(status).replace(/\s+/g, '-');
}

function createLeadItem(lead) {
  const item = document.createElement('li');
  item.className = 'lead-card';

  const name = document.createElement('h2');
  name.textContent = lead.name;

  const company = document.createElement('p');
  company.className = 'lead-company';
  company.textContent = lead.company;

  const email = document.createElement('a');
  email.href = `mailto:${lead.email}`;
  email.textContent = lead.email;

  const badge = document.createElement('span');
  badge.className = `badge ${statusClass(lead.status)}`;
  badge.textContent = lead.status;

  item.append(name, company, email, badge);
  return item;
}

function renderLeads(leads) {
  listEl.replaceChildren(...leads.map(createLeadItem));
  countEl.textContent = leads.length === 1
    ? '1 lead encontrado'
    : `${leads.length} leads encontrados`;
  emptyEl.hidden = leads.length > 0;
}

function update() {
  renderLeads(filterLeads(allLeads, searchInput.value, statusSelect.value));
}

function showError() {
  errorEl.textContent = 'Não foi possível carregar os leads. Tente novamente mais tarde.';
  errorEl.hidden = false;
  form.hidden = true;
  countEl.hidden = true;
  listEl.hidden = true;
}

async function loadLeads() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ao buscar ${DATA_URL}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('O JSON de leads não é uma lista');
    }
    allLeads = data;
    update();
  } catch (error) {
    console.error('Falha ao carregar leads:', error);
    showError();
  }
}

form.addEventListener('submit', (event) => event.preventDefault());
searchInput.addEventListener('input', update);
statusSelect.addEventListener('change', update);

loadLeads();
