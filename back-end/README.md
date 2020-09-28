# [BACK-END] Estágio Aiko 
> Desenvolvimento de uma API para o programa de estágio Aiko seguindo os moldes da API Olho Vivo da SPTrans para informações sobre ônibus.

## Instalação

Instalando o nvm e o Node.js

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.36.0/install.sh | bash
```
```sh
nvm install v9
```
Instalando o Adonis.js

```sh
npm i -g @adonisjs/cli
```

Instalando o Banco de Dados

```sh
npm install pg
```

## Execução 

Dentro da pasta do projeto (back-end), crie um arquivo .env (utilize como base o arquivo dotEnv-exemple) com as informações do banco e execute o seguinte comando caso seja a primeira execução
```sh
adonis migration:run
```

Nas vezes seguintes, basta executar

```sh
adonis serve --dev
```

## Tecnologias utilizadas

Para desenvolver a API foi utilizado Node.js com o framework Adonis.js, Lucid ORM, CORS e Validator
O banco de dados escolhido foi o PostgreSQL
O deploy foi feito no Heroku, você pode acessar em https://api-aiko.herokuapp.com/

A arquitetura foi MVC

A documentação da API foi feita utilizando a ferramenta do Postman, que você pode encontar nesse [link](https://documenter.getpostman.com/view/12883258/TVKJxEVZ)

## Collection Postman

A collection com todas as rotas está em back-end/collection

## Vídeo no YouTube

[Link]()

## Meta

Sávio Miranda – [@SirSavi0](https://twitter.com/SirSavi0) – saviomendesmiranda@gmail.com

[https://github.com/sirsavio/](https://github.com/SirSavio/)
