async function searchCountry() {
  const input = document.getElementById('search').value.trim();
  const result = document.getElementById('result');

  if (!input) return;

  result.innerHTML = '<p>Loading...</p>';

  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${input}`
    );

    if (!response.ok) throw new Error('Country not found');

    const data = await response.json();
    const country = data[0];

    const languages = Object.values(country.languages || {}).join(', ');
    const population = country.population.toLocaleString();

    result.innerHTML = `
      <div class="card">
        <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" />
        <h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${country.capital?.[0] ?? 'N/A'}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Population:</strong> ${population}</p>
        <p><strong>Languages:</strong> ${languages}</p>
      </div>
    `;
  } catch (err) {
    result.innerHTML = `<p class="error">${err.message}</p>`;
  }
}
async function loadAll() {
  const result = document.getElementById('result');
  const btn = document.getElementById('load-all-btn');

  btn.textContent = 'Loading...';
  btn.disabled = true;

  try {
    const response = await fetch(
      'https://restcountries.com/v3.1/all?fields=name,flags,capital,region,population,languages'
    );

    if (!response.ok) throw new Error('Failed to load countries');

    const data = await response.json();

    data.sort((a, b) =>
      a.name.common.localeCompare(b.name.common)
    );

    result.innerHTML = `<div class="grid">${
      data.map(country => {
        const pop = country.population.toLocaleString();
        const lang = Object.values(country.languages || {}).slice(0, 2).join(', ');
        return `
          <div class="card">
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" />
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital?.[0] ?? 'N/A'}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Population:</strong> ${pop}</p>
            <p><strong>Languages:</strong> ${lang || 'N/A'}</p>
          </div>
        `;
      }).join('')
    }</div>`;

    btn.textContent = 'Reload all countries';
    btn.disabled = false;

  } catch (err) {
    result.innerHTML = `<p class="error">${err.message}</p>`;
    btn.textContent = 'Load all countries';
    btn.disabled = false;
  }
}

document.getElementById('search').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchCountry();
});