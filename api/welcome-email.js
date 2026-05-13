// api/welcome-email.js
// Vercel Serverless Function — disparada pelo Supabase Webhook quando um lead é inserido.

export const config = { runtime: 'edge' };

const FROM = 'Launchy <ola@launchy.sbs>';

function buildHtml(nome, email) {
  const firstName = nome.split(' ')[0];
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f6f6f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6f3;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e8e8e4;">

        <!-- Header verde -->
        <tr>
          <td style="background:#052b15;padding:28px 36px;">
            <span style="font-size:20px;font-weight:700;color:#14d36b;letter-spacing:-0.03em;">Launchy</span>
          </td>
        </tr>

        <!-- Corpo -->
        <tr>
          <td style="padding:36px 36px 28px;">
            <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;letter-spacing:-0.03em;color:#111;">
              Pronto, ${firstName}. Sua vaga de fundador está reservada.
            </h1>
            <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.65;">
              Em breve nossa equipe vai entrar em contato com os próximos passos.
              Fique de olho na caixa de entrada — e no spam, só por garantia.
            </p>

            <!-- Benefícios -->
            <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;width:100%;">
              ${[
                'Mensalidade de fundador travada',
                'Voz ativa nas próximas funcionalidades',
                'Acesso antecipado a novos prestadores',
              ].map(b => `
              <tr>
                <td style="padding:6px 0;">
                  <span style="display:inline-flex;align-items:center;gap:10px;font-size:14px;color:#333;">
                    <span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:#d4f7e5;color:#052b15;font-size:11px;font-weight:700;text-align:center;line-height:20px;">★</span>
                    ${b}
                  </span>
                </td>
              </tr>`).join('')}
            </table>

            <!-- CTA -->
            <a href="https://launchy-site.vercel.app/auth.html"
               style="display:inline-block;background:#14d36b;color:#052b15;font-weight:600;font-size:15px;text-decoration:none;padding:14px 28px;border-radius:10px;">
              Criar minha conta agora →
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 36px 28px;border-top:1px solid #f0f0ec;">
            <p style="margin:0;font-size:12px;color:#999;line-height:1.6;">
              Você recebeu esse email porque se cadastrou como fundador na Launchy com o endereço <strong>${email}</strong>.
              Se foi engano, pode ignorar com segurança.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  // Supabase webhook payload: { type, table, schema, record, old_record }
  const lead = payload?.record;
  if (!lead?.email) {
    return new Response('No email in payload', { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return new Response('RESEND_API_KEY not set', { status: 500 });
  }

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: lead.email,
      subject: `${lead.nome.split(' ')[0]}, sua vaga de fundador está reservada`,
      html: buildHtml(lead.nome, lead.email),
    }),
  });

  if (!emailRes.ok) {
    const err = await emailRes.text();
    console.error('Resend error:', err);
    return new Response(err, { status: 500 });
  }

  return new Response('ok', { status: 200 });
}
