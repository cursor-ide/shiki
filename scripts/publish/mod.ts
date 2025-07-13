#!/usr/bin/env -S deno run -A --unstable
/**
 * mod.ts
 *
 * This module contains the core logic for publishing the package to the registry.
 * It is designed to be used by the main entry point of the 'publish' script.
 *
 * It handles the actual execution of the 'deno publish' command and provides
 * feedback on the process.
 */

interface PublishOptions {
	dryRun?: boolean;
}

/**
 * Publishes the package to the registry.
 *
 * @param {PublishOptions} options - The options for publishing.
 * @throws {Error} If the publishing process fails.
 */
export async function publish(options: PublishOptions = {}): Promise<void> {
	const { dryRun = false } = options;
	const command = new Deno.Command('deno', {
		args: ['publish', '-A', ...(dryRun ? ['--dry-run'] : [])],
		stdout: 'inherit',
		stderr: 'inherit',
	});

	console.log(`🚀 Publishing package...${dryRun ? ' (dry run)' : ''}`);

	const status = await command.output();

	if (!status.success) {
		throw new Error('Failed to publish package.');
	}

	console.log('✅ Package published successfully.');
}
