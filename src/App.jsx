import { useState, useRef } from "react";

const PROJECTS = [
  "Ruakura Superhub – Stage 3",
  "Rototuna Road Upgrade",
  "Hamilton Ring Road – Section B",
  "Waikato River Stopbank",
  "Te Rapa Subdivision",
];

const PLANT_LIST = [
  "20T Excavator", "10T Excavator", "5T Excavator",
  "D6 Dozer", "D8 Dozer",
  "12T Roller", "Padfoot Roller",
  "Water Truck", "Tip Truck (10m³)", "Flat Deck Truck",
  "Grader", "Telehandler", "Loader",
  "Concrete Pump", "Compactor Plate",
];

const WEATHER_OPTIONS = [
  { label: "Fine", icon: "☀️" },
  { label: "Cloudy", icon: "☁️" },
  { label: "Light Rain", icon: "🌦" },
  { label: "Heavy Rain", icon: "🌧" },
  { label: "Wind", icon: "💨" },
  { label: "Frost", icon: "❄️" },
];

const WORK_CATEGORIES = [
  "Earthworks", "Drainage", "Roading", "Concrete",
  "Utilities", "Landscaping", "Retaining", "Other",
];

const initialForm = {
  project: "",
  date: new Date().toISOString().split("T")[0],
  weather: "",
  tempMin: "",
  tempMax: "",
  personnel: [{ name: "", role: "", hours: "8" }],
  plant: [],
  workItems: [{ category: "", description: "", qty: "", unit: "" }],
  materials: [{ item: "", supplier: "", qty: "", unit: "" }],
  issues: "",
  visitors: "",
  safetyNotes: "",
  photos: [],
  supervisorName: "",
};

