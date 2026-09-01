import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Lock,
  Users,
  Globe2,
  CalendarClock,
  Headset,
  LayoutGrid,
  TrendingUp,
  PenSquare,
  Link2,
  Flag,
  DollarSign,
  Gamepad2,
  HeartPulse,
  X,
} from "lucide-react";

/* ============================================================================
   CONSTANTS — mirrors the real site's filter option buckets so the clone's
   filter behaviour matches, not just its look.
============================================================================ */

const SCORE_BUCKETS = ["0 to 10","11 to 20","21 to 30","31 to 40","41 to 50","51 to 60","61 to 70","71 to 80","81 to 90","91 to 100"];
const TRAFFIC_BUCKETS = ["0 to 10k","10k to 20k","20k to 30k","30k to 40k","40k to 50k","50k to 60k","60k to 70k","70k to 80k","80k to 90k","90k to 100k","100k to 200k","200k to 300k","300k to 400k","400k to 500k","500k to 1M","1M+"];
const KEYWORD_BUCKETS = ["0 to 100","100 to 500","500 to 1K","1K to 5K","5K to 10K","10K to 50K","50K+"];
const SEMRUSH_BUCKETS = ["0 to 10k","10k to 20k","20k to 50k","50k to 100k","100k to 500k","500k to 1M","1M+"];
const PRICE_BUCKETS = ["0 to 25","25 to 50","50 to 100","100 to 250","250+"];

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

const NICHES = ["News","Entertainment","Blog","Business","General","Technology","Sports","Fashion","Lifestyle","Travel","Education","App","Beauty","Game","Finance","Health","Medicine","Gaming","Music","Food"];

const LANGUAGES = ["English", "Spanish", "Italian", "Ukrainian"];
const LINK_VALIDITY = ["Instant", "1 Year", "Permanent"];

const FILTER_DEFS = [
  { key: "as", label: "AS", type: "bucket", options: SCORE_BUCKETS },
  { key: "da", label: "DA", type: "bucket", options: SCORE_BUCKETS },
  { key: "dr", label: "DR", type: "bucket", options: SCORE_BUCKETS },
  { key: "country", label: "Country", type: "flat", options: COUNTRIES.map((c) => c.name) },
  { key: "ahrefsTraffic", label: "Ahrefs Traffic", type: "bucket", options: TRAFFIC_BUCKETS },
  { key: "ahrefsKeywords", label: "Ahref Keywords", type: "bucket", options: KEYWORD_BUCKETS },
  { key: "semrushTraffic", label: "Semrush Traffic", type: "bucket", options: SEMRUSH_BUCKETS },
  { key: "sportsGaming", label: "Sports/Gaming allowed?", type: "flat", options: ["Yes", "No"] },
  { key: "pharmacy", label: "Pharmacy allowed?", type: "flat", options: ["Yes", "No"] },
  { key: "niche", label: "Niche", type: "flat", options: NICHES },
  { key: "backlinksCount", label: "No Of Backlinks", type: "flat", options: ["1", "2", "3"] },
  { key: "linkType", label: "Link Type", type: "flat", options: ["DoFollow", "NoFollow"] },
  { key: "linkValidity", label: "Link Validity", type: "flat", options: LINK_VALIDITY },
  { key: "language", label: "Language", type: "flat", options: LANGUAGES },
  { key: "googleNews", label: "Google News", type: "flat", options: ["Yes", "No"] },
  { key: "foreignLang", label: "Foreign lang. allowed?", type: "flat", options: ["Yes", "No"] },
  { key: "selectNew", label: "Select New", type: "flat", options: ["Only New", "Exclude New"] },
  { key: "priceRange", label: "Price Range ($)", type: "bucket", options: PRICE_BUCKETS },
];

/* ============================================================================
   FAKE DATA — replace with real API data once your MERN backend is ready.
============================================================================ */

