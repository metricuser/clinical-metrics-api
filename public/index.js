
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, function (match) {
    const escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return escapeMap[match];
  });
}

function td(text) {
  const cell = document.createElement("td");
  cell.innerHTML = escapeHTML(text == null ? "" : text.toString());
  return cell;
}




document.addEventListener('DOMContentLoaded', function () {
  fetchFacilities();
  fetchEntries();
  populateYearDropdown();

  document.getElementById("facilityFilter").addEventListener("change", fetchEntries);
  document.getElementById("monthFilter").addEventListener("change", fetchEntries);
});

let facilityMap = {};
let editingId = null;

document.getElementById("scopeSelect").addEventListener("change", calculateAverages);
document.getElementById("quarterSelect").addEventListener("change", calculateAverages);
document.getElementById("yearSelect").addEventListener("change", calculateAverages);
document.getElementById("segment").addEventListener("change", calculateAverages);
document.getElementById("facility").addEventListener("change", calculateAverages);

function fetchFacilities() {
  fetch('/facilities')
    .then(response => response.json())
    .then(data => {
      const facilityNames = data.map(f => f.name?.trim().toLowerCase()).filter(Boolean).sort();
      const segments = [...new Set(data.map(f => f.segment))].filter(Boolean).sort();

      facilityMap = {};
      data.forEach(f => {
        if (f._id) facilityMap[f._id] = { name: f.name, segment: f.segment };
        if (f.name) facilityMap[f.name] = { name: f.name, segment: f.segment };
      });

      populateDropdown('facility', facilityNames);
      populateDropdown('segment', segments);
      populateDropdown('facilityFilter', ['All', ...facilityNames]);
    })
    .catch(error => console.error('Error fetching facilities:', error));
}

function fetchEntries() {
  fetch('/entries')
    .then(response => response.json())
    .then(data => renderEntries(data))
    .catch(error => console.error('Error loading entries:', error));
}

function renderEntries(entries) {
  const tableBody = document.getElementById("metricsTable");
  tableBody.innerHTML = "";

  const selectedFacility = (document.getElementById("facilityFilter").value || "all").trim().toLowerCase();
  const selectedMonth = (document.getElementById("monthFilter").value || "all").trim().toLowerCase();

  fetch('/facilities')
    .then(response => response.json())
    .then(facilities => {
      const filtered = entries.filter(entry => {
        const entryFacility = (
          facilities.find(f => f._id === entry.facility || f.name?.toLowerCase() === entry.facility?.toLowerCase())
            ?.name || entry.facility || ""
        ).toString().trim().toLowerCase();

        const entryMonth = (entry.month || "").trim().toLowerCase();
        const facilityMatch = selectedFacility === "all" || entryFacility === selectedFacility;
        const monthMatch = selectedMonth === "all" || entryMonth === selectedMonth;

        return facilityMatch && monthMatch;
      });


      
 filtered.forEach(entry => {
  const row = document.createElement("tr");

  const facilityName = facilities.find(f =>
    f._id === entry.facility || f.name?.toLowerCase() === entry.facility?.toLowerCase()
  )?.name || entry.facility || "";

  const swlUnplanned = typeof entry.swlUnplanned === "number" ? entry.swlUnplanned : 0;

  const apwPercent = entry.census ? ((entry.apwResidents / entry.census) * 100).toFixed(2) : '0.00';
  const swlPercent = entry.census ? ((swlUnplanned / entry.census) * 100).toFixed(2) : '0.00';
  const fallsPercent = entry.census ? ((entry.fallsResidents / entry.census) * 100).toFixed(2) : '0.00';

  const apwColor = apwPercent >= 3 ? 'red' : 'black';
  const swlColor = swlPercent >= 5 ? 'red' : 'black';
  const fallsColor = fallsPercent >= 13 ? 'red' : 'black';

  function td(text, isCentered = false, color = null) {
  const cell = document.createElement("td");
  cell.textContent = text || ''; // ✅ SAFE: treats everything as plain text
  if (isCentered) cell.classList.add("centered");
  if (color) cell.style.color = color;
  return cell;
}


  row.appendChild(td(facilityName));
  row.appendChild(td(entry.segment?.trim() || ""));
  row.appendChild(td(entry.month));
  row.appendChild(td(entry.year));
  row.appendChild(td(entry.census, true));
  row.appendChild(td(entry.apwResidents, true));
  row.appendChild(td(entry.swlResidents, true));
  row.appendChild(td(swlUnplanned, true));
  row.appendChild(td(entry.fallsResidents, true));
  row.appendChild(td(entry.fallsInjury, true));
  row.appendChild(td(`${apwPercent}%`, false, apwColor));
  row.appendChild(td(`${swlPercent}%`, false, swlColor));
  row.appendChild(td(`${fallsPercent}%`, false, fallsColor));
  console.log("Notes for entry", entry._id, ":", entry.notes);
  row.appendChild(td(escapeHtml(entry.notes || "")));

  const actionTd = document.createElement("td");
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.onclick = () => editEntry(entry._id);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = () => deleteEntry(entry._id);

  actionTd.appendChild(editBtn);
  actionTd.appendChild(deleteBtn);
  row.appendChild(actionTd);

  tableBody.appendChild(row);
});



const scripts = tableBody.querySelectorAll("script");
console.log("Injected <script> tags found in table:", scripts.length);
scripts.forEach(s => console.log(s.outerHTML));











      calculateAverages();
    });
}

