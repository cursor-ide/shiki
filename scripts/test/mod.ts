#!/usr/bin/env -S deno run -A --unstable
/**
 * mod.ts
 *
 * This module contains the core logic for running the tests.
 * It is designed to be used by the main entry point of the 'test' script.
 *
 * It handles the actual execution of the 'deno test' command and provides
 * feedback on the process.
 */

/**
 * Runs the tests.
 *
 * @throws {Error} If the test process fails.
 */
export async function runTests(): Promise<void> {
	const command = new Deno.Command('deno', {
		args: ['test', '-A', '--reload', 'tests/*.test.ts'],
		stdout: 'inherit',
		stderr: 'inherit',
	});

	console.log('🚀 Running tests...');

	const status = await command.output();

	if (!status.success) {
		throw new Error('Failed to run tests.');
	}

	console.log('✅ Tests completed successfully.');
}
