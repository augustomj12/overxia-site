# Como adicionar um projeto ao site da Overxia

Manual para quem for subir um projeto novo (Augusto ou o sócio). Seguindo estes passos, o projeto entra **no mesmo padrão** dos que já estão lá (RITMO e Dedelimp): navegador que rola pelas telas do site, celular ao lado e a ficha com tecnologias.

Os caminhos abaixo partem da raiz do repositório (onde está o `index.html`). Se um dia o site for para o Next.js, **o material é o mesmo**: só muda o lugar onde ele é colado (um arquivo de dados em vez do HTML).

---

## 1. Separe o material

### Imagens (5 por projeto)

| Arquivo | O que é | Tamanho exato |
|---|---|---|
| `<nome>-0.jpg` | Primeira tela do site (o topo) | 1440 × 900 |
| `<nome>-1.jpg` | Uma seção importante | 1440 × 900 |
| `<nome>-2.jpg` | Outra seção importante | 1440 × 900 |
| `<nome>-3.jpg` | Mais uma seção (de preferência a que mostra o resultado, como um painel ou um formulário) | 1440 × 900 |
| `<nome>-mob.jpg` | A primeira tela no celular | 780 × 1688 |

`<nome>` é o nome curto do projeto em minúsculas, sem acento e sem espaço. Exemplo: `clinica-aurora-0.jpg`.

**Como tirar as capturas no tamanho certo (Google Chrome):**
1. Abra o site do projeto e aperte `F12`, depois `Ctrl + Shift + M` (modo de dispositivo).
2. Lá em cima, escolha **Responsive** e digite **1440** × **900**.
3. Role até a seção que você quer mostrar.
4. Aperte `Ctrl + Shift + P`, digite **screenshot** e escolha **Capture screenshot** (não o "full size").
5. Para o celular: troque para **390** × **844**, no menu de três pontinhos dessa barra escolha **Add device pixel ratio** e coloque **2**, volte ao topo e capture do mesmo jeito. Sai em 780 × 1688.

