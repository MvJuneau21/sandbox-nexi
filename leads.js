const DATA_URL = 'data/leads.json';

const form = document.getElementById('filters');
const searchInput = document.getElementById('search');
const statusSelect = document.getElementById('status');
const sortSelect = document.getElementById('sort');
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

// createdAt is "YYYY-MM-DD", so plain string comparison already sorts by date.
function sortLeads(leads, order) {
  const sorted = [...leads];
  if (order === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  } else if (order === 'oldest') {
    sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  } else {
    sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  return sorted;
}

// Split the string instead of using new Date(), which would shift the day
// back in negative UTC offsets like Brazil's.
function formatDate(isoDate) {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
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

  const date = document.createElement('p');
  date.className = 'lead-date';
  const time = document.createElement('time');
  time.dateTime = lead.createdAt;
  time.textContent = formatDate(lead.createdAt);
  date.append('Entrou em ', time);

  const badge = document.createElement('span');
  badge.className = `badge ${statusClass(lead.status)}`;
  badge.textContent = lead.status;

  item.append(name, company, email, date, badge);
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
  const filtered = filterLeads(allLeads, searchInput.value, statusSelect.value);
  renderLeads(sortLeads(filtered, sortSelect.value));
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
sortSelect.addEventListener('change', update);

loadLeads();