function populateDropdown(id, items) {
  const dropdown = document.getElementById(id);
  if (!dropdown) return;

  dropdown.innerHTML = '';
  const defaultOption = document.createElement("option");
  defaultOption.value = id === "facilityFilter" || id === "monthFilter" ? "All" : "";
  defaultOption.textContent = id === "facilityFilter" || id === "monthFilter" ? "All" : "Select " + id.charAt(0).toUpperCase() + id.slice(1);
  dropdown.appendChild(defaultOption);

  items.forEach(item => {
    const option = document.createElement("option");
    option.value = item.trim().toLowerCase();
    option.textContent = item;
    dropdown.appendChild(option);
  });
}

function populateYearDropdown() {
  const years = [];
  for (let y = 2025; y <= 2030; y++) {
    years.push(y.toString());
  }
  populateDropdown('year', years);
}

document.getElementById("entryForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const entry = {
    facility: document.getElementById("facility").value,
    segment: document.getElementById("segment").value,
    month: document.getElementById("month").value,
    year: document.getElementById("year").value,
    census: parseInt(document.getElementById("census").value) || 0,
    apwResidents: parseInt(document.getElementById("apwResidents").value) || 0,
    apwNew: parseInt(document.getElementById("apwNew").value) || 0,
    swlResidents: parseInt(document.getElementById("swlResidents").value) || 0,
    swlUnplanned: parseInt(document.getElementById("swlUnplanned").value) || 0,
    swlNew: parseInt(document.getElementById("swlNew").value) || 0,
    swlUnavoidable: parseInt(document.getElementById("swlUnavoidable").value) || 0,
    fallsResidents: parseInt(document.getElementById("fallsResidents").value) || 0,
    fallsTotal: parseInt(document.getElementById("fallsTotal").value) || 0,
    fallsInjury: parseInt(document.getElementById("fallsInjury").value) || 0,
    notes: document.getElementById("notes").value || ""
  };

  const url = editingId ? `/entries/${editingId}` : "/entries";
  const method = editingId ? "PUT" : "POST";

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry)
  })
    .then(response => {
      if (!response.ok) throw new Error("Failed to submit entry.");
      return response.json();
    })
    .then(() => {
      fetchEntries();
      document.getElementById("entryForm").reset();
      editingId = null;
      document.getElementById("submitEntry").textContent = "Submit Entry";
    })
    .catch(error => {
      console.error("Error submitting entry:", error);
      alert("There was an error submitting the entry.");
    });
});

