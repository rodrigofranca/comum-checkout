### **PRD: Checkout Comum - Prova de Conceito (POC)**

| **Documento:** | PRD: Checkout Comum (POC) |
| :--- | :--- |
| **Versão:** | 1.2 |
| **Status:** | Aprovado |
| **Autor:** | Arquiteto de Software AI |
| **Stakeholder Principal:** | rfranca-pc |
| **Última Atualização:** | 2025-01-17 |
| **Decisões Relacionadas:** | ADR-001: Implementação de Interface de Listagem de Inventário<br/>ADR-002: Adição de Opção de Desconto por Porcentagem |

#### **1. Visão Geral e Resumo**

Este documento detalha os requisitos para uma Prova de Conceito (POC) de um aplicativo de checkout para brechós, batizado de "Checkout Comum". O objetivo é criar um sistema rápido e minimalista para registrar vendas durante eventos, como feiras. A solução validará a viabilidade de um fluxo de trabalho digital para substituir processos manuais, agilizando o atendimento e permitindo a captura de dados básicos de clientes para futuros relacionamentos.

**Atualização v1.1:** Conforme documentado no ADR-001, a implementação inicial priorizará uma interface de listagem visual de inventário para acelerar o desenvolvimento da POC, mantendo a leitura de QR codes como funcionalidade planejada para a Fase 2.

**Atualização v1.2:** Conforme documentado no ADR-002, expandida a funcionalidade de desconto (FEAT-03) para incluir tanto desconto por valor fixo quanto por porcentagem, oferecendo maior flexibilidade operacional para cenários de venda em brechós.

#### **2. O Problema**

Brechós que participam de feiras e eventos enfrentam um desafio no momento do checkout:
*   **Lentidão:** Processos manuais (anotação em caderno, uso de calculadora) são lentos e criam filas, frustrando clientes.
*   **Erros Manuais:** O cálculo manual de preços e descontos é propenso a erros, resultando em perdas financeiras ou cobranças incorretas.
*   **Perda de Dados:** Não há um método sistemático para registrar quais itens foram vendidos ou para capturar informações de contato dos clientes, impedindo ações de pós-venda e a criação de um mailing list.
*   **Controle de Estoque Inexistente:** Ao final do evento, é difícil saber exatamente o que foi vendido sem uma conferência manual demorada.

#### **3. Objetivos e Métricas de Sucesso (para a POC)**

O sucesso desta POC será medido pela validação de hipóteses chave durante o uso em uma feira real.

| Objetivo | Métrica de Sucesso |
| :--- | :--- |
| **1. Agilizar o processo de checkout.** | O tempo total para uma transação (do primeiro item selecionado à finalização) deve ser, em média, **inferior a 90 segundos**. |
| **2. Validar a aceitação pelos usuários.** | Feedback qualitativo positivo dos vendedores/caixas sobre a facilidade de uso e do cliente sobre a agilidade e recebimento do e-mail. |
| **3. Provar a viabilidade da arquitetura.** | O sistema deve operar durante a feira com **99% de uptime**, registrando todas as vendas com sucesso e sem perda de dados. |
| **4. Iniciar a construção de base de clientes.**| **Pelo menos 30%** das vendas devem resultar na captura do e-mail do cliente. |

#### **4. Personas de Usuário**

*   **Helena (Vendedora/Caixa - Usuária Primária):**
    *   **Necessidades:** Rapidez, simplicidade, interface intuitiva que não exija treinamento extenso, redução de erros de cálculo, visualização clara do inventário disponível.
    *   **Contexto:** Precisa atender múltiplos clientes rapidamente em um ambiente movimentado e com pouco espaço.

*   **Mariana (Cliente do Brechó - Usuária Secundária):**
    *   **Necessidades:** Uma experiência de compra sem atritos, um checkout rápido e a conveniência de receber um recibo digital.

#### **5. Requisitos do Produto e Funcionalidades**

A POC se concentrará no fluxo essencial de venda.

