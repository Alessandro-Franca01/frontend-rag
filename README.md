# RAG GROQ Frontend 🖥️

Interface Angular 17 para o sistema RAG GROQ API.

## Pré-requisitos

- Node.js 18+
- Angular CLI 17: `npm install -g @angular/cli`
- API backend rodando em `http://localhost:8000`

## Setup

```bash
# 1. Entre na pasta do projeto
cd rag_frontend

# 2. Instale as dependências
npm install

# 3. Rode em desenvolvimento
ng serve

# Acesse: http://localhost:4200
```

## Estrutura

```
src/app/
├── app.component.*          # Shell: sidebar + router-outlet
├── app.config.ts            # Providers: HttpClient, Router, Animations
├── app.routes.ts            # Lazy-loaded routes
├── core/
│   ├── models/
│   │   └── api.models.ts    # Interfaces TypeScript (espelho da API)
│   └── services/
│       └── rag-api.service.ts  # HttpClient wrapper para todos os endpoints
└── features/
    ├── ask/                 # Página "Perguntar" — pipeline RAG completo
    ├── documents/           # Página "Documentos" — upload / listagem / remoção
    └── search/              # Página "Busca Semântica" — retrieval puro
```

## Páginas

| Rota | Descrição |
|---|---|
| `/ask` | Faz perguntas e recebe respostas via LLM |
| `/documents` | Gerencia PDFs — upload com drag & drop, remoção individual e limpeza total |
| `/search` | Busca semântica pura com barra de relevância por chunk |

## Configuração da API

Edite `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000', // URL da sua FastAPI
};
```

## Build produção

```bash
ng build --configuration production
# Output: dist/rag-groq-frontend/
```
