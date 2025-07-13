# ADR-001: Implementação de Interface de Listagem de Inventário

| **Campo** | **Valor** |
|-----------|-----------|
| **Status** | Aceito |
| **Data** | 2024-01-15 |
| **Autor** | Arquiteto de Software AI |
| **Stakeholders** | rfranca-pc, Equipe de Desenvolvimento |
| **Relacionado** | PRD_Checkout_Comum_POC.md |

## **Contexto**

O PRD original do Checkout Comum especificava que o registro de itens seria feito através de códigos únicos ou QR codes escaneados (FEAT-01). Durante a análise de implementação, identificamos que a funcionalidade de leitura de QR codes pode adicionar complexidade técnica significativa ao desenvolvimento inicial da POC, potencialmente atrasando a validação do conceito core.

## **Decisão**

Decidimos implementar uma **tela de listagem visual de inventário** como método principal de seleção de itens para o checkout na versão inicial da POC, postergando a implementação de leitura de QR codes para uma segunda fase.

## **Alternativas Consideradas**

### **Opção 1: Implementação Original (QR Codes)**
- **Prós:** Fluxo mais rápido após setup, experiência "high-tech"
- **Contras:** Complexidade de implementação, dependência de câmera, necessidade de geração/impressão de QR codes

### **Opção 2: Apenas Input Manual de Códigos**
- **Prós:** Simplicidade máxima de implementação
- **Contras:** Experiência de usuário inferior, propensa a erros de digitação

### **Opção 3: Listagem Visual de Inventário (Escolhida)**
- **Prós:** 
  - Desenvolvimento mais rápido
  - UX intuitiva para vendedora
  - Visualização completa do inventário
  - Funcionalidade de busca
  - Base sólida para evolução
- **Contras:** Pode ser mais lenta para inventários muito grandes

## **Rationale**

### **Velocidade de Desenvolvimento**
- Remove dependências de bibliotecas de câmera/scanner
- Elimina necessidade de geração prévia de QR codes
- Foca no fluxo core de negócio

### **Validação da POC**
- Permite testar rapidamente a hipótese central de agilizar o checkout
- Mantém todos os requisitos essenciais intactos
- Reduz variáveis que podem impactar os testes

### **Experiência do Usuário**
- Vendedora pode ver todos os itens disponíveis
- Busca por nome facilita localização
- Indicadores visuais melhoram a experiência

## **Consequências**

### **Positivas**
- **Desenvolvimento acelerado:** Redução estimada de 40-60% no tempo de desenvolvimento inicial
- **Menor risco técnico:** Menos pontos de falha na POC
- **Melhor debuggabilidade:** Interface mais simples de testar e corrigir
- **Flexibilidade:** Permite iteração rápida no design da interface

### **Negativas**
- **Escalabilidade:** Pode ser menos eficiente para inventários muito grandes (>100 itens)
- **Velocidade de checkout:** Potencialmente mais lenta que QR codes para usuários experientes
- **Dependência de tela:** Requer dispositivo com tela adequada

### **Neutras**
- **Roadmap técnico:** QR codes permanecem como feature planejada para Fase 2
- **Arquitetura:** Não impacta a decisão de usar SvelteKit + PocketBase + n8n

## **Plano de Implementação**

### **Fase 1 - POC (Atual)**
1. Implementar `InventoryGrid.svelte` com grid responsivo
2. Adicionar funcionalidade de busca e filtros básicos
3. Integrar com PocketBase para listagem de produtos
4. Implementar adição de itens ao carrinho via clique

### **Fase 2 - Evolução**
1. Adicionar suporte a QR codes como método alternativo
2. Otimizar performance para inventários grandes
3. Implementar busca avançada e filtros complexos

## **Critérios de Revisão**

Esta decisão deve ser revisada após a POC se:
- O tempo de checkout médio exceder 120 segundos (vs. meta de 90s)
- Feedback dos usuários indicar dificuldade em localizar itens
- O inventário crescer consistentemente acima de 100 itens

## **Aprovação**

- [x] Stakeholder Principal: rfranca-pc
- [x] Arquiteto de Software: AI
- [x] Equipe de Desenvolvimento: Aprovação implícita

---

**Próximos Passos:**
1. Atualizar PRD_Checkout_Comum_POC.md com as mudanças nos requisitos
2. Iniciar desenvolvimento da interface de listagem de inventário
3. Definir estrutura de dados para produtos no PocketBase 