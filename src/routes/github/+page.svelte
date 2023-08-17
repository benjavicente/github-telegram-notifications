<script lang="ts">
	export let data;
</script>

<div class="h-full max-w-xl mx-auto flex justify-center items-center flex-col">
	{#if data.orgs}
		<ul class="flex flex-col gap-2 w-full">
			{#each data.orgs as { login, avatar_url }}
				<li class="bg-gray-900 flex gap-4 p-4">
					<img src={avatar_url} alt={login} class="w-16 h-16 rounded" />
					<div class="flex-grow">
						{login}
					</div>
					<div class="flex justify-end flex-col">
						<a href={`/github/orgs/${login}`} class="bg-sky-700 px-4 py-2"
							>Configurar notificaciones</a
						>
					</div>
				</li>
			{/each}
		</ul>
		<a href="/api/github/logout">Cerrar sessión</a>
	{:else}
		<a href="/api/github/login">Inicia sessión</a>
	{/if}
</div>
