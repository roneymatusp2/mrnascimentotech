# mrnascimento.com — versão publicada (20260903)

Esta branch contém, byte a byte, os arquivos que o Firebase Hosting serve em https://mrnascimento.com
(projeto `mrnascimentotech`, release em `release.json`). Não é o código-fonte: é o site compilado.

Republicar exatamente isto:

```bash
npm i -g firebase-tools   # uma vez
firebase login            # uma vez
firebase deploy --only hosting
```
