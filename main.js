/* Overxia · v3 "Saiu desta linha"
   1. A fábrica em operação (vídeo L0 em loop sem pulo) na abertura, uma seção comum.
   2. Projetos: quando cada um chega, a tela do navegador desce até o lugar (por tempo).
      No computador o projeto fica preso enquanto as telas do site passam; no celular
      as telas rolam enquanto o navegador passa pela tela.
   Movimento reduzido: tudo parado e legível. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));

  /* ---------- A fábrica nunca para ----------
     Dois <video> se revezam: perto do fim, o outro começa do zero e os dois trocam de
     opacidade em 0,6 s (o fim e o começo do vídeo não são iguais). */
  function loopSuave(caixa) {
    const novo = () => {
      const v = document.createElement('video');
      v.muted = true; v.playsInline = true; v.preload = 'none';
      v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
      v.src = caixa.dataset.video;
      caixa.appendChild(v);
      return v;
    };
    const vs = [novo(), novo()];
    vs[1].style.opacity = 0;
    const tocar = v => { const p = v.play(); if (p) p.catch(() => {}); };
    // toca só se estiver na tela e não estiver 'segurado' (apagado atrás de outro conteúdo)
    let ativo = 0, trocando = false, ligado = false, visivel = false, segurado = false, carregado = false;
    const aplica = () => {
      const on = visivel && !segurado;
      if (on === ligado) return;
      ligado = on;
      if (on) tocar(vs[ativo]); else vs.forEach(v => v.pause());
    };
    return {
      caixa,
      // só baixa o vídeo quando ele chega perto da tela (o do rodapé não pesa na abertura)
      liga(on) { if (on && !carregado) { carregado = true; vs.forEach(v => { v.preload = 'auto'; v.load(); }); } visivel = on; aplica(); },
      segura(on) { segurado = on; aplica(); },
      tick() {
        if (!ligado || trocando) return;
        const a = vs[ativo], b = vs[1 - ativo];
        if (!a.duration || a.currentTime < a.duration - .65) return;
        trocando = true;
        b.currentTime = 0; tocar(b);
        b.style.opacity = 1; a.style.opacity = 0;
        setTimeout(() => { a.pause(); ativo = 1 - ativo; trocando = false; }, 700);
      },
    };
  }
  const filmes = RM ? [] : $$('[data-video]').map(caixa => {
    const f = loopSuave(caixa);
    new IntersectionObserver(es => es.forEach(e => f.liga(e.isIntersecting)), { rootMargin: '120px' }).observe(caixa);
    return f;
  });

  /* ---------- Nome do negócio vai até a ordem de produção ---------- */
  const campoNegocio = $('#negocio'), campoOrdem = $('#ordem-negocio');
  const dominio = nome => {
    const s = nome.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 24);
    return (s || 'seunegocio') + '.com.br';
  };
  function setCliente(nome, origem) {
    $$('[data-cliente-dominio]').forEach(e => { e.textContent = dominio(nome.trim()); });
    if (origem !== campoNegocio) campoNegocio.value = nome;
    if (origem !== campoOrdem) campoOrdem.value = nome;
  }
  campoNegocio.addEventListener('input', () => setCliente(campoNegocio.value, campoNegocio));
  campoOrdem.addEventListener('input', () => setCliente(campoOrdem.value, campoOrdem));

  const ordem = $('#ordem'), aviso = $('#ordem-aviso');
  ordem.addEventListener('submit', e => {
    e.preventDefault();
    const falta = $$('[required]', ordem).find(c => !c.value.trim());
    if (falta) { aviso.textContent = 'Preencha seu nome e um contato.'; falta.focus(); return; }
    aviso.textContent = 'Protótipo: o envio será ligado na versão final.';
  });

  const hora = () => $$('[data-hora]').forEach(e => {
    e.textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  });
  hora(); setInterval(hora, 30000);

  const topo = $('.topo');
  const solida = () => topo.classList.toggle('solida', window.scrollY > 40);
  addEventListener('scroll', solida, { passive: true }); solida();

  /* Entrada das seções comuns */
  const entra = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visto'); entra.unobserve(e.target); }
  }), { rootMargin: '0px 0px -10% 0px' });
  $$('.servicos .cabeca > :not(h2), .frente, .quem-texto > :not(h2), .socios, .contato-texto > :not(h2), .proximo, .capitulo .rotulo, .capitulo .lead').forEach(e => { e.classList.add('ver'); entra.observe(e); });

  /* ---------- Transições (código próprio, leve; tudo por tempo, uma vez) ---------- */
  if (!RM) {
    // títulos: cada palavra vira uma fresta de onde ela sobe
    let ordemPalavra = 0;
    const quebra = no => [...no.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'), d = document.createElement('span');
          w.className = 'p'; d.className = 'pi'; d.textContent = p; d.style.setProperty('--i', ordemPalavra++);
          w.appendChild(d); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') quebra(n);
    });
    $$('[data-palavras]').forEach(t => { ordemPalavra = 0; quebra(t); });

    // letreiro: uma letra por vez
    const letreiro = $('.letreiro');
    let k = 0;
    const letras = no => [...no.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        [...n.textContent].forEach(ch => { const s = document.createElement('span'); s.className = 'l'; s.textContent = ch; s.style.setProperty('--i', k++); frag.appendChild(s); });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) letras(n);
    });
    letras(letreiro);

    // botões: o texto rola no hover
    $$('.btn').forEach(b => {
      const t = [...b.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
      if (!t) return;
      const txt = t.textContent.trim();
      const r = document.createElement('span');
      r.className = 'rolo';
      r.innerHTML = '<span></span><span aria-hidden="true"></span>';
      r.children[0].textContent = txt; r.children[1].textContent = txt;
      t.replaceWith(r, document.createTextNode(' '));
    });

    // seções claras abrem como um cartão
    $$('.servicos, .contato').forEach(s => s.classList.add('cortina'));

    // quando cada coisa chega na tela
    const chega = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add(e.target.classList.contains('cortina') ? 'aberta' : 'vista');
      chega.unobserve(e.target);
    }), { rootMargin: '0px 0px -12% 0px' });
    $$('[data-palavras]:not(h1), .cortina, .letreiro').forEach(e => chega.observe(e));
    requestAnimationFrame(() => setTimeout(() => $('h1[data-palavras]').classList.add('vista'), 200));

    // barra de progresso da leitura
    const barra = $('.progresso');
    let pedidoBarra = false;
    const mede = () => { pedidoBarra = false; const max = document.documentElement.scrollHeight - innerHeight; barra.style.transform = 'scaleX(' + (max > 0 ? (scrollY / max).toFixed(4) : 0) + ')'; };
    addEventListener('scroll', () => { if (!pedidoBarra) { pedidoBarra = true; requestAnimationFrame(mede); } }, { passive: true });
    mede();
  }

  /* Sem GSAP ou com movimento reduzido: a página já está completa */
  const rolarNativo = alvo => window.scrollTo({ top: alvo ? alvo.getBoundingClientRect().top + scrollY - 64 : 0, behavior: RM ? 'auto' : 'smooth' });
  if (RM || !window.gsap || !window.ScrollTrigger) {
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const alvo = document.getElementById(a.getAttribute('href').slice(1));
      if (!alvo) return; e.preventDefault(); rolarNativo(alvo.id === 'topo' ? null : alvo);
    }));
    $('#pedido').addEventListener('submit', e => { e.preventDefault(); rolarNativo($('#projetos')); });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.add(() => filmes.forEach(f => f.tick()));

  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: .1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const rolarPara = y => lenis ? lenis.scrollTo(y, { duration: 1.6 }) : window.scrollTo({ top: y, behavior: 'smooth' });

  /* ---------- Telas de um projeto: a faixa sobe uma tela por vez ---------- */
  function telas(caso) {
    const faixa = $('.faixa', caso), n = faixa.children.length;
    const rotulos = faixa.dataset.rotulos.split('|');
    const caminho = $('[data-caminho]', caso), barras = $$('.telas i', caso);
    let ultimo = -1, fAnt = -1;
    // lê a posição atual da faixa e acende o caminho e as barrinhas (só quando muda)
    const marca = () => {
      const f = clamp(-gsap.getProperty(faixa, 'yPercent') * n / 100, 0, n - 1);
      if (Math.abs(f - fAnt) < .002) return;
      fAnt = f;
      const i = Math.round(f);
      if (i !== ultimo) { ultimo = i; caminho.textContent = '/ ' + rotulos[i]; }
      barras.forEach((b, k) => { if (k) b.style.transform = 'scaleX(' + clamp(f - k + 1).toFixed(3) + ')'; });
    };
    // uma tela por vez, com pausa em cada uma
    const passos = (tl, inicio) => {
      for (let i = 1; i < n; i++) tl.to(faixa, { yPercent: -100 * i / n, duration: 1, ease: 'power2.inOut' }, inicio + (i - 1) * 1.6);
      return inicio + (n - 1) * 1.6;
    };
    return { faixa, n, marca, passos };
  }

  const mm = gsap.matchMedia();

  /* ---------- Abertura: entra uma vez, por tempo (não depende do scroll) ---------- */
  gsap.fromTo('.cena .fabrica', { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 1.8, ease: 'power3.out' });
  gsap.fromTo('.abertura > :not(h1)', { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .9, ease: 'power3.out', stagger: .08, delay: .25 });

  /* ---------- A tela desce até o lugar ----------
     Quando o projeto chega, o navegador desce de cima, inclinado como uma tela sendo
     baixada, e assenta; depois o celular sobe e a ficha aparece. É por tempo, uma vez só. */
  function chegada(c) {
    const st = { trigger: c, start: 'top 72%', once: true };
    gsap.fromTo($('.navegador', c),
      { y: -150, autoAlpha: 0, rotationX: 14, transformPerspective: 1600 },
      { y: 0, autoAlpha: 1, rotationX: 0, duration: 1.25, ease: 'power3.out', scrollTrigger: st });
    gsap.fromTo($('.celular', c), { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', delay: .45, scrollTrigger: st });
    gsap.fromTo($$('.caso-info > *', c), { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .7, ease: 'power2.out', stagger: .06, delay: .25, scrollTrigger: st });
  }

  /* ---------- Computador: cada projeto fica preso enquanto as telas passam ---------- */
  mm.add('(min-width: 960px)', () => {
    document.documentElement.classList.add('cinema');
    $$('.casos .caso').forEach(c => {
      chegada(c);
      const t = telas(c);
      const tc = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: { trigger: c, start: 'top top', end: () => '+=' + Math.round(innerHeight * (t.n * .75)), pin: true, scrub: .3, invalidateOnRefresh: true, onUpdate: t.marca },
      });
      t.passos(tc, .3);
      tc.to({}, { duration: .5 });
    });
    return () => document.documentElement.classList.remove('cinema');
  });

  /* ---------- Celular e tablet: a tela desce igual; as telas rolam enquanto o navegador passa ---------- */
  mm.add('(max-width: 959px)', () => {
    $$('.caso').forEach(c => {
      chegada(c);
      const t = telas(c);
      const tc = gsap.timeline({
        scrollTrigger: { trigger: $('.janela', c), start: 'top 70%', end: 'bottom 20%', scrub: .3, onUpdate: t.marca },
      });
      t.passos(tc, 0);
    });
  });

  /* Links internos e o "Abrir ordem" da abertura */
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1), alvo = document.getElementById(id);
    if (!alvo) return;
    e.preventDefault();
    rolarPara(id === 'topo' ? 0 : alvo.getBoundingClientRect().top + scrollY - 0);
  }));
  $('#pedido').addEventListener('submit', e => { e.preventDefault(); campoNegocio.blur(); rolarPara($('#projetos').getBoundingClientRect().top + scrollY); });

  addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
