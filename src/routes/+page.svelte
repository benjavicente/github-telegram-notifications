<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex gap-2 border-2 border-gray-700 px-6 py-8 bg-gray-900 rounded flex-col">
	{#if $page.data.github}
		<a href="/telegram" class="btn">Administrar grupos del bot</a>
		<a href="/github" class="btn">Administrar notificaciones de repos</a>
	{:else}
		<a href="/api/github/login" class="btn">Iniciar sesión</a>
	{/if}
</div>
