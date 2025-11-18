# DietaS - Sistema de Gestão de Dietas

Uma aplicação completa de gestão de dietas pessoais com autenticação Firebase.

## Funcionalidades

- **Autenticação de Usuários**: Sistema de login e registo com Firebase Authentication
- **Gestão de Planos Dietéticos**: Criação e gestão de planos com objetivos nutricionais
- **Registo de Refeições**: Acompanhamento diário de refeições e consumo calórico
- **Livro de Receitas**: Criação e gestão de pratos e receitas personalizadas
- **Acompanhamento de Progresso**: Registo de medições corporais e evolução visual

## Estrutura da Aplicação

- `/auth` - Páginas de autenticação (login, registo)
- `/meals` - Gestão de refeições diárias
- `/plan` - Gestão de planos dietéticos
- `/log` - Livro de receitas e criação de pratos
- `/profile` - Perfil do utilizador
- `/progress` - Acompanhamento de progresso

## Autenticação

A aplicação utiliza Firebase Authentication para gerir a autenticação de usuários:

- Página de Login: `/auth/login`
- Página de Registo: `/auth/signup`

## Configuração

1. Configure as variáveis de ambiente no ficheiro `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

2. Inicie a aplicação:
   ```bash
   npm run dev
   ```

A aplicação estará disponível em `http://localhost:3000`.