#!/usr/bin/env -S deno run -A --unstable
/**
 * main.ts
 *
 * This script is the entry point for the 'publish' and 'publish:dry' tasks.
 * It handles the command-line arguments and orchestrates the publishing process.
 *
 * It delegates the core logic to the 'mod.ts' module and provides robust
 * error handling and command-line feedback.
 *
 * Usage:
 *   deno task -A publish
 *   deno task -A publish:dry
 */

import { publish } from './mod.ts';

if (import.meta.main) {
	const dryRun = Deno.args.includes('--dry-run');
	try {
		await publish({ dryRun });
	} catch (err) {
		console.error(`❗ Error publishing package: ${(err as Error).message}`);
		Deno.exit(1);
	}
}
