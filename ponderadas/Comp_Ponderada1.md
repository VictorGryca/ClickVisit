
# Projeto Individual (COMP Parte 1): Estruturando a Base do Projeto

Objetivo:
Configurar o ambiente de desenvolvimento, organizar o projeto com base no padrão MVC e criar uma aplicação básica com Node.js utilizando o framework Express.js.

Entrega:
- Submissão individual.
- O projeto deve estar hospedado em um repositório público no GitHub, bem como uma documentação WAD.md.
- README explicativo

Prazo de Entrega:
Até sexta-feira da **semana 3** do módulo.

---

## Instruções

Você vai construir a base do seu sistema web, aprendendo a organizar seu projeto com o padrão MVC, configurar o servidor com Node.js e Express.js, e criar as primeiras páginas da interface com EJS. Ao final, você terá um projeto funcional no ar, com estrutura sólida para continuar o desenvolvimento nas próximas semanas.

### Etapa 1 — Estrutura inicial do projeto

Antes de começar a programar, é importante organizar seu projeto em pastas, seguindo o padrão MVC (Model-View-Controller). Essa organização facilita o desenvolvimento e a manutenção do código ao longo das próximas etapas.

Crie uma estrutura como esta:

```
meu-projeto/
│
├── config/                # Arquivos de configuração (ex: conexão com banco)
│   └── database.js
├── controllers/           # Lógica de controle das requisições
│   └── HomeController.js
├── models/                # Definição de modelos de dados (estrutura do banco)
│   └── User.js
├── routes/                # Definição das rotas do sistema
│   └── index.js
├── services/              # Serviços auxiliares do sistema
│   └── userService.js
├── assets/                # Arquivos públicos como imagens e fontes
├── scripts/               # Arquivos de JavaScript públicos
├── styles/                # Arquivos CSS públicos
├── tests/                 # Arquivos de testes unitários
│   └── example.test.js
├── .gitignore             # Arquivo para ignorar arquivos no Git
├── .env.example           # Arquivo de exemplo para variáveis de ambiente
├── jest.config.js         # Arquivo de configuração do Jest
├── package-lock.json      # Gerenciador de dependências do Node.js
├── package.json           # Gerenciador de dependências do Node.js
├── readme.md              # Documentação do projeto (Markdown)
├── server.js              # Arquivo principal que inicializa o servidor
└── rest.http              # Teste de endpoints (opcional)

```

* **`config/`**: Configurações do banco de dados e outras configurações do projeto.
* **`controllers/`**: Controladores da aplicação (lógica de negócio).
* **`models/`**: Modelos da aplicação (definições de dados e interações com o banco de dados).
* **`routes/`**: Rotas da aplicação.
* **`tests/`**: Testes automatizados.
* **`views/`**: Views da aplicação (se aplicável).

➡️  Você também pode utilizar o [boilerplate MVC](https://github.com/afonsobrandaointeli/mvc-boilerplate) como base do seu projeto

🔍 Por que usar essa estrutura? Ela separa responsabilidades: cada parte do sistema tem sua função clara. Assim, seu projeto fica mais legível e escalável.

O padrão MVC (Model-View-Controller) é uma forma de organizar o código para que ele fique mais modular, fácil de entender e de manter. Ele separa o projeto em três camadas principais:

|Camada | Responsabilidade|
| ------------- | ------------- |
|Model | Representa os dados e a lógica de acesso ao banco.|
|View | Representa a interface que o usuário vê (páginas HTML/EJS).|
|Controller | Faz a ponte entre o Model e a View. Processa requisições e executa ações.|


➡️ Imagine que o usuário preenche um formulário: o Controller recebe os dados, usa o Model para salvar no banco e responde com uma View de sucesso.



### Etapa 2 — Inicializando o projeto com Node.js
Agora você vai criar o coração do seu sistema: o servidor backend. Ele será responsável por receber requisições, processá-las e retornar respostas (HTML, dados, etc.).
#### Passo 1 — Criar o projeto e instalar o Express
Abra o terminal na pasta do seu projeto:

```
npm init -y
Instale o Express:
```

```
npm install express
```

#### Passo 2 — Criar o servidor
No arquivo server.js, insira o seguinte código:
```
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para processar JSON
app.use(express.json());

// Rotas
const routes = require('./routes/index');
app.use('/', routes);

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```
💡 O express.json() permite que seu servidor entenda dados enviados em formato JSON, como formulários de cadastro.

### Etapa 3 — Criando o modelo do banco de dados

Mesmo que você ainda não vá conectar o banco de dados à sua aplicação agora, é fundamental já planejar quais informações o sistema vai armazenar. Exemplo de tabelas possíveis:

- Gerenciador de tarefas → users, tasks, categories
- Sistema de reservas → users, rooms, bookings
- Plataforma de eventos → users, events, subscriptions

#### O que fazer?
- Identifique as entidades principais do seu sistema (ex: usuários, tarefas, eventos, reservas...).
- Defina os campos de cada entidade (ex: nome, data, status...).
- Relacione as entidades (ex: um usuário tem muitas tarefas).
- Dica: Use notação de chave primária (PK) e estrangeira (FK) nas suas tabelas para deixar mais claro.

#### Como entregar?
- Crie um modelo físico e lógico do banco de dados.
- Use ferramentas como dbdiagram.io, Lucidchart, Draw.io ou desenhe à mão e digitalize.

Salve como imagem ou PDF no repositório com o nome modelo-banco.png ou modelo-banco.pdf.

---

##  Requisitos Mínimos da Entrega
- Estrutura de projeto no padrão MVC (Model, View, Controller).
- Arquivo server.js funcionando.
- Projeto executável com Node.js (node server.js ou npm start).
- Modelo Físico (código SQL) e Relacional (imagem do diagrama) do banco de dadosno repositório
- Atualização de README com:
    - Descrição do sistema escolhido
    - Estrutura de pastas e arquivos
    - Como executar o projeto localmente
- Atualização de WAD com:
    - Introdução
    - Diagrama do banco de dados