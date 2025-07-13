# 🌴 Tema Tropical Light - DaisyUI 5

Um tema light inspirado nas cores vibrantes e naturais do ambiente tropical, criado para DaisyUI 5 com paleta de cores que evoca praias, florestas tropicais, corais e o pôr do sol.

## 📋 Índice
- [Instalação](#instalação)
- [Uso Básico](#uso-básico)
- [Paleta de Cores](#paleta-de-cores)
- [Exemplos de Uso](#exemplos-de-uso)
- [Customização](#customização)
- [Variáveis CSS](#variáveis-css)
- [Boas Práticas](#boas-práticas)

## 🚀 Instalação

O tema já está configurado no projeto. Certifique-se de que o arquivo `app/src/app.css` contém:

```css
@import "tailwindcss";
@plugin "daisyui" {
  themes: tropical-light --default, light, dark;
}

@plugin "daisyui/theme" {
  name: "tropical-light";
  default: true;
  prefersdark: false;
  color-scheme: light;
  /* ... configurações do tema */
}
```

## 🎨 Paleta de Cores

### Cores Principais

| Cor | Descrição | Inspiração | Valor OKLCH |
|-----|-----------|------------|-------------|
| **Primary** | Turquesa vibrante | Mar tropical cristalino | `oklch(62% 0.18 185)` |
| **Secondary** | Coral quente | Pôr do sol tropical | `oklch(68% 0.16 45)` |
| **Accent** | Lime verde | Vegetação tropical fresca | `oklch(75% 0.20 130)` |
| **Neutral** | Marrom tronco | Casca das palmeiras | `oklch(45% 0.03 85)` |

### Cores de Estado

| Cor | Descrição | Inspiração | Valor OKLCH |
|-----|-----------|------------|-------------|
| **Info** | Azul oceano | Profundezas do mar | `oklch(65% 0.15 220)` |
| **Success** | Verde floresta | Vegetação densa | `oklch(70% 0.18 140)` |
| **Warning** | Amarelo sol | Sol tropical intenso | `oklch(80% 0.15 85)` |
| **Error** | Vermelho hibisco | Flor tropical vibrante | `oklch(62% 0.20 15)` |

### Cores Base

| Cor | Descrição | Inspiração | Valor OKLCH |
|-----|-----------|------------|-------------|
| **Base-100** | Branco cálido | Areia clara da praia | `oklch(98% 0.008 85)` |
| **Base-200** | Areia clara | Areia da praia | `oklch(95% 0.015 85)` |
| **Base-300** | Areia escura | Areia molhada | `oklch(91% 0.025 85)` |
| **Base-content** | Texto escuro | Sombra das palmeiras | `oklch(25% 0.02 85)` |

## 🎯 Uso Básico

### Aplicando o Tema

#### Via HTML
```html
<html data-theme="tropical-light">
  <!-- conteúdo -->
</html>
```

#### Via JavaScript
```javascript
document.documentElement.setAttribute('data-theme', 'tropical-light');
```

#### Via Svelte
```svelte
<script>
  import { onMount } from 'svelte';
  
  onMount(() => {
    document.documentElement.setAttribute('data-theme', 'tropical-light');
  });
</script>
```

### Persistência com localStorage

```javascript
// Salvar tema
localStorage.setItem('theme', 'tropical-light');

// Carregar tema
const savedTheme = localStorage.getItem('theme') || 'tropical-light';
document.documentElement.setAttribute('data-theme', savedTheme);
```

## 🌈 Exemplos de Uso

### Botões
```html
<button class="btn btn-primary">Turquesa</button>
<button class="btn btn-secondary">Coral</button>
<button class="btn btn-accent">Lime</button>
<button class="btn btn-success">Floresta</button>
<button class="btn btn-warning">Sol</button>
<button class="btn btn-error">Hibisco</button>
```

### Cards
```html
<div class="card bg-primary text-primary-content">
  <div class="card-body">
    <h2 class="card-title">Card Tropical</h2>
    <p>Inspirado no mar turquesa</p>
  </div>
</div>
```

### Badges
```html
<div class="badge badge-primary">Tropical</div>
<div class="badge badge-secondary">Coral</div>
<div class="badge badge-accent">Fresco</div>
```

### Formulários
```html
<input type="text" class="input input-primary" placeholder="Input tropical" />
<select class="select select-secondary">
  <option>Praia</option>
  <option>Floresta</option>
  <option>Oceano</option>
</select>
```

### Alertas
```html
<div class="alert alert-success">
  <span>Sucesso tropical!</span>
</div>
<div class="alert alert-warning">
  <span>Aviso ensolarado!</span>
</div>
```

## 🎨 Customização

### Modificando Cores Específicas

Para personalizar cores específicas do tema, você pode sobrescrever as variáveis CSS:

```css
@plugin "daisyui/theme" {
  name: "tropical-light";
  /* Customizar cor primária */
  --color-primary: oklch(65% 0.20 190); /* Turquesa mais escuro */
  --color-secondary: oklch(70% 0.18 50); /* Coral mais vibrante */
}
```

### Criando Variações

```css
/* Tema tropical mais suave */
@plugin "daisyui/theme" {
  name: "tropical-soft";
  color-scheme: light;
  --color-primary: oklch(65% 0.12 185);
  --color-secondary: oklch(70% 0.10 45);
  --color-accent: oklch(75% 0.15 130);
  /* ... outras cores */
}

/* Tema tropical mais vibrante */
@plugin "daisyui/theme" {
  name: "tropical-vibrant";
  color-scheme: light;
  --color-primary: oklch(60% 0.25 185);
  --color-secondary: oklch(65% 0.22 45);
  --color-accent: oklch(70% 0.25 130);
  /* ... outras cores */
}
```

## 🔧 Variáveis CSS

### Cores Completas
```css
/* Cores principais */
--color-primary: oklch(62% 0.18 185);
--color-primary-content: oklch(98% 0.005 185);
--color-secondary: oklch(68% 0.16 45);
--color-secondary-content: oklch(98% 0.005 45);
--color-accent: oklch(75% 0.20 130);
--color-accent-content: oklch(20% 0.02 130);
--color-neutral: oklch(45% 0.03 85);
--color-neutral-content: oklch(95% 0.005 85);

/* Cores base */
--color-base-100: oklch(98% 0.008 85);
--color-base-200: oklch(95% 0.015 85);
--color-base-300: oklch(91% 0.025 85);
--color-base-content: oklch(25% 0.02 85);

/* Cores de estado */
--color-info: oklch(65% 0.15 220);
--color-info-content: oklch(95% 0.005 220);
--color-success: oklch(70% 0.18 140);
--color-success-content: oklch(95% 0.005 140);
--color-warning: oklch(80% 0.15 85);
--color-warning-content: oklch(25% 0.02 85);
--color-error: oklch(62% 0.20 15);
--color-error-content: oklch(95% 0.005 15);

/* Raios de borda */
--radius-selector: 0.75rem;
--radius-field: 0.5rem;
--radius-box: 1rem;

/* Tamanhos */
--size-selector: 0.25rem;
--size-field: 0.25rem;

/* Borda */
--border: 1px;

/* Efeitos */
--depth: 1;
--noise: 0;
```

## 📝 Boas Práticas

### 1. Consistência de Cores
```html
<!-- ✅ Bom: Usar cores semânticas -->
<button class="btn btn-primary">Ação Principal</button>
<button class="btn btn-secondary">Ação Secundária</button>

<!-- ❌ Evitar: Cores hardcoded -->
<button class="btn bg-blue-500">Botão</button>
```

### 2. Contraste Adequado
```html
<!-- ✅ Bom: Usar cores de conteúdo apropriadas -->
<div class="bg-primary text-primary-content">
  Texto com bom contraste
</div>

<!-- ❌ Evitar: Texto difícil de ler -->
<div class="bg-primary text-gray-300">
  Texto com baixo contraste
</div>
```

### 3. Hierarquia Visual
```html
<!-- ✅ Bom: Usar primary para ações principais -->
<button class="btn btn-primary">Salvar</button>
<button class="btn btn-secondary">Cancelar</button>

<!-- ✅ Bom: Usar cores de estado apropriadas -->
<div class="alert alert-success">Sucesso!</div>
<div class="alert alert-error">Erro!</div>
```

### 4. Responsividade
```html
<!-- ✅ Bom: Considerar todos os tamanhos de tela -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div class="card bg-base-200">...</div>
  <div class="card bg-base-200">...</div>
</div>
```

### 5. Acessibilidade
```html
<!-- ✅ Bom: Usar atributos de acessibilidade -->
<button class="btn btn-primary" aria-label="Salvar documento">
  Salvar
</button>

<!-- ✅ Bom: Indicadores visuais claros -->
<input type="text" class="input input-error" aria-describedby="error-msg" />
<span id="error-msg" class="text-error">Campo obrigatório</span>
```

## 🎭 Seletor de Tema

Exemplo de implementação de um seletor de tema:

```svelte
<script>
  import { browser } from '$app/environment';
  
  let currentTheme = 'tropical-light';
  
  function changeTheme(theme) {
    if (browser) {
      currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }
</script>

<div class="form-control">
  <label class="label cursor-pointer">
    <span class="label-text">Tema Tropical</span>
    <input 
      type="radio" 
      name="theme" 
      class="radio theme-controller" 
      checked={currentTheme === 'tropical-light'}
      on:change={() => changeTheme('tropical-light')} 
    />
  </label>
</div>
```

## 🔗 Links Úteis

- [DaisyUI 5 Documentation](https://daisyui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [OKLCH Color Space](https://oklch.com)
- [Página de Demonstração](/tropical-theme)

## 🤝 Contribuindo

Para contribuir com melhorias no tema:

1. Mantenha a inspiração tropical
2. Use o espaço de cores OKLCH
3. Teste em diferentes componentes
4. Considere acessibilidade
5. Documente as mudanças

---

*Criado com 🌺 para trazer as cores vibrantes do paraíso tropical para suas aplicações* 