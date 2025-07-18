
console.log("🔥 index.js DEPLOYED AND LIVE 🔥");

const BASE_URL = 'https://clinical-metrics-api.onrender.com';

fetch(`${BASE_URL}/entries`)
  .then(res => res.json())
  .then(data => {
    console.log("✅ Entries loaded from Render API:", data.length);
    document.body.insertAdjacentHTML("beforeend", `<p>✅ Entries loaded: ${data.length}</p>`);
  })
  .catch(err => {
    console.error("❌ Fetch failed:", err);
    document.body.insertAdjacentHTML("beforeend", `<p style="color:red">❌ Failed to load entries from API.</p>`);
  });
