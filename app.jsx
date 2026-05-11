// app.jsx — Launchy main app

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": true,
  "density": "compact"
}/*EDITMODE-END*/;

function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-row">
        <a href="#" className="brand">
          <span className="brand-mark"></span>
          <span>Launchy</span>
        </a>
        <nav className="nav-links">
          <a href="#como">Como funciona</a>
          <a href="#prestadores">Prestadores</a>
          <a href="#oferta">Oferta</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="nav-cta">
          <a href="#fundador" className="btn btn-dark btn-sm">
            Quero acesso <span className="arr">→</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <div className="wrap row">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="brand-mark"></span>
          <span style={{ fontWeight: 600, color: "var(--fg)" }}>Launchy</span>
          <span style={{ marginLeft: 12 }}>© 2026 — Tudo que sua empresa precisa.</span>
        </div>
        <div className="links">
          <a href="#">Política de privacidade</a>
          <a href="#">Termos de uso</a>
          <a href="#">LGPD</a>
          <a href="#">Contato</a>
        </div>
      </div>
    </footer>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", t.dark ? "dark" : "light");
    document.documentElement.setAttribute("data-density", t.density);
  }, [t.dark, t.density]);

  return (
    <React.Fragment>
      <Nav />
      <main>
        <Hero />
        <Pain />
        <Solution />
        <Benefits />
        <Providers />
        <SocialProof />
        <Offer />
        <Objections />
        <Guarantee />
        <Urgency />
        <FAQ />
        <FounderForm />
        <FinalCTA />
      </main>
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Aparência" />
        <TweakToggle label="Modo escuro" value={t.dark} onChange={(v) => setTweak("dark", v)} />
        <TweakRadio
          label="Densidade"
          value={t.density}
          options={["compact", "regular"]}
          onChange={(v) => setTweak("density", v)}
        />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
