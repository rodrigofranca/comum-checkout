# 🌴 Migração para Tema Tropical - Guia Prático

Este guia ajuda você a migrar seu projeto existente para usar o tema Tropical Light.

## 📋 Checklist de Migração

### ✅ Pré-requisitos
- [ ] DaisyUI 5.x instalado
- [ ] Tailwind CSS 4.x configurado
- [ ] Projeto Svelte/SvelteKit funcionando

### ✅ Passos da Migração

1. **Configurar o Tema**
   - [ ] Adicionar configuração do tema em `app.css`
   - [ ] Atualizar `app.html` com data-theme padrão
   - [ ] Testar carregamento do tema

2. **Revisar Componentes**
   - [ ] Identificar componentes com cores hardcoded
   - [ ] Substituir por classes semânticas do DaisyUI
   - [ ] Testar contraste e acessibilidade

3. **Implementar Controle de Tema**
   - [ ] Adicionar seletor de tema (opcional)
   - [ ] Implementar persistência com localStorage
   - [ ] Testar mudanças de tema

## 🔧 Configuração Inicial

### 1. Atualizar `app/src/app.css`

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

  /* Cores principais */
  --color-primary: oklch(62% 0.18 185);
  --color-secondary: oklch(68% 0.16 45);
  --color-accent: oklch(75% 0.20 130);
  --color-neutral: oklch(45% 0.03 85);

  /* Cores base */
  --color-base-100: oklch(98% 0.008 85);
  --color-base-200: oklch(95% 0.015 85);
  --color-base-300: oklch(91% 0.025 85);
  --color-base-content: oklch(25% 0.02 85);

  /* Cores de estado */
  --color-info: oklch(65% 0.15 220);
  --color-success: oklch(70% 0.18 140);
  --color-warning: oklch(80% 0.15 85);
  --color-error: oklch(62% 0.20 15);

  /* Configurações de estilo */
  --radius-selector: 0.75rem;
  --radius-field: 0.5rem;
  --radius-box: 1rem;
  --border: 1px;
  --depth: 1;
  --noise: 0;
}
```

### 2. Atualizar `app/src/app.html`

```html
<!doctype html>
<html lang="en" data-theme="tropical-light">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

## 🎨 Migrando Componentes

### Botões

**❌ Antes (cores hardcoded):**
```html
<button class="bg-blue-500 text-white px-4 py-2 rounded">
  Salvar
</button>
<button class="bg-red-500 text-white px-4 py-2 rounded">
  Cancelar
</button>
```

**✅ Depois (tema tropical):**
```html
<button class="btn btn-primary">
  Salvar
</button>
<button class="btn btn-secondary">
  Cancelar
</button>
```

### Cards

**❌ Antes:**
```html
<div class="bg-white shadow-lg rounded-lg p-6">
  <h2 class="text-xl font-bold text-gray-800">Título</h2>
  <p class="text-gray-600">Descrição do card</p>
</div>
```

**✅ Depois:**
```html
<div class="card bg-base-100 shadow-lg">
  <div class="card-body">
    <h2 class="card-title">Título</h2>
    <p class="text-base-content/80">Descrição do card</p>
  </div>
</div>
```

### Formulários

**❌ Antes:**
```html
<input 
  type="text" 
  class="border border-gray-300 rounded px-3 py-2 w-full"
  placeholder="Digite algo..."
/>
<select class="border border-gray-300 rounded px-3 py-2 w-full">
  <option>Opção 1</option>
  <option>Opção 2</option>
</select>
```

**✅ Depois:**
```html
<input 
  type="text" 
  class="input input-bordered w-full"
  placeholder="Digite algo..."
/>
<select class="select select-bordered w-full">
  <option>Opção 1</option>
  <option>Opção 2</option>
</select>
```

### Alertas

**❌ Antes:**
```html
<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
  Operação realizada com sucesso!
</div>
<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
  Erro ao processar solicitação!
</div>
```

**✅ Depois:**
```html
<div class="alert alert-success">
  <span>Operação realizada com sucesso!</span>
</div>
<div class="alert alert-error">
  <span>Erro ao processar solicitação!</span>
</div>
```

### Navegação

**❌ Antes:**
```html
<nav class="bg-gray-800 text-white p-4">
  <div class="container mx-auto flex justify-between items-center">
    <h1 class="text-xl font-bold">Meu App</h1>
    <ul class="flex space-x-4">
      <li><a href="/" class="hover:text-gray-300">Home</a></li>
      <li><a href="/about" class="hover:text-gray-300">Sobre</a></li>
    </ul>
  </div>
</nav>
```

