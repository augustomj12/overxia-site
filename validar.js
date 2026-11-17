#!/usr/bin/env node
/* Validador do site da Overxia.
   Confere se cada projeto está no padrão antes de publicar. O Cloudflare Pages roda este
   arquivo a cada publicação: se ele achar um erro, a publicação para e o site no ar continua
   na versão anterior (nada quebrado chega ao ar).

   Uso, na pasta do site:
     node validar.js              confere e explica o que corrigir
     node validar.js --corrigir   também acerta sozinho as contagens (lote, quantidade de
                                  projetos, rodapé e a lista de projetos para o Google)

   Sem dependências: só Node. */
'use strict';
const fs = require('fs');
const path = require('path');

const RAIZ = __dirname;
const CORRIGIR = process.argv.includes('--corrigir');
const ARQ = path.join(RAIZ, 'index.html');
let html = fs.readFileSync(ARQ, 'utf8');

const erros = [], avisos = [], ok = [], faltando = new Set();
const erro = (onde, msg) => erros.push(`${onde}: ${msg}`);
const aviso = (onde, msg) => avisos.push(`${onde}: ${msg}`);
const texto = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const dois = n => String(n).padStart(2, '0');

/* ---------- tamanho de imagem (JPG, PNG, WebP), sem bibliotecas ---------- */
function medida(arq) {
  const b = fs.readFileSync(arq);
  if (b[0] === 0x89 && b[1] === 0x50) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b[0] === 0xFF && b[1] === 0xD8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xFF) { i++; continue; }
      const m = b[i + 1], l = b.readUInt16BE(i + 2);
      if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
      i += 2 + l;
    }
  }
  if (b.slice(0, 4).toString() === 'RIFF' && b.slice(8, 12).toString() === 'WEBP') {
    const t = b.slice(12, 16).toString();
    if (t === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
    if (t === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    if (t === 'VP8L') { const v = b.readUInt32LE(21); return { w: (v & 0x3fff) + 1, h: ((v >> 14) & 0x3fff) + 1 }; }
  }
  return null;
}
function confereImagem(onde, src, alt, w, h) {
  if (!src) return erro(onde, 'imagem sem src');
  const arq = path.join(RAIZ, src);
  if (!fs.existsSync(arq)) {
    faltando.add(src);
    return erro(onde, `o arquivo ${src} não existe (confira o nome e a pasta midia/projetos/)`);
  }
  if (!alt || !alt.trim()) erro(onde, `${src} está sem alt (descreva a tela, ex.: "Página inicial da Clínica Aurora")`);
  const m = medida(arq);
  if (!m) aviso(onde, `não consegui ler o tamanho de ${src} (use JPG)`);
  else if (m.w !== w || m.h !== h) erro(onde, `${src} tem ${m.w} × ${m.h}; precisa ter exatamente ${w} × ${h}`);
  const kb = fs.statSync(arq).size / 1024;
  if (kb > 600) erro(onde, `${src} pesa ${kb.toFixed(0)} KB; o limite é 600 KB (comprima no squoosh.app, JPG 80%)`);
  else if (kb > 300) aviso(onde, `${src} pesa ${kb.toFixed(0)} KB; o ideal é até ~200 KB`);
}

/* ---------- os projetos ---------- */
const reCaso = /<article class="caso caso-(\d+)( invertido)?" id="([^"]+)">([\s\S]*?)\n\s*<\/article>/g;
const casos = [];
let m;
while ((m = reCaso.exec(html))) casos.push({ n: +m[1], invertido: !!m[2], id: m[3], corpo: m[4] });
const soltos = (html.match(/<article class="caso[ "]/g) || []).length;
if (soltos !== casos.length) erro('Projetos', `achei ${soltos} blocos <article class="caso…"> mas só ${casos.length} no formato certo: <article class="caso caso-N" id="projeto-nome"> (com " invertido" nos pares)`);
if (!casos.length) erro('Projetos', 'nenhum projeto encontrado');

