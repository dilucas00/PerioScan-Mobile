
# PerioScan-Mobile

Aplicativo mobile para gestão de casos periciais, usuários e evidências, desenvolvido em React Native com Expo.

## Funcionalidades

- **Login seguro** com autenticação JWT  
- **Dashboard** com estatísticas e gráficos de casos e usuários  
- **Gestão de usuários** (criação, edição, exclusão e filtro por cargo)  
- **Gestão de casos** (criação, visualização, filtro, detalhes, evidências e relatórios)  
- **Modal para cadastro e edição** de usuários e casos  
- **Interface moderna** e responsiva  
- **Suporte a múltiplos papéis**: Administrador, Perito, Assistente  
- **Geolocalização nos casos**: registre a localização dos casos diretamente pelo app  
- **Upload de fotos**: anexe imagens como evidências nos casos  
- **Conexão com IA para geração de relatórios**: utilize inteligência artificial para criar relatórios automáticos dos casos  

## Estrutura do Projeto

```
src/
  app/
    Cases/
    DashboardAdmin/
    Login/
    UserManagement/
    _layout.tsx
    index.tsx
  Components/
    AppBarHeader.tsx
    CardEvidence.tsx
    CardRelatorios.tsx
    caseCard.tsx
    caseDetailCard.tsx
    dateInput.tsx
    FiltroButton.tsx
    novoCasoModal.tsx
    NovoUsuarioModal.tsx
    UserCard.tsx
    UserManagementPage/
    utils/
  services/
    userService.ts
```

## Instalação

1. **Clone o repositório:**
   ```sh
   git clone https://github.com/dilucas00/PerioScan-Mobile
   cd PerioScan-Mobile
   ```

2. **Instale as dependências:**
   ```sh
   npm install
   # ou
   yarn
   ```

3. **Inicie o projeto:**
   ```sh
   npx expo start
   ```

## Configuração

- O backend deve estar disponível em:  
  `https://perioscan-back-end-fhhq.onrender.com/api`
- Configure variáveis de ambiente se necessário (ex: tokens, endpoints).

## Scripts

- `npm start` — Inicia o Expo  
- `npm run android` — Executa no emulador Android  
- `npm run ios` — Executa no emulador iOS  
- `npm run web` — Executa no navegador  

## Tecnologias

- React Native (Expo)  
- TypeScript  
- React Native Paper  
- AsyncStorage  
- Gráficos: react-native-chart-kit  
- Backend: Node.js/Express (API REST)  

## Instalação do APK

Para instalar e testar o aplicativo em um dispositivo Android, baixe o APK diretamente pelo link abaixo:

🔗 **[Download do APK no Google Drive](https://drive.google.com/drive/folders/1x20l88JKghjG3BMUViy6WNp3TZ_9kwwY)**

---

**PerioScan-Mobile** — Gestão moderna para perícias forenses, com geolocalização, upload de fotos e relatórios inteligentes via IA.
