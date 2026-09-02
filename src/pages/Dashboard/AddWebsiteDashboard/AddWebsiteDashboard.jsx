import { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

/* ============================================================================
   Same option lists as the main marketplace component, kept here so this
   file works standalone. If you'd rather not duplicate them, move these
   into a shared constants file and import them in both places.
============================================================================ */

const NICHES = ["News","Entertainment","Blog","Business","General","Technology","Sports","Fashion","Lifestyle","Travel","Education","App","Beauty","Game","Finance","Health","Medicine","Gaming","Music","Food"];
const LANGUAGES = ["English", "Spanish", "Italian", "Ukrainian"];
const LINK_VALIDITY = ["Instant", "1 Year", "Permanent"];
const COUNTRIES = [
  { code: "US", flag: "🇺🇸", name: "United States" },
  { code: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "IN", flag: "🇮🇳", name: "India" },
  { code: "CA", flag: "🇨🇦", name: "Canada" },
  { code: "AU", flag: "🇦🇺", name: "Australia" },
  { code: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "FR", flag: "🇫🇷", name: "France" },
  { code: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "BR", flag: "🇧🇷", name: "Brazil" },
  { code: "PH", flag: "🇵🇭", name: "Philippines" },
];

const initialForm = {
  domain: "",
  language: "English",
  as: "",
  da: "",
  dr: "",
  ahrefsTraffic: "",
  ahrefsKeywords: "",
  semrushTraffic: "",
  semrushKeywords: "",
  trafficCountry: "US",
  trendPercent: "",
  backlinksCount: "1",
  dofollow: true,
  linkValidity: "Instant",
  deliveryDays: "0",
  sportsGaming: false,
  pharmacy: false,
  googleNews: false,
  foreignLang: false,
  price: "",
};

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-400">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-orange-500";

export default function AddWebsiteDashboard() {
  const axiosSecure = useAxiosSecure();

  const [form, setForm] = useState(initialForm);
  const [niches, setNiches] = useState([]);
  const [rulesText, setRulesText] = useState("");
  const [countryRows, setCountryRows] = useState([{ code: "US", pct: 100 }]);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: "success" | "error", message }

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const toggleNiche = (n) =>
    setNiches((cur) => (cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]));

  const updateCountryRow = (idx, key, value) =>
    setCountryRows((rows) => rows.map((r, i) => (i === idx ? { ...r, [key]: value } : r)));
  const addCountryRow = () =>
    setCountryRows((rows) => [...rows, { code: "US", pct: 0 }]);
  const removeCountryRow = (idx) =>
    setCountryRows((rows) => rows.filter((_, i) => i !== idx));

  const resetForm = () => {
    setForm(initialForm);
    setNiches([]);
    setRulesText("");
    setCountryRows([{ code: "US", pct: 100 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!form.domain.trim()) {
      setFeedback({ type: "error", message: "Domain is required." });
      return;
    }
    if (form.price === "" || Number.isNaN(Number(form.price))) {
      setFeedback({ type: "error", message: "Price is required and must be a number." });
      return;
    }
    if (niches.length === 0) {
      setFeedback({ type: "error", message: "Pick at least one niche." });
      return;
    }

    const countries = countryRows
      .filter((r) => r.code && Number(r.pct) > 0)
      .map((r) => {
        const c = COUNTRIES.find((c) => c.code === r.code);
        return { code: r.code, flag: c?.flag || "", name: c?.name || r.code, pct: Number(r.pct) };
      });

    const payload = {
      domain: form.domain.trim(),
      niches,
      language: form.language,
      as: Number(form.as) || 0,
      da: Number(form.da) || 0,
      dr: Number(form.dr) || 0,
      ahrefsTraffic: Number(form.ahrefsTraffic) || 0,
      ahrefsKeywords: Number(form.ahrefsKeywords) || 0,
      semrushTraffic: Number(form.semrushTraffic) || 0,
      semrushKeywords: Number(form.semrushKeywords) || 0,
      trafficCountry: form.trafficCountry,
      trendPercent: Number(form.trendPercent) || 0,
      rules: rulesText.split("\n").map((r) => r.trim()).filter(Boolean),
      countries,
      backlinksCount: Number(form.backlinksCount) || 1,
      dofollow: form.dofollow,
      linkValidity: form.linkValidity,
      deliveryDays: Number(form.deliveryDays) || 0,
      sportsGaming: form.sportsGaming,
      pharmacy: form.pharmacy,
      googleNews: form.googleNews,
      foreignLang: form.foreignLang,
      price: Number(form.price),
    };

    try {
      setSubmitting(true);
      const res = await axiosSecure.post("/api/websites", payload);
      setFeedback({ type: "success", message: `"${res.data.website.domain}" added successfully.` });
      resetForm();
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Something went wrong.";
      setFeedback({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] px-4 py-10 font-sans sm:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-extrabold text-white">Add a Website</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manually enter a site's details — it'll be saved to the database and show up in the
          marketplace right away.
        </p>

        {feedback && (
          <div
            className={`mt-4 rounded-md border px-4 py-3 text-sm ${
              feedback.type === "success"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/40 bg-red-500/10 text-red-400"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Basic info */}
          <section className="rounded-lg border border-white/10 bg-[#0F1729] p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Basic Info
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Domain *">
                <input
                  value={form.domain}
                  onChange={(e) => setField("domain", e.target.value)}
                  placeholder="example.com"
                  className={inputClass}
                />
              </Field>
              <Field label="Language">
                <select value={form.language} onChange={(e) => setField("language", e.target.value)} className={inputClass}>
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l} className="bg-[#0F1729]">{l}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-3">
              <span className="mb-1.5 block text-xs font-medium text-slate-400">Niches *</span>
              <div className="flex flex-wrap gap-2">
                {NICHES.map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => toggleNiche(n)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      niches.includes(n)
                        ? "border-orange-500 bg-orange-500/15 text-orange-400"
                        : "border-white/10 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <Field label="Publishing rules (one per line)">
                <textarea
                  value={rulesText}
                  onChange={(e) => setRulesText(e.target.value)}
                  rows={4}
                  placeholder={"No gambling or casino content\nMinimum 600 words per article"}
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          {/* SEO metrics */}
          <section className="rounded-lg border border-white/10 bg-[#0F1729] p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              SEO Metrics
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Field label="AS (0-100)">
                <input type="number" min="0" max="100" value={form.as} onChange={(e) => setField("as", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Moz DA (0-100)">
                <input type="number" min="0" max="100" value={form.da} onChange={(e) => setField("da", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Ahrefs DR (0-100)">
                <input type="number" min="0" max="100" value={form.dr} onChange={(e) => setField("dr", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Ahrefs Traffic">
                <input type="number" min="0" value={form.ahrefsTraffic} onChange={(e) => setField("ahrefsTraffic", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Ahrefs Keywords">
                <input type="number" min="0" value={form.ahrefsKeywords} onChange={(e) => setField("ahrefsKeywords", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Semrush Traffic">
                <input type="number" min="0" value={form.semrushTraffic} onChange={(e) => setField("semrushTraffic", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Semrush Keywords">
                <input type="number" min="0" value={form.semrushKeywords} onChange={(e) => setField("semrushKeywords", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Main Traffic Country">
                <select value={form.trafficCountry} onChange={(e) => setField("trafficCountry", e.target.value)} className={inputClass}>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#0F1729]">{c.flag} {c.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="3-mo Trend % (+/-)">
                <input type="number" value={form.trendPercent} onChange={(e) => setField("trendPercent", e.target.value)} className={inputClass} />
              </Field>
            </div>
          </section>

          {/* Countries breakdown */}
          <section className="rounded-lg border border-white/10 bg-[#0F1729] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Audience Countries
              </h2>
              <button
                type="button"
                onClick={addCountryRow}
                className="text-xs font-medium text-orange-400 hover:text-orange-300"
              >
                + Add country
              </button>
            </div>
            <div className="space-y-2">
              {countryRows.map((row, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={row.code}
                    onChange={(e) => updateCountryRow(idx, "code", e.target.value)}
                    className={`${inputClass} flex-1`}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#0F1729]">{c.flag} {c.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={row.pct}
                    onChange={(e) => updateCountryRow(idx, "pct", e.target.value)}
                    placeholder="%"
                    className={`${inputClass} w-24`}
                  />
                  {countryRows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCountryRow(idx)}
                      className="rounded-md border border-white/10 px-2.5 py-2 text-xs text-slate-400 hover:border-red-500/50 hover:text-red-400"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Link & delivery */}
          <section className="rounded-lg border border-white/10 bg-[#0F1729] p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Link &amp; Delivery
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Field label="No. of Backlinks">
                <select value={form.backlinksCount} onChange={(e) => setField("backlinksCount", e.target.value)} className={inputClass}>
                  {["1", "2", "3"].map((n) => (
                    <option key={n} value={n} className="bg-[#0F1729]">{n}</option>
                  ))}
                </select>
              </Field>
              <Field label="Link Type">
                <select
                  value={form.dofollow ? "DoFollow" : "NoFollow"}
                  onChange={(e) => setField("dofollow", e.target.value === "DoFollow")}
                  className={inputClass}
                >
                  <option value="DoFollow" className="bg-[#0F1729]">DoFollow</option>
                  <option value="NoFollow" className="bg-[#0F1729]">NoFollow</option>
                </select>
              </Field>
              <Field label="Link Validity">
                <select value={form.linkValidity} onChange={(e) => setField("linkValidity", e.target.value)} className={inputClass}>
                  {LINK_VALIDITY.map((v) => (
                    <option key={v} value={v} className="bg-[#0F1729]">{v}</option>
                  ))}
                </select>
              </Field>
              <Field label="Delivery Days (0 = instant)">
                <input type="number" min="0" value={form.deliveryDays} onChange={(e) => setField("deliveryDays", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Price ($) *">
                <input type="number" min="0" value={form.price} onChange={(e) => setField("price", e.target.value)} className={inputClass} />
              </Field>
            </div>

            <div className="mt-4 flex flex-wrap gap-4">
              {[
                ["sportsGaming", "Sports/Gaming allowed"],
                ["pharmacy", "Pharmacy allowed"],
                ["googleNews", "On Google News"],
                ["foreignLang", "Foreign language allowed"],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => setField(key, e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 accent-orange-500"
                  />
                  {label}
                </label>
              ))}
            </div>
          </section>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Saving…" : "Add Website"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5"
            >
              Clear form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}