const ids = new Set();
casos.forEach((c, i) => {
  const ordem = i + 1;
  const onde = `Projeto ${ordem} (${c.id})`;
  const nome = texto((c.corpo.match(/<h3>([\s\S]*?)<\/h3>/) || [])[1] || '');
  c.nome = nome;

  if (c.n !== ordem) erro(onde, `a classe é caso-${c.n}; pela ordem na página, precisa ser caso-${ordem}`);
  if (c.invertido !== (ordem % 2 === 0)) erro(onde, ordem % 2 === 0 ? 'projeto par: a classe precisa ter " invertido" (o navegador vai para a direita)' : 'projeto ímpar: tire o " invertido" da classe');
  if (!/^projeto-[a-z0-9]+(-[a-z0-9]+)*$/.test(c.id)) erro(onde, `id "${c.id}" fora do padrão: projeto-nome-em-minusculas-sem-acento`);
  if (ids.has(c.id)) erro(onde, `id "${c.id}" repetido`);
  ids.add(c.id);
  if (!nome) erro(onde, 'falta o nome do projeto no <h3>');

  // barra do navegador e link
  const dominio = texto((c.corpo.match(/<span class="url">[\s\S]*?<b>([^<]+)<\/b>/) || [])[1] || '');
  const link = c.corpo.match(/<a class="link" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
  if (!dominio) erro(onde, 'falta o domínio na barra do navegador (<span class="url">…<b>dominio.com.br</b>)');
  if (!link) erro(onde, 'falta o link "Visitar …" (<a class="link" …>)');
  else {
    if (!/^https:\/\//.test(link[1])) erro(onde, `o link "${link[1]}" precisa começar com https://`);
    if (dominio && !link[1].includes(dominio)) erro(onde, `a barra mostra ${dominio}, mas o link vai para ${link[1]}`);
    if (dominio && !texto(link[2]).toLowerCase().includes(dominio.toLowerCase())) aviso(onde, `o texto do link não cita ${dominio}`);
  }

  // telas do navegador
  const faixa = c.corpo.match(/<div class="faixa" data-rotulos="([^"]*)">([\s\S]*?)<\/div>/);
  if (!faixa) erro(onde, 'falta a faixa de telas (<div class="faixa" data-rotulos="…">)');
  else {
    const rotulos = faixa[1].split('|').map(s => s.trim()).filter(Boolean);
    const imgs = [...faixa[2].matchAll(/<img\b([^>]*)>/g)].map(x => ({ src: (x[1].match(/src="([^"]+)"/) || [])[1], alt: (x[1].match(/alt="([^"]*)"/) || [])[1] }));
    if (imgs.length < 3 || imgs.length > 6) erro(onde, `${imgs.length} telas na faixa; use de 3 a 6 (o padrão é 4)`);
    if (rotulos.length !== imgs.length) erro(onde, `${imgs.length} telas, mas ${rotulos.length} nomes em data-rotulos (um nome por tela, separados por |)`);
    imgs.forEach(im => confereImagem(onde, im.src, im.alt, 1440, 900));
    const barras = ((c.corpo.match(/<div class="telas"[^>]*>([\s\S]*?)<\/div>/) || [])[1] || '').match(/<span>/g) || [];
    if (barras.length !== imgs.length) erro(onde, `${imgs.length} telas, mas ${barras.length} barrinhas em <div class="telas"> (uma <span><i></i></span> por tela)`);
  }
  const cel = c.corpo.match(/<div class="celular"><img\b([^>]*)>/);
  if (!cel) erro(onde, 'falta a imagem do celular (<div class="celular"><img …>)');
  else confereImagem(onde, (cel[1].match(/src="([^"]+)"/) || [])[1], (cel[1].match(/alt="([^"]*)"/) || [])[1], 780, 1688);

  // ficha
  const lote = (c.corpo.match(/<p class="meta"><span>Lote (\d+)<\/span>/) || [])[1];
  if (!lote) erro(onde, 'falta "Lote NN" na primeira linha da ficha (<p class="meta"><span>Lote 03</span>…)');
  else if (lote !== dois(ordem)) erro(onde, `está como Lote ${lote}; pela ordem, é Lote ${dois(ordem)}`);
  const desc = texto((c.corpo.match(/<p class="desc">([\s\S]*?)<\/p>/) || [])[1] || '');
  if (!desc) erro(onde, 'falta a descrição (<p class="desc">)');
  else if (desc.length > 200) aviso(onde, `descrição com ${desc.length} caracteres; o ideal é até ~140`);
  const itens = (((c.corpo.match(/<ul class="itens">([\s\S]*?)<\/ul>/) || [])[1]) || '').match(/<li>/g) || [];
  if (itens.length < 2 || itens.length > 4) erro(onde, `${itens.length} itens em "o que foi construído"; use de 2 a 4`);
  const tec = ((c.corpo.match(/<dl class="tecnologias">([\s\S]*?)<\/dl>/) || [])[1]) || '';
  const tecs = [...tec.matchAll(/<dd>([\s\S]*?)<\/dd>/g)];
  if (!tecs.length) erro(onde, 'falta a lista de tecnologias (<dl class="tecnologias">…<dd><b>Nome</b>explicação</dd>)');
  tecs.forEach(t => { if (!/^<b>[^<]+<\/b>\S/.test(t[1].trim())) erro(onde, `tecnologia fora do formato <dd><b>Nome</b>Uma linha de explicação.</dd>: "${texto(t[1]).slice(0, 40)}"`); });
  if (!/<div class="autoria"><dt>Quem fez<\/dt>/.test(c.corpo)) erro(onde, 'falta o "Quem fez" na ficha (<div class="autoria"><dt>Quem fez</dt><dd>…</dd></div>)');
});

/* ---------- textos que dependem da quantidade de projetos ---------- */
const k = casos.length;
const extenso = ['Nenhum', 'Um', 'Dois', 'Três', 'Quatro', 'Cinco', 'Seis', 'Sete', 'Oito', 'Nove', 'Dez', 'Onze', 'Doze'][k] || String(k);
const frase = k === 1 ? 'Um endereço no ar.' : `${extenso} endereços no ar.`;
const nomes = casos.map(c => c.nome).filter(Boolean);
const lista = nomes.length > 1 ? nomes.slice(0, -1).join(', ') + ' e ' + nomes[nomes.length - 1] : (nomes[0] || '');
const regras = [
  { nome: 'Frase dos projetos', re: /(<div class="capitulo" id="projetos">[\s\S]*?<p class="lead">)([^<.]*? (?:endereço|endereços) no ar\.)()/, certo: frase },
  { nome: 'Cartão "O próximo lote"', re: /(<span class="guia-mini">Lote )(\d+)( · destino)/, certo: dois(k + 1) },
  { nome: 'Rodapé', re: /(Linha funcionando · )(\d+)( no ar)/, certo: String(k) },
  { nome: 'Descrição para o Google', re: /(<meta name="description" content="[^"]*Projetos no ar: )([^"]*?)(\.")/, certo: lista },
];
regras.forEach(r => {
  const achou = html.match(r.re);
  if (!achou) return erro(r.nome, 'não encontrei o trecho no index.html (ele foi apagado ou mudou de formato?)');
  const atual = achou[2];
  if (atual === r.certo) return;
  if (CORRIGIR) {
    html = html.replace(r.re, (_, a, __, c) => a + r.certo + c);
    ok.push(`${r.nome}: corrigido de "${atual}" para "${r.certo}"`);
  } else erro(r.nome, `está "${atual}"; com ${k} projeto(s) precisa ser "${r.certo}" (rode: node validar.js --corrigir)`);
});

/* ---------- arquivos locais referenciados ---------- */
for (const [, ref] of html.matchAll(/(?:src|href|data-video)="([^"#:]+?)"/g)) {
  if (/^(https?:|mailto:|tel:|data:)/.test(ref) || ref.startsWith('#') || faltando.has(ref)) continue;
  if (!fs.existsSync(path.join(RAIZ, ref))) erro('Arquivos', `o index.html usa "${ref}", mas esse arquivo não existe`);
}

/* ---------- resultado ---------- */
if (CORRIGIR && ok.length) fs.writeFileSync(ARQ, html);
console.log(`\nValidador da Overxia · ${k} projeto(s): ${casos.map(c => c.nome || c.id).join(', ')}\n`);
ok.forEach(s => console.log('  ✓ ' + s));
avisos.forEach(s => console.log('  ! ' + s));
erros.forEach(s => console.log('  ✗ ' + s));
if (erros.length) {
  console.log(`\n${erros.length} erro(s). Corrija antes de publicar. Nada foi publicado.\n`);
  process.exit(1);
}
console.log(`\nTudo certo${avisos.length ? ` (${avisos.length} aviso(s), não impedem a publicação)` : ''}. Pode publicar.\n`);
