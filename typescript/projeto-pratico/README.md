Projeto prático em TypeScript, Node e Webpack que consome a API Etherscan para obter informações de saldo e histórico de transações com base num endereço de carteira Ethereum.

Para rodar o projeto:

0. Instale o Node e o NPM na sua máquina;
1. Clone o repositório usando `git` onde desejar:
```
git clone https://github.com/erickMartinsSilva/estudos-polkadot-academy
```
2. Navegue para a pasta `estudos-polkadot-academy/typescript/projeto-pratico`;
3. Instale os pacotes necessários:
```
npm i
```
4. Obtenha uma chave da API do Etherscan para permitir com que o projeto realize requisições (https://etherscan.io/);
5. Crie um arquivo `.env` na pasta raiz do projeto (`projeto-pratico`) e preencha-o com base no arquivo `.env.example`;
6. Insira a chave de API do Etherscan no campo `ETHERSCAN_API_KEY` do `.env`;
7. Rode o projeto:
```
npm start
```
8. Acesse-o na porta 3001 do seu localhost.
