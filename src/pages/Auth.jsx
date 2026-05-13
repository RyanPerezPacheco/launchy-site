import { useState, useEffect } from 'react'
import { supabase, redirectByRole } from '../lib/supabase'
import './auth.css'

// ── Dados do perfil ───────────────────────────────────────────────────────────

const CATS = ['Contabilidade', 'Banco PJ', 'Design', 'Marketing', 'Influencers', 'Jurídico', 'Outro']

const SEGMENTOS = [
  'Comércio (varejo/atacado)', 'Serviços', 'Tecnologia',
  'Saúde e bem-estar', 'Alimentação', 'Educação',
  'Construção e reforma', 'Beleza e estética', 'Outro',
]

const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
]

const REGIMES = [
  'Ainda não abri meu CNPJ', 'MEI', 'Simples Nacional', 'Lucro Presumido', 'Lucro Real',
]

const FUNCIONARIOS = ['Só eu (0)', '1 a 4', '5 a 9', '10 a 19', '20 a 49', '50 ou mais']

const FATURAMENTO = [
  'Até R$ 10 mil', 'R$ 10 mil – R$ 30 mil', 'R$ 30 mil – R$ 80 mil',
  'R$ 80 mil – R$ 200 mil', 'Acima de R$ 200 mil',
]

const TEMPO = [
  'Ainda vou abrir', 'Menos de 1 ano', '1 a 3 anos', '3 a 5 anos', 'Mais de 5 anos',
]

const DORES = [
  'Contabilidade e impostos', 'Abertura de CNPJ', 'Emissão de nota fiscal',
  'Folha de pagamento (RH)', 'Marketing e divulgação', 'Design e identidade visual',
  'Assessoria jurídica', 'Conta PJ e crédito', 'Gestão financeira',
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function PasswordInput({ id, value, onChange, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div className="auth-pw-wrap">
      <input
        id={id} type={show ? 'text' : 'password'} className="auth-input"
        value={value} onChange={onChange}
        placeholder={placeholder || 'Mínimo 8 caracteres'}
        autoComplete="new-password"
      />
      <button type="button" className="auth-pw-toggle" onClick={() => setShow(s => !s)}
        tabIndex={-1} aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}>
        {show ? '🙈' : '👁'}
      </button>
    </div>
  )
}

