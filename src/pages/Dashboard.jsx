import { useState, useEffect } from 'react'
import './dashboard.css'
import { supabase, getProfile, signOut } from '../lib/supabase'

// ── Data ──────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, cat: 'Contabilidade', title: 'Escolher o tipo de empresa',  sub: 'Estrutura jurídica',   desc: 'Você definiu o enquadramento ideal: MEI, ME ou EPP. Isso determina limite de faturamento, impostos e obrigações.' },
  { id: 2, cat: 'Contabilidade', title: 'Abrir o CNPJ',                sub: 'Registro da empresa',  desc: 'CNPJ ativo na Receita Federal. Sua empresa existe oficialmente.' },
  { id: 3, cat: 'Banco PJ',      title: 'Abrir conta PJ',              sub: 'Banco empresarial',    desc: 'Conta corrente PJ aberta e pronta para receber pagamentos. Separar finanças pessoais das empresariais é obrigatório.' },
  { id: 4, cat: 'Design',        title: 'Criar identidade visual',     sub: 'Marca e design',       desc: 'Logo, paleta de cores, tipografia e arquivos prontos para usar em redes sociais, apresentações e materiais impressos. Uma marca consistente gera confiança antes mesmo da primeira venda.' },
  { id: 5, cat: 'Marketing',     title: 'Divulgar o negócio',          sub: 'Marketing e redes',    desc: 'Presença digital mínima viável: perfil no Instagram, Google Meu Negócio ativo e primeiras postagens. Você não precisa de agência grande — precisa de consistência.' },
  { id: 6, cat: 'Influencers',   title: 'Contratar um influenciador',  sub: 'Divulgação paga',      desc: 'Micro-influenciadores do seu nicho e região convertem muito mais que campanhas genéricas. O Launchy conecta você com criadores já verificados.' },
  { id: 7, cat: 'Jurídico',      title: 'Proteger a marca',            sub: 'Registro no INPI',     desc: 'Registrar a marca no INPI garante exclusividade de uso no Brasil. Sem isso, alguém pode usar o seu nome legitimamente — mesmo que você tenha criado primeiro.' },
]

const ALL_PROVIDERS = [
  {
    name: 'Contabilizei',
    cat: 'Contabilidade',
    emoji: '📊',
    rating: '4.9',
    reviews: '2.341',
    desc: 'Contabilidade online para MEI, ME e EPP. Abertura de empresa, folha, DAS e obrigações acessórias sem sair de casa.',
    deal: '1º mês grátis',
    verified: true,
  },
  {
    name: 'Conta Simples',
    cat: 'Banco PJ',
    emoji: '🏦',
    rating: '4.8',
    reviews: '1.890',
    desc: 'Conta PJ sem tarifas absurdas, cartão empresarial e controle de despesas integrado. Ideal para quem acabou de abrir o CNPJ.',
    deal: '6 meses sem mensalidade',
    verified: true,
  },
  {
    name: 'Studio Visual',
    cat: 'Design',
    emoji: '🎨',
    rating: '4.7',
    reviews: '892',
    desc: 'Kit de identidade visual completo — logo, paleta, tipografia e arquivos editáveis. Entrega em até 5 dias úteis.',
    deal: '20% off kit marca',
    verified: true,
  },
  {
    name: 'GrowthBR',
    cat: 'Marketing',
    emoji: '📣',
    rating: '4.6',
    reviews: '634',
    desc: 'Gestão de redes sociais, Google Meu Negócio e campanhas pagas para pequenos negócios. Planos a partir de R$ 390/mês.',
    deal: 'Diagnóstico gratuito',
    verified: false,
  },
  {
    name: 'CreatorMatch',
    cat: 'Influencers',
    emoji: '🎙️',
    rating: '4.5',
    reviews: '312',
    desc: 'Conecta marcas com micro-influenciadores verificados no seu nicho e região. Relatórios de performance incluídos.',
    deal: '3 posts sem compromisso',
    verified: false,
  },
  {
    name: 'LexBrasil',
    cat: 'Jurídico',
    emoji: '⚖️',
    rating: '4.8',
    reviews: '1.102',
    desc: 'Registro de marca no INPI, contratos PJ e assessoria jurídica preventiva. Atende online em todo o Brasil.',
    deal: 'Consulta inicial grátis',
    verified: true,
  },
]

