<script lang="ts">
	import Chat from './Chat.svelte';

	export let data;
	let copyButton: HTMLButtonElement;
	let copyTimeout: ReturnType<typeof setTimeout>;
</script>

<div class="flex gap-4 border-2 border-gray-700 px-6 py-8 bg-gray-900 rounded flex-col">
	<div>
		<h1 class="text-center font-bold">Añade al Bot</h1>
		{#if data.linkRequest}
			{@const linkRequest = data.linkRequest}
			<div>
				<div>
					Envía
					<button>
						<code>/link {linkRequest.id}</code>
					</button>
					al
					<a
						href="https://t.me/github_ayudante_bot"
						class="underline"
						target="_blank"
						rel="noopener noreferrer">bot en Telegram</a
					>.
				</div>
				<div class="w-full grid grid-cols-2 gap-2">
					<button
						class="btn flex-grow"
						bind:this={copyButton}
						on:click={({}) => {
							navigator.clipboard.writeText(`/link ${linkRequest.id}`);
							copyButton.innerText = 'Copiado';
							clearTimeout(copyTimeout);
							copyTimeout = setTimeout(() => {
								copyButton.innerText = 'Copiar a portapapeles';
							}, 1000);
						}}>Copiar a portapapeles</button
					>
					<form method="post" action="/telegram/?/deleteTelegramLinkRequest" class="contents">
						<button type="submit" class="btn flex-grow">Cancelar</button>
					</form>
				</div>
			</div>
		{:else}
			<form method="post" action="/telegram/?/createTelegramLink" class="contents">
				<button type="submit" class="btn">Crear enlace a grupo</button>
			</form>
		{/if}
	</div>

	<div>
		<h1 class="text-center font-bold">Chats</h1>
		{#each data.linksWithMeta as { chat, link, base64Img } (link.id)}
			<Chat {chat} {base64Img}>
				<form method="post" action="/telegram/?/deleteTelegramLink">
					<input type="hidden" name="chatId" value={link.id} />
					<button type="submit" class="btn">Eliminar</button>
				</form>
			</Chat>
		{/each}
	</div>
</div>