**✅ Depois:**
```html
<div class="navbar bg-base-100 shadow-lg">
  <div class="flex-1">
    <a class="btn btn-ghost normal-case text-xl">Meu App</a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1">
      <li><a href="/">Home</a></li>
      <li><a href="/about">Sobre</a></li>
    </ul>
  </div>
</div>
```

## 🎭 Implementando Controle de Tema

### Componente de Seletor de Tema

Crie `src/lib/components/ThemeSelector.svelte`:

```svelte
<script lang="ts">
  import { browser } from '$app/environment';
  
  let currentTheme = 'tropical-light';
  
  // Carregar tema salvo
  if (browser) {
    const savedTheme = localStorage.getItem('theme') || 'tropical-light';
    currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  
  function changeTheme(theme: string) {
    if (browser) {
      currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }
</script>

<div class="dropdown dropdown-end">
  <label tabindex="0" class="btn btn-ghost">
    🌴 Tema
  </label>
  <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
    <li>
      <button 
        class="flex items-center gap-2"
        class:active={currentTheme === 'tropical-light'}
        on:click={() => changeTheme('tropical-light')}
      >
        🌴 Tropical Light
      </button>
    </li>
    <li>
      <button 
        class="flex items-center gap-2"
        class:active={currentTheme === 'light'}
        on:click={() => changeTheme('light')}
      >
        ☀️ Light
      </button>
    </li>
    <li>
      <button 
        class="flex items-center gap-2"
        class:active={currentTheme === 'dark'}
        on:click={() => changeTheme('dark')}
      >
        🌙 Dark
      </button>
    </li>
  </ul>
</div>
```

### Usando o Seletor de Tema

Adicione ao seu layout `src/routes/+layout.svelte`:

```svelte
<script lang="ts">
  import "../app.css";
  import ThemeSelector from '$lib/components/ThemeSelector.svelte';
</script>

<div class="navbar bg-base-100 shadow-lg">
  <div class="flex-1">
    <a class="btn btn-ghost normal-case text-xl">Meu App</a>
  </div>
  <div class="flex-none">
    <ThemeSelector />
  </div>
</div>

<main class="container mx-auto p-4">
  <slot />
</main>
```

## 🔍 Verificações de Qualidade

### Contraste e Acessibilidade

```html
<!-- ✅ Bom contraste -->
<div class="bg-primary text-primary-content">
  Texto legível
</div>

<!-- ❌ Contraste ruim -->
<div class="bg-primary text-gray-300">
  Texto difícil de ler
</div>
```

### Teste de Responsividade

```html
<!-- ✅ Responsivo -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="card bg-base-200">...</div>
  <div class="card bg-base-200">...</div>
  <div class="card bg-base-200">...</div>
</div>
```

### Estados de Formulário

```html
<!-- Estados de input -->
<input type="text" class="input input-bordered" placeholder="Normal" />
<input type="text" class="input input-bordered input-primary" placeholder="Focado" />
<input type="text" class="input input-bordered input-error" placeholder="Erro" />
<input type="text" class="input input-bordered input-success" placeholder="Sucesso" />
```

## 📝 Problemas Comuns e Soluções

### 1. Tema não carrega no primeiro acesso

**Problema:** O tema não é aplicado imediatamente.

**Solução:** Adicione um script inline no `app.html`:

```html
<script>
  try {
    const savedTheme = localStorage.getItem('theme') || 'tropical-light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'tropical-light');
  }
</script>
```

### 2. Cores não aparecem

**Problema:** As classes de cor não funcionam.

**Solução:** Verifique se o plugin DaisyUI está configurado corretamente:

```css
@import "tailwindcss";
@plugin "daisyui" {
  themes: tropical-light --default;
}
```

### 3. Tema não persiste

**Problema:** O tema volta ao padrão após recarregar.

**Solução:** Implemente persistência correta:

```javascript
// Salvar
localStorage.setItem('theme', currentTheme);

// Carregar
const savedTheme = localStorage.getItem('theme') || 'tropical-light';
document.documentElement.setAttribute('data-theme', savedTheme);
```

## 🎯 Próximos Passos

1. **Teste em todos os navegadores**
2. **Verifique acessibilidade com ferramentas como axe**
3. **Documente componentes personalizados**
4. **Configure testes automatizados**
5. **Considere criar tema dark tropical**

## 🔗 Recursos Adicionais

- [Documentação completa](./TROPICAL_THEME.md)
- [Referência rápida](./TROPICAL_THEME_README.md)
- [Página de demonstração](/tropical-theme)
- [DaisyUI 5 Docs](https://daisyui.com)

---

*🌺 Transforme sua aplicação com o tema tropical! 🌺* 