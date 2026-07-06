# Deploy Vercel + Zoho

## 1. Variaveis de ambiente na Vercel

Configure em Project Settings > Environment Variables:

- `ZOHO_SMTP_HOST`: `smtp.zoho.com`
- `ZOHO_SMTP_PORT`: `465`
- `ZOHO_SMTP_USER`: e-mail Zoho que vai enviar, por exemplo `no-reply@arcambe.com`
- `ZOHO_SMTP_PASS`: senha de app do Zoho, nao a senha normal se 2FA estiver activo
- `MAIL_FROM`: `no-reply@arcambe.com`
- `SALES_TO`: e-mail que recebe pedidos, por exemplo `info@arcambe.com`

## 2. Dominio

No Vercel, adicione `arcambe.com` e `www.arcambe.com`.
Depois actualize o DNS no provedor do dominio conforme os registos indicados pela Vercel.

## 3. Indexacao Google e Bing

Depois do deploy:

- Google Search Console: adicionar `https://arcambe.com`
- Bing Webmaster Tools: adicionar `https://arcambe.com`
- Submeter `https://arcambe.com/sitemap.xml`

## 4. Teste obrigatorio

Enviar um pedido em `/orcamento.html` e confirmar:

- e-mail chega em `SALES_TO`
- cliente recebe auto-resposta a partir de `MAIL_FROM`
- newsletter envia confirmacao ao subscritor
