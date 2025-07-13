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
</script>

<form class="flex flex-col sm:flex-row gap-4 p-4 bg-base-200 rounded-box mb-6">
	<div class="form-control flex-grow">
		<label class="label" for="search-term">
			<span class="label-text">Buscar por nome ou código</span>
		</label>
		<input
			id="search-term"
			type="text"
			placeholder="Jaqueta, camisa, etc."
			class="input input-bordered w-full"
			bind:value={searchTerm}
		/>
	</div>

	<div class="flex gap-4">
		<div class="form-control">
			<label class="label" for="min-price">
				<span class="label-text">Preço Mín.</span>
			</label>
			<input
				id="min-price"
				type="number"
				placeholder="R$ 0"
				class="input input-bordered w-full"
				bind:value={minPrice}
			/>
		</div>
		<div class="form-control">
			<label class="label" for="max-price">
				<span class="label-text">Preço Máx.</span>
			</label>
			<input
				id="max-price"
				type="number"
				placeholder="R$ 100"
				class="input input-bordered w-full"
				bind:value={maxPrice}
			/>
		</div>
	</div>
</form>