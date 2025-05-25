
![ClickVisit](documents/assetsWAD/logoClickVisitBranco.png) 
----
Aplicação web para **agendamento de visitas a imóveis**. Corretores (autônomos ou vinculados a uma imobiliária) geram links de agendamento; clientes escolhem o melhor horário dentre a agenda do corretor e a disponibilidade do imóvel.

## Sumário

1. [Descrição do sistema](#c1)  
2. [Estrutura de pastas e arquivos](#c2)  
3. [Como executar o projeto localmente](#c3)  


## <a name="c1"></a>1. Descrição do sistema

| Papel           | Permissões principais                                                              |
| --------------- | ---------------------------------------------------------------------------------- |
| **Imobiliária** | Cadastro de imóveis, vinculação de corretores, bloqueio de horários (reforma etc.) |
| **Corretor**    | Mantém agenda pessoal, gera link exclusivo para o cliente                          |
| **Cliente**     | Acessa link, compara agendas, agenda visita                                        |

Fluxo resumido:

1. Corretor envia link do imóvel.
2. Cliente escolhe horário livre.
3. Sistema grava em `events` e `visits`.
4. Horário fica bloqueado para novos agendamentos.

---

**Padrão MVC:** Estrutura organizada em Model, View e Controller

**PostgreSQL:** Banco de dados relacional utilizado para persistência dos dados.

**UUID:** Utilização de UUID como chave primária na tabela `users`.

**Scripts com `nodemon`:** Utilização do `nodemon` para reiniciar automaticamente o servidor após alterações no código.

**Testes:** Inclui estrutura básica para testes automatizados.



## <a name="c2"></a>2. Estrutura de pastas e arquivos

```text
.
├── assets/              # imagens e arquivos estáticos gerais
├── config/
│   └── db.js            # conexão PostgreSQL
├── controllers/         # lógica de negócio (por entidade)
│   ├── agencyController.js
│   └── propertyController.js
├── documents/
│   ├── assetsWAD/
│   |   └── ...
│   └── PI-WAD.md        # documentação acadêmica
├── models/              # mapeamento das tabelas (DAO)
│   ├── agency.js
│   └── property.js
├── node_modules/ 
│   └── ...
├── public/              # CSS, JS e imgs servidos pelo Express
│   └── ...
├── routes/
│   ├── agency.js        # exemplo de rota
│   └── property.js
├── scripts/
│   ├── ClickVisit.sql   # schema completo do banco
│   └── runSQLScript.js  # utilitário para popular o BD
├── services/            # Serviços auxiliares do sistema
│   └── userService.js
├── tests/               # Arquivos de testes unitários
│   ├── userController.test.js
│   ├── userModel.test.js
│   ├── userRoutes.test.js
│   └── userService.test.js
├── views/ 
│   ├── agency/
|   │   └── index.ejs
|   ├── property/
|   │   └── index.ejs
|   └── ...
├── styles/              # Arquivos CSS públicos
├── app.js               # app para rodar com NODE
├── server.js            # ponto de entrada — sobe o servidor
├── .env                 # variáveis de ambiente (DB, PORT…)
├── package-lock.json    # Gerenciador de dependências do Node.
├── package.json         # dependências e scripts npm
└── readme.md            # Documentação do projeto (Markdown)
```

## <a name="c3"></a>3. Como executar o projeto localmente

1. **Clone o repositório**

   ```bash
   git clone https://github.com/VictorGryca/ClickVisit.git
   cd <seu-repo>
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure o ambiente**

   Crie o arquivo `.env` e preencha:

   ```env
   DB_HOST=<host>
   DB_PORT=5432
   DB_USER=<usuario>
   DB_PASSWORD=<senha>
   DB_DATABASE=<nome_bd>
   PORT=3000
   ```

4. **Inicialize o banco**

   ```bash
   npm run init-db            # executa scripts/ClickVisit.sql
   ```

5. **Rode a aplicação**

   ```bash
   node app.js               
   ```

   A aplicação estará em **[http://localhost:3000](http://localhost:3000)**.

---

