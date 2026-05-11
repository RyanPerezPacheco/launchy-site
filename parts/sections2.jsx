// parts/sections2.jsx
// Social proof, offer, objections, guarantee, urgency, FAQ, final.

function SocialProof() {
  const T = [
    { i: "M", nm: "Marina S.", ro: "MEI · São Paulo", q: "Em 8 dias eu tinha CNPJ, conta PJ aberta e contadora ativa. O checklist literalmente me dizia o próximo passo." },
    { i: "R", nm: "Rafael T.", ro: "Pequeno Comércio · BH", q: "Meu logo, meu site e o anúncio com microinfluenciador saíram da mesma plataforma. Tudo conversa entre si." },
    { i: "C", nm: "Camila A.", ro: "Simples Nacional · Recife", q: "Eu tinha contador, banco e designer espalhados. Centralizei tudo na Launchy e parei de perder coisa." },
  ];
  return (
    <section id="prova">
      <div className="wrap">
        <div className="banner">
          <div className="b-l">
            <span className="pulse"></span>
            <h3>Plataforma em lançamento. Vagas de fundador abertas.</h3>
          </div>
          <small>Seja um dos primeiros</small>
        </div>
        <div className="testimonials">
          {T.map((t, i) => (
            <div className="testimonial" key={i}>
              <div className="quote">"{t.q}"</div>
              <div className="who">
                <div className="av">{t.i}</div>
                <div>
                  <div className="nm">{t.nm}</div>
                  <div className="ro">{t.ro}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mono muted" style={{ fontSize: 12, marginTop: 24, textAlign: "center" }}>
          ⚠ Depoimentos ilustrativos. Substituir por relatos reais antes de publicar.
        </p>
      </div>
    </section>
  );
}

function Offer() {
  const incl = [
    "Acesso à plataforma completa de serviços",
    "Checklist guiado de abertura e gestão",
    "Contabilidade especializada em MEI/Simples",
    "Banco digital parceiro com condições Launchy",
    "Designer e identidade visual",
    "Influencers e divulgação",
    "Suporte na abertura do CNPJ",
    "Ofertas exclusivas dos prestadores parceiros",
    "Novos prestadores e categorias todo mês",
  ];
  return (
    <section id="oferta">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow"><span className="dot"></span>O que você acessa</div>
          <h2>Uma mensalidade. Um login.<br/>Um lugar pra tudo.</h2>
        </div>
        <div className="offer">
          <div className="offer-l">
            <h3>Cliente Launchy</h3>
            <p style={{ color: "var(--fg-3)", marginTop: 6, marginBottom: 24 }}>
              Inclui acesso a todos os prestadores parceiros, checklist guiado e suporte humano.
            </p>
            <div className="checks">
              {incl.map((c, i) => (
                <div className="check-row" key={i}>
                  <div className="ck">✓</div>
                  <div>{c}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="offer-r">
            <span className="founder-tag">⚡ Acesso de Fundador</span>
            <h3>Mensalidade acessível</h3>
            <div className="price">
              <span className="from">a partir de</span>
              <span className="num">R$<span style={{ marginLeft: 4 }}>—</span></span>
              <span className="per">/mês</span>
            </div>
            <p style={{ color: "color-mix(in oklab, var(--bg) 70%, transparent)", fontSize: 14, lineHeight: 1.55 }}>
              Fundadores têm condições especiais por tempo limitado: mensalidade reduzida, acesso antecipado a novos prestadores e voz ativa nas próximas funcionalidades.
            </p>
            <div className="divider"></div>
            <div className="checks">
              <div className="check-row alt"><div className="ck">★</div><div>Mensalidade de fundador travada</div></div>
              <div className="check-row alt"><div className="ck">★</div><div>30 dias de garantia total</div></div>
              <div className="check-row alt"><div className="ck">★</div><div>Sem fidelidade. Cancele quando quiser.</div></div>
            </div>
            <a href="#fundador" className="btn btn-primary btn-lg">
              Ser fundador Launchy <span className="arr">→</span>
            </a>
            <small style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 11, opacity: .7 }}>
              valor exato a confirmar antes do lançamento
            </small>
          </div>
        </div>
      </div>
    </section>
  );
}

function Objections() {
  const items = [
    { q: "Mas como eu sei que os prestadores são bons?", a: "Contratar alguém sem referência é um dos maiores medos de quem empreende. Por isso a Launchy tem um processo de verificação e avaliação dos prestadores — você vê o histórico, as avaliações de outros clientes e contrata com base em evidência, não em achismo." },
    { q: "E se eu não gostar do serviço de algum prestador?", a: "O relacionamento é entre você e o prestador — mas a Launchy está do seu lado. Toda contratação fica registrada na plataforma e nossa política garante transparência no processo. Você nunca fica sozinho." },
    { q: "A plataforma está começando — vai ter prestador de qualidade?", a: "Sim. Antes de abrir pra qualquer um, a Launchy seleciona e faz parceria com prestadores qualificados nas principais categorias. Você não vai entrar numa plataforma vazia — vai entrar numa plataforma curada." },
    { q: "Já uso outros serviços separados. Por que mudar?", a: "Porque centralizar economiza tempo, e tempo é o recurso mais escasso de quem empreende sozinho. Uma mensalidade. Um login. Um lugar pra tudo." },
    { q: "É seguro colocar minha empresa e meus dados aqui?", a: "A Launchy opera em conformidade com a LGPD e adota padrões de segurança para proteger seus dados e os da sua empresa. Segurança não é opcional pra nós — é fundação." },
  ];
  return (
    <section id="objecoes">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow"><span className="dot"></span>Quebra de objeções</div>
          <h2>Antes que você pergunte.</h2>
        </div>
        <div>
          {items.map((o, i) => (
            <div className="obj" key={i}>
              <div className="q">"{o.q}"</div>
              <div className="a">{o.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Guarantee() {
  return (
    <section id="garantia" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="guarantee">
          <div className="shield">🛡</div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 10 }}><span className="dot"></span>Garantia de 30 dias</div>
            <h3>Teste sem risco.</h3>
            <p>
              Se você acessar a Launchy e sentir que não é pra você, basta nos avisar dentro dos primeiros 30 dias e devolvemos 100% do valor pago — sem perguntas, sem burocracia. <strong>A confiança vem antes do contrato.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Urgency() {
  // simulated meter
  const [filled, setFilled] = React.useState(20);
  React.useEffect(() => {
    const id = setTimeout(() => setFilled(72), 400);
    return () => clearTimeout(id);
  }, []);
  return (
    <section id="urgencia" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="urgency">
          <div>
            <div className="eyebrow" style={{ marginBottom: 10 }}><span className="dot"></span>⚠ Vagas limitadas</div>
            <h3 style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 8 }}>
              Acesso de Fundador.<br/>Quando acabarem, acabaram.
            </h3>
            <p style={{ color: "var(--fg-3)", maxWidth: 56, fontSize: 15, lineHeight: 1.5, maxWidth: "60ch" }}>
              As primeiras vagas vêm com mensalidade reduzida, acesso antecipado a novos prestadores e voz ativa nas próximas funcionalidades — condições que não estarão disponíveis depois do lançamento oficial.
            </p>
          </div>
          <div className="meter">
            <div className="mtitle">Vagas preenchidas</div>
            <div className="mbar"><div className="mfill" style={{ width: filled + "%" }}></div></div>
            <div className="mlabel"><span>{filled}% ocupadas</span><span>{100 - filled}% restantes</span></div>
            <a href="#fundador" className="btn btn-dark btn-sm" style={{ marginTop: 8, alignSelf: "flex-start" }}>
              Garantir minha vaga →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    ["Quanto tempo por semana preciso dedicar pra usar a Launchy?", "Pouquíssimo. A ideia é exatamente o contrário — você ganha tempo de volta. O checklist guiado te mostra o próximo passo quando você precisar, sem te sobrecarregar."],
    ["Serve pra quem está começando do zero?", "Sim, especialmente pra quem está começando. A Launchy foi pensada pra quem ainda não tem estrutura montada e não quer errar nos primeiros passos."],
    ["Serve pra quem já tem empresa aberta?", "Também. Se você já é MEI ou Simples Nacional e ainda gerencia seus prestadores de forma desorganizada, a Launchy centraliza tudo e te ajuda a profissionalizar a operação."],
    ["E se eu não gostar? Posso cancelar?", "Sim. Você tem 30 dias de garantia total. E pode cancelar quando quiser — sem multa, sem burocracia."],
    ["Como funciona o acesso depois que eu assinar?", "Você cria sua conta, acessa o painel e já começa pelo checklist guiado. Do cadastro ao primeiro serviço contratado, tudo fica dentro da plataforma."],
    ["Tem suporte se eu travar em alguma etapa?", "Tem. Nossa equipe está disponível pra te ajudar sempre que precisar — especialmente nos primeiros passos, que costumam gerar mais dúvidas."],
    ["Quais formas de pagamento são aceitas?", "Cartão de crédito, Pix e boleto bancário."],
    ["Preciso assinar contrato longo?", "Não. A Launchy funciona por mensalidade — você assina, usa, e decide se fica. Sem fidelidade forçada."],
  ];
  const [open, setOpen] = React.useState(0);
  return (
    <section id="faq">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow"><span className="dot"></span>Dúvidas comuns</div>
          <h2>Perguntas frequentes.</h2>
        </div>
        <div className="faq-list">
          {items.map(([q, a], i) => (
            <div className={"faq-item " + (open === i ? "open" : "")} key={i}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{q}</span>
                <span className="pl">+</span>
              </button>
              <div className="faq-a">{a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="final">
      <div className="wrap">
        <div className="eyebrow" style={{ justifyContent: "center", display: "inline-flex" }}>
          <span className="dot"></span>O momento é agora
        </div>
        <h2 style={{ marginTop: 16 }}>Empreender no Brasil é difícil.<br/>Encontrar suporte não precisa ser.</h2>
        <p>
          Entrar agora como fundador significa ter acesso às melhores condições que a plataforma vai oferecer — e fazer parte da construção de algo que vai ajudar milhares de empreendedores como você.
        </p>
        <a href="#fundador" className="btn btn-primary btn-lg">
          🚀 Quero ser fundador Launchy <span className="arr">→</span>
        </a>
        <div style={{ marginTop: 14, fontSize: 13, color: "var(--fg-3)" }}>
          Vagas limitadas · Condições especiais de lançamento
        </div>

        <div className="ps">
          <strong>PS:</strong> Se você chegou até aqui, provavelmente já sabe que continuar gerenciando tudo espalhado não está funcionando. A Launchy não é mais um app — é a estrutura que você devia ter tido desde o primeiro dia. As vagas de fundador são limitadas e as condições mudam assim que o lançamento oficial acontecer. Se faz sentido, o momento é agora.
        </div>
      </div>
    </section>
  );
}

window.SocialProof = SocialProof;
window.Offer = Offer;
window.Objections = Objections;
window.Guarantee = Guarantee;
window.Urgency = Urgency;
window.FAQ = FAQ;
window.FinalCTA = FinalCTA;
