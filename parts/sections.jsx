// parts/sections.jsx
// Hero, pain, solution, benefits, providers carousel.

function Hero({ density }) {
  return (
    <section className="hero">
      <div className="bg-blob"></div>
      <div className="wrap hero-grid">
        <div>
          <div className="eyebrow"><span className="dot"></span>Em lançamento · Vagas de fundador abertas</div>
          <h1 style={{ marginTop: 18 }}>
            Tudo que sua <span className="underline">empresa</span> precisa.<br/>
            Em <span className="ink">um só lugar</span>.
          </h1>
          <p className="lead hero-sub">
            A Launchy centraliza todos os serviços que seu negócio precisa — do CNPJ ao crescimento — com um checklist guiado passo a passo pra você nunca se perder no caminho.
          </p>
          <div className="hero-cta">
            <a href="#fundador" className="btn btn-primary btn-lg">
              Quero garantir meu acesso <span className="arr">→</span>
            </a>
            <a href="#como" className="btn btn-ghost btn-lg">
              Ver como funciona
            </a>
          </div>
          <div className="hero-meta">
            <span>Vagas de fundador limitadas</span>
            <span className="pip"></span>
            <span>Sem compromisso</span>
            <span className="pip"></span>
            <span>30 dias de garantia</span>
          </div>
        </div>
        <div>
          <ChecklistMockup />
        </div>
      </div>

      <div className="wrap">
        <div className="logos">
          <div className="l-label">Reunindo prestadores em</div>
          <div className="ll">Contabilidade</div>
          <div className="ll">Banco PJ</div>
          <div className="ll">Design</div>
          <div className="ll">Influencers</div>
          <div className="ll">Jurídico</div>
          <div className="ll">+ novos todo mês</div>
        </div>
      </div>
    </section>
  );
}