const CATS = ['Todos', 'Contabilidade', 'Banco PJ', 'Design', 'Marketing', 'Influencers', 'Jurídico']

const NAV_SECTIONS = [
  {
    label: 'Meu negócio',
    items: [
      { id: 'checklist',   icon: '✓', label: 'Checklist' },
      { id: 'prestadores', icon: '◈', label: 'Prestadores' },
      { id: 'documentos',  icon: '□', label: 'Documentos' },
    ],
  },
  {
    label: 'Categorias',
    items: [
      { id: 'contabilidade', icon: '◉', label: 'Contabilidade' },
      { id: 'banco',         icon: '◉', label: 'Banco PJ' },
      { id: 'design',        icon: '◉', label: 'Design' },
      { id: 'marketing',     icon: '◉', label: 'Marketing' },
      { id: 'juridico',      icon: '◉', label: 'Jurídico' },
    ],
  },
]

const MAIN_VIEWS = ['checklist', 'prestadores', 'documentos']

// ── Sub-components ────────────────────────────────────────────────────────────

function ProviderLogo({ provider, className }) {
  if (provider.logo_url) {
    return <img src={provider.logo_url} alt={provider.name} className={className} style={{ objectFit: 'cover', borderRadius: 10 }} />
  }
  return <div className={className}>{provider.emoji || (provider.name || '?').charAt(0).toUpperCase()}</div>
}

function ProviderCard({ provider, compact, onOpenModal }) {
  if (!provider) return null
  if (compact) {
    return (
      <div className={`db-prov-card${provider ? ' db-prov-card--active' : ''}`}>
        <ProviderLogo provider={provider} className="db-prov-ph" />
        <div className="db-prov-info">
          <div className="db-prov-name">{provider.name}</div>
          <div className="db-prov-meta">
            <span className="db-prov-cat">{provider.cat}</span>
            <span>·</span>
            <span className="db-prov-rating">★ {provider.rating}</span>
            {provider.verified && <span className="db-verified">verificado</span>}
          </div>
          {provider.deal && <div className="db-prov-deal">🎁 {provider.deal}</div>}
        </div>
        <button className="btn btn--sm btn--outline" onClick={() => onOpenModal && onOpenModal(provider)}>Ver detalhes</button>
      </div>
    )
  }

  return (
    <div className="db-prest-card">
      <div className="db-pc-top">
        <ProviderLogo provider={provider} className="db-pc-ph" />
        {provider.verified && <span className="db-verified-badge">verificado</span>}
      </div>
      <div className="db-pc-name">{provider.name}</div>
      <div className="db-pc-cat">{provider.cat}</div>
      <p className="db-pc-desc">{provider.desc}</p>
      <div className="db-pc-footer">
        <div className="db-pc-meta">
          <span className="db-pc-rating">★ {provider.rating}</span>
          <span className="db-pc-reviews">({provider.reviews} aval.)</span>
        </div>
        {provider.deal && <span className="db-pc-deal">🎁 {provider.deal}</span>}
      </div>
      <button className="btn btn--sm btn--primary db-pc-btn" onClick={() => onOpenModal && onOpenModal(provider)}>Acessar prestador</button>
    </div>
  )
}

