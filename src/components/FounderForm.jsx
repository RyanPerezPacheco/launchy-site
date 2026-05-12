// components/FounderForm.jsx
// Founder signup form with validation + LGPD consent.
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function FounderForm() {
  const [data, setData] = useState({
    nome: "", email: "", whatsapp: "", estagio: "", consent: false,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setData({ ...data, [k]: v });
    if (errors[k]) setErrors({ ...errors, [k]: null });
  };

  const validate = () => {
    const e = {};
    if (!data.nome.trim() || data.nome.trim().length < 2) e.nome = "Digite seu nome.";
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    if (!emailOk) e.email = "Email inválido.";
    const wpp = data.whatsapp.replace(/\D/g, "");
    if (wpp.length < 10) e.whatsapp = "Telefone inválido (com DDD).";
    if (!data.estagio) e.estagio = "Selecione uma opção.";
    if (!data.consent) e.consent = "Você precisa concordar com a LGPD.";
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length !== 0) return;
    setLoading(true);
    const { error } = await supabase.from('leads').insert({
      nome:     data.nome,
      email:    data.email,
      whatsapp: data.whatsapp,
      estagio:  data.estagio,
    });
    if (error) console.error('Erro ao salvar lead:', error);
    try {
      localStorage.setItem('launchy_prefill', JSON.stringify({ name: data.nome, email: data.email }));
    } catch { /* no-op */ }
    setLoading(false);
    setSubmitted(true);
  };

  // Simple BR phone mask
  const maskPhone = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };

  return (
    <section id="fundador">
      <div className="wrap">
        <div className="cta-block">
          <div className="left">
            <div className="eyebrow"><span className="dot"></span>Cadastro de fundador</div>
            <h2 style={{ marginTop: 14, marginBottom: 18 }}>
              Comece seu negócio do jeito certo.
            </h2>
            <p className="lead" style={{ marginBottom: 28 }}>
              Acesso antecipado com condições especiais. Sem compromisso. 30 dias de garantia.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {["Mensalidade de fundador travada", "Voz ativa nas próximas funcionalidades", "Acesso antecipado a novos prestadores"].map((x, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: "var(--accent-soft)", color: "var(--accent-deep)",
                    display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>★</div>
                  {x}
                </li>
              ))}
            </ul>
          </div>

          {!submitted ? (
            <form className="form" onSubmit={onSubmit} noValidate>
              <div className={"field " + (errors.nome ? "error" : data.nome.length > 1 ? "success" : "")}>
                <label htmlFor="f-nome">Nome completo</label>
                <input id="f-nome" type="text" placeholder="Como te chamamos?" value={data.nome} onChange={set("nome")} />
                {errors.nome && <div className="err">{errors.nome}</div>}
              </div>

              <div className={"field " + (errors.email ? "error" : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ? "success" : "")}>
                <label htmlFor="f-email">Email</label>
                <input id="f-email" type="email" placeholder="voce@empresa.com.br" value={data.email} onChange={set("email")} />
                {errors.email && <div className="err">{errors.email}</div>}
              </div>

              <div className={"field " + (errors.whatsapp ? "error" : data.whatsapp.replace(/\D/g, "").length >= 10 ? "success" : "")}>
                <label htmlFor="f-wpp">WhatsApp</label>
                <input id="f-wpp" type="tel" placeholder="(11) 99999-9999"
                  value={data.whatsapp}
                  onChange={(e) => {
                    setData({ ...data, whatsapp: maskPhone(e.target.value) });
                    if (errors.whatsapp) setErrors({ ...errors, whatsapp: null });
                  }} />
                {errors.whatsapp && <div className="err">{errors.whatsapp}</div>}
              </div>

              <div className={"field " + (errors.estagio ? "error" : data.estagio ? "success" : "")}>
                <label htmlFor="f-est">Em que estágio você está?</label>
                <select id="f-est" value={data.estagio} onChange={set("estagio")}>
                  <option value="">Selecione…</option>
                  <option value="ideia">Ainda na ideia</option>
                  <option value="abrir">Vou abrir CNPJ em breve</option>
                  <option value="mei">Já sou MEI</option>
                  <option value="simples">Simples Nacional</option>
                  <option value="outro">Outro</option>
                </select>
                {errors.estagio && <div className="err">{errors.estagio}</div>}
              </div>

              <label className="consent">
                <input type="checkbox" checked={data.consent} onChange={set("consent")} />
                <span>
                  Ao se cadastrar, você concorda com nossa <a href="#">Política de Privacidade</a> e com o tratamento dos seus dados conforme a LGPD.
                </span>
              </label>
              {errors.consent && <div className="err" style={{ marginTop: -6 }}>{errors.consent}</div>}

              <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: 8, justifyContent: "center" }} disabled={loading}>
                {loading ? 'Salvando…' : <> Garantir meu acesso de fundador <span className="arr">→</span> </>}
              </button>
              <small className="mono muted" style={{ fontSize: 11, textAlign: "center" }}>
                Vagas limitadas · Sem spam · Cancele quando quiser
              </small>
            </form>
          ) : (
            <div className="success-box">
              <div className="eyebrow" style={{ marginBottom: 10 }}><span className="dot"></span>Recebido</div>
              <h3>Pronto, {data.nome.split(" ")[0]}. Sua vaga de fundador está reservada.</h3>
              <p style={{ marginTop: 10 }}>
                Em breve você recebe um email em <strong>{data.email}</strong> com os próximos passos. Fique de olho — incluindo no spam, só por garantia.
              </p>
              <a href="/auth.html" className="btn btn-primary btn-lg" style={{ marginTop: 20, justifyContent: "center" }}>
                Criar minha conta agora <span className="arr">→</span>
              </a>
              <button onClick={() => { setSubmitted(false); setData({ nome: "", email: "", whatsapp: "", estagio: "", consent: false }); }} className="btn btn-ghost btn-sm" style={{ marginTop: 10 }}>
                Cadastrar outro
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