function Pain() {
  const QS = [
    "Qual contador contratar — e como saber se é bom?",
    "Como abrir CNPJ sem cometer erro de iniciante?",
    "Onde achar um designer que caiba no orçamento?",
    "Como divulgar sem desperdiçar dinheiro?",
    "Por que cada serviço fica espalhado em 10 lugares diferentes?",
    "E a contabilidade do mês que vem? E a NF-e?",
  ];
  return (
    <section id="dor">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow"><span className="dot"></span>A real do empreendedor brasileiro</div>
          <h2>Você criou coragem pra empreender.<br/>Aí começou a lista de coisas que ninguém te contou.</h2>
        </div>
        <div className="pain-grid">
          {QS.map((q, i) => (
            <div className="pain-item" key={i}>
              <div className="num">{String(i + 1).padStart(2, "0")}</div>
              <div>
                <div className="q">{q}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="pain-tag">
          <div className="big">
            Enquanto você tenta resolver tudo isso, o negócio em si fica parado.
            Você vira <span className="strike">empreendedor</span> gerente de burocracias.
          </div>
          <div className="mono" style={{ color: "var(--fg-3)", fontSize: 13 }}>↳ ninguém te avisou</div>
        </div>
      </div>
    </section>
  );
}

function Solution() {
  return (
    <section id="como">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow"><span className="dot"></span>Como funciona</div>
          <h2>Um ecossistema completo<br/>pra quem está começando — ou quer parar de improvisar.</h2>
          <p className="lead">
            Dentro da plataforma você encontra prestadores verificados nas principais áreas que seu negócio precisa: contabilidade, design, banco digital, divulgação, e muito mais. Mas o diferencial vai além do catálogo.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center" }} className="how-grid">
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <HowStep n="01" title="Você se cadastra e responde 4 perguntas" desc="Tipo de negócio, estágio, prioridade, orçamento. Dois minutos." />
              <HowStep n="02" title="A Launchy monta seu checklist personalizado" desc="Cada etapa amarrada a um prestador parceiro pré-verificado." />
              <HowStep n="03" title="Você contrata, executa, marca como feito" desc="Um login. Um lugar. Um próximo passo claro o tempo todo." />
              <HowStep n="04" title="A plataforma evolui com você" desc="De MEI a Simples Nacional, novos prestadores e categorias todo mês." />
            </div>
          </div>
          <div>
            <ChecklistMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function HowStep({ n, title, desc }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 18, alignItems: "start" }}>
      <div className="mono" style={{ fontSize: 14, color: "var(--accent-deep)", fontWeight: 600, paddingTop: 4 }}>
        {n}
      </div>
      <div>
        <h3 style={{ fontSize: 22, marginBottom: 6, fontWeight: 600 }}>{title}</h3>
        <p style={{ color: "var(--fg-3)", fontSize: 15, margin: 0, lineHeight: 1.5 }}>{desc}</p>
      </div>
    </div>
  );
}

function Benefits() {
  const items = [
    { ic: "✕", t: "Pare de garimpar fornecedor", d: "Todos os serviços essenciais reunidos e verificados numa só plataforma." },
    { ic: "→", t: "Saiba sempre o próximo passo", d: "Checklist guiado que acompanha a jornada do seu negócio do zero ao crescimento." },
    { ic: "✓", t: "Abra seu CNPJ sem dor de cabeça", d: "Suporte direto pra formalização sem burocracia paralisante." },
    { ic: "★", t: "Contrate com confiança", d: "Prestadores avaliados pela comunidade Launchy, não achados no acaso." },
    { ic: "⏱", t: "Economize tempo todo mês", d: "Menos horas em gestão de fornecedores, mais tempo no que importa." },
    { ic: "%", t: "Condições especiais Launchy", d: "Prestadores oferecem ofertas exclusivas pra clientes da plataforma." },
    { ic: "↗", t: "Cresça com suporte real", d: "De MEI até Simples Nacional, a plataforma evolui com você." },
    { ic: "♥", t: "Como ter um sócio experiente", d: "A estrutura que todo empreendedor queria ter desde o primeiro dia." },
    { ic: "△", t: "Curadoria, não busca", d: "A Launchy escolhe os melhores. Você só usa." },
  ];
  return (
    <section id="beneficios">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow"><span className="dot"></span>O que você ganha</div>
          <h2>Como ter um sócio experiente<br/>do seu lado. Sem pagar caro.</h2>
        </div>
        <div className="benefits-grid">
          {items.map((b, i) => (
            <div className="benefit" key={i}>
              <div className="ic">{b.ic}</div>
              <h3>{b.t}</h3>
              <p>{b.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Providers() {
  const list = [
    { i: "C", nm: "Contábil Express", cat: "Contabilidade", desc: "MEI e Simples Nacional, com app próprio e atendimento humano em até 4h.", rating: 4.9, deals: "20% off mensalidade" },
    { i: "B", nm: "Banco Sorriso PJ", cat: "Banco digital", desc: "Conta PJ sem mensalidade, Pix ilimitado e maquininha integrada.", rating: 4.8, deals: "Maquininha grátis" },
    { i: "D", nm: "Atelier Marca", cat: "Design", desc: "Identidade visual completa em 7 dias com 3 rodadas de revisão.", rating: 5.0, deals: "1 logo extra grátis" },
    { i: "I", nm: "Mídia.Boa", cat: "Influencers", desc: "Match com microinfluenciadores no seu nicho e cidade.", rating: 4.7, deals: "Setup grátis" },
    { i: "J", nm: "Jus.Ágil", cat: "Jurídico", desc: "Contratos, termos de uso e política de privacidade prontos pro seu negócio.", rating: 4.8, deals: "Pacote LGPD incluído" },
    { i: "F", nm: "Fluxo Fiscal", cat: "ERP / NF-e", desc: "Emissão de NF-e em um clique, integrado com sua conta PJ.", rating: 4.6, deals: "60 dias grátis" },
    { i: "S", nm: "Site no Ar", cat: "Web", desc: "Landing pages e e-commerces feitos por humanos, no padrão Launchy.", rating: 4.9, deals: "Hospedagem 1º ano" },
  ];
  const ref = React.useRef(null);
  const scroll = (dir) => {
    const el = ref.current; if (!el) return;
    el.scrollBy({ left: dir * 360, behavior: "smooth" });
  };
  return (
    <section id="prestadores">
      <div className="wrap">
        <div className="section-head" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", maxWidth: "100%" }}>
          <div>
            <div className="eyebrow"><span className="dot"></span>Curadoria Launchy</div>
            <h2 style={{ marginTop: 14 }}>Prestadores verificados.<br/>Não achados no Google.</h2>
          </div>
          <div className="carousel-controls">
            <button onClick={() => scroll(-1)} aria-label="Anterior">←</button>
            <button onClick={() => scroll(1)} aria-label="Próximo">→</button>
          </div>
        </div>
      </div>
      <div className="wrap">
        <div className="carousel" ref={ref}>
          {list.map((p, i) => (
            <div className="provider" key={i}>
              <div className="row1">
                <div className="ph">{p.i}</div>
                <div>
                  <div className="nm">{p.nm}</div>
                  <div className="cat">{p.cat}</div>
                </div>
                <div className="verified">✓ verificado</div>
              </div>
              <div className="desc">{p.desc}</div>
              <div className="meta">
                <span className="star">★ {p.rating.toFixed(1)}</span>
                <span style={{ color: "var(--fg-3)" }}>·</span>
                <span className="mono" style={{ fontSize: 11 }}>{p.deals}</span>
              </div>
            </div>
          ))}
          <div className="provider" style={{ display: "grid", placeItems: "center", textAlign: "center", borderStyle: "dashed" }}>
            <div>
              <div style={{ fontSize: 32, marginBottom: 6 }}>+</div>
              <div className="nm">Novos prestadores</div>
              <div className="cat" style={{ marginTop: 4 }}>todo mês</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
window.Pain = Pain;
window.Solution = Solution;
window.Benefits = Benefits;
window.Providers = Providers;
