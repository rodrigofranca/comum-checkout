# ADR-002: Adição de Opção de Desconto por Porcentagem

| **Campo** | **Valor** |
|-----------|-----------|
| **Status** | Aceito |
| **Data** | 2025-01-17 |
| **Autor** | Arquiteto de Software AI |
| **Stakeholders** | rfranca-pc, Equipe de Desenvolvimento |
| **Relacionado** | PRD_Checkout_Comum_POC.md, FEAT-03, ADR-001 |

## **Contexto**

A FEAT-03 do PRD especifica que "deve haver uma opção para aplicar um desconto de valor fixo (R$) sobre o subtotal da compra". Durante a implementação da funcionalidade de desconto, identificamos que vendedores em brechós frequentemente trabalham com descontos percentuais além dos valores fixos, especialmente para:

- Promoções sazonais (ex: "20% de desconto")
- Vendas em lote (ex: "15% na compra de 3 ou mais itens")
- Negociações com clientes regulares
- Estratégias de liquidação de estoque

## **Decisão**

Decidimos **expandir a FEAT-03** para incluir uma segunda modalidade de desconto por porcentagem, mantendo a opção de valor fixo já implementada. O usuário poderá escolher entre aplicar desconto em valor absoluto (R$) ou percentual (%).

## **Alternativas Consideradas**

### **Opção 1: Manter Apenas Desconto Fixo (Status Quo)**
- **Prós:** Simplicidade, menos complexidade de interface, implementação já concluída
- **Contras:** Limitado para cenários de negociação, não atende práticas comuns de brechó

### **Opção 2: Substituir por Desconto Percentual**
- **Prós:** Mais flexível para diferentes cenários
- **Contras:** Quebra compatibilidade com implementação atual, pode ser menos intuitivo para valores pequenos

### **Opção 3: Interface Dupla com Toggle (Escolhida)**
- **Prós:** 
  - Máxima flexibilidade para o usuário
  - Mantém implementação atual
  - Atende ambos os casos de uso
  - Interface familiar (comum em apps de e-commerce)
- **Contras:** Ligeiro aumento na complexidade da interface

### **Opção 4: Dois Campos Separados**
- **Prós:** Muito claro qual tipo está sendo aplicado
- **Contras:** Interface mais carregada, possível confusão se ambos forem preenchidos

## **Rationale**

### **Necessidade de Negócio**
- Brechós frequentemente oferecem descontos percentuais em promoções
- Facilita cálculos mentais do vendedor ("vou dar 10% de desconto")
- Atende expectativas dos clientes habituados a promoções percentuais

### **Experiência do Usuário**
- Toggle simples entre "R$" e "%" mantém interface limpa
- Comportamento familiar de apps de calculadora e e-commerce
- Validação automática previne erros de cálculo

### **Flexibilidade Operacional**
- Suporta diferentes estratégias de venda
- Permite adaptação a diferentes perfis de cliente
- Facilita treinamento de novos vendedores

## **Especificação Técnica**

### **Interface Proposta**
```svelte
<!-- Toggle para tipo de desconto -->
<div class="tabs tabs-boxed mb-2">
  <button class="tab {discountType === 'fixed' ? 'tab-active' : ''}" 
          onclick={() => setDiscountType('fixed')}>
    R$
  </button>
  <button class="tab {discountType === 'percentage' ? 'tab-active' : ''}" 
          onclick={() => setDiscountType('percentage')}>
    %
  </button>
</div>

<!-- Input único que muda comportamento -->
<input 
  type="number" 
  placeholder={discountType === 'fixed' ? '0,00' : '0'}
  max={discountType === 'fixed' ? subtotal : 100}
  step={discountType === 'fixed' ? '0.01' : '1'}
/>
```

### **Lógica de Cálculo**
```typescript
function calculateDiscount(value: number, type: 'fixed' | 'percentage', subtotal: number): number {
  if (type === 'fixed') {
    return Math.min(value, subtotal); // Não pode exceder subtotal
  } else {
    const percentage = Math.min(value, 100); // Máximo 100%
    return (subtotal * percentage) / 100;
  }
}
```

### **Validações**
- **Desconto Fixo:** Valor não pode exceder o subtotal
- **Desconto Percentual:** Valor não pode exceder 100%
- **Ambos:** Valores não podem ser negativos

## **Consequências**

### **Positivas**
- **Flexibilidade aumentada:** Atende mais cenários de uso real
- **UX melhorada:** Interface familiar e intuitiva
- **Facilita vendas:** Vendedores podem aplicar estratégias variadas
- **Compatibilidade:** Mantém funcionalidade atual intacta

### **Negativas**
- **Complexidade adicional:** Mais estados para gerenciar e testar
- **Potencial confusão:** Usuários podem não entender a diferença inicialmente
- **Validação extra:** Necessário implementar validações específicas para cada tipo

### **Neutras**
- **Performance:** Impacto mínimo no desempenho
- **Manutenibilidade:** Código bem estruturado facilita manutenção futura

## **Plano de Implementação**

### **Fase 1 - Extensão da FEAT-03**
1. Adicionar estado `discountType` ao `cart.svelte.ts`
2. Modificar `DiscountInput.svelte` para incluir toggle R$/% 
3. Implementar função `calculateDiscount` com ambos os tipos
4. Atualizar validações para cada modalidade
5. Adicionar testes para ambos os cenários

### **Fase 2 - Melhorias (Opcional)**
1. Preset de porcentagens comuns (5%, 10%, 15%, 20%)
2. Histórico de descontos aplicados
3. Regras de desconto automático baseadas em quantidade

## **Critérios de Sucesso**

- Usuários conseguem aplicar tanto descontos fixos quanto percentuais sem confusão
- Tempo de aplicação de desconto permanece abaixo de 10 segundos
- Zero erros de cálculo reportados nos testes de usuário
- Interface permanece limpa e intuitiva

## **Riscos e Mitigações**

### **Risco: Confusão do Usuário**
- **Mitigação:** Labels claros, tooltips explicativos, feedback visual imediato

### **Risco: Erros de Cálculo**
- **Mitigação:** Testes automatizados extensivos, validação em tempo real

### **Risco: Complexidade de Interface**
- **Mitigação:** Design minimalista, toggle simples, preview do desconto

## **Aprovação**

- [x] Stakeholder Principal: rfranca-pc
- [x] Arquiteto de Software: AI
- [x] Equipe de Desenvolvimento: Aprovado

---

**Próximos Passos:**
1. ✅ Atualizar FEAT-03 no PRD com as duas modalidades - Concluído
2. Iniciar implementação da extensão do componente `DiscountInput`
3. Realizar testes de integração com ambas as modalidades
4. Validar interface com usuários finais 