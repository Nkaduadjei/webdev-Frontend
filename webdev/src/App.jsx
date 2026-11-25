import { useMemo, useState } from "react";

const products = [
  { id: "wall-relief", name: "Ancestral Gye Nyame Wall Relief", maker: "Kwabena Osei", place: "Kumasi, Ghana", category: "Sculptures", material: "Sun-dried mahogany", price: 2100, tag: "ONE OF A KIND", motif: "gye", tone: "wood", photo: "wall-relief" },
  { id: "vessel-mask", name: "Oti Sentinel Vessel Mask", maker: "Kofi Asante", place: "Vogan, Togo", category: "Sculptures", material: "Hardwood & kaolin clay", price: 2600, tag: "AVAILABLE", motif: "mask", tone: "clay", photo: "mask-card" },
  { id: "harmony-diptych", name: "Duafe Harmony Diptych", maker: "Kwabena Osei", place: "Kumasi, Ghana", category: "Sculptures", material: "Incised basswood", price: 1950, tag: "AVAILABLE", motif: "duafe", tone: "dark", photo: "relief-card" },
  { id: "brass-pendant", name: "Nyame Dua Brass Pendant", maker: "Adisa Adeleke", place: "Osogbo, Nigeria", category: "Adornment", material: "Lost-wax cast brass", price: 850, tag: "GUILD VERIFIED", motif: "pendant", tone: "gold", photo: "home" },
  { id: "ceremony-textile", name: "Ochre & Ash Ceremony Textile", maker: "Akosua Serwaa", place: "Bonwire, Ghana", category: "Textiles", material: "Hand-stamped cotton", price: 1750, tag: "AVAILABLE", motif: "textile", tone: "ochre", photo: "textile-card" },
  { id: "royal-stool", name: "Golden Stool Royal Study", maker: "Kwabena Osei", place: "Kumasi, Ghana", category: "Furniture", material: "Iroko & brass leaf", price: 3400, tag: "AVAILABLE", motif: "stool", tone: "gold", photo: "stool-card" },
  { id: "sovereign-vessel", name: "Sovereign Vessel No. 4", maker: "Kofi Asante", place: "Vogan, Togo", category: "Ceramics", material: "Open-pit fired terracotta", price: 1200, tag: "AVAILABLE", motif: "vessel", tone: "clay", photo: "vessel-card" },
  { id: "akoma-panel", name: "Akoma Intaglio Panel", maker: "Kwabena Osei", place: "Kumasi, Ghana", category: "Sculptures", material: "Carved teak", price: 1600, tag: "AVAILABLE", motif: "akoma", tone: "wood", photo: "adinkra" },
];

const routeTitles = {
  "/": "Home",
  "/inspire": "Inspire",
  "/market": "Market",
  "/heritage": "Heritage Library",
  "/heritage/gye-nyame": "Gye Nyame",
  "/showcase/kwabena-osei": "Kwabena Osei",
  "/market/ancestral-gye-nyame-wall-relief": "Ancestral Gye Nyame Wall Relief",
  ...Object.fromEntries(products.map((product) => [`/market/${product.id}`, product.name])),
  "/cart": "Your curated acquisition",
  "/checkout": "Secure guild checkout",
  "/commissions": "Commission tracker",
  "/atelier/upload": "Upload artwork",
  "/login": "Guild vault",
};

function readCart() {
  const saved = localStorage.getItem("adwini-cart");
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.some((item) => !item || !products.some((product) => product.id === item.id) || !Number.isInteger(item.quantity) || item.quantity < 1)) {
      throw new TypeError("Saved cart data has an invalid shape.");
    }
    return parsed;
  } catch (error) {
    console.error("Unable to load the saved cart; starting with an empty cart.", error);
    return [];
  }
}

function money(amount) {
  return `GH₵ ${amount.toLocaleString("en-GH")}`;
}

function App() {
  const [cart, setCart] = useState(readCart);
  const [notice, setNotice] = useState("");

  function updateCart(next) {
    setCart(next);
    localStorage.setItem("adwini-cart", JSON.stringify(next));
  }

  function addToCart(product) {
    const existing = cart.find((item) => item.id === product.id);
    updateCart(existing
      ? cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { id: product.id, quantity: 1 }]);
    setNotice(`${product.name} added to your collection`);
    window.setTimeout(() => setNotice(""), 2800);
  }

  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const page = routeTitles[path] ? path : "/";
  const count = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <Header count={count} />
      <main>
        {page === "/" && <Home addToCart={addToCart} />}
        {page === "/inspire" && <Inspire />}
        {page === "/market" && <Market addToCart={addToCart} />}
        {page === "/heritage" && <Heritage />}
        {page === "/heritage/gye-nyame" && <HeritageDetail />}
        {page === "/showcase/kwabena-osei" && <Artisan />}
        {page.startsWith("/market/") && page !== "/market" && <ProductDetail product={products.find((item) => `/market/${item.id}` === page) || products[0]} addToCart={addToCart} />}
        {page === "/cart" && <Cart cart={cart} updateCart={updateCart} />}
        {page === "/checkout" && <Checkout cart={cart} updateCart={updateCart} />}
        {page === "/commissions" && <Commissions />}
        {page === "/atelier/upload" && <Upload />}
        {page === "/login" && <Login />}
      </main>
      <Footer />
      {notice && <div className="toast" role="status">{notice}</div>}
    </>
  );
}