function StepCard({ step, status, defaultOpen, onOpenModal, onToggle }) {
  const [open, setOpen] = useState(defaultOpen || false)
  const isCurrent = status === 'current'
  const isDone = status === 'done'

  let chkClass = 'db-step-chk'
  if (isDone) chkClass += ' db-step-chk--done'
  else if (isCurrent) chkClass += ' db-step-chk--current'
  else chkClass += ' db-step-chk--todo'

  let stepClass = 'db-step'
  if (isDone) stepClass += ' db-step--done'
  else if (isCurrent) stepClass += ' db-step--current'
  else stepClass += ' db-step--todo'

  return (
    <div className={stepClass}>
      <div className="db-step-hd" onClick={() => setOpen(o => !o)}>
        <span className="db-step-num">{String(step.id).padStart(2, '0')}</span>
        <span
          className={chkClass}
          onClick={e => { e.stopPropagation(); onToggle && onToggle(step.id) }}
          title={isDone ? 'Marcar como pendente' : 'Marcar como concluído'}
          style={{ cursor: 'pointer' }}
        />
        <div className="db-step-info">
          <div className="db-step-title">{step.title}</div>
          <div className="db-step-sub">{step.sub}</div>
        </div>
        {isDone && <span className="db-pill db-pill--muted">Concluído</span>}
        {isCurrent && <span className="db-pill db-pill--accent">Em andamento</span>}
        <span style={{ color: 'var(--fg-3)', fontSize: 12, marginLeft: 4 }}>
          {open ? '▲' : '▼'}
        </span>
      </div>

      {open && (
        <div className="db-step-body">
          <p className="db-step-desc">{step.desc}</p>
          {step.provider && <ProviderCard provider={step.provider} compact onOpenModal={onOpenModal} />}
          <button
            className={`btn ${isDone ? 'btn--outline' : 'btn--primary'}`}
            style={{ marginTop: 12 }}
            onClick={() => onToggle && onToggle(step.id)}
          >
            {isDone ? '↩ Marcar como pendente' : '✓ Marcar como concluído'}
          </button>
        </div>
      )}
    </div>
  )
}

function ChecklistView({ onOpenModal, doneIds, onToggle }) {
  const doneCount = doneIds.length
  const pct = Math.round((doneCount / STEPS.length) * 100)
  const [allProviders, setAllProviders] = useState([])

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('*').eq('role', 'provider').eq('verified', true),
      supabase.from('providers').select('*').eq('verified', true),
    ]).then(([{ data: profiles }, { data: curated }]) => {
      const fromProfiles = (profiles || []).map(p => ({
        ...p, name: p.empresa || p.name, emoji: (p.empresa || p.name || '?').charAt(0), desc: p.bio, reviews: p.reviews_count,
      }))
      const fromCurated = (curated || []).map(p => ({ ...p, desc: p.description }))
      setAllProviders([...fromProfiles, ...fromCurated])
    })
  }, [])

  function getBestForCat(cat) {
    const inCat = allProviders.filter(p => p.cat === cat)
    if (!inCat.length) return null
    return inCat.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0))[0]
  }

  function getStatus(id) {
    if (doneIds.includes(id)) return 'done'
    const firstPending = STEPS.find(s => !doneIds.includes(s.id))
    if (firstPending?.id === id) return 'current'
    return 'todo'
  }

  return (
    <div>
      <div className="db-checklist-top">
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--fg-3)', margin: '0 0 4px' }}>
            Progresso geral
          </p>
          <h2 className="db-checklist-h2">Seu checklist de abertura</h2>
          <p className="db-checklist-sub">Siga os passos e a Launchy cuida do resto.</p>
        </div>
        <div className="db-checklist-pct">
          <span className="db-pct-num">{pct}%</span>
          <span className="db-pct-label">{doneCount}/{STEPS.length} etapas</span>
        </div>
      </div>

      <div className="db-pbar-wrap">
        <div className="db-pbar">
          <div className="db-pfill" style={{ width: `${pct}%` }} />
        </div>
        <span className="db-pbar-hint">{STEPS.length - doneCount} restantes</span>
      </div>

      <div className="db-steps-list">
        {STEPS.map(step => {
          const status = getStatus(step.id)
          const suggestedProvider = getBestForCat(step.cat)
          return (
            <StepCard
              key={step.id}
              step={{ ...step, provider: suggestedProvider }}
              status={status}
              defaultOpen={status === 'current'}
              onOpenModal={onOpenModal}
              onToggle={onToggle}
            />
          )
        })}
      </div>
    </div>
  )
}