const NAME_A = ["digi","prime","urban","byte","north","grand","swift","nova","core","vivid","peak","zen","true","meta","pulse","spark","trend","orbit","wise","fresh"];
const NAME_B = ["press","hub","wire","daily","pulse","media","post","desk","world","times","buzz","scope","report","spot","grid","loop","beam","verse","way","lane"];
const TLDS = [".com", ".net", ".org", ".io", ".co"];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[rand(0, arr.length - 1)]; }
function pickMany(arr, n) {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length; i++) out.push(copy.splice(rand(0, copy.length - 1), 1)[0]);
  return out;
}
function trendSeries(bias) {
  let v = rand(20, 80);
  const out = [v];
  for (let i = 0; i < 7; i++) {
    v = Math.max(2, v + rand(-15, 15) + bias);
    out.push(v);
  }
  return out;
}
function formatCompact(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

function generateFakeDb(count) {
  const used = new Set();
  const rows = [];
  for (let i = 0; i < count; i++) {
    let domain;
    do { domain = pick(NAME_A) + pick(NAME_B) + pick(TLDS); } while (used.has(domain));
    used.add(domain);

    const daysAgo = rand(0, 400);
    const bias = rand(-3, 3);
    const countryPicks = pickMany(COUNTRIES, rand(1, 3));
    let remaining = 100;
    const countries = countryPicks.map((c, idx) => {
      const pct = idx === countryPicks.length - 1 ? remaining : rand(5, remaining - (countryPicks.length - idx - 1) * 5);
      remaining -= pct;
      return { ...c, pct };
    });

    rows.push({
      id: `site_${i}`,
      domain,
      isNew: daysAgo < 7,
      niches: pickMany(NICHES, rand(1, 3)),
      language: pick(LANGUAGES),
      as: rand(2, 60),
      da: rand(2, 95),
      dr: rand(2, 95),
      ahrefsTraffic: rand(50, 400000),
      ahrefsKeywords: rand(10, 60000),
      semrushTraffic: rand(20, 200000),
      semrushKeywords: rand(10, 40000),
      ahrefsTrend: trendSeries(bias),
      semrushTrend: trendSeries(-bias),
      countries,
      backlinksCount: pick([1, 1, 2, 2, 2, 3]),
      dofollow: Math.random() > 0.15,
      linkValidity: pick(LINK_VALIDITY),
      deliveryDays: pick([0, 0, 1, 2, 3, 4, 5, 7]),
      sportsGaming: Math.random() > 0.5,
      pharmacy: Math.random() > 0.7,
      googleNews: Math.random() > 0.75,
      foreignLang: Math.random() > 0.6,
      price: rand(8, 320),
      addedAt: Date.now() - daysAgo * 86400000,
    });
  }
  return rows;
}

const FAKE_DB = generateFakeDb(520);

/* ============================================================================
   FILTER PARSING — turns a bucket string like "10k to 20k" or "31 to 40"
   into a numeric [min, max] range for filtering.
============================================================================ */

function bucketToRange(bucket) {
  if (!bucket) return null;
  if (bucket.endsWith("+")) {
    const n = parseUnit(bucket.replace("+", ""));
    return [n, Infinity];
  }
  const [a, b] = bucket.split(" to ");
  return [parseUnit(a), parseUnit(b)];
}
function parseUnit(str) {
  str = str.trim();
  if (str.endsWith("M")) return parseFloat(str) * 1000000;
  if (str.endsWith("K") || str.endsWith("k")) return parseFloat(str) * 1000;
  return parseFloat(str);
}

/* ============================================================================
   MOCK API — same query params a real Express endpoint would receive.
============================================================================ */

function mockFetch(params) {
  const { page = 1, perPage = 150, sortBy = "default", search = "", filters = {} } = params;

  let rows = FAKE_DB.filter((r) => {
    if (search && !r.domain.toLowerCase().includes(search.toLowerCase())) return false;

    for (const def of FILTER_DEFS) {
      const val = filters[def.key];
      if (!val) continue;

      if (def.key === "as" || def.key === "da" || def.key === "dr") {
        const [min, max] = bucketToRange(val);
        if (r[def.key] < min || r[def.key] > max) return false;
      } else if (def.key === "ahrefsTraffic" || def.key === "semrushTraffic") {
        const [min, max] = bucketToRange(val);
        if (r[def.key] < min || r[def.key] > max) return false;
      } else if (def.key === "ahrefsKeywords") {
        const [min, max] = bucketToRange(val);
        if (r.ahrefsKeywords < min || r.ahrefsKeywords > max) return false;
      } else if (def.key === "priceRange") {
        const [min, max] = bucketToRange(val);
        if (r.price < min || r.price > max) return false;
      } else if (def.key === "country") {
        if (!r.countries.some((c) => c.name === val)) return false;
      } else if (def.key === "niche") {
        if (!r.niches.includes(val)) return false;
      } else if (def.key === "backlinksCount") {
        if (r.backlinksCount !== Number(val)) return false;
      } else if (def.key === "linkType") {
        if (val === "DoFollow" && !r.dofollow) return false;
        if (val === "NoFollow" && r.dofollow) return false;
      } else if (def.key === "linkValidity") {
        if (r.linkValidity !== val) return false;
      } else if (def.key === "language") {
        if (r.language !== val) return false;
      } else if (def.key === "sportsGaming") {
        if ((val === "Yes") !== r.sportsGaming) return false;
      } else if (def.key === "pharmacy") {
        if ((val === "Yes") !== r.pharmacy) return false;
      } else if (def.key === "googleNews") {
        if ((val === "Yes") !== r.googleNews) return false;
      } else if (def.key === "foreignLang") {
        if ((val === "Yes") !== r.foreignLang) return false;
      } else if (def.key === "selectNew") {
        if (val === "Only New" && !r.isNew) return false;
        if (val === "Exclude New" && r.isNew) return false;
      }
    }
    return true;
  });

  const sorters = {
    default: (a, b) => b.addedAt - a.addedAt,
    da_desc: (a, b) => b.da - a.da,
    dr_desc: (a, b) => b.dr - a.dr,
    traffic_desc: (a, b) => b.ahrefsTraffic - a.ahrefsTraffic,
    price_asc: (a, b) => a.price - b.price,
    price_desc: (a, b) => b.price - a.price,
  };
  rows = [...rows].sort(sorters[sortBy] || sorters.default);

  const total = rows.length;
  const start = (page - 1) * perPage;
  const pageRows = rows.slice(start, start + perPage);

  return new Promise((resolve) => setTimeout(() => resolve({ rows: pageRows, total }), 260));
}

/* ============================================================================
   DATA HOOK — axios first, falls back to local fake data if there's no
   backend yet or the response doesn't look like real API data.
============================================================================ */

const API_BASE = "/api/websites"; // TODO: point this at your Express route

function useWebsites({ page, perPage, sortBy, search, filters }) {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = { page, perPage, sortBy, search, filters };

    axios
      .get(API_BASE, { params })
      .then((res) => {
        const data = res.data;
        const looksValid = data && Array.isArray(data.rows) && typeof data.total === "number";
        if (!looksValid) throw new Error("Unexpected /api/websites response shape");
        if (cancelled) return;
        setRows(data.rows);
        setTotal(data.total);
        setUsingFallback(false);
        setLoading(false);
      })
      .catch(() => {
        mockFetch(params).then((res) => {
          if (cancelled) return;
          setRows(res.rows);
          setTotal(res.total);
          setUsingFallback(true);
          setLoading(false);
        });
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, sortBy, search, filtersKey]);

  return { rows: rows || [], total: total || 0, loading, usingFallback };
}

/* ============================================================================
   SMALL UI PIECES
============================================================================ */

function ringColor(value) {
  if (value >= 60) return "#34d399"; // emerald
  if (value >= 30) return "#fb923c"; // orange
  return "#f87171"; // red
}

function RingMetric({ value }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(value, 100) / 100) * c;
  const color = ringColor(value);
  return (
    <div className="relative h-9 w-9 shrink-0">
      <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" stroke="#ffffff14" strokeWidth="3" />
        <circle
          cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="3"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">
        {value}
      </span>
    </div>
  );
}