function Header({ count }) {
  const links = [["Home", "/"], ["Inspire", "/inspire"], ["Heritage", "/heritage"], ["Showcase", "/showcase/kwabena-osei"], ["Market", "/market"], ["About", "/#about"]];
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  return (
    <>
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="Adwini home">ADWINI</a>
        <nav className="main-nav" aria-label="Main navigation">
          {links.map(([label, href]) => <a key={label} className={path === href ? "active" : ""} href={href}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <a className="button button-small button-rust" href="/market">Shop now</a>
          <a className="icon-link bag-link" href="/cart" aria-label={`Shopping cart, ${count} items`}>♧{count > 0 && <span className="bag-count">{count}</span>}</a>
          <a className="icon-link account-link" href="/login" aria-label="Guild account">♙</a>
        </div>
      </header>
      <div className="kente-strip" aria-hidden="true" />
    </>
  );
}

function Footer() {
  return (
    <>
      <div className="kente-strip" aria-hidden="true" />
      <footer className="footer" id="about">
        <div className="footer-about">
          <a className="wordmark" href="/">ADWINI</a>
          <p>Art, heritage, and direct marketplace for African creators, sculptors, and textile weavers. Connecting roots to global spaces.</p>
          <span>ACCRA · LAGOS · NAIROBI · DAKAR</span>
        </div>
        <div className="footer-column"><strong>Explore</strong><a href="/inspire">Curated galleries</a><a href="/showcase/kwabena-osei">Artisan voices</a><a href="/heritage">Current exhibitions</a></div>
        <div className="footer-column"><strong>Heritage</strong><a href="/heritage">Material archives</a><a href="/heritage/gye-nyame">Adinkra motifs</a><a href="/commissions">Provenance registry</a></div>
        <div className="footer-column"><strong>Marketplace</strong><a href="/market">Artifact exchange</a><a href="/cart">Shopping cart</a><a href="/checkout">Secure checkout</a><a href="/atelier/upload">Artist registration</a></div>
        <div className="footer-bottom"><span>© 2025 Adwini. All rights reserved.</span><span><a href="/heritage">Privacy policy</a><a href="/heritage">Terms of provenance</a><a href="/checkout">Shipping & customs</a></span></div>
      </footer>
    </>
  );
}

function Artwork({ motif = "gye", tone = "wood", className = "", photo }) {
  return (
    <div className={`artwork artwork-${tone} ${photo ? "photo-art" : ""} ${className}`} aria-hidden="true">
      {photo ? <img src={`/artwork/${photo}.jpg`} alt="" loading="lazy" /> : <><span className={`motif motif-${motif}`} /><span className="art-glint" /></>}
    </div>
  );
}

function ProductCard({ product, addToCart }) {
  const productPath = product.id === "wall-relief" ? "/market/ancestral-gye-nyame-wall-relief" : `/market/${product.id}`;
  return (
    <article className="product-card">
      <a className="product-image-link" href={productPath}>
        <Artwork motif={product.motif} tone={product.tone} photo={product.photo} />
        <span className="product-tag">{product.tag}</span>
      </a>
      <div className="product-info">
        <span className="eyebrow">{product.material}</span>
        <a className="product-title" href={productPath}>{product.name}</a>
        <p>{product.maker} · {product.place}</p>
        <div className="product-card-bottom"><strong>{money(product.price)}</strong><button className="button button-mini" onClick={() => addToCart(product)}>Acquire</button></div>
      </div>
    </article>
  );
}

function Home({ addToCart }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy"><span className="eyebrow light">THE ADWINI CULTURAL EXCHANGE</span><h1>The beauty of<br />African heritage.</h1><p>Discover timeless craft, living traditions, and contemporary creativity from across the continent.</p><a className="button button-light" href="/market">Explore the market <span>→</span></a></div>
        <div className="hero-art"><div className="hero-art-frame"><Artwork motif="pendant" tone="hero" photo="home" /></div><span className="hero-caption">Handcrafted in Kumasi · Ghana</span></div>
        <div className="hero-pagination"><span className="dot-current" /><span /><span /></div>
      </section>
      <div className="kente-strip" aria-hidden="true" />
      <section className="section ecosystem">
        <div className="section-intro"><span className="eyebrow">OUR ECOSYSTEM</span><h2>One home for living heritage</h2><p>A unified home honoring classical West, East, and Southern African craft traditions alongside contemporary master artisans.</p></div>
        <div className="ecosystem-grid">
          <Feature title="Inspire" copy="Browse curated moodboards, color palettes, and artisan sketchbooks from across the continent." href="/inspire" icon="✳" />
          <Feature title="Heritage library" copy="Explore historical archives of motifs, weaving traditions, and indigenous techniques." href="/heritage" icon="◈" />
          <Feature title="Showcase" copy="Meet master makers and discover the stories behind their work." href="/showcase/kwabena-osei" icon="♧" />
          <Feature title="Market" copy="Purchase verified original works directly from creators with secure regional and global shipping." href="/market" icon="◇" />
        </div>
      </section>
      <section className="section section-pale">
        <div className="section-heading"><div><span className="eyebrow">DIRECT FROM STUDIOS</span><h2>New artworks</h2></div><a className="text-link" href="/market">View all pieces <span>→</span></a></div>
        <div className="product-grid product-grid-4">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} addToCart={addToCart} />)}</div>
      </section>
      <section className="section heritage-banner">
        <Artwork motif="textile" tone="ochre" photo="textile-card" className="banner-art" />
        <div><span className="eyebrow">PATTERN ARCHIVE 084</span><h2>Adinkra: Gye Nyame<br /><em>“Except God”</em></h2><p>Originating among the Akan people of Ghana, this symbol represents the omnipotence and supremacy of God.</p><a className="text-link" href="/heritage/gye-nyame">Explore the heritage library <span>→</span></a></div>
      </section>
    </>
  );
}

function Feature({ title, copy, href, icon }) {
  return <a className="feature-card" href={href}><span className="feature-icon">{icon}</span><h3>{title}</h3><p>{copy}</p><span className="eyebrow">EXPLORE COLLECTIONS →</span></a>;
}

