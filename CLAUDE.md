# Launchy — contexto pro Claude Code

> Este arquivo é lido automaticamente pelo Claude Code em toda conversa neste repositório. Mantenha curto e atualizado.

## O que é o projeto

Landing page da **Launchy** — uma plataforma que centraliza todos os serviços que um pequeno empreendedor brasileiro precisa (contabilidade, banco PJ, design, divulgação, jurídico, etc.) com um checklist guiado passo a passo. Modelo SaaS com mensalidade.

**Público-alvo:** quem está abrindo o primeiro CNPJ, MEIs, e Simples Nacional que ainda gerenciam fornecedores de forma desorganizada.

**Tom da copy:** direto, brasileiro caloroso, sem clichê de fintech, sem "agora ficou fácil empreender". A real do empreendedor.

## Estado atual

Protótipo de landing page com **React 18 + Babel rodando no navegador via CDN** — sem build, sem npm. Bom pra iterar visualmente, ruim pra produção.

**Próximo grande passo recomendado:** migrar pra Vite + React (mesma estrutura de pastas) antes de adicionar backend, autenticação, etc.

## Estrutura

```
launchy-site/
├── index.html            ← standalone (CSS + JSX inline, abre com duplo-clique)
├── styles.css            ← tokens, tema claro/escuro, densidade, animações
├── app.jsx               ← Nav, Footer, montagem do app, TWEAK_DEFAULTS
├── tweaks-panel.jsx      ← painel de tweaks (modo escuro / densidade)
└── parts/
    ├── mockup.jsx        ← ChecklistMockup (animado, auto-avança)
    ├── sections.jsx      ← Hero, Pain, Solution, Benefits, Providers (carrossel)
    ├── sections2.jsx     ← SocialProof, Offer, Objections, Guarantee, Urgency, FAQ, FinalCTA
    └── form.jsx          ← FounderForm (validação BR, máscara de telefone, LGPD)
```

Os arquivos `.jsx` separados são a **fonte editável**. O `index.html` standalone é gerado a partir deles concatenando tudo inline. Ao migrar pra Vite, cada `.jsx` vira um módulo de verdade com `import/export`.

## Sistema de design

- **Cor:** branco/preto + verde vivo `#14d36b` como único acento. Modo escuro com verde-petróleo escuro.
- **Tipografia:** Geist (sans) + Geist Mono (números, eyebrows, tags).
- **Tokens:** variáveis CSS no `:root` de `styles.css`. Temas via `[data-theme="dark"]` e `[data-density="compact"]` no `<html>`.
- **Sem gradientes ornamentais**, sem emojis decorativos fora do que já existe.

## Tweaks expostos

- `dark` (bool) — claro/escuro
- `density` (string) — `"compact"` ou `"regular"`

Definidos em `TWEAK_DEFAULTS` no topo do `app.jsx`.

## Pendências (substituir antes de publicar)

- [ ] Depoimentos placeholder em `SocialProof` (`parts/sections2.jsx`) — usar reais
- [ ] Valor da mensalidade em `Offer` — hoje está `R$ —`
- [ ] Número/prazo real de vagas no medidor de urgência
- [ ] Política de Privacidade + Termos de Uso (links no footer e no form)
- [ ] Endpoint real pro `FounderForm` — hoje só valida e mostra sucesso fake
- [ ] Favicon + meta Open Graph
- [ ] Analytics

## Como rodar hoje

Abrir `index.html` no navegador (duplo-clique funciona). Pra desenvolvimento, servir com:

```bash
npx serve .
# ou
python3 -m http.server
```

## Convenções

- Português BR em toda copy
- Componentes em PascalCase, funções helpers em camelCase
- Cores e espaçamentos sempre via variáveis CSS, nunca hex hardcoded em componente
- Texto novo sempre passa pelo crivo: "isso é filler ou tem peso?"
