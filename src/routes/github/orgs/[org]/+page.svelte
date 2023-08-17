<script lang="ts">
	import Chat from '../../../telegram/Chat.svelte';

	export let data;
	console.log(data.telegramLinksWithMeta[0]);
</script>

<div class="h-full max-w-xl mx-auto flex justify-center items-center flex-col">
	<h1>{data.organization.login}</h1>
	{#each data.telegramLinksWithMeta as { base64Img, chat, link }}
		<Chat {base64Img} {chat}>
			<svelte:fragment>
				{#if link.linkedGitHubOrgs.map((org) => org.githubOrgId).includes(data.organization.id)}
					<form method="post" action={`/github/orgs/${data.organization.login}/?/deactivate`}>
						<input type="hidden" name="linkId" value={link.id} />
						<button type="submit" class="btn">Eliminar notificaciones</button>
					</form>
				{:else}
					<form method="post" action={`/github/orgs/${data.organization.login}/?/activate`}>
						<input type="hidden" name="linkId" value={link.id} />
						<button type="submit" class="btn">Activar notificaciones</button>
					</form>
				{/if}
			</svelte:fragment>
		</Chat>
	{/each}
</div>