| ID | Requisito | Descrição | Prioridade |
| :--- | :--- | :--- | :--- |
| **FEAT-01** | **Listagem Visual de Inventário** | O sistema deve exibir uma interface com todos os itens disponíveis para venda em formato de grid/lista, incluindo foto (quando disponível), nome, código e preço. Deve permitir busca por nome ou código do item. | Obrigatório |
| **FEAT-01A** | **Seleção de Itens da Lista** | O usuário deve poder adicionar itens ao carrinho clicando diretamente nos produtos exibidos na listagem do inventário. | Obrigatório |
| **FEAT-01B** | **Busca e Filtros** | A interface deve incluir barra de busca para localizar itens por nome ou código, e filtros básicos como faixa de preço. | Obrigatório |
| **FEAT-02** | **Gerenciamento do Carrinho** | A interface deve exibir uma lista clara dos itens adicionados, o subtotal e a quantidade. O usuário deve poder remover um item do carrinho. | Obrigatório |
| **FEAT-03** | **Aplicação de Desconto** | O sistema deve oferecer duas modalidades de desconto sobre o subtotal da compra: **(A) Valor fixo em reais (R$)** - permitindo inserir um valor específico a ser descontado, e **(B) Porcentagem (%)** - permitindo aplicar um desconto percentual de 0% a 100%. O usuário deve poder alternar entre as duas modalidades através de uma interface intuitiva (toggle). | Obrigatório |
| **FEAT-04** | **Coleta de Dados do Cliente** | O usuário deve poder inserir o nome e/ou o e-mail do comprador. O campo de e-mail é obrigatório apenas para o envio do recibo. | Obrigatório |
| **FEAT-05** | **Seleção de Forma de Pagamento** | O usuário deve poder selecionar a forma de pagamento (Débito, Crédito, PIX) para fins de registro. Nenhuma transação financeira será processada. | Obrigatório |
| **FEAT-06** | **Finalização da Venda** | Um botão "Finalizar Compra" deve consolidar a transação, registrando-a no sistema e disparando as ações de pós-venda. | Obrigatório |
| **FEAT-07** | **Envio de Recibo por E-mail** | Após a finalização, um e-mail contendo os detalhes da compra (itens, preços, total) deve ser enviado automaticamente para o e-mail do cliente, se fornecido. | Obrigatório |
| **SYS-01** | **Sincronização de Produtos** | Os produtos disponíveis para venda devem ser sincronizados a partir de uma planilha do Google Sheets para o banco de dados da aplicação. | Obrigatório |
| **SYS-02** | **Atualização de Status do Item** | Ao finalizar uma venda, os itens vendidos devem ter seu status alterado para "vendido" no sistema, para evitar venda duplicada. | Obrigatório |

#### **5.1 Roadmap de Funcionalidades**

**Fase 1 - POC (Implementação Atual):**
- Listagem visual de inventário (FEAT-01, FEAT-01A, FEAT-01B)
- Fluxo completo de checkout (FEAT-02 até FEAT-07)
- Integração com backend (SYS-01, SYS-02)

**Fase 2 - Evolução (Pós-POC):**
- Registro de itens por QR Code/código de barras
- Otimizações de performance para inventários grandes
- Funcionalidades avançadas de busca e filtros

#### **6. Fluxo de Usuário Principal (Jornada da Vendedora)**

