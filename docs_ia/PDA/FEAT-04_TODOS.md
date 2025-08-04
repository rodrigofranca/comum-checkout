#### **Fase 1: Análise e Estrutura de Dados**

## TODOs: 1.1 Análise do Estado Atual

- [x] **Analisar `cart.svelte.ts`:** Revisar estrutura atual do carrinho e identificar onde integrar dados do cliente.
- [x] **Analisar `CartView.svelte`:** Examinar interface atual do carrinho e fluxo de checkout.
- [x] **Analisar `types.ts`:** Revisar tipos existentes e identificar necessidade de novos tipos.
- [x] **Mapear fluxo atual de finalização:** Entender como funciona o processo de finalização da compra.

## TODOs: 1.2 Definição de Interfaces e Tipos

- [x] **Criar interface `CustomerData`:** Definir estrutura para nome, email e preferência de recibo.
- [x] **Criar interface `CustomerState`:** Definir estado reativo para gerenciamento dos dados.
- [x] **Atualizar `types.ts`:** Adicionar as novas interfaces ao arquivo de tipos.
- [x] **Definir validações de tipos:** Especificar regras de validação para email.

## TODOs: 1.3 Módulo de Gerenciamento de Estado

- [x] **Criar `customer.svelte.ts`:** Arquivo para gerenciar estado dos dados do cliente.
- [x] **Implementar estado reativo:** Usar `$state` para dados do cliente.
- [x] **Criar função `validateEmail()`:** Validação robusta de formato de email.
- [x] **Criar função `setCustomerData()`:** Atualizar dados do cliente.
- [x] **Criar função `clearCustomerData()`:** Limpar dados após finalização.
- [x] **Criar função `canFinalizePurchase()`:** Verificar se dados obrigatórios estão preenchidos.

#### **Fase 2: Desenvolvimento da Interface**

### **TODOs: 2.1 `CustomerForm.svelte` - Formulário de Coleta**

- [x] **Criar o arquivo do componente:** Criar em `src/lib/components/forms/CustomerForm.svelte`.  
- [x] **Definir as propriedades (`props`):** Receber função de callback para atualização dos dados.
- [x] **Estruturar layout com DaisyUI:** Usar classes do tema tropical para estilização.
- [x] **Implementar campo nome:** Input text opcional com placeholder apropriado.
- [x] **Implementar checkbox recibo:** "Deseja receber recibo por email?".
- [x] **Implementar campo email condicional:** Visível e obrigatório apenas se checkbox marcado.
- [x] **Adicionar validação visual:** Feedback em tempo real para validação de email.
- [x] **Implementar responsividade:** Garantir funcionamento em diferentes tamanhos de tela.

### **TODOs: 2.2 Integração com `CartView.svelte`**

- [x] **Importar `CustomerForm`:** Adicionar import do novo componente.
- [x] **Posicionar no fluxo de checkout:** Inserir antes do botão de finalização.
- [x] **Conectar com estado do cliente:** Integrar com `customer.svelte.ts`.
- [x] **Modificar botão "Finalizar Compra":** Tornar condicional baseado em dados obrigatórios.
- [x] **Adicionar indicadores visuais:** Mostrar quando dados obrigatórios estão faltando.
- [x] **Implementar persistência localStorage:** Salvar e recuperar dados automaticamente.
- [x] **Adicionar carregamento automático:** Recuperar dados salvos na inicialização.
- [x] **Integrar limpeza completa:** Limpar dados do cliente junto com carrinho.

#### **Fase 3: Lógica de Negócio e Persistência**

### **TODOs: 3.1 Integração com Sistema de Checkout**

- [x] **Modificar função de finalização:** Incluir dados do cliente no processo.
- [x] **Implementar persistência temporária:** Usar localStorage para dados durante sessão.
- [x] **Integrar com envio de recibo:** Passar dados para sistema de email (n8n).
- [x] **Implementar limpeza automática:** Limpar dados após finalização ou ao esvaziar carrinho.
- [x] **Configurar webhook n8n:** Adicionar URL do webhook via variável de ambiente.
- [x] **Estruturar payload de venda:** Organizar dados para envio ao backend.
- [x] **Implementar tratamento de erros:** Feedback adequado em caso de falha.

#### **Fase 4: UX e Acessibilidade**

### **TODOs: 4.1 Melhorias de Experiência do Usuário**

- [x] **Implementar labels para acessibilidade:** Garantir navegação por teclado.
- [x] **Adicionar tooltips explicativos:** Explicar quando email é obrigatório.
- [x] **Otimizar fluxo de interação:** Garantir transições suaves entre estados.
- [x] **Validar tema tropical:** Confirmar consistência visual com resto da aplicação.
- [x] **Corrigir CartFloating:** Implementar modal com scroll correto e backdrop funcional.
- [x] **Atualizar sintaxe Tailwind:** Usar nova sintaxe bg-color/opacity (bg-neutral/50).
- [x] **Implementar controle de scroll:** Desabilitar scroll da página quando carrinho aberto.
- [x] **Adicionar suporte a teclado:** Tecla Escape para fechar carrinho.

#### **Fase 5: Testes e Validação**

### **TODOs: 5.1 Testes Funcionais**

- [x] **Testar fluxo completo:** Checkout com e sem dados do cliente.
- [x] **Testar cenários de email:** Com e sem checkbox marcado.
- [x] **Testar validação de email:** Formatos válidos e inválidos.
- [x] **Testar casos edge:** Campos vazios, dados muito longos, caracteres especiais.
- [x] **Testar responsividade:** Verificar em diferentes dispositivos e tamanhos de tela.
- [x] **Testar integração:** Confirmar funcionamento com PocketBase e n8n.
- [x] **Criar página de teste:** Implementar /test/customer-form com cenários completos.
- [x] **Documentar casos de teste:** Criar passo a passo detalhado para validação.
- [x] **Corrigir problemas encontrados:** Resolver bugs de importação e layout.
- [x] **Validar persistência:** Confirmar funcionamento do localStorage.

---

## **✅ FEAT-04 - CONCLUÍDA**

### **Resumo Final**
- **Todas as 5 fases** foram implementadas e testadas com sucesso
- **30+ tarefas** completadas incluindo extras identificadas durante desenvolvimento
- **Funcionalidade pronta** para integração com PocketBase e n8n em produção
- **Interface testada** e validada com todos os cenários de uso

### **Entregáveis**
1. **Interfaces TypeScript** - CustomerData e CustomerState
2. **Módulo de estado** - customer.svelte.ts com validação robusta
3. **Componente de formulário** - CustomerForm.svelte com tema tropical
4. **Integração completa** - CartView.svelte modificado com lógica de finalização
5. **Carrinho flutuante** - CartFloating.svelte corrigido e funcional
6. **Página de teste** - /test/customer-form para validação completa
7. **Documentação** - CLAUDE.md atualizado com novas convenções