function Sparkline({ data, color }) {
  const w = 64, h = 22;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data
    .map((d, i) => `${(i / (data.length - 1)) * w},${h - ((d - min) / (max - min || 1)) * h}`)
    .join(" ");
  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function StatPill({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/15 text-orange-400">
        <Icon className="h-4 w-4" />
      </div>
      <div className="leading-tight">
        <div className="text-sm font-bold text-white">{value}</div>
        <div className="text-xs text-slate-400">{label}</div>
      </div>
    </div>
  );
}

function CategoryCard({ icon: Icon, label, sub, value, color, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg border p-3.5 text-left transition-colors ${
        active ? "border-orange-500 bg-orange-500/10" : "border-white/10 bg-[#0F1729] hover:border-white/20"
      }`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-lg font-bold leading-tight text-white">{formatCompact(value)}</div>
        <div className="truncate text-xs font-medium text-slate-300">{label}</div>
        <div className="truncate text-[11px] text-slate-500">{sub}</div>
      </div>
    </button>
  );
}

function FilterSelect({ def, value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value || ""}
        onChange={(e) => onChange(def.key, e.target.value)}
        className={`w-full appearance-none rounded-md border bg-white/5 py-2 pl-3 pr-8 text-sm outline-none focus:border-orange-500 ${
          value ? "border-orange-500/60 text-white" : "border-white/10 text-slate-400"
        }`}
      >
        <option value="">{def.label}</option>
        {def.options.map((o) => (
          <option key={o} value={o} className="bg-[#0F1729] text-white">{o}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
    </div>
  );
}

function LoginGateModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#0F1729] p-6 text-center">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-500 hover:text-white">
          <X className="h-4 w-4" />
        </button>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/15 text-orange-400">
          <Lock className="h-5 w-5" />
        </div>
        <h3 className="text-base font-semibold text-white">Do you have an account?</h3>
        <p className="mt-1.5 text-sm text-slate-400">
          Login or create your account to view member pricing and place orders.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button className="rounded-md bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
            Login to Dashboard
          </button>
          <button className="rounded-md border border-white/10 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5">
            Create Free Account
          </button>
          <button onClick={onClose} className="mt-1 text-xs text-slate-500 hover:text-slate-300">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   MAIN COMPONENT
============================================================================ */

const emptyFilters = Object.fromEntries(FILTER_DEFS.map((f) => [f.key, ""]));

export default function GuestPostingMarketplace() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [perPage, setPerPage] = useState(150);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(emptyFilters);
  const [gateOpen, setGateOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => setPage(1), [sortBy, perPage, filters]);

  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const clearFilters = () => { setFilters(emptyFilters); setActiveCategory(null); };

  const cleanFilters = useMemo(() => {
    const f = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) f[k] = v; });
    return f;
  }, [filters]);

  const { rows, total, loading, usingFallback } = useWebsites({
    page, perPage, sortBy, search, filters: cleanFilters,
  });

  // Category card counts, computed from the same source the table reads from.
  const categoryCounts = useMemo(() => {
    const c = {
      total: FAKE_DB.length,
      topTraffic: FAKE_DB.filter((r) => r.ahrefsTraffic > 50000).length,
      guestPosting: FAKE_DB.filter((r) => r.deliveryDays <= 3).length,
      linkInsertion: FAKE_DB.filter((r) => r.backlinksCount <= 2).length,
      usa: FAKE_DB.filter((r) => r.countries[0]?.code === "US").length,
      financial: FAKE_DB.filter((r) => r.niches.includes("Finance")).length,
      gaming: FAKE_DB.filter((r) => r.niches.includes("Gaming") || r.niches.includes("Game")).length,
      medicine: FAKE_DB.filter((r) => r.niches.includes("Medicine") || r.niches.includes("Health")).length,
    };
    return c;
  }, []);

  const cards = [
    { key: "total", icon: Globe2, label: "Total Websites", sub: "All Verified Sites", value: categoryCounts.total, color: "bg-blue-500/15 text-blue-400" },
    { key: "topTraffic", icon: TrendingUp, label: "Top Traffic", sub: "High Traffic Sites", value: categoryCounts.topTraffic, color: "bg-orange-500/15 text-orange-400" },
    { key: "guestPosting", icon: PenSquare, label: "Guest Posting", sub: "Available for Guest Post", value: categoryCounts.guestPosting, color: "bg-purple-500/15 text-purple-400" },
    { key: "linkInsertion", icon: Link2, label: "Link Insertion", sub: "Link Insertion Sites", value: categoryCounts.linkInsertion, color: "bg-cyan-500/15 text-cyan-400" },
    { key: "usa", icon: Flag, label: "USA Websites", sub: "From United States", value: categoryCounts.usa, color: "bg-rose-500/15 text-rose-400" },
    { key: "financial", icon: DollarSign, label: "Financial", sub: "Finance Niche", value: categoryCounts.financial, color: "bg-emerald-500/15 text-emerald-400" },
    { key: "gaming", icon: Gamepad2, label: "Gaming Sites", sub: "Gaming Niche", value: categoryCounts.gaming, color: "bg-pink-500/15 text-pink-400" },
    { key: "medicine", icon: HeartPulse, label: "Medicine", sub: "Health & Medicine", value: categoryCounts.medicine, color: "bg-red-500/15 text-red-400" },
  ];

  const handleCategoryClick = (key) => {
    if (activeCategory === key) { setActiveCategory(null); setFilter("niche", ""); return; }
    setActiveCategory(key);
    if (key === "financial") setFilter("niche", "Finance");
    else if (key === "gaming") setFilter("niche", "Gaming");
    else if (key === "medicine") setFilter("niche", "Health");
    else if (key === "usa") setFilter("country", "United States");
    else setFilter("niche", "");
  };

  const start = total === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="min-h-screen bg-[#0B1220] px-4 py-10 font-sans sm:px-8">
      {gateOpen && <LoginGateModal onClose={() => setGateOpen(false)} />}

      <div className="mx-auto max-w-7xl">
        {/* Hero */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Guest Posting Marketplace</h1>
          <p className="mt-1 text-lg font-semibold text-orange-400">Backlinks from Real Websites</p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">
            Get premium editorial backlinks from real, high-authority websites and trusted brands.
            Filter publisher websites by niche, target audience, traffic, and key SEO metrics, then
            manage your entire guest posting campaign from one marketplace.
          </p>
        </div>

        {/* Stats bar */}
        <div className="mt-8 grid grid-cols-2 divide-white/10 rounded-lg border border-white/10 bg-[#0F1729] sm:grid-cols-4 sm:divide-x">
          <StatPill icon={Users} value="20K+" label="Happy Customers" />
          <StatPill icon={Globe2} value="2.8K+" label="Verified Websites" />
          <StatPill icon={CalendarClock} value="8+" label="Years in Business" />
          <StatPill icon={Headset} value="24/7" label="Live Support" />
        </div>

        {/* Live ticker */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-md border border-white/10 bg-[#0F1729] px-4 py-2.5 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> LIVE
          </span>
          <span>142 browsing now</span>
          <span>564 sites added this week · 17 added today</span>
          <span className="hidden sm:inline">
            Just added: <span className="text-orange-400">{FAKE_DB[0]?.domain}</span> 6 hours ago
          </span>
          <span className="ml-auto hidden text-slate-600 sm:inline">Metrics update automatically</span>
        </div>

        {/* Category cards */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {cards.map((c) => (
            <CategoryCard
              key={c.key}
              icon={c.icon}
              label={c.label}
              sub={c.sub}
              value={c.value}
              color={c.color}
              active={activeCategory === c.key}
              onClick={() => handleCategoryClick(c.key)}
            />
          ))}
        </div>

        {/* Filters grid */}
        <div className="mt-5 rounded-lg border border-white/10 bg-[#0F1729] p-4">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Filter Websites</span>
            {Object.values(cleanFilters).length > 0 && (
              <button onClick={clearFilters} className="text-xs font-medium text-orange-400 hover:text-orange-300">
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {FILTER_DEFS.map((def) => (
              <FilterSelect key={def.key} def={def} value={filters[def.key]} onChange={setFilter} />
            ))}
          </div>
        </div>

        {/* Search + sort row */}
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>
              Showing {start} – {end} of {total} results
            </span>
            {usingFallback && !loading && (
              <span className="ml-3 hidden text-xs text-slate-600 sm:inline">demo data · connect your API to replace</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search URL"
                className="w-full rounded-md border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none focus:border-orange-500"
              />
            </div>

            <button className="rounded-md border border-orange-500 px-3 py-2 text-sm font-medium text-orange-400 hover:bg-orange-500/10">
              Bulk Search
            </button>

            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
            >
              {[10, 25, 50, 100, 150].map((n) => (
                <option key={n} value={n} className="bg-[#0F1729]">{n} per page</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
            >
              <option value="default" className="bg-[#0F1729]">Sort: Default</option>
              <option value="da_desc" className="bg-[#0F1729]">DA (High to Low)</option>
              <option value="dr_desc" className="bg-[#0F1729]">DR (High to Low)</option>
              <option value="traffic_desc" className="bg-[#0F1729]">Traffic (High to Low)</option>
              <option value="price_asc" className="bg-[#0F1729]">Price (Low to High)</option>
              <option value="price_desc" className="bg-[#0F1729]">Price (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="mt-3 overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#0F1729] text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3">Website</th>
                <th className="px-3 py-3 text-blue-400">AS</th>
                <th className="px-3 py-3 text-emerald-400">Moz DA</th>
                <th className="px-3 py-3 text-orange-400">Ahrefs DR</th>
                <th className="px-3 py-3 text-orange-400">Ahrefs Traffic</th>
                <th className="px-3 py-3 text-emerald-400">Semrush Traffic</th>
                <th className="px-3 py-3">Countries</th>
                <th className="px-3 py-3">Delivery &amp; Links No</th>
                <th className="px-3 py-3">Starting Price</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {Array.from({ length: 9 }).map((__, j) => (
                      <td key={j} className="px-3 py-4">
                        <div className="h-4 w-full max-w-[70px] animate-pulse rounded bg-white/5" />
                      </td>
                    ))}
                  </tr>
                ))}

              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-500">
                    No websites match these filters. Try widening your search.
                  </td>
                </tr>
              )}

              {!loading &&
                rows.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 align-top hover:bg-white/[0.03]">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-white">{r.domain}</span>
                        {r.isNew && (
                          <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">NEW</span>
                        )}
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {r.niches.map((n) => (
                          <span key={n} className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-300">
                            {n}
                          </span>
                        ))}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500">{r.language}</div>
                    </td>
                    <td className="px-3 py-4"><RingMetric value={r.as} /></td>
                    <td className="px-3 py-4"><RingMetric value={r.da} /></td>
                    <td className="px-3 py-4"><RingMetric value={r.dr} /></td>
                    <td className="px-3 py-4">
                      <div className="text-sm font-semibold text-white">{formatCompact(r.ahrefsTraffic)}</div>
                      <Sparkline data={r.ahrefsTrend} color="#fb923c" />
                      <div className="text-[10px] text-slate-500">{formatCompact(r.ahrefsKeywords)} keywords</div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-sm font-semibold text-white">{formatCompact(r.semrushTraffic)}</div>
                      <Sparkline data={r.semrushTrend} color="#34d399" />
                      <div className="text-[10px] text-slate-500">{formatCompact(r.semrushKeywords)} keywords</div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="space-y-1">
                        {r.countries.map((c) => (
                          <div key={c.code} className="flex items-center gap-1.5 text-xs text-slate-300">
                            <span>{c.flag}</span>
                            <span>{c.pct}%</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-white">{r.backlinksCount}</span>
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${r.dofollow ? "bg-blue-500/20 text-blue-400" : "bg-slate-500/20 text-slate-400"}`}>
                          {r.dofollow ? "DoFollow" : "NoFollow"}
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] font-medium text-orange-400">
                        {r.deliveryDays === 0 ? "INSTANT" : `${r.deliveryDays} DAYS`}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <button
                        onClick={() => setGateOpen(true)}
                        className="flex items-center gap-1.5 whitespace-nowrap rounded-md border border-orange-500/60 px-3 py-1.5 text-xs font-semibold text-orange-400 hover:bg-orange-500/10"
                      >
                        <Lock className="h-3 w-3" /> Member Price
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && total > 0 && (
          <div className="mt-6 flex items-center justify-center gap-1.5">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-300 disabled:opacity-30 hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 text-sm text-slate-400">Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-300 disabled:opacity-30 hover:bg-white/10"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}