1.  Helena abre o aplicativo no seu dispositivo (tablet ou celular).
2.  **[NOVO]** A tela inicial exibe o inventário disponível em formato de grid com fotos, nomes e preços dos itens.
3.  **[NOVO]** Helena usa a barra de busca para encontrar "Camisa Jeans" rapidamente.
4.  **[NOVO]** Ela clica no item "Camisa Jeans Vintage - R$ 50,00" que é automaticamente adicionado ao carrinho. Um contador no canto superior direito indica "1 item no carrinho".
5.  **[NOVO]** Helena busca por "Bolsa" e clica em "Bolsa de Couro - R$ 80,00". O contador atualiza para "2 itens".
6.  **[NOVO]** Helena acessa o carrinho clicando no botão flutuante. O carrinho mostra subtotal de R$ 130,00.
7.  **[ATUALIZADO v1.2]** Helena oferece um desconto. Ela toca em "Aplicar Desconto", seleciona o tipo de desconto (alterna entre "R$" e "%"), e insere "10,00" para desconto fixo ou "10" para desconto percentual. O total é recalculado automaticamente (R$ 120,00 para desconto fixo de R$ 10,00 ou R$ 117,00 para desconto de 10%).
8.  Ela pergunta o nome e e-mail de Mariana e os insere nos campos apropriados.
9.  Mariana informa que pagará com PIX. Helena seleciona "PIX" na interface.
10. Helena clica em "Finalizar Compra".
11. O app exibe uma mensagem de sucesso. Simultaneamente, o sistema envia o recibo para o e-mail de Mariana e marca os dois itens como vendidos.
12. A interface do app é limpa, voltando à tela de inventário, pronta para a próxima venda.

#### **7. Fora do Escopo (Para esta POC)**

Para garantir a entrega rápida e focada, os seguintes itens estão **explicitamente fora do escopo**:
*   Integração com gateways de pagamento para processamento de transações.
*   Autenticação de usuários (login/senha para vendedores).
*   Dashboard de vendas e analytics.
*   Gestão de inventário complexa (além de marcar como "vendido").
*   Funcionalidade de devolução ou troca.
*   Modo offline.
*   **Leitura de QR codes/códigos de barras** *(movido para Fase 2)*

#### **8. Arquitetura Proposta**

Conforme discutido, utilizaremos a **Proposta 3 (Híbrida e Automatizada)**:
*   **Frontend:** SvelteKit (para leitura de dados e interface do usuário).
*   **Banco de Dados:** PocketBase (para armazenamento e API de leitura de dados).
*   **Backend/Lógica:** n8n (para orquestrar a lógica de escrita: processar vendas, atualizar inventário e enviar e-mails via webhooks).

#### **9. Especificações Técnicas da Interface**

**Estrutura de Dados dos Produtos:**
```json
{
  "id": "unique_id",
  "codigo": "BR001",
  "nome": "Camisa Jeans Vintage",
  "preco": 50.00,
  "status": "disponivel", // "disponivel" | "vendido"
  "foto_url": "https://storage.../foto.jpg", // opcional
  "categoria": "roupas", // opcional
  "descricao": "Descrição do item" // opcional
}
```

**Componentes Principais:**
- `InventoryGrid.svelte` - Grid responsivo dos produtos
- `ProductCard.svelte` - Card individual do produto
- `SearchBar.svelte` - Busca e filtros
- `CartFloating.svelte` - Botão flutuante do carrinho
- `CheckoutFlow.svelte` - Fluxo de finalização

#### **10. Hipóteses e Dependências**

*   **Hipótese:** Uma conexão estável com a internet estará disponível no local da feira.
*   **Dependência:** A infraestrutura (VPS com PocketBase e n8n) está funcional e acessível.
*   **Dependência:** A planilha do Google Sheets com os produtos existe e mantém uma estrutura consistente (ex: colunas para código, nome, preço, foto_url).
*   **Hipótese:** O inventário inicial terá entre 20-100 itens, permitindo navegação eficiente na interface visual.

#### **11. Critérios de Sucesso da Decisão Arquitetural**

Conforme documentado no ADR-001, a decisão de implementar listagem visual será considerada bem-sucedida se:
- O tempo médio de checkout permanecer abaixo de 90 segundos
- Feedback positivo dos usuários sobre facilidade de localizar itens
- Redução de pelo menos 40% no tempo de desenvolvimento comparado à implementação com QR codes

---

**Histórico de Versões:**
- **v1.0:** Versão inicial com foco em QR codes
- **v1.1:** Atualização para priorizar listagem visual de inventário (ADR-001)
- **v1.2:** Expansão da FEAT-03 para incluir desconto por porcentagem além do valor fixo (ADR-002) 