# 📚 Cronograma de Aulas - Teachers Schedule

Um site simples e bonito para professores visualizarem suas aulas semanais, integrado com Google Sheets.

## ✨ Funcionalidades

- **Seleção por Professor**: Cada professor seleciona seu nome na tela inicial
- **Cores Personalizadas**: Cada professor tem uma cor única para fácil identificação
- **Integração com Google Sheets**: Os dados são carregados diretamente da sua planilha
- **Design Responsivo**: Funciona em computadores, tablets e celulares
- **Visualização Semanal**: Mostra o cronograma completo da semana (Segunda a Sábado)

## 🚀 Como Usar

### 1. Abrir o Site

Basta abrir o arquivo `index.html` no seu navegador:

```bash
# Opção 1: Abrir diretamente
open index.html  # macOS
start index.html  # Windows
xdg-open index.html  # Linux

# Opção 2: Usar um servidor local (recomendado para funcionalidade completa)
python3 -m http.server 8000
# Acesse: http://localhost:8000
```

### 2. Configurar com Seu Google Sheets

#### Passo 1: Criar a Planilha

1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha
3. Nomeie a primeira aba como `Cronograma`

#### Passo 2: Estruturar os Dados

Organize sua planilha assim:

| Horário | Segunda | Terça | Quarta | Quinta | Sexta | Sábado |
|---------|---------|-------|--------|--------|-------|--------|
| 08:00 - 09:00 | Matemática - Ana Silva | Português - Carlos Santos | História - Maria Oliveira | | | |
| 09:00 - 10:00 | Português - Carlos Santos | Matemática - Ana Silva | | Geografia - João Pereira | | |
| 10:00 - 11:00 | | | Ciências - Fernanda Costa | | Arte - Juliana Rodrigues | |

**Formato das células**: `Matéria - Nome do Professor`

#### Passo 3: Publicar a Planilha

**Opção A - Planilha Pública (mais simples):**

1. Clique em `Arquivo` > `Compartilhar` > `Publicar na Web`
2. Selecione a aba `Cronograma`
3. Clique em `Publicar`
4. Copie o ID da planilha da URL

**Opção B - Usando API do Google (recomendado para produção):**

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto
3. Ative a `Google Sheets API`
4. Crie credenciais (API Key)
5. Compartilhe sua planilha com o email de serviço

#### Passo 4: Configurar o App

Edite o arquivo `app.js` e atualize as configurações:

```javascript
const SHEET_CONFIG = {
    spreadsheetId: 'COPIE_O_ID_DA_SUA_PLANILHA_AQUI',
    sheetName: 'Cronograma',
    apiKey: 'SUA_API_KEY_AQUI' // opcional se for pública
};
```

**Onde encontrar o Spreadsheet ID:**
- URL da planilha: `https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit...`
- O ID é a string entre `/d/` e `/edit`

#### Passo 5: Personalizar Cores dos Professores

No arquivo `app.js`, edite o objeto `TEACHER_COLORS`:

```javascript
const TEACHER_COLORS = {
    'Ana Silva': '#FF6B6B',
    'Carlos Santos': '#4ECDC4',
    'Maria Oliveira': '#45B7D1',
    // Adicione seus professores aqui
};
```

## 🎨 Estrutura de Arquivos

```
/workspace
├── index.html      # Página principal
├── styles.css      # Estilos e design
├── app.js          # Lógica e integração com Google Sheets
└── README.md       # Este arquivo
```

## 🌟 Recursos Visuais

- **Tela Inicial**: Grid com cards coloridos para cada professor
- **Cronograma**: Tabela semanal com horários e disciplinas
- **Legenda**: Mostra todos os professores e suas cores
- **Indicador de Cor**: Cada professor tem uma cor única associada

## 📱 Responsividade

O site é totalmente responsivo e se adapta a:
- Desktops (tela cheia)
- Tablets (layout ajustado)
- Celulares (menu simplificado)

## 🔧 Personalização

### Mudar Cores do Tema

Edite o arquivo `styles.css`:

```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Adicionar Novos Dias

Edite o array `days` no arquivo `app.js`:

```javascript
const days = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
```

### Alterar Formato de Data

Edite a função `getWeekInfo()` no arquivo `app.js`.

## 🐛 Solução de Problemas

### Dados não carregam

1. Verifique se o `spreadsheetId` está correto
2. Confirme que a planilha está pública ou a API key está configurada
3. Verifique o nome da aba (`sheetName`)

### Erro de CORS

Se estiver tendo problemas de CORS, use um servidor local:

```bash
python3 -m http.server 8000
```

Ou faça deploy em serviços como:
- Vercel
- Netlify
- GitHub Pages

### Cores não aparecem

Verifique se os nomes dos professores no Google Sheets correspondem exatamente aos nomes no objeto `TEACHER_COLORS`.

## 📝 Exemplo de Uso

1. Abra o site no navegador
2. Selecione seu nome na grade de professores
3. Visualize suas aulas da semana
4. Use o botão "Voltar" para selecionar outro professor

## 🌐 Deploy (Opcional)

### GitHub Pages

1. Crie um repositório no GitHub
2. Faça upload dos arquivos
3. Ative o GitHub Pages nas configurações

### Vercel/Netlify

1. Conecte seu repositório
2. Deploy automático

## 📞 Suporte

Para dúvidas ou problemas, verifique:
- Console do navegador (F12) para erros
- Configurações do Google Sheets
- Permissões de acesso à planilha

---

**Desenvolvido com ❤️ para facilitar a vida dos professores!**
