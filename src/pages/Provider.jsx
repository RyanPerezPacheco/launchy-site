import { useState, useEffect, useRef } from 'react'
import './dashboard.css'
import './provider.css'
import { supabase, getProfile, signOut } from '../lib/supabase'

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_LEADS = [
  { id: 1, name: 'João Silva',    empresa: 'Silva & Filhos ME',    cat: 'Design',         date: 'Hoje, 09:41',       status: 'novo' },
  { id: 2, name: 'Camila Torres', empresa: 'Torrestur Viagens',     cat: 'Design',         date: 'Hoje, 07:15',       status: 'novo' },
  { id: 3, name: 'Marcos Pinto',  empresa: 'Pinto Distribuidora',  cat: 'Design',         date: 'Ontem, 18:30',      status: 'lido' },
  { id: 4, name: 'Fernanda Luz',  empresa: 'Luz Cosméticos',       cat: 'Design',         date: 'Ontem, 11:05',      status: 'lido' },
  { id: 5, name: 'Rodrigo Melo',  empresa: 'Melo Tech LTDA',       cat: 'Design',         date: '08/05, 14:22',      status: 'contatado' },
  { id: 6, name: 'Bianca Neves',  empresa: 'Neves Floricultura',   cat: 'Design',         date: '07/05, 10:00',      status: 'contatado' },
]

const MOCK_REVIEWS = [
  { id: 1, name: 'Camila Torres', rating: 5, date: 'Ontem',      text: 'Trabalho impecável, entregou antes do prazo e ainda ajudou com ajustes depois. Recomendo demais!' },
  { id: 2, name: 'Marcos Pinto',  rating: 5, date: '06/05',      text: 'Muito profissional. A identidade visual ficou exatamente como eu imaginava.' },
  { id: 3, name: 'João Silva',    rating: 4, date: '01/05',      text: 'Ótimo resultado final. Demorou um pouco mais que o combinado, mas entregou com qualidade.' },
  { id: 4, name: 'Fernanda Luz',  rating: 5, date: '28/04',      text: 'Atendimento incrível, super atenciosa com os detalhes. Já contratei pela segunda vez.' },
]

const MOCK_BILLING = [
  { id: 1, desc: 'Plano Profissional — Maio/2026',    valor: 'R$ 149,00', status: 'pago',    date: '01/05/2026' },
  { id: 2, desc: 'Plano Profissional — Abril/2026',   valor: 'R$ 149,00', status: 'pago',    date: '01/04/2026' },
  { id: 3, desc: 'Plano Profissional — Março/2026',   valor: 'R$ 149,00', status: 'pago',    date: '01/03/2026' },
]

const CATS = ['Contabilidade', 'Banco PJ', 'Design', 'Marketing', 'Influencers', 'Jurídico', 'Outro']

// ── Nav config ────────────────────────────────────────────────────────────────

const PROVIDER_NAV = [
  {
    label: 'Minha conta',
    items: [
      { id: 'perfil',  icon: '◈', label: 'Perfil público' },
      { id: 'demo',    icon: '▷', label: 'Demonstração' },
    ],
  },
  {
    label: 'Negócios',
    items: [
      { id: 'leads',     icon: '◉', label: 'Leads recebidos' },
      { id: 'avaliacoes',icon: '★', label: 'Avaliações' },
      { id: 'planos',    icon: '◎', label: 'Planos & Faturamento' },
    ],
  },
]

// ── Views ─────────────────────────────────────────────────────────────────────


// ── Provider Modal (shared) ──────────────────────────────────────────────────

function ProviderModal({ provider, onClose }) {
  if (!provider) return null
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose() }
  return (
    <div className="pm-backdrop" onClick={handleBackdrop} role="dialog" aria-modal="true">
      <div className="pm-card">
        <button className="pm-close" onClick={onClose} aria-label="Fechar">✕</button>
        <div className="pm-header">
          <div className="pm-logo">{provider.emoji}</div>
          <div>
            <div className="pm-name">{provider.name}</div>
            <div className="pm-cat">{provider.cat}</div>
          </div>
          {provider.verified && <span className="db-verified-badge" style={{ marginLeft: 'auto' }}>verificado</span>}
        </div>
        <p className="pm-desc">{provider.desc || 'Prestador parceiro Launchy.'}</p>
        <div className="pm-meta">
          <div className="pm-meta-item">
            <span className="pm-meta-label">Avaliação</span>
            <span className="pm-meta-val" style={{ color: 'var(--accent-deep)' }}>★ {provider.rating}</span>
          </div>
          <div className="pm-meta-item">
            <span className="pm-meta-label">Avaliações</span>
            <span className="pm-meta-val">{provider.reviews}</span>
          </div>
          {provider.deal && (
            <div className="pm-meta-item">
              <span className="pm-meta-label">Condição exclusiva</span>
              <span className="pm-meta-val" style={{ color: 'var(--accent-deep)' }}>🎁 {provider.deal}</span>
            </div>
          )}
        </div>
        <div className="pm-actions">
          <button className="btn btn--primary" style={{ flex: 1, justifyContent: 'center' }}>Acessar prestador</button>
          <button className="btn btn--outline" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  )
}

