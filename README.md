# mrnascimento.com — atualização de 14 de outubro de 2026

Site institucional publicado no Firebase Hosting, projeto `mrnascimentotech`.
Esta branch (`update/site-20261014`) atualiza a versão publicada. A branch `main`
preserva o projeto React antigo, que não corresponde ao site atual.

Os fontes React da versão publicada não foram recuperados. O build usa os
módulos compilados do commit `0ef5a45` como base imutável e aplica dados editáveis
de `content/*.json` e alterações de apresentação verificadas por parser.
Mantenha esse commit no histórico ao clonar. Os arquivos em `public/assets`
são gerados; edite o conteúdo e execute o build, em vez de alterar os bundles.

`content/publications.json` registra 18 artigos originais, com traduções e
republicações agrupadas no respectivo artigo. Livros, preprints e podcast têm
categorias próprias. `content/publication-sources.json` registra as fontes e
limitações de verificação. As datas dos eventos são passadas; próximos
lançamentos aparecem somente como um aviso sem detalhes.

Os HTMLs em `public/` são a página inicial pré-renderizada e os kits estáticos
de imprensa. Ao atualizar os dados, mantenha o texto e JSON-LD desses HTMLs
sincronizados. `npm run check` confere datas, contagem de artigos e links de
origem. As rotas `/about` e `/speaking` usam o aplicativo; `/about.html` e
`/speaking.html` preservam as versões estáticas.

```bash
npm ci
npm run build
npm run check
npm run dev
```

A prévia fica em http://127.0.0.1:5173. O build renomeia os módulos do aplicativo
a cada alteração de conteúdo, preservando a política de cache do site.
`content/build-manifest.json` identifica a versão gerada; `release.json`
preserva o registro de publicação de setembro como referência de recuperação.

O currículo público foi atualizado conservando as duas páginas e as fontes
originais. `scripts/update-cv.py` reproduz essa atualização a partir do mesmo
commit-base e requer Python com PyMuPDF 1.28.2. O PDF já gerado está em `public/`
e não depende de Python para ser servido ou publicado.

Publicação, depois das verificações locais:

```bash
GOOGLE_CLOUD_QUOTA_PROJECT=mrnascimentotech firebase deploy --only hosting --project mrnascimentotech
```
