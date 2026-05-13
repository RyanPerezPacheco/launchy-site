// src/pages/Admin.jsx
import { useState, useEffect, useCallback } from 'react'
import { supabase, getSession, getProfile, signOut } from '../lib/supabase'
import './admin.css'

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmt(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function fmtDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

function initials(nome = '') {
  return nome.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?'
}

const ESTAGIOS = {
  ideia: 'Na ideia',
  abrir: 'Vai abrir CNPJ',
  mei: 'Já é MEI',
  simples: 'Simples Nacional',
  outro: 'Outro',
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }) {
  return (
    <div className="ad-stat">
      <div className="ad-stat-num">{value}</div>
      <div className="ad-stat-label">{label}</div>
      {sub && <div className="ad-stat-sub">{sub}</div>}
    </div>
  )
}

function Badge({ children, color = 'green' }) {
  return <span className={`ad-badge ad-badge--${color}`}>{children}</span>
}

// ── Leads view ────────────────────────────────────────────────────────────────

function LeadsView({ leads, loading }) {
  const hoje = leads.filter(l => {
    const d = new Date(l.created_at)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  }).length

  if (loading) return <div className="ad-loading">Carregando leads…</div>

  return (
    <div>
      <div className="ad-stats">
        <StatCard label="Total de leads" value={leads.length} />
        <StatCard label="Hoje" value={hoje} />
        <StatCard
          label="Mais comum"
          value={
            leads.length
              ? ESTAGIOS[
                  Object.entries(
                    leads.reduce((acc, l) => {
                      acc[l.estagio] = (acc[l.estagio] || 0) + 1
                      return acc
                    }, {})
                  ).sort((a, b) => b[1] - a[1])[0]?.[0]
                ] || '—'
              : '—'
          }
        />
      </div>

      {leads.length === 0 ? (
        <div className="ad-empty">Nenhum lead ainda.</div>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>WhatsApp</th>
                <th>Estágio</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(l => (
                <tr key={l.id}>
                  <td>
                    <div className="ad-user-cell">
                      <div className="ad-av">{initials(l.nome)}</div>
                      <span>{l.nome}</span>
                    </div>
                  </td>
                  <td><a href={`mailto:${l.email}`} className="ad-link">{l.email}</a></td>
                  <td>{l.whatsapp || '—'}</td>
                  <td><Badge>{ESTAGIOS[l.estagio] || l.estagio}</Badge></td>
                  <td className="ad-mono">{fmt(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Prestadores view ──────────────────────────────────────────────────────────

function PrestadoresView({ providers, loading, onToggle }) {
  const aprovados = providers.filter(p => p.verified).length
  const pendentes = providers.filter(p => !p.verified).length

  if (loading) return <div className="ad-loading">Carregando prestadores…</div>

  return (
    <div>
      <div className="ad-stats">
        <StatCard label="Total" value={providers.length} />
        <StatCard label="Aprovados" value={aprovados} />
        <StatCard label="Pendentes" value={pendentes} />
      </div>

      {providers.length === 0 ? (
        <div className="ad-empty">Nenhum prestador cadastrado ainda.</div>
      ) : (
        <div className="ad-provider-list">
          {providers.map(p => (
            <div key={p.id} className={`ad-provider-card ${p.verified ? '' : 'ad-provider-card--pending'}`}>
              <div className="ad-provider-card-left">
                <div className="ad-pv-logo">
                  {p.logo_url
                    ? <img src={p.logo_url} alt={p.empresa} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                    : (p.empresa?.[0] || '?')
                  }
                </div>
                <div>
                  <div className="ad-provider-name">{p.empresa || p.nome || '—'}</div>
                  <div className="ad-provider-meta">
                    {p.categoria && <span>{p.categoria}</span>}
                    {p.website && <a href={p.website} target="_blank" rel="noreferrer" className="ad-link">{p.website}</a>}
                  </div>
                  {p.bio && <p className="ad-provider-bio">{p.bio}</p>}
                </div>
              </div>
              <div className="ad-provider-card-right">
                <Badge color={p.verified ? 'green' : 'orange'}>
                  {p.verified ? 'Aprovado' : 'Pendente'}
                </Badge>
                <div className="ad-provider-date">{fmtDate(p.created_at)}</div>
                <button
                  className={`btn ${p.verified ? 'btn-ghost' : 'btn-primary'} btn-sm`}
                  style={{ marginTop: 8 }}
                  onClick={() => onToggle(p.id, p.verified)}
                >
                  {p.verified ? 'Reprovar' : 'Aprovar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Usuários view ─────────────────────────────────────────────────────────────

function UsuariosView({ users, loading }) {
  if (loading) return <div className="ad-loading">Carregando usuários…</div>

  return (
    <div>
      <div className="ad-stats">
        <StatCard label="Clientes cadastrados" value={users.length} />
      </div>

      {users.length === 0 ? (
        <div className="ad-empty">Nenhum cliente cadastrado ainda.</div>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Empresa</th>
                <th>Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="ad-user-cell">
                      <div className="ad-av">{initials(u.nome)}</div>
                      <span>{u.nome || '—'}</span>
                    </div>
                  </td>
                  <td>{u.empresa || '—'}</td>
                  <td className="ad-mono">{fmtDate(u.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────

export function AdminApp() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(true)
  const [tab, setTab] = useState('leads')

  const [leads, setLeads] = useState([])
  const [providers, setProviders] = useState([])
  const [users, setUsers] = useState([])

  const loadData = useCallback(async () => {
    setDataLoading(true)
    const [leadsRes, providersRes, usersRes] = await Promise.all([
      supabase.from('leads').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').eq('role', 'provider').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').eq('role', 'client').order('created_at', { ascending: false }),
    ])
    setLeads(leadsRes.data || [])
    setProviders(providersRes.data || [])
    setUsers(usersRes.data || [])
    setDataLoading(false)
  }, [])

  useEffect(() => {
    async function init() {
      const s = await getSession()
      if (!s) { window.location.href = '/auth.html'; return }
      const p = await getProfile(s.user.id)
      if (!p || p.role !== 'admin') {
        setLoading(false)
        return
      }
      setSession(s)
      setProfile(p)
      setLoading(false)
      loadData()
    }
    init()
  }, [loadData])

  async function handleToggleVerified(id, current) {
    const { error } = await supabase
      .from('profiles')
      .update({ verified: !current })
      .eq('id', id)
    if (!error) {
      setProviders(prev => prev.map(p => p.id === id ? { ...p, verified: !current } : p))
    }
  }

  // ── States ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-3)' }}>Verificando acesso…</div>
      </div>
    )
  }

  if (!profile || profile.role !== 'admin') {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 32 }}>🔒</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)' }}>Acesso restrito</h2>
        <p style={{ color: 'var(--fg-3)', fontSize: 14 }}>Você não tem permissão para acessar esta página.</p>
        <a href="/dashboard.html" className="btn btn-primary btn-sm">Voltar ao início</a>
      </div>
    )
  }

  const TABS = [
    { id: 'leads', label: 'Leads', count: leads.length },
    { id: 'providers', label: 'Prestadores', count: providers.length },
    { id: 'users', label: 'Usuários', count: users.length },
  ]

  return (
    <div className="ad-root">
      {/* Sidebar */}
      <aside className="ad-sidebar">
        <div className="ad-sidebar-logo">
          <span className="ad-logo-text">Launchy</span>
          <span className="ad-logo-badge">Admin</span>
        </div>

        <nav className="ad-nav">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`ad-nav-item ${tab === t.id ? 'ad-nav-item--active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span>{t.label}</span>
              <span className="ad-nav-count">{t.count}</span>
            </button>
          ))}
        </nav>

        <div className="ad-sidebar-footer">
          <div className="ad-sidebar-user">
            <div className="ad-av ad-av--sm">{initials(profile.nome)}</div>
            <span className="ad-sidebar-username">{profile.nome || 'Admin'}</span>
          </div>
          <button className="ad-signout" onClick={signOut}>Sair</button>
        </div>
      </aside>

      {/* Main */}
      <main className="ad-main">
        <div className="ad-header">
          <div>
            <div className="ad-eyebrow">Painel administrativo</div>
            <h1 className="ad-title">
              {tab === 'leads' && 'Leads'}
              {tab === 'providers' && 'Prestadores'}
              {tab === 'users' && 'Usuários'}
            </h1>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={loadData}>↻ Atualizar</button>
        </div>

        <div className="ad-content">
          {tab === 'leads' && <LeadsView leads={leads} loading={dataLoading} />}
          {tab === 'providers' && <PrestadoresView providers={providers} loading={dataLoading} onToggle={handleToggleVerified} />}
          {tab === 'users' && <UsuariosView users={users} loading={dataLoading} />}
        </div>
      </main>
    </div>
  )
}
