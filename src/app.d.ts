// See https://kit.svelte.dev/docs/types#app

import type { PrismaClient } from '@prisma/client';
import type { Octokit } from 'octokit';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			github: {
				token: string;
				octokit: InstanceType<typeof Octokit>;
			} | null;
			prisma: PrismaClient;
		}
		interface PageData {
			github: {
				token: string;
			} | null;
		}
		// interface Platform {}
	}
}

export {};
