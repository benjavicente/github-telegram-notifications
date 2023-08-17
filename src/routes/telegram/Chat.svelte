<script lang="ts">
	import type { ChatFromGetChat } from 'grammy/types';

	export let chat: ChatFromGetChat;
	export let base64Img: string | null;

	function getName(chat: ChatFromGetChat): string {
		if (chat.type === 'private') {
			return chat.first_name;
		}
		if (chat.type === 'group') {
			return chat.title;
		}
		if (chat.type === 'supergroup') {
			return chat.title;
		}
		if (chat.type === 'channel') {
			return chat.title;
		}
		return 'Desconocido';
	}

	const name = getName(chat);
	const photo = chat.photo?.small_file_id;
</script>

<div class="flex gap-2">
	<div class="rounded h-12 w-12 overflow-clip">
		{#if base64Img}
			<img src={`data:image/png;base64, ${base64Img}`} alt={name} />
		{:else}
			{name
				.split(' ')
				.map((word) => word[0])
				.slice(0, 2)
				.join('')}
		{/if}
	</div>
	<div>
		{name}
	</div>
	<slot />
</div>