function Market({ addToCart }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All artifacts");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sort, setSort] = useState("featured");
  const filtered = useMemo(() => {
    const matches = products.filter((p) => (category === "All artifacts" || p.category === category) && p.price <= maxPrice && `${p.name} ${p.maker} ${p.material} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
    return matches.sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : 0);
  }, [query, category, maxPrice, sort]);
  return (
    <div className="market-layout page-wrap">
      <aside className="market-sidebar"><span className="eyebrow">CURATED MARKET</span><h2>Guild collections</h2><p>Authentic works, directly from African studios.</p><div className="category-list">{["All artifacts", "Sculptures", "Textiles", "Adornment", "Ceramics", "Furniture"].map((item) => <button key={item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="filter-box"><label htmlFor="price-range">PRICE RANGE (GH₵)</label><input id="price-range" type="range" min="500" max="5000" step="100" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} /><div className="range-values"><span>GH₵ 500</span><strong>GH₵ {maxPrice.toLocaleString()}</strong></div></div><div className="sidebar-note"><strong>Direct trade</strong><p>85% of each acquisition goes directly to the master craftspeople across West and East Africa.</p></div></aside>
      <section className="market-content"><div className="breadcrumbs">ADWINI / MARKET</div><div className="section-heading"><div><h1>Artifact market</h1><p>Direct-from-studio acquisitions supporting master artists, verified guilds, and traditional craft preservation.</p></div><span className="verified-note">✦ SHOWING {filtered.length} VERIFIED ARTIFACTS</span></div><div className="market-toolbar"><label className="search-field"><span>⌕</span><input aria-label="Search artworks" placeholder="Search artworks, makers, materials..." value={query} onChange={(event) => setQuery(event.target.value)} /></label><label className="sort-field">SORT BY <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Curatorial featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div>{filtered.length ? <div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} addToCart={addToCart} />)}</div> : <div className="empty-state"><h3>No pieces match those filters</h3><p>Try a different search or widen your price range.</p><button className="button" onClick={() => { setQuery(""); setCategory("All artifacts"); setMaxPrice(5000); }}>Clear filters</button></div>}</section>
    </div>
  );
}

function ProductDetail({ product, addToCart }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="page-wrap product-detail">
      <div className="breadcrumbs">ADWINI / MARKET / SCULPTURES / ANCESTRAL GYE NYAME WALL RELIEF</div>
      <div className="detail-grid">
        <div><div className="detail-art"><Artwork motif={product.motif} tone={product.tone} photo={product.photo} /><span className="product-tag">PLATE 01 / FRONTAL VIEW</span></div><div className="thumbnail-row">{["Frontal view", "Profile detail", "Material grain", "Studio process"].map((label, index) => <button key={label} className={index === 0 ? "thumb-active" : ""} onClick={(event) => event.currentTarget.classList.toggle("thumb-active")}><Artwork motif={index === 1 ? "akoma" : index === 2 ? "textile" : product.motif} tone={index % 2 ? "ochre" : product.tone} photo={index === 0 ? product.photo : undefined} /><span>{index + 1}. {label}</span></button>)}</div><div className="spec-box"><h3>Artwork specifications</h3><div className="spec-grid"><span>Physical dimensions<strong>110 cm (H) × 65 cm (W) × 8 cm (D)</strong></span><span>Primary medium<strong>{product.material}</strong></span><span>Guild provenance<strong>Verified artisan registry</strong></span><span>Year of completion<strong>2024 · Artisan Guild record</strong></span></div></div></div>
        <div className="detail-copy"><span className="eyebrow">✦ AVAILABLE FOR ACQUISITION · {product.category.toUpperCase()}</span><h1>{product.name}</h1><div className="maker-line"><span className="avatar">{product.maker.split(" ").map((word) => word[0]).join("")}</span><span><a href="/showcase/kwabena-osei"><strong>{product.maker}</strong></a><small>{product.place} · Verified master artisan</small></span><a className="text-link" href="/showcase/kwabena-osei">Profile</a></div><div className="price-panel"><span>ACQUISITION PRICE <small>NO GALLERY MARKUP</small></span><strong>{money(product.price)}</strong><small>Direct museum crating, export documentation, and phytosanitary certificate included.</small></div><p>Created by {product.maker} in {product.place}, this masterwork is crafted from {product.material.toLowerCase()} using techniques carried through generations of guild practice. Its form brings an enduring piece of African cultural heritage into contemporary spaces.</p><p>Each work is individually finished in the artisan’s studio and documented in the Adwini registry. Its provenance record accompanies the piece from atelier dispatch through delivery.</p><div className="tag-row"><span>#{product.category.toUpperCase()}</span><span>#{product.material.toUpperCase().replaceAll(" ", "")}</span><span>#GUILDVERIFIED</span><span>#HANDCRAFTED</span></div><div className="detail-actions"><button className="button button-rust" onClick={() => addToCart(product)}>＋ Add to collection (cart)</button><button className={`button button-outline ${saved ? "saved" : ""}`} onClick={() => setSaved(!saved)}>{saved ? "♥ Saved" : "♡ Save"}</button></div><p className="fine-print">◈ Have questions about this piece? <a href="/showcase/kwabena-osei">Inquire directly with {product.maker.split(" ")[0]}</a></p><div className="covenant"><strong>THE ADWINI PROVENANCE COVENANT</strong><ul><li>Guild registry: artisan lineage and work record verified by the regional craft council.</li><li>85% Direct Artisan Dividend: guaranteed direct remittance to the maker’s local trust.</li><li>Reinforced shipping enclosure: temperature and shock-monitored freight for fine art handling.</li></ul></div></div>
      </div><section className="section"><div className="section-heading"><h2>More from Kwabena Osei</h2><a className="text-link" href="/showcase/kwabena-osei">View full portfolio →</a></div><div className="product-grid product-grid-4">{products.slice(2, 6).map((item) => <ProductCard key={item.id} product={item} addToCart={addToCart} />)}</div></section>
    </div>
  );
}

function Inspire() {
  const [saved, setSaved] = useState(false);
  const [query, setQuery] = useState("");
  const inspirations = [
    ["Ashanti Stool Carving Studies", "CARVING", "gye", "wood", "Kwabena Osei · Kumasi, Ghana", "Motif: Gye Nyame", "stool-card"],
    ["Fulani Hammered Brass Collar", "ADORNMENT", "pendant", "gold", "Adisa Adeleke · Osogbo, Nigeria", "Material: Raw brass", "home"],
    ["Yoruba Beaded Crown Detail", "ADORNMENT", "mask", "ochre", "Gbenga Ogunlesi · Oyo, Nigeria", "Medium: Glass seed beads", "mask-card"],
    ["Maasai Beaded Choker Sequence", "ADORNMENT", "akoma", "clay", "Nasieku Sopai · Narok, Kenya", "Region: Great Rift Valley", "login"],
    ["Indigo Resist Dye Swatches", "TEXTILE", "textile", "dark", "Fatomata Ba · Bamako, Mali", "Dye: Fermented indigo", "textile-card"],
    ["Kuba Raffia Cut-Pile Tapestry", "TEXTILE", "textile", "ochre", "Zola Ndlovu · Kasai, DR Congo", "Fiber: Raffia palm", "adinkra"],
    ["Dogon Granary Shutter Relief", "CARVING", "duafe", "wood", "Amadou Guindo · Bandiagara, Mali", "Timber: Sun-dried iroko", "atelier"],
    ["Terracotta Water Vessel", "CERAMICS", "vessel", "clay", "Kofi Asante · Vogan, Togo", "Finish: Open-pit fired", "vessel-card"],
  ];
  const shown = inspirations.filter((item) => `${item[0]} ${item[1]} ${item[4]} ${item[5]}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="page-wrap inspire-page"><div className="breadcrumbs">ADWINI / INSPIRE</div><div className="section-heading"><div><span className="eyebrow">CURATED VISUAL JOURNAL</span><h1>Inspire</h1><p>Explore the materials, makers, and traditions shaping contemporary African craft.</p></div><div className="button-group"><button className="button button-outline" onClick={() => setSaved(!saved)}>{saved ? "My moodboards (1)" : "My moodboards (0)"}</button><button className="button button-rust" onClick={() => { const name = window.prompt("Name your new moodboard"); if (name?.trim()) setSaved(true); }}>＋ Create new moodboard</button></div></div><div className="market-toolbar"><div className="filter-pills"><span>Style: All styles</span><span>Medium: All mediums</span><span>Colour: All palettes</span><span>Pattern: All motifs</span></div><label className="search-field"><span>⌕</span><input aria-label="Search inspirations" placeholder="Search inspirations..." value={query} onChange={(event) => setQuery(event.target.value)} /></label><span className="eyebrow">{shown.length} CURATIONS</span></div><div className="inspiration-grid">{shown.map((item) => <article className="inspiration-card" key={item[0]}><Artwork motif={item[2]} tone={item[3]} photo={item[6]} /><div><span className="eyebrow">{item[1]} <span>{item[5]}</span></span><h3>{item[0]}</h3><p>{item[4]}</p><button className="text-link" onClick={() => setSaved(!saved)}>{saved ? "✓ Saved to moodboard" : "Save to moodboard"} →</button></div></article>)}</div>{saved && <div className="saved-board">Active curating session <strong>Moodboard: “Warm Earth & Ochre”</strong><span>Items saved in this session</span></div>}</div>
  );
}

function Heritage() {
  const [query, setQuery] = useState("");
  const entries = [
    ["Gye Nyame", "ADINKRA MOTIF · AKAN (GHANA)", "“Except God” — Supremacy and Omnipresence", "gye", "wood"],
    ["Sankofa", "ADINKRA MOTIF · AKAN (GHANA)", "“Return and retrieve” — Wisdom of historical continuity", "akoma", "gold"],
    ["Kalabougue Chevron", "BOGOLAN · BAMANA (MALI)", "Applied through fermented iron-rich clay", "textile", "dark"],
    ["Adweneasa", "KENTE WEAVING · ASHANTI (GHANA)", "“My skill is exhausted” — Pinnacle of mastery", "textile", "ochre"],
    ["Duafe", "ADINKRA MOTIF · AKAN (GHANA)", "The wooden comb — material care and beauty", "duafe", "clay"],
    ["Shoua Diamond", "KUBA CLOTH · KASAI (DR CONGO)", "Poly-rhythmic weave & cosmic balance", "akoma", "wood"],
    ["Aya", "ADINKRA MOTIF · AKAN (GHANA)", "“The fern” — Defiance and endurance", "gye", "ochre"],
    ["Sanyan Lineage", "ASO-OKE · YORUBA (NIGERIA)", "Wild anaphe silk ceremonial strip", "textile", "dark"],
  ];
  const filtered = entries.filter((entry) => `${entry[0]} ${entry[1]} ${entry[2]}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="page-wrap heritage-page"><div className="breadcrumbs">ADWINI / HERITAGE LIBRARY</div><div className="heritage-intro"><div><h1>Heritage library</h1><p>An open cultural archive preserving sacred geometry, oral histories, symbolic motifs, and ancestral textile traditions across the continent.</p></div><div className="archive-stats"><span>◈ 142 Catalogued motifs</span><span>♧ 8 Provenance traditions</span><span>◎ All open access</span></div></div><div className="archive-tools"><label className="search-field"><span>⌕</span><input aria-label="Search heritage archive" placeholder="Search patterns by name, meaning, motif or ethnic origin (e.g. Gye Nyame, Sankofa, Bogolan)..." value={query} onChange={(event) => setQuery(event.target.value)} /></label><div className="filter-pills"><span>Origin tradition: All traditions</span><span>Meaning category: All meanings</span><span>Era: Historical & contemporary</span><span>Sort: Most documented first</span></div></div><div className="archive-grid">{filtered.map((entry, index) => <article className="archive-card" key={entry[0]}><div className="archive-image"><Artwork motif={entry[3]} tone={entry[4]} photo={index === 0 ? "archive" : index === 1 ? "adinkra" : index % 2 ? "textile-card" : "inspire"} /><span className="product-tag">REF #ADK-{String(index + 1).padStart(3, "0")}</span></div><div><span className="eyebrow">{entry[1]}</span><h3>{entry[0]}</h3><p>{entry[2]}</p><span className="archive-count">{14 + index * 3} connected works</span><a className="text-link" href="/heritage/gye-nyame">View record →</a></div></article>)}</div><div className="protocol"><strong>ARCHIVAL PROTOCOL & ETHICS STATEMENT</strong><p><em>“Every motif in this archive is recorded in direct dialogue with lineage elders, traditional weavers, and guild historians to ensure authentic cultural attribution, provenance tracking, and semantic integrity.”</em></p><a className="button button-outline" href="/heritage/gye-nyame">Protocol guidelines</a></div></div>
  );
}

function HeritageDetail() {
  return (
    <div className="page-wrap heritage-detail"><div className="breadcrumbs"><a href="/heritage">ADWINI / HERITAGE LIBRARY</a> / ADINKRA MOTIFS / GYE NYAME</div><div className="detail-grid"><div><div className="heritage-symbol"><Artwork motif="gye" tone="ochre" photo="adinkra" /><span className="product-tag">SPECIMEN 084 · PRIMARY MOTIF</span></div><div className="phonetic"><span>◖</span><div><small>PHONETIC GUIDE · TWI LANGUAGE</small><strong>Gye Nyame <em>/dʒiː ɲaːme/</em></strong></div></div></div><div className="heritage-meaning"><span className="eyebrow">TRADITIONAL AKAN MOTIF · ASHANTI REGION, GHANA</span><h1>Gye Nyame</h1><p className="subtitle"><em>“Except God”</em> · “Only God has final dominion”</p><div className="tag-row"><span>ORIGIN: PRE-17TH CENTURY</span><span>MEDIUM: BARK DYE & LOST-WAX BRASS</span></div><h3>◈ Symbolic meaning</h3><p>Symbol of the omnipotence, omnipresence, and supremacy of God. It reflects the core Akan belief that nothing in the universe exists, sustains, or endures without divine sanction. Highly revered across the West African diaspora, it stands as the most recognized and culturally sacred Adinkra motif globally.</p><h3>♧ Traditional usage & cultural protocol</h3><p>Historically reserved exclusively for Ashanti monarchs (Asantehene) and spiritual custodians on ceremonial cloths during state funerals, sacred Akwasidae festivals, and royal investitures.</p><h3>◉ Pigment & materiality</h3><p>Crafted using Adinkra aduru — a deep, indelible brown-black dye extracted from the boiled bark and powder of the Badie tree. The bark mixture is simmered slowly over woodsmoke for continuous days alongside iron-rich river slag.</p><div className="detail-actions"><a className="button button-rust" href="/inspire">Add to curated moodboard</a><button className="button button-outline" onClick={() => navigator.clipboard?.writeText(window.location.href)}>▣ Cite cultural archive record</button></div></div></div><section className="section"><span className="eyebrow">MASTER ARTISAN CATALOG</span><h2>Artworks using this pattern</h2><div className="product-grid product-grid-4">{products.slice(0, 4).map((item) => <ProductCard key={item.id} product={item} addToCart={() => { window.location.href = "/market/ancestral-gye-nyame-wall-relief"; }} />)}</div></section></div>
  );
}

function Artisan() {
  const [following, setFollowing] = useState(false);
  return (
    <div className="page-wrap artisan-page"><div className="artisan-cover"><Artwork motif="stool" tone="wood" photo="atelier" /><span className="cover-label">ADWINI GUILD · KUMASI, GHANA</span></div><section className="artisan-card"><div className="avatar avatar-large">KO</div><div className="artisan-bio"><span className="eyebrow">◉ VERIFIED MASTER ARTISAN · ASHANTI REGION, GHANA</span><h1>Kwabena Osei</h1><h3>Master Sculptor & Sacred Akan Carver</h3><p>Carving sacred mahogany, cedar, and sun-dried iroko for over 28 years in Kumasi. Trained under royal regalia master carvers, specializing in monumental Adinkra wall reliefs, ceremonial chiefs’ stools, and ancestral guardians for architectural spaces worldwide.</p></div><div className="artisan-actions"><a className="button button-rust" href="/commissions">Request custom artwork</a><button className="button button-outline" onClick={() => setFollowing(!following)}>{following ? "✓ Following" : "♧ Follow"}</button></div><div className="artisan-stats"><div><strong>42</strong><span>Archived works</span></div><div><strong>{following ? "1,841" : "1,840"}</strong><span>Patron followers</span></div><div><strong>29</strong><span>Guild commissions</span></div><div><strong>14</strong><span>Apprentices mentored</span></div></div></section><div className="artisan-info"><section className="statement"><span className="eyebrow">ARTISAN STATEMENT & MATERIAL LINEAGE</span><p>“The grain of mature iroko holds the ancestral rhythm before my chisel ever touches the timber. In our Kumasi studio, wood is treated not as inert substrate, but as a living mediator between sacred Akan cosmologies and secular modern dwellings.”</p><div className="tag-row"><span>SUN-DRIED RED MAHOGANY</span><span>SMOKED IROKO TIMBER</span><span>LOW-WASTE DRESSING</span></div></section><section className="studio"><span className="eyebrow">STUDIO & FOUNDRY ACCESS</span><p>Visits to the studio are welcomed for international collectors and architects by advance arrangement through the Adwini Curatorial Board.</p><span>Location: Ahinsan Estate, Kumasi</span><span>Lead time: 4–8 weeks</span><span>Direct shipping: Worldwide via DHL crate</span></section></div><div className="section-heading"><div><span className="eyebrow">FEATURED ARTIFACTS</span><h2>Selected works</h2></div><a className="text-link" href="/market">Explore all artifacts →</a></div><div className="product-grid product-grid-4">{products.slice(0, 4).map((item) => <ProductCard key={item.id} product={item} addToCart={() => { window.location.href = "/market/ancestral-gye-nyame-wall-relief"; }} />)}</div></div>
  );
}

function Cart({ cart, updateCart }) {
  const items = cart.map((item) => ({ ...products.find((product) => product.id === item.id), quantity: item.quantity })).filter((item) => item.id);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = items.length ? 320 : 0;
  return (
    <div className="page-wrap cart-page"><div className="breadcrumbs">ADWINI / SHOPPING CART ({items.length} ITEMS)</div><h1>Your curated acquisition</h1><p className="lead">Direct studio dispatch from verified artisan guilds in Ghana, Nigeria, and Togo.</p>{items.length ? <div className="cart-layout"><div><div className="guarantee">✦ <span><strong>GUILD REMITTANCE GUARANTEE</strong><br />85% of acquisition proceeds are held in guild escrow and remitted directly to the master craftsmen upon dispatch.</span></div>{items.map((item) => <article className="cart-item" key={item.id}><Artwork motif={item.motif} tone={item.tone} photo={item.id === "wall-relief" ? "cart" : item.photo} /><div className="cart-item-main"><h2>{item.name}</h2><p>{item.maker} · {item.place}</p><span className="eyebrow">{item.material} · GUILD VERIFIED</span><div className="cart-controls"><div className="quantity"><button aria-label="Decrease quantity" onClick={() => updateCart(item.quantity === 1 ? cart.filter((row) => row.id !== item.id) : cart.map((row) => row.id === item.id ? { ...row, quantity: row.quantity - 1 } : row))}>−</button><span>{item.quantity}</span><button aria-label="Increase quantity" onClick={() => updateCart(cart.map((row) => row.id === item.id ? { ...row, quantity: row.quantity + 1 } : row))}>＋</button></div><button className="text-link" onClick={() => updateCart(cart.filter((row) => row.id !== item.id))}>Remove</button></div></div><strong className="cart-item-price">{money(item.price * item.quantity)}</strong></article>)}<p className="cart-provenance">◈ Each piece travels in climate-cured reinforced timber crating with sealed physical brass guild ledger medallion and certificate of cultural stewardship.</p><a className="text-link" href="/market">← Continue exploring artifacts</a></div><aside className="summary-card"><h2>Order summary <span>{items.length} works</span></h2><div className="summary-line"><span>Subtotal ({items.length} items)</span><strong>{money(subtotal)}</strong></div><div className="summary-line"><span>Artisan guild royalty dividend</span><strong>{money(subtotal * 0.85)}</strong></div><div className="summary-line"><span>Fine art shipping</span><strong>{money(shipping)}</strong></div><div className="summary-total"><span>Acquisition total</span><strong>{money(subtotal + shipping)}</strong></div><a className="button button-rust button-block" href="/checkout">Proceed to secure checkout →</a><p className="fine-print">256-bit encrypted transaction · Direct guild settlement</p></aside></div> : <div className="empty-state"><h2>Your collection is waiting</h2><p>Discover one-of-a-kind work from master artisans across the continent.</p><a className="button button-rust" href="/market">Explore the market</a></div>}</div>
  );
}

function Checkout({ cart, updateCart }) {
  const [complete, setComplete] = useState(false);
  const [shipping, setShipping] = useState("express");
  const [paymentMethod, setPaymentMethod] = useState("mobile");
  const items = cart.map((item) => ({ ...products.find((product) => product.id === item.id), quantity: item.quantity })).filter((item) => item.id);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shipping === "express" ? 320 : 0;
  if (complete) return <div className="page-wrap success-state"><span className="success-icon">✓</span><span className="eyebrow">ACQUISITION REQUEST RECEIVED</span><h1>Your heritage journey begins.</h1><p>Your secure checkout has been recorded. The artisan guild will contact you to confirm dispatch details.</p><a className="button button-rust" href="/market">Continue exploring</a></div>;
  if (!items.length) return <div className="page-wrap empty-state"><h1>Your cart is empty</h1><p>Add an artwork before starting secure checkout.</p><a className="button button-rust" href="/market">Explore the market</a></div>;
  return (
    <div className="page-wrap checkout-page">
      <div className="breadcrumbs">ADWINI / CHECKOUT / SECURE ACQUISITION</div>
      <span className="eyebrow">ARTISAN REGISTRY & VAULT CLEARING</span>
      <h1>Secure guild checkout</h1>
      <p className="lead">Direct collector acquisition backed by Asante Craft Guild, Nigerian Traditional Guilds, and the Pan-African Art Registry.</p>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={(event) => { event.preventDefault(); updateCart([]); setComplete(true); }}>
          <fieldset>
            <legend>1 &nbsp; Collector & delivery dossier</legend>
            <label>Email address<input type="email" placeholder="collector@example.org" required /></label>
            <div className="form-grid"><label>Legal first name<input required /></label><label>Legal surname / house name<input required /></label></div>
            <label>Destination street address<input required /></label>
            <div className="form-grid"><label>City / district<input required /></label><label>Region / state<input required /></label><label>Postal code<input required /></label></div>
            <div className="form-grid"><label>Country of destination<select required defaultValue=""><option value="" disabled>Select country</option><option>Ghana</option><option>Nigeria</option><option>Kenya</option><option>United States</option><option>United Kingdom</option></select></label><label>Direct telephone number<input type="tel" required /></label></div>
          </fieldset>
          <fieldset>
            <legend>2 &nbsp; Fine art shipping protocol</legend>
            <label className="choice-card"><input type="radio" name="shipping" checked={shipping === "express"} onChange={() => setShipping("express")} /><span><strong>DHL Express fine arts freight</strong><small>Reinforced climate-controlled timber crate. Complimentary phytosanitary treatment.</small></span><b>GH₵ 320</b></label>
            <label className="choice-card"><input type="radio" name="shipping" checked={shipping === "atelier"} onChange={() => setShipping("atelier")} /><span><strong>Direct atelier studio collection</strong><small>Collect your work in person from the artisan guild studio.</small></span><b>Complimentary</b></label>
          </fieldset>
          <fieldset>
            <legend>3 &nbsp; Settlement & artisan escrow</legend>
            <div className="payment-tabs">{[["mobile", "Mobile money"], ["card", "Card"], ["bank", "Bank transfer"]].map(([value, label]) => <button key={value} type="button" className={paymentMethod === value ? "active" : ""} onClick={() => setPaymentMethod(value)}>{label}</button>)}</div>
            {paymentMethod === "mobile" && <div className="form-grid"><label>Mobile network<input placeholder="MTN Mobile Money Ghana / Nigeria" required /></label><label>Subscriber number<input type="tel" placeholder="+233 24 123 4567" required /></label></div>}
            {paymentMethod === "card" && <div className="form-grid"><label>Card number<input inputMode="numeric" autoComplete="cc-number" placeholder="0000 0000 0000 0000" required /></label><label>Name on card<input autoComplete="cc-name" required /></label><label>Expiry date<input placeholder="MM/YY" autoComplete="cc-exp" required /></label><label>Security code<input inputMode="numeric" autoComplete="cc-csc" required /></label></div>}
            {paymentMethod === "bank" && <div className="form-grid"><label>Bank name<input required /></label><label>Account holder<input required /></label><label>Account number<input inputMode="numeric" required /></label></div>}
          </fieldset>
          <fieldset>
            <legend>4 &nbsp; Cultural stewardship</legend>
            <label className="check-label"><input type="checkbox" required /> I agree to the Adwini Cultural Heritage Covenant, authenticating non-commercial physical reproduction stewardship, direct artisan dividend payout, and official registry documentation.</label>
          </fieldset>
          <button className="button button-rust button-block" type="submit">Complete acquisition · {money(subtotal + shippingCost)}</button>
        </form>
        <aside className="summary-card">
          <h2>Acquisition dossier <span>{items.length} masterworks</span></h2>
          {items.map((item) => <div className="checkout-item" key={item.id}><Artwork motif={item.motif} tone={item.tone} photo={item.photo} /><span>{item.name}<small>{item.maker} · Qty: {item.quantity}</small></span><strong>{money(item.price * item.quantity)}</strong></div>)}
          <div className="summary-line"><span>Artifacts subtotal</span><strong>{money(subtotal)}</strong></div>
          <div className="summary-line"><span>{shipping === "express" ? "Express fine arts freight" : "Atelier collection"}</span><strong>{shippingCost ? money(shippingCost) : "Complimentary"}</strong></div>
          <div className="summary-total"><span>Total acquisition</span><strong>{money(subtotal + shippingCost)}</strong></div>
        </aside>
      </div>
    </div>
  );
}

function Commissions() {
  const [message, setMessage] = useState("");
  return (
    <div className="page-wrap commission-page"><div className="breadcrumbs">ADWINI / COMMISSIONS / #COM-2025-084</div><div className="section-heading"><div><span className="eyebrow">ACTIVE ATELIER COVENANT · CREATED OCT 12, 2024</span><h1>Commission tracker: Ancestral Akan Royal Door Panel</h1></div><button className="button button-outline" onClick={() => window.print()}>♧ Print dossier</button></div><div className="commission-meta"><span>MASTER ARTISAN<strong>Kwabena Osei (Kumasi)</strong></span><span>COMMISSION<strong>#COM-2025-084</strong></span><span>REGISTRY GUILD<strong>Asante Craft Guild Verified</strong></span><span>ESCROW STATUS<strong>Locked (GH₵ 4,800)</strong></span></div><section className="milestones"><div className="section-heading"><h2>Milestone progression</h2><span className="eyebrow">STAGE 3 OF 4 ACTIVE</span></div><div className="milestone-line">{[["Requested", "Oct 12, 2024"], ["Accepted", "Oct 15, 2024"], ["In progress", "Est. Nov 28, 2024"], ["Delivered", "Pending completion"]].map((item, index) => <div className={index < 3 ? "milestone done" : "milestone"} key={item[0]}><span>{index < 2 ? "✓" : index === 2 ? "⚒" : "◷"}</span><strong>MILESTONE 0{index + 1}</strong><b>{item[0]}</b><small>{item[1]}</small></div>)}</div></section><div className="commission-columns"><section className="dispatch-log"><div className="section-heading"><h2>Atelier dispatch log</h2><span className="eyebrow">4 ENTRIES RECORDED</span></div><article><span className="eyebrow">SECOND HARMATTAN SEASONING & CHISEL DETAILING</span><p>“The central Gye Nyame medallion is fully blocked with deep relief contours. Currently applying initial coats of organic camwood extract to enrich the reddish luster. Controlled moisture venting continues smoothly.”</p><div className="atelier-preview"><Artwork motif="gye" tone="wood" photo="commission" /><Artwork motif="stool" tone="ochre" photo="stool-card" /></div></article><article><strong>Timber selection & curing sign-off</strong><p>Seasoned Ghanaian mahogany slab selected from sustainable Kumasi forest concession.</p></article><article><strong>Commission accepted & escrow locked</strong><p>Terms, dimensional specs, and sacred symbology parameters accepted by Master Kwabena Osei.</p></article><div className="message-box"><h3>Message the artisan</h3><form onSubmit={(event) => { event.preventDefault(); setMessage("Message sent to Kwabena Osei"); }}><input placeholder="Write a message..." aria-label="Write a message" /><button className="button button-rust">Send</button></form>{message && <small role="status">{message}</small>}</div></section><aside className="summary-card"><h2>Commission agreement dossier</h2><p><strong>Piece title:</strong><br />Ancestral Akan Royal Door Panel</p><p><strong>Medium & finish:</strong><br />Aged Ghanaian Mahogany, Raw Beeswax & Camwood Wax</p><p><strong>Dimensions & scale:</strong><br />210cm × 90cm × 6cm</p><div className="summary-total"><span>Total escrow value</span><strong>GH₵ 4,800</strong></div><p>Target delivery date: <strong>November 28, 2024</strong></p><a className="button button-outline button-block" href="/showcase/kwabena-osei">Contact guild concierge</a></aside></div></div>
  );
}

function Upload() {
  const [status, setStatus] = useState("");
  return (
    <div className="atelier-shell"><aside className="atelier-sidebar"><span className="avatar">KA</span><strong>Kofi Anane</strong><small>Master Wood Carver</small><div className="guild-status">GUILD STATUS <b>Accra Guild · Verified</b></div><a href="/atelier/upload">Overview</a><a href="/showcase/kwabena-osei">My artworks</a><a href="/commissions">Orders</a><a href="/commissions">Commission requests</a><a className="selected" href="/atelier/upload">Upload</a><div className="protocol-id">PROVENANCE PROTOCOL<br /><strong>Artisan ID: #ADW-7492</strong></div></aside><div className="upload-page"><div className="breadcrumbs">ARTIST ATELIER / WORKS / UPLOAD ARTWORK</div><div className="section-heading"><div><h1>Upload new artwork</h1><p>Catalog a completed masterwork or archival piece to your atelier portfolio, direct marketplace, or continental cultural registry.</p></div><div className="button-group"><button className="button button-outline" type="button" onClick={() => setStatus("Draft saved in your atelier.")}>Save as draft</button><button className="button button-rust" form="upload-form">◎ Publish masterwork</button></div></div><div className="guild-banner">♙ &nbsp; <strong>Master Artisan Kwabena Osei</strong> · Asante Woodcarvers Guild · Ledger #ADW-GH-KMS-084 <span>KUMASI ATELIER STATION · ACTIVE</span></div><form id="upload-form" className="upload-grid" onSubmit={(event) => { event.preventDefault(); setStatus("Your masterwork has been submitted to the guild registry."); }}><div className="upload-side"><section className="form-card"><h3>Primary specimen view <span>Mandatory</span></h3><label className="file-drop">▧<strong>Drag & drop high-resolution frontal view</strong><small>JPG, PNG, WEBP up to 25MB</small><input type="file" accept="image/*" required /></label><h3>Detail perspectives</h3><label className="file-drop compact-drop">＋ Add supplementary views<input type="file" accept="image/*" multiple /></label></section><section className="form-card"><h3>Guild provenance certificate</h3><p>Attach verified tree-harvest license, forestry stewardship docket, or brass founding casting log.</p><label className="file-drop compact-drop">＋ Attach supplementary archive ledger<input type="file" /></label></section><div className="covenant"><strong>Artisanal chain of custody</strong><p>By publishing to the Adwini Registry, this piece is imprinted with a unique immutable ledger record identifying its sole lineage creator.</p></div></div><div className="upload-fields"><section className="form-card"><h3>1. Nomenclature & materiality</h3><label>Artwork title<input required defaultValue="Ancestral Akan Royal Door Panel (Odwira Suite)" /></label><label>Primary medium & material treatment<select required><option>Sun-dried Ghanaian Mahogany & Camwood Wax</option><option>Lost-wax cast brass</option><option>Hand-stamped cotton</option></select></label><div className="form-grid"><label>Height (cm)<input type="number" defaultValue="184" required /></label><label>Width (cm)<input type="number" defaultValue="78.5" required /></label><label>Depth (cm)<input type="number" defaultValue="6.2" required /></label><label>Weight (kg)<input type="number" defaultValue="24.8" required /></label></div></section><section className="form-card"><h3>2. Cultural symbology & lineage</h3><label>Adinkra or canonical symbol incorporated<input defaultValue="Gye Nyame — Supremacy and omnipotence of God" /></label><label>Curatorial taxonomy tags<input placeholder="#Woodcarving, #Adinkra, #Handcarved" /></label><label>Curatorial statement & usage notes<textarea rows="4" defaultValue="Carved from an aged Ghanaian mahogany trunk, this relief portal panel carries central deep-relief carvings of the Gye Nyame symbol flanked by ancestral river motifs." /></label></section><section className="form-card"><h3>3. Acquisition status & guild royalties</h3><div className="form-grid"><label className="choice-card"><input type="radio" name="status" defaultChecked /><span><strong>For sale in marketplace</strong><small>Listed directly for authenticated collectors.</small></span></label><label className="choice-card"><input type="radio" name="status" /><span><strong>Archival / exhibition only</strong><small>Catalogued to portfolio registry.</small></span></label></div><label>List price (GH₵)<input type="number" defaultValue="2100" min="1" required /></label><label className="check-label"><input type="checkbox" defaultChecked /> Available for custom commission variations</label></section><div className="form-submit"><span>◈ Archival metadata cryptographically sealed upon submission</span><button className="button button-rust">Publish masterwork</button></div>{status && <p className="form-status" role="status">{status}</p>}</div></form></div></div>
  );
}

function Login() {
  const [tab, setTab] = useState("sign-in");
  const [role, setRole] = useState("artisan");
  const [message, setMessage] = useState("");
  return (
    <div className="vault-page"><section className="vault-story"><span className="eyebrow light">▪ ARCHIVAL GATEWAY · GUILD PORTAL</span><h1>Step into the <em>living archive</em> of African mastery.</h1><p>Connect directly with verified master carvers, weavers, lost-wax metallurgists, and bead artisans across ancestral continental guilds.</p><Artwork motif="mask" tone="hero" photo="login" /><div className="vault-benefits"><strong>◉ 85% Direct Artisan Dividends</strong><strong>◈ Cryptographic Provenance Dossiers</strong><strong>♧ Pan-African Craft Registry Certified</strong></div></section><section className="vault-form"><div className="vault-tabs"><button className={tab === "sign-in" ? "active" : ""} onClick={() => setTab("sign-in")}>Sign in</button><button className={tab === "create" ? "active" : ""} onClick={() => setTab("create")}>Create account</button></div><span className="eyebrow">ARCHIVAL ACCESS TERMINAL</span><h2>{tab === "sign-in" ? "Enter the Guild Vault" : "Create your guild account"}</h2><p>Authenticate your credentials to access protected marketplace ledgers and artisan ateliers.</p><form onSubmit={(event) => { event.preventDefault(); setMessage(tab === "sign-in" ? "Demo sign-in complete. Welcome to the Adwini Guild Vault." : "Your account request has been received."); }}><label>Select your guild affiliation</label><div className="role-select"><button type="button" className={role === "artisan" ? "selected" : ""} onClick={() => setRole("artisan")}><strong>⚒ Artist / Artisan</strong><small>Catalog masterworks, manage guild commissions, and receive direct escrow payouts.</small></button><button type="button" className={role === "buyer" ? "selected" : ""} onClick={() => setRole("buyer")}><strong>♧ Buyer / Collector</strong><small>Acquire authenticated artifacts, commission bespoke heirlooms, and track provenance.</small></button></div><label>Institutional / guild email<input type="email" placeholder="you@atelier.org" required /></label><label>Guild cryptographic key (password)<input type="password" placeholder="Enter your password" minLength="6" required /></label>{tab === "create" && <label>Guild lineage & atelier certification<input placeholder="e.g. Bonwire Kente Weavers Guild" required /></label>}<label className="check-label"><input type="checkbox" required /> I honor the Adwini Cultural Heritage Covenant, affirming the authenticity of trade listings and respecting continental sacred artisan rites.</label><button className="button button-rust button-block">{tab === "sign-in" ? "Enter atelier & guild vault →" : "Create guild account →"}</button></form>{message && <p className="form-status" role="status">{message}</p>}<div className="vault-secure">◈ 256-bit guild escrow encryption <span>UNESCO 1970 convention compliant</span></div></section></div>
  );
}

export default App;