function PrestadoresView({ onOpenModal }) {
  const [cat, setCat] = useState('Todos')
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('*').eq('role', 'provider').eq('verified', true).order('empresa'),
      supabase.from('providers').select('*').eq('verified', true).order('name'),
    ]).then(([{ data: profiles }, { data: curated }]) => {
      const fromProfiles = (profiles || []).map(p => ({
        ...p, name: p.empresa || p.name, emoji: (p.empresa || p.name || '?').charAt(0).toUpperCase(), desc: p.bio, reviews: p.reviews_count, _source: 'profile',
      }))
      const fromCurated = (curated || []).map(p => ({
        ...p, desc: p.description, reviews: p.reviews, _source: 'curated',
      }))
      setProviders([...fromProfiles, ...fromCurated])
      setLoading(false)
    })
  }, [])

  const filtered = cat === 'Todos' ? providers : providers.filter(p => p.cat === cat)

  function toCard(p) { return p }

  return (
    <div>
      <div className="db-prest-top">
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--fg-3)', margin: '0 0 4px' }}>
          Rede Launchy
        </p>
        <h2 className="db-checklist-h2">Prestadores parceiros</h2>
        <p className="db-checklist-sub">Todos verificados e com condições exclusivas para membros.</p>
      </div>

      <div className="db-prest-filters">
        {CATS.map(c => (
          <button key={c} className={`db-filter-btn${cat === c ? ' active' : ''}`} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: 'var(--fg-3)', fontSize: 14, marginTop: 24 }}>Carregando prestadores…</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: 'var(--fg-3)', fontSize: 14, marginTop: 24 }}>Nenhum prestador disponível nesta categoria ainda.</p>
      ) : (
        <div className="db-prest-grid">
          {filtered.map(p => (
            <ProviderCard key={p.id} provider={toCard(p)} compact={false} onOpenModal={onOpenModal} />
          ))}
        </div>
      )}
    </div>
  )
}

function ComingSoon({ label }) {
  return (
    <div className="db-coming-soon">
      <div className="db-cs-icon">🔒</div>
      <h3>{label}</h3>
      <p>Esta seção está sendo construída. Em breve disponível para todos os membros.</p>
    </div>
  )
}


// ── Provider Modal ─────────────────────────────────────────────────────────────