**Regras das capturas**
- Nada de dado pessoal de cliente real na tela (nome, telefone, e-mail). Se aparecer, use uma conta de teste.
- Sem pop-up de cookies na frente. Aceite ou feche antes de capturar.
- Salve em JPG com cerca de 80% de qualidade, até uns 200 KB cada ([squoosh.app](https://squoosh.app) faz isso de graça). Se não souber, pode mandar em PNG que a gente converte.

### Textos (copie este modelo e preencha)

```
Nome do projeto:
Endereço (domínio, sem https):
Tipo (ex.: Cliente · página de vendas / Produto próprio · SaaS):

Descrição (uma frase, até ~140 caracteres):

O que foi construído (3 itens curtos, um por linha):
-
-
-

Tecnologias (de 2 a 4; nome + uma linha em português simples dizendo o que ela faz NESTE projeto):
- Nome: explicação
- Nome: explicação

Entrega (ex.: Página de conversão / Site de vendas + aplicativo web):
Um fato extra (ex.: Região: Salvador e RMS / Modelo: R$ 19,90/mês):
Resultado (um número real, com fonte; se não tiver, escreva "pendente"):
Autorização do cliente para aparecer no site (sim / não):

Nome de cada captura, para o caminho do navegador (4 itens, ex.: início | problemas | orçamento | quem atendemos):
```

**Regras dos textos**
- **Nada inventado.** Número sem fonte não entra; fica "número em breve" (em âmbar, classe `pendente`).
- Tecnologia só se ela realmente foi usada. A explicação diz o que ela faz no projeto, não o que ela é ("O aplicativo é compilado com Vite", e não "Vite é uma ferramenta moderna...").
- Português do Brasil, frases curtas, sem ponto de exclamação e sem emoji.

---

## 2. Coloque os arquivos no lugar

1. As 5 imagens vão em `midia/projetos/`.
2. No `index.html`, procure o bloco do último projeto (hoje `<article class="caso caso-6 invertido app" id="projeto-carreto-facil">`, até o `</article>` dele). Para um **site com endereço público**, copie o da Dedelimp (`caso-2`); para um **sistema sem endereço público**, o do JV Logs (`caso-3`); para um **aplicativo de celular**, o do Carreto Fácil (`caso-6`). Veja a seção 2.1.
3. Cole a cópia logo depois do último projeto, antes do `<a class="proximo"`.
4. No bloco novo, troque:
   - o número do `caso-N` pelo do projeto (`caso-7`, `caso-8`...);
   - `invertido`: **projetos pares têm**, **ímpares não têm** (o navegador alterna de lado). O 7 fica sem `invertido`; o 8, com;
   - `id="projeto-<nome>"` pelo nome do projeto novo;
   - os dois domínios (na barra e no link) pelo domínio novo;
   - `data-rotulos="..."` pelos 4 nomes das capturas, separados por `|`;
   - as 4 imagens e o `alt` de cada uma (o `alt` descreve a tela, ex.: "Página inicial da Clínica Aurora");
   - a imagem do celular e o `alt` dela;
   - `Lote 02` pelo número do lote;
   - tipo, nome (`<h3>`), descrição, os 3 itens, as tecnologias, os fatos e o link (a ficha não tem "Quem fez" nem número de commits);
   - se o código do projeto estiver num repositório **público**, um segundo link logo depois do "Visitar…":
     ```html
     <a class="link" href="https://github.com/usuario/repositorio" target="_blank" rel="noopener">Ver o código <span aria-hidden="true">↗</span></a>
     ```

**Tecnologias, no formato exato:**
```html
<dd><b>Nome da tecnologia</b>Uma linha dizendo o que ela faz neste projeto.</dd>
```
O que ainda não está confirmado:
```html
<dd><b>Banco, login e pagamento</b><span class="pendente">a confirmar</span></dd>
```

### 2.1 Variantes do bloco

O bloco base é o do navegador com 4 capturas 1440 × 900 e o celular ao lado. Há três variações, todas já prontas no `style.css`:

| Caso | O que fazer |
|---|---|
| **Capturas em 16:9** (ex.: 1920 × 1080, como o MapsLine) | Reduza para **1440 × 810** (não corte) e ponha a classe `tela-wide` no `<div class="caso-tela">`. |
| **Sem captura de celular** (sistema só para computador) | Apague o `<div class="celular">`. O `main.js` já trata a falta dele. |
| **Aplicativo de celular** (só tem prints de celular) | Use o bloco do Carreto Fácil ou do MapsLine Mobile: `class="caso caso-N app"` e `style="--ar: LARGURA / ALTURA; --r: LARGURA ÷ ALTURA"` no `<article>` (ex.: `--ar: 739 / 1600; --r: .4619`). As 4 telas rolam dentro de um aparelho no centro e o `-mob.jpg` fica ao lado. Mantenha o tamanho original do print e salve em JPG. |

Outros ajustes:
- **Sem endereço público** (sistema com login, projeto de cliente fechado): na barra, escreva o nome do projeto no lugar do domínio, **não invente um endereço**, apague o link "Visitar" e use `<p class="nota">Acesso só com login.</p>`.
- **Mais de um link** (lojas de aplicativo): coloque os links dentro de `<div class="links">`.
- **Ainda em desenvolvimento**: o selo fica `<span class="no-ar dev"><i></i>Em desenvolvimento</span>` (âmbar). Use "Em uso", "Em produção" ou "Nas lojas" só quando for verdade.
- **Dado de terceiro nos prints** (rosto, nome, e-mail, telefone, CPF, placa): borre antes de salvar e confirme a autorização do cliente.

## 3. Rode o validador (ele acerta os números sozinho)

Na pasta do site, no terminal:
```bash
node validar.js --corrigir
```

Ele faz duas coisas:
- **acerta sozinho os números que dependem da quantidade de projetos**: o "Lote" do cartão do fim, a frase "Seis projetos, entre sites, sistemas e aplicativos.", o "6 projetos" do rodapé e a lista "Projetos: …" da descrição para o Google;
- **confere o projeto novo** e, se tiver algo fora do padrão, diz exatamente o que corrigir: classe e número do caso, `invertido` nos pares, id, nome, domínio igual na barra e no link (quando a barra mostra um domínio), quantidade de telas igual à de nomes e de barrinhas, tamanho das imagens (1440 × 900; 1440 × 810 com `tela-wide`; o do print com `app`; 780 × 1688 no celular), peso das imagens, `alt`, "Lote", tecnologias no formato certo e arquivos que não existem.

Rode de novo até aparecer **"Tudo certo. Pode publicar."**

> **O Cloudflare roda o mesmo validador antes de cada publicação.** Se ele achar um erro, a publicação para e o site no ar continua na versão anterior. Nada quebrado chega ao ar. O motivo aparece no Cloudflare: Workers & Pages → overxia-site → Deployments → a publicação com falha → "View details".

Nada no `main.js` precisa mudar: ele encontra sozinho os blocos com a classe `caso`.

## 4. Confira antes de subir

1. Dê dois cliques em `index.html` e role a página inteira.
   - **Computador:** o projeto fica preso e passa pelas telas conforme a rolagem; o caminho na barra muda junto.
   - O celular desenhado aparece ao lado.
   - Nenhum texto cortado, nada saindo da tela.
2. **Celular:** `F12`, `Ctrl + Shift + M`, tamanho **375 × 812**, recarregue e role tudo de novo. No celular as telas do projeto **passam sozinhas** (como stories, 2,6 s cada) enquanto ele está na tela, e um toque pula para a próxima. Não pode aparecer rolagem para o lado.
3. Suba as mudanças (seção 5). O Cloudflare valida e publica sozinho em cerca de 1 minuto. Abra o endereço do site e confira no ar.

## 5. Ao registrar a mudança (commit)

Cada pessoa sobe os próprios projetos com o próprio usuário do GitHub, para o histórico mostrar quem fez o quê. Mensagem do commit no formato:

```
projeto: adiciona <Nome do projeto>
```

Um projeto por commit, com as imagens e o texto juntos. O commit vai para o `main`, e o Cloudflare Pages publica sozinho.

No terminal, na pasta do repositório:
```bash
git add index.html midia/projetos
```
```bash
git commit -m "projeto: adiciona Nome do projeto"
```
```bash
git push
```