function PerfilView({ user, onProfileSaved }) {
  const [form, setForm] = useState({
    nome:    user?.name     || '',
    empresa: user?.empresa  || '',
    cat:     user?.cat      || '',
    bio:     user?.bio      || '',
    site:    user?.site     || '',
    phone:   user?.phone    || '',
    cnpj:    user?.cnpj     || '',
    deal:    user?.deal     || '',
  })
  const [logoUrl, setLogoUrl] = useState(user?.logo_url || null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const logoRef = useRef(null)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); setSaved(false); setSaveError(null) }

  async function handleLogoUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploadingLogo(true)
    const ext = file.name.split('.').pop().toLowerCase()
    const path = `${user.id}/logo.${ext}`
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (upErr) { setUploadingLogo(false); return }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
    const url = `${publicUrl}?t=${Date.now()}`
    await supabase.from('profiles').update({ logo_url: url }).eq('id', user.id)
    setLogoUrl(url)
    setUploadingLogo(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)
    const { error } = await supabase
      .from('profiles')
      .update({
        name:    form.nome,
        empresa: form.empresa,
        cat:     form.cat,
        bio:     form.bio,
        site:    form.site,
        phone:   form.phone,
        cnpj:    form.cnpj,
        deal:    form.deal || null,
      })
      .eq('id', user.id)
    setSaving(false)
    if (error) { setSaveError('Erro ao salvar. Tente novamente.'); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    onProfileSaved?.({ ...user, name: form.nome, empresa: form.empresa, cat: form.cat, bio: form.bio, site: form.site, phone: form.phone, cnpj: form.cnpj, deal: form.deal, logo_url: logoUrl })
  }

  return (
    <div>
      <p className="pv-eyebrow">Minha conta</p>
      <h2 className="db-checklist-h2">Perfil público</h2>
      <p className="db-checklist-sub">Como os clientes veem você na listagem de prestadores.</p>

      <div className="pv-grid">
        {/* Form */}
        <form className="pv-form" onSubmit={handleSave}>
          <div className="pv-section-label">Logo da empresa</div>
          <div className="pv-logo-row">
            <div className="pv-logo-preview" onClick={() => logoRef.current?.click()} title="Clique para trocar">
              {uploadingLogo ? (
                <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>Enviando…</span>
              ) : logoUrl ? (
                <img src={logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
              ) : (
                <span style={{ fontSize: 28 }}>{(form.empresa || '?').charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <button type="button" className="btn btn--outline btn--sm" onClick={() => logoRef.current?.click()} disabled={uploadingLogo}>
                {uploadingLogo ? 'Enviando…' : logoUrl ? 'Trocar logo' : 'Adicionar logo'}
              </button>
              <p style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 6 }}>PNG ou JPG · Aparece no card do prestador</p>
            </div>
            <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
          </div>

          <div className="pv-section-label" style={{ marginTop: 8 }}>Dados gerais</div>

          <div className="pv-row">
            <div className="pv-field">
              <label className="pv-label">Nome</label>
              <input className="pv-input" value={form.nome} onChange={e => set('nome', e.target.value)} />
            </div>
            <div className="pv-field">
              <label className="pv-label">Empresa</label>
              <input className="pv-input" value={form.empresa} onChange={e => set('empresa', e.target.value)} />
            </div>
          </div>

          <div className="pv-field">
            <label className="pv-label">Categoria</label>
            <select className="pv-input pv-select" value={form.cat} onChange={e => set('cat', e.target.value)}>
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="pv-field">
            <label className="pv-label">Descrição (aparece no card)</label>
            <textarea className="pv-input pv-textarea" rows={3} value={form.bio} onChange={e => set('bio', e.target.value)} />
          </div>

          <div className="pv-section-label" style={{ marginTop: 8 }}>Contato & links</div>

          <div className="pv-row">
            <div className="pv-field">
              <label className="pv-label">Site / portfolio</label>
              <input className="pv-input" value={form.site} onChange={e => set('site', e.target.value)} placeholder="seusite.com.br" />
            </div>
            <div className="pv-field">
              <label className="pv-label">Telefone de contato</label>
              <input className="pv-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(11) 99999-0000" />
            </div>
          </div>

          <div className="pv-field">
            <label className="pv-label">CNPJ</label>
            <input className="pv-input" value={form.cnpj} onChange={e => set('cnpj', e.target.value)} placeholder="00.000.000/0001-00" />
          </div>

          <div className="pv-field">
            <label className="pv-label">Condição exclusiva para clientes Launchy</label>
            <input className="pv-input" value={form.deal} onChange={e => set('deal', e.target.value)} placeholder="Ex: 1º mês grátis, 20% off, Consulta grátis…" />
            <span style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, display: 'block' }}>Aparece no card com ícone 🎁</span>
          </div>

          {saveError && <p style={{ color: 'var(--danger, #f55)', fontSize: 13, margin: '4px 0 0' }}>{saveError}</p>}
          <button type="submit" className="btn btn--primary" style={{ marginTop: 8 }} disabled={saving}>
            {saving ? 'Salvando…' : saved ? '✓ Salvo' : 'Salvar alterações'}
          </button>
        </form>

        {/* Preview */}
        <div>
          <div className="pv-preview-label">Prévia do card</div>
          <div className="pv-preview-card">
            <div className="pv-pc-top">
              <div className="pv-pc-logo">{form.empresa.charAt(0)}</div>
              <span className="db-verified-badge">verificado</span>
            </div>
            <div className="pv-pc-name">{form.empresa}</div>
            <div className="db-pc-cat">{form.cat}</div>
            <p className="db-pc-desc">{form.bio}</p>
            <div className="db-pc-footer">
              <div className="db-pc-meta">
                <span className="db-pc-rating">★ 4.8</span>
                <span className="db-pc-reviews">(24 aval.)</span>
              </div>
              <span className="db-pc-deal">🎁 Consulta grátis</span>
            </div>
            <button className="btn btn--sm btn--primary" style={{ width: '100%', marginTop: 4, justifyContent: 'center' }}>
              Acessar prestador
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DemoView({ user }) {
  const [demos, setDemos] = useState([])
  const [loading, setLoading] = useState(true)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkTitle, setLinkTitle] = useState('')
  const [adding, setAdding] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    if (!user?.id) return
    supabase.from('demonstrations').select('*').eq('provider_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { setDemos(data || []); setLoading(false) })
  }, [user?.id])

  async function addLink(e) {
    e.preventDefault()
    if (!linkUrl.trim()) return
    setAdding(true)
    const isVideo = linkUrl.includes('youtube') || linkUrl.includes('vimeo')
    const { data, error } = await supabase.from('demonstrations').insert({
      provider_id: user.id,
      type: isVideo ? 'video' : 'link',
      url: linkUrl.trim(),
      title: linkTitle.trim() || null,
    }).select().single()
    setAdding(false)
    if (!error && data) { setDemos(d => [data, ...d]); setLinkUrl(''); setLinkTitle('') }
  }

  async function uploadFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop().toLowerCase()
    const type = ['jpg','jpeg','png','gif','webp'].includes(ext) ? 'image' : 'pdf'
    const path = `${user.id}/${Date.now()}-${file.name}`
    const { error: upErr } = await supabase.storage.from('demonstrations').upload(path, file)
    if (upErr) { setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('demonstrations').getPublicUrl(path)
    const { data, error } = await supabase.from('demonstrations').insert({
      provider_id: user.id, type, url: publicUrl, title: file.name,
    }).select().single()
    setUploading(false)
    if (!error && data) setDemos(d => [data, ...d])
  }

  async function removeDemo(id) {
    await supabase.from('demonstrations').delete().eq('id', id)
    setDemos(d => d.filter(x => x.id !== id))
  }

  return (
    <div>
      <p className="pv-eyebrow">Minha conta</p>
      <h2 className="db-checklist-h2">Demonstração de serviço</h2>
      <p className="db-checklist-sub">Mostre seu trabalho para atrair mais clientes.</p>

      {/* Upload de arquivo */}
      <div className="demo-upload-area" onClick={() => fileRef.current?.click()} style={{ cursor: 'pointer' }}>
        <div className="demo-upload-icon">{uploading ? '⏳' : '📁'}</div>
        <p className="demo-upload-title">{uploading ? 'Enviando…' : 'Clique para selecionar arquivo'}</p>
        <p className="demo-upload-sub">Imagens (JPG, PNG) ou PDF — máx. 10MB</p>
        <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={uploadFile} />
      </div>

      {/* Adicionar link */}
      <div className="demo-link-wrap">
        <p className="pv-label" style={{ marginBottom: 8 }}>Ou adicione um link (YouTube, Vimeo, portfólio…)</p>
        <form onSubmit={addLink} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input className="pv-input" value={linkTitle} onChange={e => setLinkTitle(e.target.value)} placeholder="Título (opcional)" />
          <div style={{ display: 'flex', gap: 10 }}>
            <input className="pv-input" style={{ flex: 1 }} value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://…" />
            <button type="submit" className="btn btn--primary" disabled={adding}>{adding ? '…' : 'Adicionar'}</button>
          </div>
        </form>
      </div>

      {/* Lista de demos */}
      {loading ? (
        <p style={{ color: 'var(--fg-3)', fontSize: 14, marginTop: 24 }}>Carregando…</p>
      ) : demos.length === 0 ? (
        <div className="db-coming-soon" style={{ minHeight: '20vh' }}>
          <div className="db-cs-icon">🎬</div>
          <h3>Nenhuma demonstração ainda</h3>
          <p>Adicione fotos, vídeos ou links do seu trabalho.</p>
        </div>
      ) : (
        <div className="demo-list">
          {demos.map(d => (
            <div key={d.id} className="demo-item">
              <span className="demo-item-ic">{d.type === 'image' ? '🖼' : d.type === 'video' ? '▶' : d.type === 'pdf' ? '📄' : '🔗'}</span>
              <div className="demo-item-info">
                <a href={d.url} target="_blank" rel="noopener noreferrer" className="demo-item-title">{d.title || d.url}</a>
                <span className="demo-item-type">{d.type}</span>
              </div>
              <button className="btn btn--sm btn--ghost" onClick={() => removeDemo(d.id)} title="Remover">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function LeadsView() {
  const novo = MOCK_LEADS.filter(l => l.status === 'novo').length

  return (
    <div>
      <p className="pv-eyebrow">Negócios</p>
      <h2 className="db-checklist-h2">Leads recebidos</h2>
      <p className="db-checklist-sub">{novo > 0 ? `${novo} novo${novo > 1 ? 's' : ''} desde ontem.` : 'Nenhum lead novo.'}</p>

      <div className="leads-stats">
        <div className="leads-stat">
          <span className="leads-stat-num">{MOCK_LEADS.length}</span>
          <span className="leads-stat-label">Total</span>
        </div>
        <div className="leads-stat">
          <span className="leads-stat-num" style={{ color: 'var(--accent)' }}>{novo}</span>
          <span className="leads-stat-label">Novos</span>
        </div>
        <div className="leads-stat">
          <span className="leads-stat-num">{MOCK_LEADS.filter(l => l.status === 'contatado').length}</span>
          <span className="leads-stat-label">Contatados</span>
        </div>
      </div>

      <div className="leads-list">
        {MOCK_LEADS.map(lead => (
          <div key={lead.id} className="leads-item">
            <div className="leads-av">{lead.name.charAt(0)}</div>
            <div className="leads-info">
              <div className="leads-name">
                {lead.name}
                {lead.status === 'novo' && <span className="leads-badge">novo</span>}
              </div>
              <div className="leads-empresa">{lead.empresa}</div>
            </div>
            <div className="leads-meta">
              <span className="leads-date">{lead.date}</span>
              <button className="btn btn--sm btn--outline">Contatar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AvaliacoesView() {
  const avg = (MOCK_REVIEWS.reduce((s, r) => s + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1)

  return (
    <div>
      <p className="pv-eyebrow">Negócios</p>
      <h2 className="db-checklist-h2">Avaliações</h2>
      <p className="db-checklist-sub">O que os clientes estão falando.</p>

      <div className="rev-summary">
        <div className="rev-avg">
          <span className="rev-avg-num">{avg}</span>
          <span className="rev-stars">{'★'.repeat(Math.round(avg))}</span>
          <span className="rev-count">{MOCK_REVIEWS.length} avaliações</span>
        </div>
        <div className="rev-bars">
          {[5, 4, 3, 2, 1].map(n => {
            const cnt = MOCK_REVIEWS.filter(r => r.rating === n).length
            const pct = Math.round((cnt / MOCK_REVIEWS.length) * 100)
            return (
              <div key={n} className="rev-bar-row">
                <span className="rev-bar-label">{n}★</span>
                <div className="rev-bar-track">
                  <div className="rev-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="rev-bar-pct">{cnt}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rev-list">
        {MOCK_REVIEWS.map(r => (
          <div key={r.id} className="rev-item">
            <div className="rev-item-top">
              <div className="rev-av">{r.name.charAt(0)}</div>
              <div>
                <div className="rev-name">{r.name}</div>
                <div className="rev-date">{r.date}</div>
              </div>
              <div className="rev-rating-stars" style={{ marginLeft: 'auto' }}>
                {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
              </div>
            </div>
            <p className="rev-text">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function PlanosView() {
  return (
    <div>
      <p className="pv-eyebrow">Negócios</p>
      <h2 className="db-checklist-h2">Planos & Faturamento</h2>
      <p className="db-checklist-sub">Seu plano atual e histórico de cobranças.</p>

      {/* Current plan */}
      <div className="plan-card plan-card--active">
        <div className="plan-badge">Plano atual</div>
        <div className="plan-name">Profissional</div>
        <div className="plan-price">R$ 149<span>/mês</span></div>
        <ul className="plan-features">
          <li>✓ Perfil verificado no diretório</li>
          <li>✓ Leads ilimitados</li>
          <li>✓ Demonstração de até 10 arquivos</li>
          <li>✓ Respostas para avaliações</li>
          <li>✓ Suporte prioritário</li>
        </ul>
        <button className="btn btn--outline" style={{ marginTop: 8 }}>Gerenciar assinatura</button>
      </div>

      {/* Billing history */}
      <div className="plan-hist-label">Histórico de cobranças</div>
      <div className="plan-hist">
        {MOCK_BILLING.map(b => (
          <div key={b.id} className="plan-hist-row">
            <div>
              <div className="plan-hist-desc">{b.desc}</div>
              <div className="plan-hist-date">{b.date}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="plan-hist-valor">{b.valor}</span>
              <span className={`plan-hist-status plan-hist-status--${b.status}`}>{b.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function ProviderSidebar({ view, setView, user }) {
  function logout() {
    signOut()
  }

  return (
    <aside className="db-sidebar">
      <div className="db-logo">
        <span style={{ color: 'var(--accent)' }}>◆</span> Launchy
      </div>

      <nav className="db-nav">
        {PROVIDER_NAV.map(sect => (
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
        <div className="db-user-pill" onClick={logout} title="Sair">
          <div className="db-av">{(user?.name || 'P').charAt(0).toUpperCase()}</div>
          <div>
            <div className="db-uname">{user?.empresa || user?.name || 'Prestador'}</div>
            <div className="db-uplan">Prestador · sair</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

// ── TopBar ────────────────────────────────────────────────────────────────────

const TITLES = {
  perfil:     'Perfil público',
  demo:       'Demonstração',
  leads:      'Leads recebidos',
  avaliacoes: 'Avaliações',
  planos:     'Planos & Faturamento',
}

function ProviderTopBar({ view, dark, toggleDark, user }) {
  return (
    <header className="db-topbar">
      <span className="db-topbar-title">{TITLES[view] || 'Painel'}</span>
      <div className="db-topbar-actions">
        <button className="db-icon-btn" onClick={toggleDark} title={dark ? 'Modo claro' : 'Modo escuro'} style={{ fontSize: 15 }}>
          {dark ? '☀' : '☾'}
        </button>
        <button className="db-icon-btn" title="Notificações" style={{ fontSize: 14 }}>🔔</button>
        <div className="db-topbar-av">{(user?.name || 'P').charAt(0).toUpperCase()}</div>
      </div>
    </header>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function Provider() {
  const [view, setView] = useState('perfil')
  const [dark, setDark] = useState(true)
  const [user, setUser] = useState(null)
  const [modalProvider, setModalProvider] = useState(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    document.documentElement.setAttribute('data-density', 'regular')
  }, [dark])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { window.location.href = '/auth.html'; return }
      const profile = await getProfile(session.user.id)
      if (!profile) { window.location.href = '/auth.html'; return }
      if (profile.role !== 'provider') { window.location.href = '/dashboard.html'; return }
      setUser({ ...profile, email: session.user.email })
    })
  }, [])

  function renderView() {
    if (view === 'perfil')     return <PerfilView user={user} onProfileSaved={u => setUser(u)} />
    if (view === 'demo')       return <DemoView user={user} />
    if (view === 'leads')      return <LeadsView />
    if (view === 'avaliacoes') return <AvaliacoesView />
    if (view === 'planos')     return <PlanosView />
    return null
  }

  if (!user) return null

  return (
    <>
    {modalProvider && <ProviderModal provider={modalProvider} onClose={() => setModalProvider(null)} />}
    <div className="db-layout">
      <ProviderSidebar view={view} setView={setView} user={user} />
      <div className="db-right">
        <ProviderTopBar view={view} dark={dark} toggleDark={() => setDark(d => !d)} user={user} />
        <main className="db-content">{renderView()}</main>
      </div>
    </div>
    </>
  )
}
