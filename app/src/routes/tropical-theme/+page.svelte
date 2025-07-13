<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let currentTheme = 'tropical-light';

  // Aplica o tema imediatamente se no browser
  if (browser) {
    const savedTheme = localStorage.getItem('theme') || 'tropical-light';
    currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  onMount(() => {
    // Restaura tema salvo ou usa padrão
    const savedTheme = localStorage.getItem('theme') || 'tropical-light';
    currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
  });

  // Reativo para mudanças de tema
  $: if (browser) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
  }

  // Função para mudar tema
  function changeTheme(theme: string) {
    currentTheme = theme;
    if (browser) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }
</script>

<div class="min-h-screen bg-base-100 p-8">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-base-content mb-4">
        🌴 Tema Tropical Light DaisyUI
      </h1>
      <p class="text-base-content/80 text-lg">
        Um tema inspirado nas cores vibrantes do ambiente tropical
      </p>
    </div>

    <!-- Color Palette Display -->
    <div class="card bg-base-200 shadow-lg mb-8">
      <div class="card-body">
        <h2 class="card-title text-2xl mb-6">Paleta de Cores</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="w-full h-16 bg-primary rounded-lg mb-2 border border-base-300"></div>
            <span class="text-sm font-medium">Primary<br/>(Turquesa)</span>
          </div>
          <div class="text-center">
            <div class="w-full h-16 bg-secondary rounded-lg mb-2 border border-base-300"></div>
            <span class="text-sm font-medium">Secondary<br/>(Coral)</span>
          </div>
          <div class="text-center">
            <div class="w-full h-16 bg-accent rounded-lg mb-2 border border-base-300"></div>
            <span class="text-sm font-medium">Accent<br/>(Lime)</span>
          </div>
          <div class="text-center">
            <div class="w-full h-16 bg-neutral rounded-lg mb-2 border border-base-300"></div>
            <span class="text-sm font-medium">Neutral<br/>(Tronco)</span>
          </div>
          <div class="text-center">
            <div class="w-full h-16 bg-info rounded-lg mb-2 border border-base-300"></div>
            <span class="text-sm font-medium">Info<br/>(Oceano)</span>
          </div>
          <div class="text-center">
            <div class="w-full h-16 bg-success rounded-lg mb-2 border border-base-300"></div>
            <span class="text-sm font-medium">Success<br/>(Floresta)</span>
          </div>
          <div class="text-center">
            <div class="w-full h-16 bg-warning rounded-lg mb-2 border border-base-300"></div>
            <span class="text-sm font-medium">Warning<br/>(Sol)</span>
          </div>
          <div class="text-center">
            <div class="w-full h-16 bg-error rounded-lg mb-2 border border-base-300"></div>
            <span class="text-sm font-medium">Error<br/>(Hibisco)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Component Examples -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Buttons -->
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h3 class="card-title mb-4">Botões</h3>
          <div class="space-y-3">
            <div class="flex gap-2 flex-wrap">
              <button class="btn btn-primary">Primário</button>
              <button class="btn btn-secondary">Secundário</button>
              <button class="btn btn-accent">Destaque</button>
            </div>
            <div class="flex gap-2 flex-wrap">
              <button class="btn btn-info">Info</button>
              <button class="btn btn-success">Sucesso</button>
              <button class="btn btn-warning">Aviso</button>
              <button class="btn btn-error">Erro</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Badges -->
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h3 class="card-title mb-4">Badges</h3>
          <div class="space-y-3">
            <div class="flex gap-2 flex-wrap">
              <div class="badge badge-primary">Tropical</div>
              <div class="badge badge-secondary">Coral</div>
              <div class="badge badge-accent">Fresco</div>
            </div>
            <div class="flex gap-2 flex-wrap">
              <div class="badge badge-info">Oceânico</div>
              <div class="badge badge-success">Natural</div>
              <div class="badge badge-warning">Ensolarado</div>
              <div class="badge badge-error">Vibrante</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Elements -->
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h3 class="card-title mb-4">Formulários</h3>
          <div class="space-y-3">
            <input type="text" placeholder="Input normal" class="input input-bordered w-full" />
            <input type="text" placeholder="Input primário" class="input input-bordered input-primary w-full" />
            <select class="select select-bordered w-full">
              <option disabled selected>Selecione uma opção</option>
              <option>Praia</option>
              <option>Floresta</option>
              <option>Oceano</option>
            </select>
            <textarea class="textarea textarea-bordered w-full" placeholder="Textarea tropical"></textarea>
          </div>
        </div>
      </div>

      <!-- Cards -->
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h3 class="card-title mb-4">Cards</h3>
          <div class="space-y-3">
            <div class="card bg-primary text-primary-content">
              <div class="card-body p-4">
                <h4 class="card-title text-sm">Card Primário</h4>
                <p class="text-xs">Inspirado no mar turquesa</p>
              </div>
            </div>
            <div class="card bg-secondary text-secondary-content">
              <div class="card-body p-4">
                <h4 class="card-title text-sm">Card Secundário</h4>
                <p class="text-xs">Cor do pôr do sol</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Alerts -->
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h3 class="card-title mb-4">Alertas</h3>
          <div class="space-y-3">
            <div class="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Informação tropical!</span>
            </div>
            <div class="alert alert-success">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Sucesso tropical!</span>
            </div>
            <div class="alert alert-warning">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>Aviso tropical!</span>
            </div>
            <div class="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Erro tropical!</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Theme Controls -->
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h3 class="card-title mb-4">Controle de Tema</h3>
          <div class="space-y-3">
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Tema Tropical Light</span>
                <input
                  type="radio"
                  name="theme"
                  class="radio theme-controller"
                  value="tropical-light"
                  checked={currentTheme === 'tropical-light'}
                  on:change={() => changeTheme('tropical-light')}
                />
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Tema Light Original</span>
                <input
                  type="radio"
                  name="theme"
                  class="radio theme-controller"
                  value="light"
                  checked={currentTheme === 'light'}
                  on:change={() => changeTheme('light')}
                />
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Tema Dark</span>
                <input
                  type="radio"
                  name="theme"
                  class="radio theme-controller"
                  value="dark"
                  checked={currentTheme === 'dark'}
                  on:change={() => changeTheme('dark')}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="text-center mt-12 p-6 bg-base-200 rounded-lg">
      <p class="text-base-content/80">
        🌺 Tema Tropical Light criado com DaisyUI 5 e Tailwind CSS 🌺
      </p>
    </div>
  </div>
</div>