function ProviderModal({ provider, onClose }) {
  if (!provider) return null
  const [demos, setDemos] = useState([])
  const [loadingDemos, setLoadingDemos] = useState(true)

  useEffect(() => {
    if (!provider.id) { setLoadingDemos(false); return }
    supabase.from('demonstrations')
      .select('*')
      .eq('provider_id', provider.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setDemos(data || []); setLoadingDemos(false) })
  }, [provider.id])

  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose() }
  const displayName = provider.empresa || provider.name
  const initial = (displayName || '?').charAt(0).toUpperCase()
  const siteUrl = provider.site ? (provider.site.startsWith('http') ? provider.site : `https://${provider.site}`) : null

  return (
    <div className="pm-backdrop" onClick={handleBackdrop} role="dialog" aria-modal="true">
      <div className="pm-card pm-card--expanded">
        <button className="pm-close" onClick={onClose} aria-label="Fechar">✕</button>

        <div className="pm-header">
          <ProviderLogo provider={{ ...provider, name: provider.empresa || provider.name }} className="pm-logo" />
          <div>
            <div className="pm-name">{displayName}</div>
            <div className="pm-cat">{provider.cat}</div>
          </div>
          {provider.verified && <span className="db-verified-badge" style={{ marginLeft: 'auto' }}>verificado</span>}
        </div>

        {(provider.bio || provider.desc) && (
          <p className="pm-desc">{provider.bio || provider.desc}</p>
        )}

        <div className="pm-meta">
          {provider.rating > 0 && (
            <div className="pm-meta-item">
              <span className="pm-meta-label">Avaliação</span>
              <span className="pm-meta-val" style={{ color: 'var(--accent-deep)' }}>★ {provider.rating}</span>
            </div>
          )}
          {(provider.reviews_count > 0 || provider.reviews) && (
            <div className="pm-meta-item">
              <span className="pm-meta-label">Avaliações</span>
              <span className="pm-meta-val">{provider.reviews_count || provider.reviews}</span>
            </div>
          )}
          {provider.deal && (
            <div className="pm-meta-item">
              <span className="pm-meta-label">Condição exclusiva</span>
              <span className="pm-meta-val" style={{ color: 'var(--accent-deep)' }}>🎁 {provider.deal}</span>
            </div>
          )}
          {provider.site && (
            <div className="pm-meta-item">
              <span className="pm-meta-label">Site</span>
              <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="pm-meta-val" style={{ color: 'var(--accent-deep)' }}>{provider.site}</a>
            </div>
          )}
          {provider.phone && (
            <div className="pm-meta-item">
              <span className="pm-meta-label">Contato</span>
              <span className="pm-meta-val">{provider.phone}</span>
            </div>
          )}
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
            Demonstrações
          </div>
          {loadingDemos ? (
            <p style={{ color: 'var(--fg-3)', fontSize: 13 }}>Carregando…</p>
          ) : demos.length === 0 ? (
            <p style={{ color: 'var(--fg-3)', fontSize: 13 }}>Nenhuma demonstração adicionada ainda.</p>
          ) : (
            <div className="pm-demos">
              {demos.map(d => (
                <a key={d.id} href={d.url} target="_blank" rel="noopener noreferrer" className="pm-demo-item">
                  <span>{d.type === 'image' ? '🖼' : d.type === 'video' ? '▶' : d.type === 'pdf' ? '📄' : '🔗'}</span>
                  <span>{d.title || d.url}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--fg-3)', marginBottom: 10 }}>
            Contato
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {siteUrl && (
              <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="btn btn--outline" style={{ justifyContent: 'flex-start', gap: 10 }}>
                🌐 <span>{provider.site}</span>
              </a>
            )}
            {provider.phone && (
              <a href={`https://wa.me/55${provider.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn btn--outline" style={{ justifyContent: 'flex-start', gap: 10 }}>
                💬 <span>{provider.phone}</span>
              </a>
            )}
            {!siteUrl && !provider.phone && (
              <p style={{ color: 'var(--fg-3)', fontSize: 13 }}>Nenhum contato cadastrado ainda.</p>
            )}
          </div>
        </div>
        <div className="pm-actions" style={{ marginTop: 16 }}>
          <button className="btn btn--primary" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  )
}

function Sidebar({ view, setView, user }) {
  function logout() {
    signOut()
  }

  const displayName = user?.name || 'Ryan'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <aside className="db-sidebar">
      <div className="db-logo">
        <span style={{ color: 'var(--accent)' }}>◆</span> Launchy
      </div>

      <nav className="db-nav">
        {NAV_SECTIONS.map(sect => (
          <div key={sect.label}>
            <div className="db-nav-sect">{sect.label}</div>
            {sect.items.map(item => (
              <button
                key={item.id}
                className={`db-nav-item${view === item.id ? ' active' : ''}`}
                onClick={() => setView(item.id)}
              >
                <em className="db-nav-ic">{item.icon}</em>
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="db-user-sect">
        <div className="db-user-pill" onClick={logout} title="Sair" style={{ cursor: 'pointer' }}>
          <div className="db-av">{initial}</div>
          <div>
            <div className="db-uname">{displayName}</div>
            <div className="db-uplan">Empreendedor · sair</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function TopBar({ view, dark, toggleDark }) {
  const titles = {
    checklist:     'Checklist',
    prestadores:   'Prestadores',
    documentos:    'Documentos',
    contabilidade: 'Contabilidade',
    banco:         'Banco PJ',
    design:        'Design',
    marketing:     'Marketing',
    juridico:      'Jurídico',
  }

  return (
    <header className="db-topbar">
      <span className="db-topbar-title">{titles[view] || 'Painel'}</span>
      <div className="db-topbar-actions">
        <button
          className="db-icon-btn"
          onClick={toggleDark}
          title={dark ? 'Modo claro' : 'Modo escuro'}
          style={{ fontSize: 15 }}
        >
          {dark ? '☀' : '☾'}
        </button>
        <button className="db-icon-btn" title="Notificações" style={{ fontSize: 14 }}>🔔</button>
        <div className="db-topbar-av">R</div>
      </div>
    </header>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [view, setView] = useState('checklist')
  const [dark, setDark] = useState(true)
  const [user, setUser] = useState(null)
  const [modalProvider, setModalProvider] = useState(null)
  const [doneIds, setDoneIds] = useState([])

  useEffect(() => {
    const el = document.documentElement
    el.setAttribute('data-theme', dark ? 'dark' : 'light')
    el.setAttribute('data-density', 'regular')
  }, [dark])

  // Role guard: redirect providers to their own dashboard, unauthenticated to auth
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { window.location.href = '/auth.html'; return }
      const profile = await getProfile(session.user.id)
      if (!profile) { window.location.href = '/auth.html'; return }
      if (profile.role === 'provider') { window.location.href = '/provider.html'; return }
      setUser({ ...profile, email: session.user.email })
      setDoneIds(profile.checklist_done || [])
    })
  }, [])

  async function toggleStep(id) {
    const newDone = doneIds.includes(id)
      ? doneIds.filter(x => x !== id)
      : [...doneIds, id]
    setDoneIds(newDone)
    await supabase.from('profiles').update({ checklist_done: newDone }).eq('id', user.id)
  }

  function renderView() {
    if (view === 'checklist')   return <ChecklistView onOpenModal={setModalProvider} doneIds={doneIds} onToggle={toggleStep} />
    if (view === 'prestadores') return <PrestadoresView onOpenModal={setModalProvider} />
    if (MAIN_VIEWS.includes(view)) return <ComingSoon label={view.charAt(0).toUpperCase() + view.slice(1)} />
    // category views
    const catMap = {
      contabilidade: 'Contabilidade',
      banco:         'Banco PJ',
      design:        'Design',
      marketing:     'Marketing',
      juridico:      'Jurídico',
    }
    const catLabel = catMap[view]
    if (catLabel) {
      return <PrestadoresWithCat initialCat={catLabel} onOpenModal={setModalProvider} />
    }
    return <ComingSoon label={view} />
  }

  return (
    <>
    {modalProvider && <ProviderModal provider={modalProvider} onClose={() => setModalProvider(null)} />}
    <div className="db-layout">
      <Sidebar view={view} setView={setView} user={user} />
      <div className="db-right">
        <TopBar view={view} dark={dark} toggleDark={() => setDark(d => !d)} />
        <main className="db-content">
          {renderView()}
        </main>
      </div>
    </div>
    </>
  )
}

// Category view (prestadores pre-filtered)
function PrestadoresWithCat({ initialCat, onOpenModal }) {
  const [cat, setCat] = useState(initialCat)
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('*').eq('role', 'provider').eq('verified', true).order('empresa'),
      supabase.from('providers').select('*').eq('verified', true).order('name'),
    ]).then(([{ data: profiles }, { data: curated }]) => {
      const fromProfiles = (profiles || []).map(p => ({
        ...p, name: p.empresa || p.name, emoji: (p.empresa || p.name || '?').charAt(0).toUpperCase(), desc: p.bio, reviews: p.reviews_count, _source: 'profile',
      }))
      const fromCurated = (curated || []).map(p => ({
        ...p, desc: p.description, reviews: p.reviews, _source: 'curated',
      }))
      setProviders([...fromProfiles, ...fromCurated])
      setLoading(false)
    })
  }, [])

  const filtered = cat === 'Todos' ? providers : providers.filter(p => p.cat === cat)

  function toCard(p) { return p }

  return (
    <div>
      <div className="db-prest-top">
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--fg-3)', margin: '0 0 4px' }}>
          Rede Launchy
        </p>
        <h2 className="db-checklist-h2">{initialCat}</h2>
        <p className="db-checklist-sub">Prestadores verificados nesta categoria.</p>
      </div>

      <div className="db-prest-filters">
        {CATS.map(c => (
          <button key={c} className={`db-filter-btn${cat === c ? ' active' : ''}`} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: 'var(--fg-3)', fontSize: 14, marginTop: 24 }}>Carregando prestadores…</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: 'var(--fg-3)', fontSize: 14, marginTop: 24 }}>Nenhum prestador disponível nesta categoria ainda.</p>
      ) : (
        <div className="db-prest-grid">
          {filtered.map(p => (
            <ProviderCard key={p.id} provider={toCard(p)} compact={false} onOpenModal={onOpenModal} />
          ))}
        </div>
      )}
    </div>
  )
}
