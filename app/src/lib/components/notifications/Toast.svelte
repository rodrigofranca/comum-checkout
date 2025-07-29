<script lang="ts">
	import toast from './toast.svelte';
	import { slide } from 'svelte/transition';

	const { toasts, removeToast } = toast;
</script>

<div class="toast toast-end">
	{#each toasts as { id, message, type } (id)}
		<div class="alert alert-{type}" transition:slide>
			<span>{message}</span>
			<button class="btn btn-ghost btn-xs" onclick={() => removeToast(id)}>X</button>
		</div>
	{/each}
</div>