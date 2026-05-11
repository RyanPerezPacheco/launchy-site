// components/Mockup.jsx
// Animated checklist dashboard mockup for the hero.
import { useState, useEffect } from 'react'

const INITIAL_STEPS = [
  { id: 1, label: "Definir tipo de empresa", sub: "MEI / Simples", status: "done" },
  { id: 2, label: "Abrir CNPJ", sub: "Receita Federal", status: "done" },
  { id: 3, label: "Contratar contabilidade", sub: "Contábil mensal", status: "done" },
  { id: 4, label: "Abrir conta PJ no banco digital", sub: "parceiro Launchy", status: "current" },
  { id: 5, label: "Criar identidade visual", sub: "logo + paleta", status: "todo" },
  { id: 6, label: "Configurar emissão de NF-e", sub: "Prefeitura + ERP", status: "todo" },
  { id: 7, label: "Lançar primeira campanha", sub: "Influencers Launchy", status: "todo" },
];

export function ChecklistMockup() {
  const [steps, setSteps] = useState(INITIAL_STEPS);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setSteps((prev) => {
      const next = [...prev];
      const curIdx = next.findIndex((s) => s.status === "current");
      if (curIdx === -1) return prev;
      next[curIdx] = { ...next[curIdx], status: "done" };
      const nextIdx = next.findIndex((s) => s.status === "todo");
      if (nextIdx !== -1) next[nextIdx] = { ...next[nextIdx], status: "current" };
      else {
        // reset cycle
        return INITIAL_STEPS;
      }
      return next;
    });
  }, [tick]);

  const doneCount = steps.filter((s) => s.status === "done").length;
  const pct = Math.round((doneCount / steps.length) * 100);

  return (
    <div className="mock" aria-label="Demonstração do painel Launchy">
      <div className="mock-tab">
        <div className="dots"><span></span><span></span><span></span></div>
        <div className="url">launchy.com.br/painel</div>
        <div style={{ width: 28 }}></div>
      </div>
      <div className="mock-body">
        <aside className="mock-side">
          <div className="grp">Meu negócio</div>
          <div className="item active"><span className="ic"></span>Checklist</div>
          <div className="item"><span className="ic"></span>Prestadores</div>
          <div className="item"><span className="ic"></span>Documentos</div>
          <div className="grp">Categorias</div>
          <div className="item"><span className="ic"></span>Contabilidade</div>
          <div className="item"><span className="ic"></span>Banco PJ</div>
          <div className="item"><span className="ic"></span>Design</div>
          <div className="item"><span className="ic"></span>Divulgação</div>
        </aside>
        <div className="mock-main">
          <div className="mock-h">
            <div>
              <div className="eyebrow"><span className="dot"></span>Próximo passo</div>
              <h4 style={{ marginTop: 8 }}>Checklist guiado</h4>
            </div>
            <div className="progress mono">{doneCount}/{steps.length} · {pct}%</div>
          </div>
          <div className="progress-bar"><div className="fill" style={{ width: pct + "%" }}></div></div>
          <div className="steps">
            {steps.map((s, i) => (
              <div key={s.id} className={"step " + s.status}>
                <span className="mono" style={{ color: "var(--fg-3)", fontSize: 12 }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div className="label">{s.label}</div>
                  <div className="sub">{s.sub}</div>
                </div>
                <div className="check"></div>
                {s.status === "current" && <span className="pill" style={{ gridColumn: "2 / span 2", justifySelf: "start", marginTop: 6 }}>fazer agora →</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