function editEntry(id) {
  fetch(`/entries/${id}`)
    .then(response => {
      if (!response.ok) throw new Error("Failed to fetch entry.");
      return response.json();
    })
    .then(entry => {
      document.getElementById("facility").value = entry.facility;
      document.getElementById("segment").value = entry.segment;
      document.getElementById("month").value = entry.month;
      document.getElementById("year").value = entry.year;
      document.getElementById("census").value = entry.census;
      document.getElementById("apwResidents").value = entry.apwResidents;
      document.getElementById("apwNew").value = entry.apwNew;
      document.getElementById("swlResidents").value = entry.swlResidents;
      document.getElementById("swlUnplanned").value = entry.swlUnplanned;
      document.getElementById("swlNew").value = entry.swlNew;
      document.getElementById("swlUnavoidable").value = entry.swlUnavoidable;
      document.getElementById("fallsResidents").value = entry.fallsResidents;
      document.getElementById("fallsTotal").value = entry.fallsTotal;
      document.getElementById("fallsInjury").value = entry.fallsInjury;
      document.getElementById("notes").value = entry.notes;

      editingId = id;
      document.getElementById("submitEntry").textContent = "Update Entry";
    })
    .catch(error => {
      console.error("Error loading entry for edit:", error);
      alert("Could not load entry for editing.");
    });
}

function deleteEntry(id) {
  if (!confirm("Are you sure you want to delete this entry?")) return;

  fetch(`/entries/${id}`, { method: "DELETE" })
    .then(response => {
      if (!response.ok) throw new Error("Failed to delete entry.");
      fetchEntries();
    })
    .catch(error => {
      console.error("Error deleting entry:", error);
      alert("There was an error deleting the entry.");
    });
}

function getQuarter(month) {
  const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const monthIndex = months.indexOf(month);
  return monthIndex < 0 ? null : Math.floor(monthIndex / 3) + 1;
}

function calculateAverages() {
  const rows = document.querySelectorAll("#metricsTable tr");

  const selectedYear = parseInt(document.getElementById("yearSelect").value);
  const selectedQuarter = parseInt(document.getElementById("quarterSelect").value.replace("Q", ""));
  const selectedScope = document.getElementById("scopeSelect").value;

  const selectedFacility = document.getElementById("facility").value?.trim().toLowerCase() || "";
  const selectedSegment = document.getElementById("segment").value?.trim().toLowerCase() || "";

  let quarterly = { apw: 0, swl: 0, falls: 0, count: 0 };
  let annual = { apw: 0, swl: 0, falls: 0, count: 0 };

  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    if (cells.length < 13) return;

    const rowFacility = (cells[0].textContent || "").trim().toLowerCase();
    const rowSegment = (cells[1].textContent || "").trim().toLowerCase();
    const month = cells[2].textContent.trim();
    const year = parseInt(cells[3].textContent.trim());

    const apwPct = parseFloat(cells[10].textContent) || 0;
    const swlPct = parseFloat(cells[11].textContent) || 0;
    const fallsPct = parseFloat(cells[12].textContent) || 0;

    const rowQuarter = getQuarter(month);

    let include = false;
    if (selectedScope === "Corporate") {
      include = true;
    } else if (selectedScope === "Segment" && rowSegment === selectedSegment) {
      include = true;
    } else if (selectedScope === "Facility" && rowFacility === selectedFacility) {
      include = true;
    }

    if (include && year === selectedYear) {
      annual.apw += apwPct;
      annual.swl += swlPct;
      annual.falls += fallsPct;
      annual.count++;

      if (rowQuarter === selectedQuarter) {
        quarterly.apw += apwPct;
        quarterly.swl += swlPct;
        quarterly.falls += fallsPct;
        quarterly.count++;
      }
    }
  });

  function avg(val, count) {
    return count > 0 ? (val / count).toFixed(2) + "%" : "0%";
  }

  document.getElementById("avgAPWQ").textContent = avg(quarterly.apw, quarterly.count);
  document.getElementById("avgSWLQ").textContent = avg(quarterly.swl, quarterly.count);
  document.getElementById("avgFallsQ").textContent = avg(quarterly.falls, quarterly.count);
  document.getElementById("avgAPWA").textContent = avg(annual.apw, annual.count);
  document.getElementById("avgSWLA").textContent = avg(annual.swl, annual.count);
  document.getElementById("avgFallsA").textContent = avg(annual.falls, annual.count);
  document.getElementById("scopeLabel").textContent =
    selectedScope === "Segment" ? (selectedSegment || "Segment") :
    selectedScope === "Facility" ? (selectedFacility || "Facility") :
    "Corporate";
}
