# Checkout Comum - Prova de Conceito (POC)

![Version](https://img.shields.io/badge/version-1.1-blue.svg)
![Status](https://img.shields.io/badge/status-desenvolvimento-yellow.svg)
![Framework](https://img.shields.io/badge/framework-SvelteKit-orange.svg)

## 📋 Visão Geral

O **Checkout Comum** é um aplicativo de checkout minimalista desenvolvido especificamente para brechós que participam de feiras e eventos. A solução tem como objetivo digitalizar e agilizar o processo de vendas, substituindo métodos manuais por um fluxo de trabalho otimizado e intuitivo.

### 🎯 Objetivo Principal

Validar a viabilidade de um sistema digital que:
- Reduza o tempo de checkout para menos de 90 segundos por transação
- Elimine erros de cálculo manual
- Capture dados de clientes para futuras ações de marketing
- Forneça controle básico de inventário em tempo real

## 🚀 Problemas Resolvidos

### Antes (Processo Manual)
- ⏱️ **Lentidão:** Anotações em caderno e cálculos manuais
- ❌ **Erros:** Cálculos incorretos resultando em perdas financeiras
- 📊 **Falta de Dados:** Ausência de registro sistemático de vendas
- 📦 **Controle de Estoque:** Dificuldade para rastrear itens vendidos

### Depois (Checkout Comum)
- ⚡ **Agilidade:** Interface visual intuitiva para seleção de produtos
- ✅ **Precisão:** Cálculos automáticos com aplicação de descontos
- 📈 **Dados Estruturados:** Captura de informações de cliente e vendas
- 🔄 **Sincronização:** Atualização automática de status de inventário

## 🏗️ Arquitetura

### Proposta Híbrida e Automatizada

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   SvelteKit     │    │   PocketBase    │    │      n8n        │
│   (Frontend)    │◄──►│  (Database)     │◄──►│  (Automation)   │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • Interface     │    │ • Produtos      │    │ • Proc. Vendas  │
│ • Busca/Filtros │    │ • Vendas        │    │ • Envio Email   │
│ • Carrinho      │    │ • Clientes      │    │ • Sync Sheets   │
│ • Checkout      │    │ • API REST      │    │ • Webhooks      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Componentes Principais

- **Frontend (SvelteKit):** Interface responsiva e intuitiva
- **Backend (PocketBase):** Banco de dados e API REST
- **Automação (n8n):** Orquestração de processos e integrações

## ✨ Funcionalidades

### 🔍 Fase 1 - POC (Atual)
- [x] **Listagem Visual de Inventário** - Grid responsivo com fotos, nomes e preços
- [x] **Busca e Filtros** - Localização rápida por nome ou código
- [x] **Gerenciamento de Carrinho** - Adição/remoção de itens com subtotal
- [x] **Aplicação de Desconto** - Desconto em valor fixo (R$)
- [x] **Coleta de Dados do Cliente** - Nome e email do comprador
- [x] **Seleção de Forma de Pagamento** - Débito, Crédito, PIX
- [x] **Finalização da Venda** - Consolidação da transação
- [x] **Envio de Recibo por Email** - Recibo automático para o cliente
- [x] **Sincronização de Produtos** - Importação via Google Sheets
- [x] **Atualização de Status** - Marcação automática de itens vendidos

### 🚀 Fase 2 - Evolução (Planejada)
- [ ] **Leitura de QR Code/Código de Barras**
- [ ] **Otimizações de Performance** para inventários grandes
- [ ] **Funcionalidades Avançadas** de busca e filtros
- [ ] **Dashboard de Vendas** e analytics
- [ ] **Modo Offline** para uso sem internet

## 🛠️ Tecnologias Utilizadas

### Frontend
- **SvelteKit** - Framework full-stack moderno
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **Vite** - Build tool rápido

### Backend & Infraestrutura
- **PocketBase** - Backend-as-a-Service com SQLite
- **n8n** - Plataforma de automação de workflows
- **Google Sheets API** - Sincronização de produtos
- **Email Service** - Envio de recibos automáticos

## 📁 Estrutura do Projeto

```
app/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── InventoryGrid.svelte      # Grid de produtos
│   │   │   ├── ProductCard.svelte        # Card individual
│   │   │   ├── SearchBar.svelte          # Busca e filtros
│   │   │   ├── CartFloating.svelte       # Carrinho flutuante
│   │   │   └── CheckoutFlow.svelte       # Fluxo de checkout
│   │   ├── stores/                       # Stores do Svelte
│   │   ├── services/                     # Serviços e APIs
│   │   └── types/                        # Tipos TypeScript
│   ├── routes/                           # Rotas da aplicação
│   ├── app.html                          # Template HTML
│   └── app.css                           # Estilos globais
├── static/                               # Arquivos estáticos
├── .storybook/                          # Configuração Storybook
├── package.json                         # Dependências
├── svelte.config.js                     # Configuração Svelte
├── tsconfig.json                        # Configuração TypeScript
└── vite.config.ts                       # Configuração Vite
```

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js (v18 ou superior)
- PNPM (gerenciador de pacotes)
- Conexão com internet para sincronização

### Instalação
```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações
```

### Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
pnpm dev

# Abrir automaticamente no navegador
pnpm dev --open
```

### Build para Produção
```bash
# Criar build otimizado
pnpm build

# Pré-visualizar build de produção
pnpm preview
```

### Testes
```bash
# Executar testes unitários
pnpm test

# Executar testes com coverage
pnpm test:coverage

# Executar Storybook
pnpm storybook
```

## 📊 Métricas de Sucesso

| Métrica | Objetivo | Status |
|---------|----------|--------|
| Tempo de Checkout | < 90 segundos | 🟡 Em validação |
| Uptime do Sistema | 99% durante eventos | 🟡 Em validação |
| Captura de Emails | ≥ 30% das vendas | 🟡 Em validação |
| Satisfação do Usuário | Feedback positivo | 🟡 Em validação |

## 🎯 Personas

### 👩‍💼 Helena - Vendedora/Caixa (Usuária Primária)
- **Necessidades:** Rapidez, simplicidade, interface intuitiva
- **Contexto:** Atendimento rápido em ambiente movimentado
- **Objetivo:** Processar vendas sem erros e com agilidade

### 👩‍🦰 Mariana - Cliente do Brechó (Usuária Secundária)
- **Necessidades:** Experiência de compra sem atritos
- **Contexto:** Compras rápidas em feiras e eventos
- **Objetivo:** Checkout ágil e recibo digital

## 🔄 Fluxo de Usuário Principal

1. **Visualização do Inventário** - Grid com todos os produtos disponíveis
2. **Busca de Produtos** - Localização rápida por nome ou código
3. **Seleção de Itens** - Clique para adicionar ao carrinho
4. **Gerenciamento do Carrinho** - Visualização de itens e subtotal
5. **Aplicação de Desconto** - Desconto opcional em valor fixo
6. **Coleta de Dados** - Nome e email do cliente
7. **Forma de Pagamento** - Seleção para registro (sem processamento)
8. **Finalização** - Consolidação da venda
9. **Confirmação** - Envio de recibo e atualização do estoque

## 🔧 Configuração

### Estrutura de Dados dos Produtos
```typescript
interface Product {
  id: string;
  codigo: string;
  nome: string;
  preco: number;
  status: 'disponivel' | 'vendido';
  foto_url?: string;
  categoria?: string;
  descricao?: string;
}
```

### Variáveis de Ambiente
```bash
# PocketBase
PUBLIC_POCKETBASE_URL=https://your-pocketbase-instance.com

# n8n Webhook
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook

# Google Sheets
GOOGLE_SHEETS_ID=your-google-sheets-id
GOOGLE_API_KEY=your-google-api-key
```

## 📈 Roadmap

### Q1 2024 - POC
- ✅ Implementação da interface visual
- ✅ Fluxo completo de checkout
- ✅ Integração com backend
- 🔄 Testes em evento real

### Q2 2024 - Evolução
- 🔄 Leitura de QR codes
- 🔄 Otimizações de performance
- 🔄 Dashboard de vendas
- 🔄 Modo offline

### Q3 2024 - Expansão
- 🔄 Multi-tenancy
- 🔄 Integração com gateways de pagamento
- 🔄 App mobile nativo
- 🔄 Analytics avançados

## 🤝 Contribuição

Este projeto está em fase de POC. Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é proprietário e está sendo desenvolvido como uma prova de conceito para validação de mercado.

## 📞 Contato

**Stakeholder Principal:** rfranca-pc  
**Arquiteto de Software:** AI Assistant  
**Versão do Documento:** 1.1  
**Última Atualização:** 2024-01-15

---

**Documentos Relacionados:**
- [PRD - Checkout Comum POC](../docs_ia/PRD_Checkout_Comum_POC.md)
- [ADR-001 - Implementação de Interface de Listagem](../docs_ia/ADR-001.md)
