import { useState, useEffect } from 'react'
import './auth.css'

// ── Constants ─────────────────────────────────────────────────────────────────

const CATS = [
  'Contabilidade',
  'Banco PJ',
  'Design',
  'Marketing',
  'Influencers',
  'Jurídico',
  'Outro',
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function saveUser(data) {
  localStorage.setItem('launchy_user', JSON.stringify(data))
}

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem('launchy_user'))
  } catch {
    return null
  }
}

function redirect(role) {
  if (role === 'provider') {
    window.location.href = '/provider.html'
  } else {
    window.location.href = '/dashboard.html'
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PasswordInput({ id, value, onChange, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div className="auth-pw-wrap">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        className="auth-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder || 'Mínimo 8 caracteres'}
        autoComplete="new-password"
      />
      <button
        type="button"
        className="auth-pw-toggle"
        onClick={() => setShow(s => !s)}
        tabIndex={-1}
        aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
      >
        {show ? '🙈' : '👁'}
      </button>
    </div>
  )
}

// ── Register ──────────────────────────────────────────────────────────────────

function RegisterView({ onSwitchToLogin }) {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState(null)
  const [form, setForm] = useState({
    name: '', empresa: '', cat: '', email: '', phone: '', cnpj: '', password: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Informe seu nome.'
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'E-mail inválido.'
    if (form.password.length < 8) e.password = 'Mínimo 8 caracteres.'
    if (role === 'provider') {
      if (!form.empresa.trim()) e.empresa = 'Informe o nome da empresa.'
      if (!form.cat) e.cat = 'Selecione uma categoria.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    // Simulate async save
    setTimeout(() => {
      saveUser({ name: form.name, email: form.email, role, empresa: form.empresa, cat: form.cat })
      setLoading(false)
      setSuccess(true)
      setTimeout(() => redirect(role), 1800)
    }, 900)
  }

  if (success) {
    return (
      <div className="auth-success">
        <div className="auth-success-icon">✓</div>
        <h3>Conta criada!</h3>
        <p>
          {role === 'provider'
            ? 'Seu perfil de prestador está pronto. Redirecionando para o painel…'
            : 'Tudo certo. Redirecionando para o seu painel…'}
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Step indicator */}
      <div className="auth-steps">
        <div className={`auth-step-dot${step >= 1 ? ' active' : ''}`} />
        <div className={`auth-step-dot${step >= 2 ? ' active' : ''}`} />
      </div>

      {step === 1 ? (
        <>
          <h2 className="auth-heading">Qual é o seu perfil?</h2>
          <p className="auth-sub">Escolha como você vai usar a Launchy.</p>

          <div className="auth-role-grid">
            <div
              className={`auth-role-card${role === 'client' ? ' selected' : ''}`}
              onClick={() => setRole('client')}
              role="button"
              tabIndex={0}
              onKeyDown={ev => ev.key === 'Enter' && setRole('client')}
            >
              <span className="auth-role-icon">🏢</span>
              <p className="auth-role-title">Sou empreendedor</p>
              <p className="auth-role-desc">
                Abri ou vou abrir meu CNPJ e quero organizar meus fornecedores e obrigações.
              </p>
              <div className="auth-role-check" />
            </div>

            <div
              className={`auth-role-card${role === 'provider' ? ' selected' : ''}`}
              onClick={() => setRole('provider')}
              role="button"
              tabIndex={0}
              onKeyDown={ev => ev.key === 'Enter' && setRole('provider')}
            >
              <span className="auth-role-icon">🛠</span>
              <p className="auth-role-title">Sou prestador</p>
              <p className="auth-role-desc">
                Ofereço serviços para empresas (contabilidade, design, banco, jurídico etc.).
              </p>
              <div className="auth-role-check" />
            </div>
          </div>

          <button
            className="auth-btn-primary"
            disabled={!role}
            onClick={() => setStep(2)}
          >
            Continuar →
          </button>
        </>
      ) : (
        <>
          <h2 className="auth-heading">
            {role === 'provider' ? 'Dados da sua empresa' : 'Seus dados'}
          </h2>
          <p className="auth-sub">
            {role === 'provider'
              ? 'Crie seu perfil de prestador.'
              : 'Crie sua conta de empreendedor.'}
          </p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {role === 'provider' ? (
              <>
                <div className="auth-row">
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="r-name">Nome completo</label>
                    <input id="r-name" className={`auth-input${errors.name ? ' error' : ''}`} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ana Lima" />
                    {errors.name && <span className="auth-error-msg">{errors.name}</span>}
                  </div>
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="r-empresa">Nome da empresa</label>
                    <input id="r-empresa" className={`auth-input${errors.empresa ? ' error' : ''}`} value={form.empresa} onChange={e => set('empresa', e.target.value)} placeholder="Studio Visual" />
                    {errors.empresa && <span className="auth-error-msg">{errors.empresa}</span>}
                  </div>
                </div>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="r-cat">Categoria de serviço</label>
                  <select id="r-cat" className={`auth-input auth-select${errors.cat ? ' error' : ''}`} value={form.cat} onChange={e => set('cat', e.target.value)}>
                    <option value="">Selecione…</option>
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.cat && <span className="auth-error-msg">{errors.cat}</span>}
                </div>
                <div className="auth-row">
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="r-email">E-mail</label>
                    <input id="r-email" type="email" className={`auth-input${errors.email ? ' error' : ''}`} value={form.email} onChange={e => set('email', e.target.value)} placeholder="ana@studio.com.br" />
                    {errors.email && <span className="auth-error-msg">{errors.email}</span>}
                  </div>
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="r-cnpj">CNPJ</label>
                    <input id="r-cnpj" className="auth-input" value={form.cnpj} onChange={e => set('cnpj', e.target.value)} placeholder="00.000.000/0001-00" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="auth-row">
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="r-name">Nome completo</label>
                    <input id="r-name" className={`auth-input${errors.name ? ' error' : ''}`} value={form.name} onChange={e => set('name', e.target.value)} placeholder="João Silva" />
                    {errors.name && <span className="auth-error-msg">{errors.name}</span>}
                  </div>
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="r-phone">Telefone</label>
                    <input id="r-phone" className="auth-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(11) 99999-9999" />
                  </div>
                </div>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="r-email">E-mail</label>
                  <input id="r-email" type="email" className={`auth-input${errors.email ? ' error' : ''}`} value={form.email} onChange={e => set('email', e.target.value)} placeholder="joao@empresa.com.br" />
                  {errors.email && <span className="auth-error-msg">{errors.email}</span>}
                </div>
              </>
            )}

            <div className="auth-field">
              <label className="auth-label" htmlFor="r-pw">Senha</label>
              <PasswordInput id="r-pw" value={form.password} onChange={e => set('password', e.target.value)} />
              {errors.password && <span className="auth-error-msg">{errors.password}</span>}
            </div>

            <p style={{ fontSize: 11.5, color: 'var(--fg-3)', margin: '-4px 0 0', lineHeight: 1.6 }}>
              Ao criar conta você concorda com os{' '}
              <span className="auth-link">Termos de Uso</span> e{' '}
              <span className="auth-link">Política de Privacidade</span>.
            </p>

            <div className="auth-actions-row">
              <button type="button" className="auth-btn-back" onClick={() => setStep(1)}>← Voltar</button>
              <button type="submit" className="auth-btn-primary" disabled={loading}>
                {loading ? 'Criando conta…' : 'Criar conta'}
              </button>
            </div>
          </form>
        </>
      )}

      <p className="auth-footer">
        Já tem conta?{' '}
        <button className="auth-link" onClick={onSwitchToLogin}>Entrar</button>
      </p>
    </>
  )
}

// ── Login ─────────────────────────────────────────────────────────────────────

function LoginView({ onSwitchToRegister }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.email.includes('@')) e.email = 'E-mail inválido.'
    if (form.password.length < 4) e.password = 'Informe sua senha.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      const user = loadUser()
      if (user && user.email === form.email) {
        setLoading(false)
        redirect(user.role)
      } else {
        // Demo: default to client for any email
        saveUser({ name: form.email.split('@')[0], email: form.email, role: 'client' })
        setLoading(false)
        redirect('client')
      }
    }, 800)
  }

  return (
    <>
      <h2 className="auth-heading">Bem-vindo de volta</h2>
      <p className="auth-sub">Entre na sua conta Launchy.</p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label className="auth-label" htmlFor="l-email">E-mail</label>
          <input
            id="l-email"
            type="email"
            className={`auth-input${errors.email ? ' error' : ''}`}
            value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="seu@email.com.br"
            autoComplete="email"
          />
          {errors.email && <span className="auth-error-msg">{errors.email}</span>}
        </div>

        <div className="auth-field">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="auth-label" htmlFor="l-pw">Senha</label>
            <button type="button" className="auth-link" style={{ fontSize: 12 }}>
              Esqueci a senha
            </button>
          </div>
          <PasswordInput
            id="l-pw"
            value={form.password}
            onChange={e => set('password', e.target.value)}
            placeholder="Sua senha"
          />
          {errors.password && <span className="auth-error-msg">{errors.password}</span>}
        </div>

        <button type="submit" className="auth-btn-primary" style={{ marginTop: 4 }} disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      <div className="auth-divider" style={{ margin: '16px 0' }}>ou</div>

      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          className="auth-btn-back"
          style={{ width: '100%' }}
          onClick={() => { saveUser({ name: 'Ryan', email: 'cliente@demo.com', role: 'client' }); redirect('client') }}
        >
          🏢 Entrar como cliente (demo)
        </button>
        <button
          className="auth-btn-back"
          style={{ width: '100%' }}
          onClick={() => { saveUser({ name: 'Ana Lima', email: 'prestador@demo.com', role: 'provider', empresa: 'Studio Visual', cat: 'Design' }); redirect('provider') }}
        >
          🛠 Entrar como prestador (demo)
        </button>
      </div>

      <p className="auth-footer" style={{ marginTop: 20 }}>
        Não tem conta?{' '}
        <button className="auth-link" onClick={onSwitchToRegister}>Cadastrar</button>
      </p>
    </>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [dark, setDark] = useState(true)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    document.documentElement.setAttribute('data-density', 'regular')
  }, [dark])

  // Auto-redirect if already logged in
  useEffect(() => {
    const user = loadUser()
    if (user && user.role) redirect(user.role)
  }, [])

  const isWide = mode === 'register'

  return (
    <div className="auth-bg">
      <button
        className="auth-dark-btn"
        onClick={() => setDark(d => !d)}
        title={dark ? 'Modo claro' : 'Modo escuro'}
      >
        {dark ? '☀' : '☾'}
      </button>

      <div className={`auth-card${isWide ? ' auth-card--wide' : ''}`}>
        <div className="auth-logo">
          <span className="auth-logo-dot">◆</span> Launchy
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab${mode === 'login' ? ' active' : ''}`}
            onClick={() => setMode('login')}
          >
            Entrar
          </button>
          <button
            className={`auth-tab${mode === 'register' ? ' active' : ''}`}
            onClick={() => setMode('register')}
          >
            Criar conta
          </button>
        </div>

        {mode === 'login'
          ? <LoginView onSwitchToRegister={() => setMode('register')} />
          : <RegisterView onSwitchToLogin={() => setMode('login')} />
        }
      </div>
    </div>
  )
}
