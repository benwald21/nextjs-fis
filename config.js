const FIS_CONFIG = {
  AIRTABLE_TOKEN: 'patdursXQTMkI2jjH.42d70dce8a27b8d1292e260443d7820e99a2982a98a0e1961842258ad32d581e',
  BASE_ID: 'appcwgO0x00bccESC',
  TABLES: {
    PLAYERS: 'Players',
    SCHEDULE: 'Schedule',
    WELLNESS: 'Wellness Checks',
    INJURIES: 'Injuries',
    TRAINING: 'Training_Sessions',
    LOAD: 'Player_Load_Data',
    PROSPECTS: 'Prospects',
    SCHOLARSHIP: 'Scholarship_Budget',
    OPPONENTS: 'Opponents',
    TASKS: 'Staff_Tasks',
    ACADEMICS: 'Academics',
    ALUMNI: 'Alumni',
    CAMPS: 'Camp_Participants',
    MARKETING: 'Marketing_KPIs',
    BUDGET: 'Budget_Items'
  }
};

// Airtable API helper
async function airtableFetch(table, params = {}) {
  const base = `https://api.airtable.com/v0/${FIS_CONFIG.BASE_ID}/${encodeURIComponent(table)}`;
  const url = new URL(base);
  if (params.filterByFormula) url.searchParams.set('filterByFormula', params.filterByFormula);
  if (params.sort) params.sort.forEach((s, i) => {
    url.searchParams.set(`sort[${i}][field]`, s.field);
    url.searchParams.set(`sort[${i}][direction]`, s.direction || 'asc');
  });
  if (params.maxRecords) url.searchParams.set('maxRecords', params.maxRecords);
  if (params.view) url.searchParams.set('view', params.view);

  const res = await fetch(url.toString(), {
    headers: { 'Authorization': `Bearer ${FIS_CONFIG.AIRTABLE_TOKEN}` }
  });
  if (!res.ok) throw new Error(`Airtable error: ${res.status} — Table: ${table}`);
  const data = await res.json();
  return data.records || [];
}

async function airtableCreate(table, fields) {
  const res = await fetch(`https://api.airtable.com/v0/${FIS_CONFIG.BASE_ID}/${encodeURIComponent(table)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${FIS_CONFIG.AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields })
  });
  if (!res.ok) throw new Error(`Airtable create error: ${res.status}`);
  return res.json();
}

async function airtableUpdate(table, recordId, fields) {
  const res = await fetch(`https://api.airtable.com/v0/${FIS_CONFIG.BASE_ID}/${encodeURIComponent(table)}/${recordId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${FIS_CONFIG.AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields })
  });
  if (!res.ok) throw new Error(`Airtable update error: ${res.status}`);
  return res.json();
}
