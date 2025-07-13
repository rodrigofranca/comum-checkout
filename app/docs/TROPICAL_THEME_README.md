# 🌴 Tropical Light Theme - Quick Reference

> Um tema DaisyUI 5 inspirado nas cores vibrantes do paraíso tropical

## 🚀 Quick Start

```css
/* app/src/app.css */
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
  --color-primary: oklch(62% 0.18 185);        /* Turquesa */
  --color-secondary: oklch(68% 0.16 45);       /* Coral */
  --color-accent: oklch(75% 0.20 130);         /* Lime */
  --color-neutral: oklch(45% 0.03 85);         /* Tronco */
  
  /* Cores base */
  --color-base-100: oklch(98% 0.008 85);       /* Areia clara */
  --color-base-200: oklch(95% 0.015 85);       /* Areia */
  --color-base-300: oklch(91% 0.025 85);       /* Areia escura */
  --color-base-content: oklch(25% 0.02 85);    /* Texto escuro */
  
  /* Cores de estado */
  --color-info: oklch(65% 0.15 220);           /* Oceano */
  --color-success: oklch(70% 0.18 140);        /* Floresta */
  --color-warning: oklch(80% 0.15 85);         /* Sol */
  --color-error: oklch(62% 0.20 15);           /* Hibisco */
  
  /* Configurações */
  --radius-selector: 0.75rem;
  --radius-field: 0.5rem;
  --radius-box: 1rem;
  --border: 1px;
  --depth: 1;
  --noise: 0;
}
```

## 🎨 Color Palette

| Cor | Hex Aproximado | Uso |
|-----|---------------|-----|
| **Primary** | `#1CBAB4` | Ações principais, links |
| **Secondary** | `#E67E22` | Ações secundárias, destaques |
| **Accent** | `#A4D65E` | Elementos de destaque |
| **Success** | `#52C41A` | Sucesso, confirmações |
| **Warning** | `#FAAD14` | Avisos, alertas |
| **Error** | `#F5222D` | Erros, perigos |
| **Info** | `#1890FF` | Informações |

## 🎯 Common Usage

```html
<!-- Botões -->
<button class="btn btn-primary">Tropical</button>
<button class="btn btn-secondary">Coral</button>
<button class="btn btn-accent">Lime</button>

<!-- Cards -->
<div class="card bg-primary text-primary-content">
  <div class="card-body">
    <h2 class="card-title">Tropical Card</h2>
    <p>Mar turquesa inspirado</p>
  </div>
</div>

<!-- Formulários -->
<input type="text" class="input input-primary" placeholder="Tropical input" />
<select class="select select-secondary">
  <option>Praia</option>
  <option>Floresta</option>
</select>

<!-- Alertas -->
<div class="alert alert-success">
  <span>Sucesso tropical!</span>
</div>
```

## 🔧 Theme Control

```javascript
// Aplicar tema
document.documentElement.setAttribute('data-theme', 'tropical-light');

// Salvar no localStorage
localStorage.setItem('theme', 'tropical-light');

// Carregar tema salvo
const savedTheme = localStorage.getItem('theme') || 'tropical-light';
document.documentElement.setAttribute('data-theme', savedTheme);
```

## 📱 Demo

Acesse `/tropical-theme` para ver todos os componentes em ação.

## 📚 Documentação Completa

Veja [TROPICAL_THEME.md](./TROPICAL_THEME.md) para documentação completa.

---

*🌺 Tropical vibes for your apps 🌺* 