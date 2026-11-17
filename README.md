# Overxia Solutions · site

Site da Overxia Solutions: sites, sistemas e aplicativos feitos sob medida. Também serve de portfólio dos sócios.

- **Abertura:** a fábrica em miniatura em operação (imagem e vídeo gerados por IA).
- **Projetos:** cada um com um navegador que desce até o lugar e rola pelas telas do site, o celular ao lado e uma ficha com as tecnologias usadas.
- **Depois:** serviços, quem somos e o contato (a "ordem de produção").

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | A página inteira (todos os textos estão aqui) |
| `style.css` | Cores, fontes e layout |
| `main.js` | Vídeo da fábrica em loop, a tela que desce e as telas que rolam nos projetos |
| `midia/fabrica/` | Imagem e vídeo da fábrica |
| `midia/projetos/` | Capturas dos projetos (4 telas + celular de cada um) |
| `_headers` | Cabeçalhos de segurança e de cache usados pelo Cloudflare Pages |
| `ADICIONAR-PROJETO.md` | **Manual para subir um projeto novo no mesmo padrão** |

Site estático: HTML, CSS e JavaScript, com GSAP, ScrollTrigger e Lenis carregados por CDN. Não tem etapa de build.

## Ver no computador

- Jeito simples: dois cliques no `index.html`.
- Com servidor local, na pasta do projeto:
  ```bash
  npx --yes http-server@14.1.1 . -p 5196 -c-1
  ```
  e abrir `http://localhost:5196`.

## Publicação

O site é publicado pelo **Cloudflare Pages**, ligado a este repositório no GitHub. **Cada commit no `main` publica sozinho**, em um ou dois minutos.

Configuração no Cloudflare Pages:
- Framework preset: **None**
- Build command: **(vazio)**
- Build output directory: **/** (a raiz do repositório)

## Regras do conteúdo

- Nada de número, nome, contato ou tecnologia inventada. O que falta fica marcado como pendente (`class="pendente"`, aparece em âmbar).
- Português do Brasil, frases curtas, sem ponto de exclamação e sem emoji.
- Testar sempre em computador (1440 × 900) e celular (375 × 812) antes de subir.
