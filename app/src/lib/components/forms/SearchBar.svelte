<script lang="ts">
	let {
		searchTerm = $bindable(),
		minPrice = $bindable(),
		maxPrice = $bindable()
	} = $props<{
		searchTerm: string;
		minPrice?: number;
		maxPrice?: number;
	}>();

	function clearFilters() {
		searchTerm = '';
		minPrice = undefined;
		maxPrice = undefined;
	}
</script>

<form class="flex flex-col sm:flex-row items-center gap-4 p-4 bg-base-200 rounded-box mb-6">
	<div class="form-control flex-grow w-full">
		<label class="input input-bordered flex items-center gap-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 16 16"
				fill="currentColor"
				class="w-4 h-4 opacity-70 text-primary"
				><path
					fill-rule="evenodd"
					d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
					clip-rule="evenodd"
				/></svg
			>
			<input type="text" class="grow" placeholder="Buscar..." bind:value={searchTerm} />
		</label>
	</div>

	<div class="form-control w-full sm:w-auto">
		<input
			type="range"
			min={0}
			max={500}
			bind:value={maxPrice}
			class="range range-primary"
			step="10"
		/>
		<div class="w-full flex justify-between text-xs px-2">
			<span>R$0</span>
			<span>R${maxPrice || 500}</span>
		</div>
	</div>

	<div class="form-control">
		<button type="button" class="btn btn-ghost btn-sm" onclick={clearFilters}> Limpar </button>
	</div>
</form>