// ── Full Report View ───────────────────────────────
function ReportView({ form, onNewReport }) {
  const totalHours = form.personnel.reduce((sum, p) => sum + (parseFloat(p.hours) || 0), 0);
  const reportDate = form.date
    ? new Date(form.date).toLocaleDateString("en-NZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "—";
  const weather = [form.weather, form.tempMin && form.tempMax ? `${form.tempMin}–${form.tempMax}°C` : ""].filter(Boolean).join("  ");

  return (
    <div style={s.page}>
      {/* Report Header */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.logoWrap}>
            <div style={s.logoMark}>S</div>
            <div>
              <div style={s.logoName}>SCHICK</div>
              <div style={s.logoSub}>CIVIL CONTRACTING</div>
            </div>
          </div>
          <div style={s.headerRight}>
            <div style={s.headerTag}>SITE DIARY</div>
            <div style={s.headerDate}>{new Date().toLocaleDateString("en-NZ", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</div>
          </div>
        </div>
      </header>

      <div style={rpt.wrap}>

        {/* Title block */}
        <div style={rpt.titleBlock}>
          <div style={rpt.reportLabel}>DAILY SITE DIARY REPORT</div>
          <h1 style={rpt.projectName}>{form.project}</h1>
          <div style={rpt.metaRow}>
            <span style={rpt.metaItem}>📅 {reportDate}</span>
            {weather && <span style={rpt.metaItem}>🌤 {weather}</span>}
            <span style={rpt.metaItem}>✍️ {form.supervisorName}</span>
          </div>
        </div>

        {/* Stats strip */}
        <div style={rpt.statsStrip}>
          {[
            { n: form.personnel.filter(p => p.name).length, u: totalHours.toFixed(0) + " hrs", l: "Workers" },
            { n: form.plant.length, u: "items", l: "Plant" },
            { n: form.workItems.filter(w => w.description).length, u: "tasks", l: "Work" },
            { n: form.materials.filter(m => m.item).length, u: "items", l: "Materials" },
            { n: form.photos.length, u: "photos", l: "Photos" },
          ].map(({ n, u, l }) => (
            <div key={l} style={rpt.statCell}>
              <span style={rpt.statNum}>{n}</span>
              <span style={rpt.statUnit}>{u}</span>
              <span style={rpt.statLbl}>{l}</span>
            </div>
          ))}
        </div>

        {/* Personnel */}
        {form.personnel.some(p => p.name) && (
          <ReportSection icon="👷" title="Personnel on Site">
            <table style={rpt.table}>
              <thead>
                <tr>
                  {["Name", "Role", "Hours"].map(h => <th key={h} style={rpt.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {form.personnel.filter(p => p.name).map((p, i) => (
                  <tr key={i} style={i % 2 === 0 ? rpt.trEven : {}}>
                    <td style={rpt.td}>{p.name}</td>
                    <td style={rpt.td}>{p.role || "—"}</td>
                    <td style={{ ...rpt.td, fontWeight: 700, color: "#E8920A" }}>{p.hours} hrs</td>
                  </tr>
                ))}
                <tr style={rpt.trTotal}>
                  <td style={rpt.td} colSpan={2}><strong>Total</strong></td>
                  <td style={{ ...rpt.td, fontWeight: 800, color: "#E8920A" }}>{totalHours.toFixed(1)} hrs</td>
                </tr>
              </tbody>
            </table>
          </ReportSection>
        )}

        {/* Plant */}
        {form.plant.length > 0 && (
          <ReportSection icon="🚜" title="Plant & Equipment">
            <table style={rpt.table}>
              <thead>
                <tr>
                  {["Equipment", "Hours", "Notes"].map(h => <th key={h} style={rpt.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {form.plant.map((p, i) => (
                  <tr key={i} style={i % 2 === 0 ? rpt.trEven : {}}>
                    <td style={{ ...rpt.td, fontWeight: 600 }}>{p.name}</td>
                    <td style={{ ...rpt.td, color: "#E8920A", fontWeight: 700 }}>{p.hours} hrs</td>
                    <td style={{ ...rpt.td, color: "#6B7280" }}>{p.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ReportSection>
        )}

        {/* Work */}
        {form.workItems.some(w => w.description) && (
          <ReportSection icon="⚙️" title="Work Completed">
            {form.workItems.filter(w => w.description).map((w, i) => (
              <div key={i} style={rpt.workItem}>
                <div style={rpt.workItemHeader}>
                  <span style={rpt.workCat}>{w.category || "General"}</span>
                  {w.qty && w.unit && (
                    <span style={rpt.workQty}>{w.qty} {w.unit}</span>
                  )}
                </div>
                <p style={rpt.workDesc}>{w.description}</p>
              </div>
            ))}
          </ReportSection>
        )}

        {/* Materials */}
        {form.materials.some(m => m.item) && (
          <ReportSection icon="📦" title="Materials Received">
            <table style={rpt.table}>
              <thead>
                <tr>
                  {["Material", "Supplier", "Qty", "Unit"].map(h => <th key={h} style={rpt.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {form.materials.filter(m => m.item).map((m, i) => (
                  <tr key={i} style={i % 2 === 0 ? rpt.trEven : {}}>
                    <td style={{ ...rpt.td, fontWeight: 600 }}>{m.item}</td>
                    <td style={rpt.td}>{m.supplier || "—"}</td>
                    <td style={{ ...rpt.td, color: "#E8920A", fontWeight: 700 }}>{m.qty || "—"}</td>
                    <td style={rpt.td}>{m.unit || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ReportSection>
        )}

        {/* Notes */}
        {(form.issues || form.visitors || form.safetyNotes) && (
          <ReportSection icon="📋" title="Notes & Issues">
            {form.issues && (
              <div style={rpt.noteBlock}>
                <div style={rpt.noteLabel}>⚠️ Issues / Delays</div>
                <p style={rpt.noteText}>{form.issues}</p>
              </div>
            )}
            {form.visitors && (
              <div style={rpt.noteBlock}>
                <div style={rpt.noteLabel}>👤 Visitors / Inspections</div>
                <p style={rpt.noteText}>{form.visitors}</p>
              </div>
            )}
            {form.safetyNotes && (
              <div style={{ ...rpt.noteBlock, borderLeftColor: "#10B981" }}>
                <div style={{ ...rpt.noteLabel, color: "#10B981" }}>🦺 Safety Notes</div>
                <p style={rpt.noteText}>{form.safetyNotes}</p>
              </div>
            )}
          </ReportSection>
        )}

        {/* Photos */}
        {form.photos.length > 0 && (
          <ReportSection icon="📸" title={`Site Photos (${form.photos.length})`}>
            <div style={rpt.photoGrid}>
              {form.photos.map(photo => (
                <div key={photo.id} style={rpt.photoCard}>
                  <img src={photo.url} alt={photo.name} style={rpt.photoImg} />
                  {photo.caption && <div style={rpt.photoCaption}>{photo.caption}</div>}
                </div>
              ))}
            </div>
          </ReportSection>
        )}

        {/* Sign off */}
        <div style={rpt.signOff}>
          <div style={rpt.signRow}>
            <div style={rpt.signField}>
              <div style={rpt.signLabel}>Submitted by</div>
              <div style={rpt.signValue}>{form.supervisorName}</div>
            </div>
            <div style={rpt.signField}>
              <div style={rpt.signLabel}>Date submitted</div>
              <div style={rpt.signValue}>{new Date().toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" })}</div>
            </div>
            <div style={rpt.signBadge}>✓ SUBMITTED</div>
          </div>
        </div>

        {/* Actions */}
        <div style={rpt.actions}>
          <button style={rpt.newBtn} onClick={onNewReport}>+ New Report</button>
          <button style={rpt.printBtn} onClick={() => window.print()}>🖨 Print / Save PDF</button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F2F1EE; }
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @media print {
          button { display: none !important; }
          header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}

function ReportSection({ icon, title, children }) {
  return (
    <div style={rpt.section}>
      <div style={rpt.sectionHead}>
        <span style={rpt.sectionIcon}>{icon}</span>
        <h2 style={rpt.sectionTitle}>{title}</h2>
      </div>
      <div style={rpt.sectionBody}>{children}</div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────
export default function SiteDiary() {
  const [form, setForm] = useState(initialForm);
  const [view, setView] = useState("form"); // "form" | "success" | "report"
  const [activeSection, setActiveSection] = useState("project");
  const [plantSearch, setPlantSearch] = useState("");
  const [showPlantPicker, setShowPlantPicker] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const sections = [
    { id: "project", label: "Site", icon: "📍" },
    { id: "personnel", label: "People", icon: "👷" },
    { id: "plant", label: "Plant", icon: "🚜" },
    { id: "work", label: "Work", icon: "⚙️" },
    { id: "materials", label: "Materials", icon: "📦" },
    { id: "notes", label: "Notes", icon: "📋" },
    { id: "sign", label: "Sign Off", icon: "✅" },
  ];

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const updatePersonnel = (i, field, val) => {
    const p = [...form.personnel]; p[i] = { ...p[i], [field]: val }; update("personnel", p);
  };
  const addPersonnel = () => update("personnel", [...form.personnel, { name: "", role: "", hours: "8" }]);
  const removePersonnel = i => update("personnel", form.personnel.filter((_, idx) => idx !== i));

  const togglePlant = (item) => {
    const exists = form.plant.find(p => p.name === item);
    if (exists) update("plant", form.plant.filter(p => p.name !== item));
    else update("plant", [...form.plant, { name: item, hours: "8", notes: "" }]);
  };
  const updatePlant = (i, field, val) => {
    const p = [...form.plant]; p[i] = { ...p[i], [field]: val }; update("plant", p);
  };

  const updateWork = (i, field, val) => {
    const w = [...form.workItems]; w[i] = { ...w[i], [field]: val }; update("workItems", w);
  };
  const addWork = () => update("workItems", [...form.workItems, { category: "", description: "", qty: "", unit: "" }]);
  const removeWork = i => update("workItems", form.workItems.filter((_, idx) => idx !== i));

  const updateMaterial = (i, field, val) => {
    const m = [...form.materials]; m[i] = { ...m[i], [field]: val }; update("materials", m);
  };
  const addMaterial = () => update("materials", [...form.materials, { item: "", supplier: "", qty: "", unit: "" }]);
  const removeMaterial = i => update("materials", form.materials.filter((_, idx) => idx !== i));

  const handleFiles = (files) => {
    Array.from(files).filter(f => f.type.startsWith("image/")).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setForm(prev => ({
          ...prev,
          photos: [...prev.photos, { id: Date.now() + Math.random(), url: e.target.result, name: file.name, caption: "" }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (id) => update("photos", form.photos.filter(p => p.id !== id));
  const updateCaption = (id, caption) => update("photos", form.photos.map(p => p.id === id ? { ...p, caption } : p));
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); };

  const filteredPlant = PLANT_LIST.filter(p => p.toLowerCase().includes(plantSearch.toLowerCase()));

  const handleNewReport = () => {
    setForm(initialForm);
    setView("form");
    setActiveSection("project");
  };

  // Show full report
  if (view === "report") {
    return <ReportView form={form} onNewReport={handleNewReport} />;
  }

  // Show success screen
  if (view === "success") {
    return (
      <div style={s.page}>
        <header style={s.header}>
          <div style={s.headerInner}>
            <div style={s.logoWrap}>
              <div style={s.logoMark}>S</div>
              <div>
                <div style={s.logoName}>SCHICK</div>
                <div style={s.logoSub}>CIVIL CONTRACTING</div>
              </div>
            </div>
            <div style={s.headerRight}>
              <div style={s.headerTag}>SITE DIARY</div>
            </div>
          </div>
        </header>
        <div style={s.successWrap}>
          <div style={s.successCard}>
            <div style={s.successCheck}>✓</div>
            <h2 style={s.successTitle}>Report Submitted</h2>
            <p style={s.successSub}>
              {form.project} · {new Date(form.date).toLocaleDateString("en-NZ", { weekday: "short", day: "numeric", month: "short" })}
            </p>
            <div style={s.successStats}>
              {[
                { n: form.personnel.filter(p => p.name).length, l: "Workers" },
                { n: form.plant.length, l: "Plant" },
                { n: form.workItems.filter(w => w.description).length, l: "Tasks" },
                { n: form.photos.length, l: "Photos" },
              ].map(({ n, l }) => (
                <div key={l} style={s.statBox}>
                  <span style={s.statN}>{n}</span>
                  <span style={s.statL}>{l}</span>
                </div>
              ))}
            </div>
            <button style={s.viewReportBtn} onClick={() => setView("report")}>
              📄 View Full Report
            </button>
            <button style={s.newBtn} onClick={handleNewReport}>
              + New Report
            </button>
          </div>
        </div>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@400;500;600&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #F2F1EE; }
        `}</style>
      </div>
    );
  }

  // Main form
  return (
    <div style={s.page}>
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.logoWrap}>
            <div style={s.logoMark}>S</div>
            <div>
              <div style={s.logoName}>SCHICK</div>
              <div style={s.logoSub}>CIVIL CONTRACTING</div>
            </div>
          </div>
          <div style={s.headerRight}>
            <div style={s.headerTag}>SITE DIARY</div>
            <div style={s.headerDate}>{new Date().toLocaleDateString("en-NZ", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</div>
          </div>
        </div>
      </header>

      <nav style={s.progressWrap}>
        {sections.map((sec, idx) => {
          const active = activeSection === sec.id;
          const done = sections.findIndex(x => x.id === activeSection) > idx;
          return (
            <button key={sec.id} style={{ ...s.step, ...(active ? s.stepActive : {}), ...(done ? s.stepDone : {}) }}
              onClick={() => setActiveSection(sec.id)}>
              <span style={s.stepIcon}>{done ? "✓" : sec.icon}</span>
              <span style={s.stepLabel}>{sec.label}</span>
            </button>
          );
        })}
      </nav>

      <main style={s.main}>

        {activeSection === "project" && (
          <Section title="Site Details">
            <Field label="Project">
              <select style={s.select} value={form.project} onChange={e => update("project", e.target.value)}>
                <option value="">Select project…</option>
                {PROJECTS.map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Date">
              <input style={s.input} type="date" value={form.date} onChange={e => update("date", e.target.value)} />
            </Field>
            <Field label="Weather Conditions">
              <div style={s.weatherGrid}>
                {WEATHER_OPTIONS.map(w => (
                  <button key={w.label} style={{ ...s.weatherBtn, ...(form.weather === w.label ? s.weatherActive : {}) }}
                    onClick={() => update("weather", w.label)}>
                    <span style={{ fontSize: 24 }}>{w.icon}</span>
                    <span style={s.weatherLbl}>{w.label}</span>
                  </button>
                ))}
              </div>
            </Field>
            <div style={{ display: "flex", gap: 16 }}>
              <Field label="Min °C" style={{ flex: 1 }}>
                <input style={s.input} type="number" placeholder="12" value={form.tempMin} onChange={e => update("tempMin", e.target.value)} />
              </Field>
              <Field label="Max °C" style={{ flex: 1 }}>
                <input style={s.input} type="number" placeholder="22" value={form.tempMax} onChange={e => update("tempMax", e.target.value)} />
              </Field>
            </div>
            <NextBtn onClick={() => setActiveSection("personnel")}>Continue → People</NextBtn>
          </Section>
        )}

        {activeSection === "personnel" && (
          <Section title="Personnel on Site">
            {form.personnel.map((p, i) => (
              <div key={i} style={s.card}>
                <div style={s.cardHeader}>
                  <span style={s.cardNum}>#{i + 1}</span>
                  {form.personnel.length > 1 && <button style={s.delBtn} onClick={() => removePersonnel(i)}>Remove</button>}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Field label="Name" style={{ flex: 2 }}>
                    <input style={s.input} placeholder="Full name" value={p.name} onChange={e => updatePersonnel(i, "name", e.target.value)} />
                  </Field>
                  <Field label="Role" style={{ flex: 2 }}>
                    <input style={s.input} placeholder="e.g. Operator" value={p.role} onChange={e => updatePersonnel(i, "role", e.target.value)} />
                  </Field>
                  <Field label="Hours" style={{ flex: 1 }}>
                    <input style={s.input} type="number" value={p.hours} onChange={e => updatePersonnel(i, "hours", e.target.value)} />
                  </Field>
                </div>
              </div>
            ))}
            <AddBtn onClick={addPersonnel}>+ Add Worker</AddBtn>
            <div style={s.totalRow}>
              <span>Total man-hours</span>
              <strong style={s.totalAmt}>{form.personnel.reduce((sum, p) => sum + (parseFloat(p.hours) || 0), 0).toFixed(1)} hrs</strong>
            </div>
            <NextBtn onClick={() => setActiveSection("plant")}>Continue → Plant</NextBtn>
          </Section>
        )}

        {activeSection === "plant" && (
          <Section title="Plant & Equipment">
            <AddBtn onClick={() => setShowPlantPicker(!showPlantPicker)}>
              {showPlantPicker ? "✕ Close picker" : "+ Add Plant"}
            </AddBtn>
            {showPlantPicker && (
              <div style={s.picker}>
                <input style={{ ...s.input, marginBottom: 10 }} placeholder="Search plant…" value={plantSearch}
                  onChange={e => setPlantSearch(e.target.value)} />
                <div style={s.chipGrid}>
                  {filteredPlant.map(item => {
                    const sel = form.plant.some(p => p.name === item);
                    return (
                      <button key={item} style={{ ...s.chip, ...(sel ? s.chipActive : {}) }} onClick={() => togglePlant(item)}>
                        {sel ? "✓ " : ""}{item}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {form.plant.map((p, i) => (
              <div key={i} style={s.card}>
                <div style={s.cardHeader}>
                  <span style={s.plantName}>{p.name}</span>
                  <button style={s.delBtn} onClick={() => togglePlant(p.name)}>Remove</button>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Field label="Hours" style={{ flex: 1 }}>
                    <input style={s.input} type="number" value={p.hours} onChange={e => updatePlant(i, "hours", e.target.value)} />
                  </Field>
                  <Field label="Notes" style={{ flex: 3 }}>
                    <input style={s.input} placeholder="e.g. breakdown, inspection" value={p.notes} onChange={e => updatePlant(i, "notes", e.target.value)} />
                  </Field>
                </div>
              </div>
            ))}
            {form.plant.length === 0 && !showPlantPicker && <EmptyState>No plant added yet</EmptyState>}
            <NextBtn onClick={() => setActiveSection("work")}>Continue → Work Done</NextBtn>
          </Section>
        )}

        {activeSection === "work" && (
          <Section title="Work Completed">
            {form.workItems.map((w, i) => (
              <div key={i} style={s.card}>
                <div style={s.cardHeader}>
                  <span style={s.cardNum}>Item {i + 1}</span>
                  {form.workItems.length > 1 && <button style={s.delBtn} onClick={() => removeWork(i)}>Remove</button>}
                </div>
                <Field label="Category">
                  <select style={s.select} value={w.category} onChange={e => updateWork(i, "category", e.target.value)}>
                    <option value="">Select category…</option>
                    {WORK_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Description">
                  <textarea style={s.textarea} placeholder="Describe work completed, location, chainage, etc."
                    value={w.description} onChange={e => updateWork(i, "description", e.target.value)} />
                </Field>
                <div style={{ display: "flex", gap: 10 }}>
                  <Field label="Quantity" style={{ flex: 1 }}>
                    <input style={s.input} type="number" placeholder="0" value={w.qty} onChange={e => updateWork(i, "qty", e.target.value)} />
                  </Field>
                  <Field label="Unit" style={{ flex: 1 }}>
                    <select style={s.select} value={w.unit} onChange={e => updateWork(i, "unit", e.target.value)}>
                      <option value="">—</option>
                      {["m", "m²", "m³", "t", "LM", "EA"].map(u => <option key={u}>{u}</option>)}
                    </select>
                  </Field>
                </div>
              </div>
            ))}
            <AddBtn onClick={addWork}>+ Add Work Item</AddBtn>
            <NextBtn onClick={() => setActiveSection("materials")}>Continue → Materials</NextBtn>
          </Section>
        )}

        {activeSection === "materials" && (
          <Section title="Materials Received">
            {form.materials.map((m, i) => (
              <div key={i} style={s.card}>
                <div style={s.cardHeader}>
                  <span style={s.cardNum}>#{i + 1}</span>
                  {form.materials.length > 1 && <button style={s.delBtn} onClick={() => removeMaterial(i)}>Remove</button>}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Field label="Material" style={{ flex: 2 }}>
                    <input style={s.input} placeholder="e.g. AP40 basecourse" value={m.item} onChange={e => updateMaterial(i, "item", e.target.value)} />
                  </Field>
                  <Field label="Supplier" style={{ flex: 2 }}>
                    <input style={s.input} placeholder="e.g. Fulton Hogan" value={m.supplier} onChange={e => updateMaterial(i, "supplier", e.target.value)} />
                  </Field>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Field label="Qty" style={{ flex: 1 }}>
                    <input style={s.input} type="number" value={m.qty} onChange={e => updateMaterial(i, "qty", e.target.value)} />
                  </Field>
                  <Field label="Unit" style={{ flex: 1 }}>
                    <select style={s.select} value={m.unit} onChange={e => updateMaterial(i, "unit", e.target.value)}>
                      <option value="">—</option>
                      {["t", "m³", "m", "EA", "L"].map(u => <option key={u}>{u}</option>)}
                    </select>
                  </Field>
                </div>
              </div>
            ))}
            <AddBtn onClick={addMaterial}>+ Add Material</AddBtn>
            <NextBtn onClick={() => setActiveSection("notes")}>Continue → Notes</NextBtn>
          </Section>
        )}

        {activeSection === "notes" && (
          <Section title="Notes & Photos">
            <Field label="Issues / Delays">
              <textarea style={{ ...s.textarea, minHeight: 80 }} placeholder="Describe any issues, delays, or non-conformances…"
                value={form.issues} onChange={e => update("issues", e.target.value)} />
            </Field>
            <Field label="Visitors / Inspections">
              <textarea style={s.textarea} placeholder="Council inspector, client rep, engineer, etc."
                value={form.visitors} onChange={e => update("visitors", e.target.value)} />
            </Field>
            <Field label="Safety Notes">
              <textarea style={s.textarea} placeholder="Toolbox meeting topics, near misses, hazards identified…"
                value={form.safetyNotes} onChange={e => update("safetyNotes", e.target.value)} />
            </Field>
            <div style={s.photoSection}>
              <div style={s.photoHeader}>
                <span style={s.photoTitle}>📸 Site Photos</span>
                <span style={s.photoBadge}>{form.photos.length} added</span>
              </div>
              <div style={{ ...s.dropZone, ...(dragOver ? s.dropZoneOver : {}) }}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}>
                <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: "none" }}
                  onChange={e => { handleFiles(e.target.files); e.target.value = ""; }} />
                <div style={s.dropIcon}>🖼️</div>
                <p style={s.dropText}>Drop photos here or <span style={s.dropLink}>browse files</span></p>
                <p style={s.dropHint}>JPG, PNG, HEIC · Multiple files supported</p>
              </div>
              {form.photos.length > 0 && (
                <div style={s.photoGrid}>
                  {form.photos.map(photo => (
                    <div key={photo.id} style={s.photoCard}>
                      <div style={s.photoImgWrap}>
                        <img src={photo.url} alt={photo.name} style={s.photoImg} />
                        <button style={s.photoRemove} onClick={() => removePhoto(photo.id)}>✕</button>
                      </div>
                      <input style={s.captionInput} placeholder="Add caption…" value={photo.caption}
                        onChange={e => updateCaption(photo.id, e.target.value)} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <NextBtn onClick={() => setActiveSection("sign")}>Continue → Sign Off</NextBtn>
          </Section>
        )}

        {activeSection === "sign" && (
          <Section title="Sign Off">
            <div style={s.summaryBox}>
              {[
                ["Project", form.project || "—"],
                ["Date", form.date ? new Date(form.date).toLocaleDateString("en-NZ", { weekday: "long", day: "numeric", month: "long" }) : "—"],
                ["Weather", [form.weather, form.tempMin && form.tempMax ? `${form.tempMin}–${form.tempMax}°C` : ""].filter(Boolean).join("  ") || "—"],
                ["Workers", `${form.personnel.filter(p => p.name).length} (${form.personnel.reduce((sum, p) => sum + (parseFloat(p.hours) || 0), 0).toFixed(0)} hrs)`],
                ["Plant items", form.plant.length],
                ["Work items", form.workItems.filter(w => w.description).length],
                ["Photos", form.photos.length],
              ].map(([k, v]) => (
                <div key={k} style={s.summRow}>
                  <span style={s.summKey}>{k}</span>
                  <span style={s.summVal}>{v}</span>
                </div>
              ))}
              {form.issues && (
                <div style={{ background: "#fff8ed", borderRadius: 4, padding: "8px 12px", marginTop: 8 }}>
                  <span style={{ color: "#d97706", fontSize: 12, fontWeight: 700 }}>⚠ Issues logged</span>
                </div>
              )}
            </div>
            <Field label="Supervisor / Foreman Name">
              <input style={s.input} placeholder="Your full name" value={form.supervisorName}
                onChange={e => update("supervisorName", e.target.value)} />
            </Field>
            <button
              style={{ ...s.submitBtn, opacity: form.project && form.supervisorName ? 1 : 0.45 }}
              onClick={() => { if (form.project && form.supervisorName) setView("success"); }}>
              Submit Report
            </button>
            {(!form.project || !form.supervisorName) && (
              <p style={{ textAlign: "center", color: "#aaa", fontSize: 12, marginTop: 8 }}>
                Project and supervisor name required
              </p>
            )}
          </Section>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F2F1EE; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #E8920A !important; box-shadow: 0 0 0 3px rgba(232,146,10,0.12) !important; }
        input::placeholder, textarea::placeholder { color: #BBC0C9; }
        select option { background: #fff; color: #1a1a2e; }
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .anim { animation: slideUp 0.25s ease; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #f0f0ee; }
        ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 99px; }
      `}</style>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={s.section} className="anim">
      <h2 style={s.sectionTitle}>{title}</h2>
      {children}
    </div>
  );
}
function Field({ label, children, style }) {
  return <div style={{ marginBottom: 14, ...style }}><label style={s.label}>{label}</label>{children}</div>;
}
function NextBtn({ children, onClick }) {
  return <button style={s.nextBtn} onClick={onClick}>{children} →</button>;
}
function AddBtn({ children, onClick }) {
  return <button style={s.addBtn} onClick={onClick}>{children}</button>;
}
function EmptyState({ children }) {
  return <div style={s.empty}>{children}</div>;
}

// ── Form styles ────────────────────────────────────
const s = {
  page: { minHeight: "100vh", background: "#F2F1EE", fontFamily: "'Barlow', sans-serif", color: "#1C1E2B", maxWidth: 560, margin: "0 auto", paddingBottom: 60 },
  header: { background: "#1C1E2B", padding: "0 20px" },
  headerInner: { display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 },
  logoWrap: { display: "flex", alignItems: "center", gap: 12 },
  logoMark: { width: 40, height: 40, background: "#E8920A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, fontFamily: "'Barlow Condensed', sans-serif" },
  logoName: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: 3, lineHeight: 1 },
  logoSub: { fontSize: 9, color: "#6B7280", letterSpacing: 2, marginTop: 3 },
  headerRight: { textAlign: "right" },
  headerTag: { fontFamily: "'Barlow Condensed', sans-serif", background: "#E8920A", color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: 2, padding: "3px 8px", display: "inline-block", marginBottom: 4 },
  headerDate: { fontSize: 11, color: "#9CA3AF" },
  progressWrap: { display: "flex", background: "#fff", borderBottom: "1.5px solid #E5E7EB", overflowX: "auto", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
  step: { flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "10px 13px", background: "none", border: "none", color: "#BBC0C9", cursor: "pointer", fontFamily: "'Barlow', sans-serif", borderBottom: "3px solid transparent", transition: "all 0.15s" },
  stepActive: { color: "#E8920A", borderBottom: "3px solid #E8920A" },
  stepDone: { color: "#10B981", borderBottom: "3px solid #10B981" },
  stepIcon: { fontSize: 16 },
  stepLabel: { fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" },
  main: { padding: "0 18px" },
  section: { paddingTop: 22 },
  sectionTitle: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 800, color: "#1C1E2B", textTransform: "uppercase", marginBottom: 20, paddingBottom: 12, borderBottom: "2px solid #E5E7EB" },
  label: { display: "block", fontSize: 11, fontWeight: 700, color: "#6B7280", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 },
  input: { display: "block", width: "100%", background: "#fff", border: "1.5px solid #E5E7EB", color: "#1C1E2B", borderRadius: 6, padding: "10px 13px", fontSize: 14, fontFamily: "'Barlow', sans-serif", transition: "border-color 0.15s" },
  select: { display: "block", width: "100%", background: "#fff", border: "1.5px solid #E5E7EB", color: "#1C1E2B", borderRadius: 6, padding: "10px 13px", fontSize: 14, fontFamily: "'Barlow', sans-serif", cursor: "pointer" },
  textarea: { display: "block", width: "100%", background: "#fff", border: "1.5px solid #E5E7EB", color: "#1C1E2B", borderRadius: 6, padding: "10px 13px", fontSize: 14, fontFamily: "'Barlow', sans-serif", resize: "vertical", minHeight: 72 },
  weatherGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 },
  weatherBtn: { background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 6, color: "#6B7280", padding: "12px 6px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, fontFamily: "'Barlow', sans-serif", transition: "all 0.15s" },
  weatherActive: { background: "#fff8ed", border: "1.5px solid #E8920A", color: "#E8920A" },
  weatherLbl: { fontSize: 11, fontWeight: 600 },
  card: { background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "14px 16px", marginBottom: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  cardNum: { fontSize: 11, fontWeight: 700, color: "#BBC0C9", letterSpacing: 1, textTransform: "uppercase" },
  plantName: { fontSize: 14, fontWeight: 700, color: "#E8920A" },
  delBtn: { background: "none", border: "1px solid #F3C4B4", color: "#EF4444", borderRadius: 4, fontSize: 11, fontWeight: 600, padding: "3px 8px", cursor: "pointer", fontFamily: "'Barlow', sans-serif" },
  picker: { background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 8, padding: 14, marginTop: 10, marginBottom: 12 },
  chipGrid: { display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 200, overflowY: "auto" },
  chip: { background: "#F9FAFB", border: "1px solid #E5E7EB", color: "#374151", borderRadius: 99, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontFamily: "'Barlow', sans-serif" },
  chipActive: { background: "#fff8ed", border: "1px solid #E8920A", color: "#E8920A", fontWeight: 600 },
  totalRow: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 6, padding: "10px 14px", marginTop: 12, fontSize: 13, color: "#6B7280" },
  totalAmt: { fontSize: 18, fontWeight: 800, color: "#E8920A", fontFamily: "'Barlow Condensed', sans-serif" },
  photoSection: { marginTop: 4, marginBottom: 14, background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 8, padding: 16 },
  photoHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  photoTitle: { fontSize: 14, fontWeight: 700, color: "#1C1E2B" },
  photoBadge: { background: "#F3F4F6", color: "#6B7280", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99 },
  dropZone: { border: "2px dashed #D1D5DB", borderRadius: 8, padding: "28px 20px", textAlign: "center", cursor: "pointer", background: "#FAFAFA", transition: "all 0.15s" },
  dropZoneOver: { border: "2px dashed #E8920A", background: "#fff8ed" },
  dropIcon: { fontSize: 32, marginBottom: 8 },
  dropText: { fontSize: 14, color: "#374151", marginBottom: 4 },
  dropLink: { color: "#E8920A", fontWeight: 600 },
  dropHint: { fontSize: 11, color: "#9CA3AF" },
  photoGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginTop: 14 },
  photoCard: { border: "1.5px solid #E5E7EB", borderRadius: 6, overflow: "hidden", background: "#F9FAFB" },
  photoImgWrap: { position: "relative" },
  photoImg: { width: "100%", height: 110, objectFit: "cover", display: "block" },
  photoRemove: { position: "absolute", top: 5, right: 5, background: "rgba(0,0,0,0.55)", color: "#fff", border: "none", borderRadius: 99, width: 22, height: 22, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  captionInput: { display: "block", width: "100%", border: "none", borderTop: "1px solid #E5E7EB", padding: "7px 10px", fontSize: 11, color: "#374151", fontFamily: "'Barlow', sans-serif", background: "transparent" },
  summaryBox: { background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 8, padding: 16, marginBottom: 20 },
  summRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F3F4F6", fontSize: 13 },
  summKey: { fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.8 },
  summVal: { color: "#1C1E2B", fontWeight: 500, textAlign: "right", maxWidth: "60%" },
  addBtn: { background: "#fff", border: "1.5px dashed #D1D5DB", color: "#E8920A", borderRadius: 6, padding: "10px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%", marginTop: 4, marginBottom: 4, fontFamily: "'Barlow', sans-serif" },
  nextBtn: { marginTop: 22, width: "100%", background: "#1C1E2B", color: "#fff", border: "none", borderRadius: 6, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Barlow', sans-serif" },
  submitBtn: { marginTop: 18, width: "100%", background: "#E8920A", color: "#fff", border: "none", borderRadius: 6, padding: "16px", fontSize: 15, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif" },
  empty: { textAlign: "center", color: "#BBC0C9", fontSize: 13, padding: "28px 0" },
  successWrap: { padding: "40px 20px" },
  successCard: { background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: "40px 28px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" },
  successCheck: { width: 64, height: 64, background: "#ECFDF5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#10B981", margin: "0 auto 16px", border: "2px solid #6EE7B7" },
  successTitle: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 900, color: "#1C1E2B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  successSub: { color: "#9CA3AF", fontSize: 13, marginBottom: 24 },
  successStats: { display: "flex", justifyContent: "space-around", margin: "0 0 28px" },
  statBox: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  statN: { fontSize: 32, fontWeight: 900, color: "#E8920A", fontFamily: "'Barlow Condensed', sans-serif" },
  statL: { fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1 },
  viewReportBtn: { display: "block", width: "100%", background: "#E8920A", color: "#fff", border: "none", borderRadius: 6, padding: "14px", fontSize: 15, fontWeight: 800, letterSpacing: 0.5, cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 10 },
  newBtn: { display: "block", width: "100%", background: "none", border: "1.5px solid #1C1E2B", color: "#1C1E2B", borderRadius: 6, padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Barlow', sans-serif" },
};

// ── Report styles ──────────────────────────────────
const rpt = {
  wrap: { padding: "0 18px 60px", maxWidth: 560, margin: "0 auto" },
  titleBlock: { background: "#1C1E2B", margin: "0 -18px", padding: "24px 24px 20px", marginBottom: 0 },
  reportLabel: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, color: "#E8920A", letterSpacing: 3, marginBottom: 6 },
  projectName: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: 0.5, marginBottom: 12, lineHeight: 1.1 },
  metaRow: { display: "flex", flexWrap: "wrap", gap: 12 },
  metaItem: { fontSize: 12, color: "#9CA3AF", fontWeight: 500 },
  statsStrip: { display: "flex", background: "#fff", borderBottom: "2px solid #E8920A", overflowX: "auto" },
  statCell: { flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 16px", borderRight: "1px solid #F3F4F6", minWidth: 80 },
  statNum: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 900, color: "#1C1E2B", lineHeight: 1 },
  statUnit: { fontSize: 10, color: "#9CA3AF", marginTop: 2, marginBottom: 2 },
  statLbl: { fontSize: 9, fontWeight: 700, color: "#BBC0C9", textTransform: "uppercase", letterSpacing: 1 },
  section: { marginTop: 20, background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },
  sectionHead: { display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#F9FAFB", borderBottom: "1.5px solid #E5E7EB" },
  sectionIcon: { fontSize: 16 },
  sectionTitle: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 800, color: "#1C1E2B", textTransform: "uppercase", letterSpacing: 1 },
  sectionBody: { padding: "14px 16px" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { textAlign: "left", fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.8, padding: "0 8px 8px 0", borderBottom: "1.5px solid #E5E7EB" },
  td: { padding: "9px 8px 9px 0", borderBottom: "1px solid #F3F4F6", color: "#1C1E2B", fontSize: 13, verticalAlign: "top" },
  trEven: { background: "#FAFAFA" },
  trTotal: { background: "#fff8ed" },
  workItem: { padding: "12px 0", borderBottom: "1px solid #F3F4F6" },
  workItemHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  workCat: { background: "#E8920A", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, letterSpacing: 0.5 },
  workQty: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 800, color: "#1C1E2B" },
  workDesc: { fontSize: 13, color: "#374151", lineHeight: 1.5 },
  noteBlock: { borderLeft: "3px solid #E8920A", paddingLeft: 12, marginBottom: 12 },
  noteLabel: { fontSize: 11, fontWeight: 700, color: "#E8920A", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 },
  noteText: { fontSize: 13, color: "#374151", lineHeight: 1.5 },
  photoGrid: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 },
  photoCard: { borderRadius: 6, overflow: "hidden", border: "1px solid #E5E7EB" },
  photoImg: { width: "100%", height: 130, objectFit: "cover", display: "block" },
  photoCaption: { padding: "6px 8px", fontSize: 11, color: "#6B7280", background: "#F9FAFB", borderTop: "1px solid #E5E7EB" },
  signOff: { marginTop: 20, background: "#1C1E2B", borderRadius: 8, padding: "18px 20px" },
  signRow: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 },
  signField: {},
  signLabel: { fontSize: 10, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 },
  signValue: { fontSize: 14, color: "#fff", fontWeight: 600 },
  signBadge: { background: "#10B981", color: "#fff", fontSize: 11, fontWeight: 800, padding: "5px 12px", borderRadius: 99, letterSpacing: 1 },
  actions: { display: "flex", gap: 10, marginTop: 20 },
  newBtn: { flex: 1, background: "none", border: "1.5px solid #1C1E2B", color: "#1C1E2B", borderRadius: 6, padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Barlow', sans-serif" },
  printBtn: { flex: 1, background: "#1C1E2B", color: "#fff", border: "none", borderRadius: 6, padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Barlow', sans-serif" },
};