function SelectPill({ options, value, onChange, multi = false }) {
  return (
    <div className="auth-pills">
      {options.map(opt => {
        const active = multi ? (value || []).includes(opt) : value === opt
        return (
          <button
            key={opt} type="button"
            className={`auth-pill${active ? ' auth-pill--active' : ''}`}
            onClick={() => {
              if (multi) {
                const curr = value || []
                onChange(curr.includes(opt) ? curr.filter(x => x !== opt) : [...curr, opt])
              } else {
                onChange(opt === value ? '' : opt)
              }
            }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function StepDots({ current, total }) {
  return (
    <div className="auth-steps">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`auth-step-dot${i + 1 <= current ? ' active' : ''}`} />
      ))}
    </div>
  )
}

// ── Register ──────────────────────────────────────────────────────────────────

function RegisterView({ onSwitchToLogin }) {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState(null)
  const [form, setForm] = useState({
    // básico
    name: '', empresa: '', cat: '', email: '', phone: '', cnpj: '', password: '',
    // perfil cliente
    segmento: '', estado: '', regime: '', funcionarios: '', faturamento: '', tempo: '',
    dores: [],
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const totalSteps = role === 'client' ? 4 : 2

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  function validateStep2() {
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

  function next() {
    if (step === 1 && !role) return
    if (step === 2 && !validateStep2()) return
    if (step === 2 && role === 'provider') { handleSubmit(); return }
    setStep(s => s + 1)
  }

  async function handleSubmit() {
    setLoading(true)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name, role,
          empresa: form.empresa || null,
          cat: form.cat || null,
          phone: form.phone || null,
          cnpj: form.cnpj || null,
        },
      },
    })
    if (authError) {
      setErrors({ email: authError.message })
      setLoading(false)
      return
    }
    // Para clientes: salva dados de perfil adicionais
    if (role === 'client' && authData?.user) {
      await supabase.from('profiles').update({
        segmento:     form.segmento     || null,
        estado:       form.estado       || null,
        regime_fiscal: form.regime      || null,
        funcionarios: form.funcionarios || null,
        faturamento:  form.faturamento  || null,
        tempo_empresa: form.tempo       || null,
        dores:        form.dores.length > 0 ? form.dores : null,
      }).eq('id', authData.user.id)
    }
    setLoading(false)
    setSuccess(true)
    setTimeout(() => redirectByRole(role), 1800)
  }

  if (success) {
    return (
      <div className="auth-success">
        <div className="auth-success-icon">✓</div>
        <h3>Conta criada!</h3>
        <p>
          {role === 'provider'
            ? 'Seu perfil de prestador está pronto. Redirecionando…'
            : 'Tudo certo. Redirecionando para o seu painel…'}
        </p>
      </div>
    )
  }

  return (
    <>
      <StepDots current={step} total={totalSteps} />

      {/* ── Step 1: Role ── */}
      {step === 1 && (
        <>
          <h2 className="auth-heading">Qual é o seu perfil?</h2>
          <p className="auth-sub">Escolha como você vai usar a Launchy.</p>
          <div className="auth-role-grid">
            <div className={`auth-role-card${role === 'client' ? ' selected' : ''}`}
              onClick={() => setRole('client')} role="button" tabIndex={0}
              onKeyDown={ev => ev.key === 'Enter' && setRole('client')}>
              <span className="auth-role-icon">🏢</span>
              <p className="auth-role-title">Sou empreendedor</p>
              <p className="auth-role-desc">Abri ou vou abrir meu CNPJ e quero organizar meus fornecedores e obrigações.</p>
              <div className="auth-role-check" />
            </div>
            <div className={`auth-role-card${role === 'provider' ? ' selected' : ''}`}
              onClick={() => setRole('provider')} role="button" tabIndex={0}
              onKeyDown={ev => ev.key === 'Enter' && setRole('provider')}>
              <span className="auth-role-icon">🛠</span>
              <p className="auth-role-title">Sou prestador</p>
              <p className="auth-role-desc">Ofereço serviços para empresas (contabilidade, design, banco, jurídico etc.).</p>
              <div className="auth-role-check" />
            </div>
          </div>
          <button className="auth-btn-primary" disabled={!role} onClick={next}>Continuar →</button>
        </>
      )}

      {/* ── Step 2: Dados básicos ── */}
      {step === 2 && (
        <>
          <h2 className="auth-heading">
            {role === 'provider' ? 'Dados da sua empresa' : 'Seus dados'}
          </h2>
          <p className="auth-sub">
            {role === 'provider' ? 'Crie seu perfil de prestador.' : 'Crie sua conta de empreendedor.'}
          </p>
          <form className="auth-form" onSubmit={e => { e.preventDefault(); next() }} noValidate>
            {role === 'provider' ? (
              <>
                <div className="auth-row">
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="r-name">Nome completo</label>
                    <input id="r-name" className={`auth-input${errors.name ? ' error' : ''}`}
                      value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ana Lima" />
                    {errors.name && <span className="auth-error-msg">{errors.name}</span>}
                  </div>
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="r-empresa">Nome da empresa</label>
                    <input id="r-empresa" className={`auth-input${errors.empresa ? ' error' : ''}`}
                      value={form.empresa} onChange={e => set('empresa', e.target.value)} placeholder="Studio Visual" />
                    {errors.empresa && <span className="auth-error-msg">{errors.empresa}</span>}
                  </div>
                </div>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="r-cat">Categoria de serviço</label>
                  <select id="r-cat" className={`auth-input auth-select${errors.cat ? ' error' : ''}`}
                    value={form.cat} onChange={e => set('cat', e.target.value)}>
                    <option value="">Selecione…</option>
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.cat && <span className="auth-error-msg">{errors.cat}</span>}
                </div>
                <div className="auth-row">
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="r-email">E-mail</label>
                    <input id="r-email" type="email" className={`auth-input${errors.email ? ' error' : ''}`}
                      value={form.email} onChange={e => set('email', e.target.value)} placeholder="ana@studio.com.br" />
                    {errors.email && <span className="auth-error-msg">{errors.email}</span>}
                  </div>
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="r-cnpj">CNPJ</label>
                    <input id="r-cnpj" className="auth-input"
                      value={form.cnpj} onChange={e => set('cnpj', e.target.value)} placeholder="00.000.000/0001-00" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="auth-row">
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="r-name">Nome completo</label>
                    <input id="r-name" className={`auth-input${errors.name ? ' error' : ''}`}
                      value={form.name} onChange={e => set('name', e.target.value)} placeholder="João Silva" />
                    {errors.name && <span className="auth-error-msg">{errors.name}</span>}
                  </div>
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="r-phone">Telefone</label>
                    <input id="r-phone" className="auth-input"
                      value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(11) 99999-9999" />
                  </div>
                </div>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="r-email">E-mail</label>
                  <input id="r-email" type="email" className={`auth-input${errors.email ? ' error' : ''}`}
                    value={form.email} onChange={e => set('email', e.target.value)} placeholder="joao@empresa.com.br" />
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
                {role === 'provider'
                  ? (loading ? 'Criando conta…' : 'Criar conta')
                  : 'Continuar →'}
              </button>
            </div>
          </form>
        </>
      )}

      {/* ── Step 3 (cliente): Perfil da empresa ── */}
      {step === 3 && role === 'client' && (
        <>
          <h2 className="auth-heading">Sua empresa</h2>
          <p className="auth-sub">Nos conte um pouco sobre o seu negócio.</p>
          <div className="auth-form">
            <div className="auth-field">
              <label className="auth-label">Segmento</label>
              <SelectPill options={SEGMENTOS} value={form.segmento} onChange={v => set('segmento', v)} />
            </div>
            <div className="auth-row">
              <div className="auth-field">
                <label className="auth-label" htmlFor="s-estado">Estado</label>
                <select id="s-estado" className="auth-input auth-select"
                  value={form.estado} onChange={e => set('estado', e.target.value)}>
                  <option value="">Selecione…</option>
                  {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="auth-field">
                <label className="auth-label" htmlFor="s-tempo">Tempo de empresa</label>
                <select id="s-tempo" className="auth-input auth-select"
                  value={form.tempo} onChange={e => set('tempo', e.target.value)}>
                  <option value="">Selecione…</option>
                  {TEMPO.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="auth-field">
              <label className="auth-label">Regime fiscal atual</label>
              <SelectPill options={REGIMES} value={form.regime} onChange={v => set('regime', v)} />
            </div>
            <div className="auth-row">
              <div className="auth-field">
                <label className="auth-label">Funcionários</label>
                <select className="auth-input auth-select"
                  value={form.funcionarios} onChange={e => set('funcionarios', e.target.value)}>
                  <option value="">Selecione…</option>
                  {FUNCIONARIOS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="auth-field">
                <label className="auth-label">Faturamento médio/mês</label>
                <select className="auth-input auth-select"
                  value={form.faturamento} onChange={e => set('faturamento', e.target.value)}>
                  <option value="">Selecione…</option>
                  {FATURAMENTO.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div className="auth-actions-row">
              <button type="button" className="auth-btn-back" onClick={() => setStep(2)}>← Voltar</button>
              <button type="button" className="auth-btn-primary" onClick={() => setStep(4)}>Continuar →</button>
            </div>
          </div>
        </>
      )}

      {/* ── Step 4 (cliente): Maiores dores ── */}
      {step === 4 && role === 'client' && (
        <>
          <h2 className="auth-heading">Suas maiores dores</h2>
          <p className="auth-sub">Selecione tudo que é desafio hoje. Usamos isso para te recomendar os melhores prestadores.</p>
          <div className="auth-form">
            <div className="auth-field">
              <SelectPill options={DORES} value={form.dores} onChange={v => set('dores', v)} multi />
            </div>
            <div className="auth-actions-row">
              <button type="button" className="auth-btn-back" onClick={() => setStep(3)}>← Voltar</button>
              <button
                type="button"
                className="auth-btn-primary"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? 'Criando conta…' : 'Criar minha conta →'}
              </button>
            </div>
            <button type="button" className="auth-link" style={{ textAlign: 'center', marginTop: 4, fontSize: 12 }}
              onClick={() => { set('dores', []); handleSubmit() }}>
              Pular esta etapa
            </button>
          </div>
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

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!form.email.includes('@')) { setErrors({ email: 'E-mail inválido.' }); return }
    if (form.password.length < 4)  { setErrors({ password: 'Informe sua senha.' }); return }
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email, password: form.password,
    })
    if (error) {
      setLoading(false)
      setErrors({ password: 'E-mail ou senha incorretos.' })
      return
    }
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', data.user.id).single()
    setLoading(false)
    redirectByRole(profile?.role || 'client')
  }

  return (
    <>
      <h2 className="auth-heading">Bem-vindo de volta</h2>
      <p className="auth-sub">Entre na sua conta Launchy.</p>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label className="auth-label" htmlFor="l-email">E-mail</label>
          <input id="l-email" type="email"
            className={`auth-input${errors.email ? ' error' : ''}`}
            value={form.email} onChange={e => set('email', e.target.value)}
            placeholder="seu@email.com.br" autoComplete="email" />
          {errors.email && <span className="auth-error-msg">{errors.email}</span>}
        </div>
        <div className="auth-field">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="auth-label" htmlFor="l-pw">Senha</label>
            <button type="button" className="auth-link" style={{ fontSize: 12 }}>Esqueci a senha</button>
          </div>
          <PasswordInput id="l-pw" value={form.password}
            onChange={e => set('password', e.target.value)} placeholder="Sua senha" />
          {errors.password && <span className="auth-error-msg">{errors.password}</span>}
        </div>
        <button type="submit" className="auth-btn-primary" style={{ marginTop: 4 }} disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
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

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', session.user.id).single()
      if (profile?.role) redirectByRole(profile.role)
    })
  }, [])

  return (
    <div className="auth-bg">
      <button className="auth-dark-btn" onClick={() => setDark(d => !d)}
        title={dark ? 'Modo claro' : 'Modo escuro'}>
        {dark ? '☀' : '☾'}
      </button>
      <div className={`auth-card${mode === 'register' ? ' auth-card--wide' : ''}`}>
        <div className="auth-logo">
          <span className="auth-logo-dot">◆</span> Launchy
        </div>
        <div className="auth-tabs">
          <button className={`auth-tab${mode === 'login' ? ' active' : ''}`} onClick={() => setMode('login')}>Entrar</button>
          <button className={`auth-tab${mode === 'register' ? ' active' : ''}`} onClick={() => setMode('register')}>Criar conta</button>
        </div>
        {mode === 'login'
          ? <LoginView onSwitchToRegister={() => setMode('register')} />
          : <RegisterView onSwitchToLogin={() => setMode('login')} />
        }
      </div>
    </div>
  )
}
