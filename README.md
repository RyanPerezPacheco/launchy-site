# Launchy — Landing Page

Landing page completa da Launchy. Roda direto no navegador, sem build.

## Como usar

Abra `index.html` em qualquer navegador moderno. Pronto.

> Se você abrir como `file://` e algum JSX não carregar, sirva a pasta com um servidor estático simples, ex.:
>
> `npx serve .` ou `python3 -m http.server`

## Estrutura

```
launchy-site/
├── index.html            ← entrada da página
├── styles.css            ← tokens de design, tema claro/escuro, layout, animações
├── app.jsx               ← componente raiz, Nav, Footer, montagem do React
├── tweaks-panel.jsx      ← painel de tweaks (modo escuro / densidade)
└── parts/
    ├── mockup.jsx        ← dashboard/checklist animado do hero
    ├── sections.jsx      ← Hero, Dor, Solução, Benefícios, Prestadores (carrossel)
    ├── sections2.jsx     ← Prova social, Oferta, Objeções, Garantia, Urgência, FAQ, CTA final
    └── form.jsx          ← formulário de cadastro de fundador (com validação)
```

## Stack

- **HTML** estático
- **CSS** puro (custom properties, oklch, color-mix, grid)
- **React 18** via CDN com **Babel Standalone** transpilando JSX no browser

Sem dependências de build — qualquer ajuste é só editar o arquivo e recarregar.

## Personalização rápida

- **Cores / tipografia / densidade**: variáveis CSS no topo de `styles.css` (`:root`, `[data-theme="dark"]`, `[data-density="compact"]`).
- **Copy**: textos vivem dentro dos `.jsx` em `parts/`.
- **Tweaks padrão**: bloco `TWEAK_DEFAULTS` em `app.jsx`.

## Pendências (substituir antes de publicar)

- Depoimentos placeholder em `parts/sections2.jsx` (`SocialProof`)
- Valor real da mensalidade em `Offer` (`parts/sections2.jsx`)
- Número/prazo real de vagas no medidor de urgência
- Links de Política de Privacidade / Termos de Uso no footer e no form
