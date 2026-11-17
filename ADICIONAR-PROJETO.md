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
Quem fez (Augusto, sócio ou os dois, e o que cada um fez):

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
2. No `index.html`, procure o bloco do último projeto (comentário `SEGUNDO PROJETO`, a partir de `<article class="caso caso-2 invertido" id="projeto-dedelimp">` até o `</article>` dele).
3. Copie o bloco inteiro e cole logo depois dele, antes do `<a class="proximo"`.
4. No bloco novo, troque:
   - `caso-2` pelo número do projeto (`caso-3`, `caso-4`...);
   - `invertido`: **projetos pares têm**, **ímpares não têm** (o navegador alterna de lado). O 3 fica sem `invertido`; o 4, com;
   - `id="projeto-dedelimp"` por `id="projeto-<nome>"`;
   - os dois `dedelimp.com.br` (na barra e no link) pelo domínio novo;
   - `data-rotulos="..."` pelos 4 nomes das capturas, separados por `|`;
   - as 4 imagens e o `alt` de cada uma (o `alt` descreve a tela, ex.: "Página inicial da Clínica Aurora");
   - a imagem do celular e o `alt` dela;
   - `Lote 02` pelo número do lote;
   - tipo, nome (`<h3>`), descrição, os 3 itens, as tecnologias, os fatos e o link;
   - **"Quem fez"**, que é o primeiro fato da ficha. Para recrutador, é o campo mais importante:
     ```html
     <div class="autoria"><dt>Quem fez</dt><dd>Nome: o que fez · Nome: o que fez</dd></div>
     ```
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

## 3. Atualize os números que contam projetos

Quando entra um projeto, **cinco lugares** mudam juntos:

| Onde | O que mudar |
|---|---|
| Cartão do fim dos projetos: `Lote 03 · destino:` | próximo número livre (com 3 projetos, vira `Lote 04`) |
| Frase dos projetos: "Dois endereços no ar." | a quantidade, por extenso |
| Descrição para o Google (`<meta name="description">`): "Projetos no ar: RITMO e Dedelimp." | o nome do projeto novo na lista |
| Rodapé: "Linha funcionando · 2 no ar" | a quantidade |
| Este manual e o `ROTEIRO.md` | anotar o projeto novo |

Nada no `main.js` precisa mudar: ele encontra sozinho os blocos com a classe `caso`.

## 4. Confira antes de subir

1. Dê dois cliques em `index.html` e role a página inteira.
   - O navegador do projeto fica preso e passa pelas 4 telas; o caminho na barra muda junto.
   - O celular aparece ao lado.
   - Nenhum texto cortado, nada saindo da tela.
2. Celular: `F12`, `Ctrl + Shift + M`, tamanho **375 × 812**, recarregue e role tudo de novo. Não pode aparecer rolagem para o lado.
3. Suba as mudanças (seção 5). O Cloudflare publica sozinho em um ou dois minutos. Abra o endereço do site e role tudo de novo para conferir no ar.

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
