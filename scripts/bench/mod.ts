#!/usr/bin/env -S deno run -A --unstable
/**
 * mod.ts
 *
 * This module contains the core logic for running the benchmarks.
 * It is designed to be used by the main entry point of the 'bench' script.
 *
 * It handles the actual execution of the 'deno bench' command and provides
 * feedback on the process.
 */

/**
 * Runs the benchmarks.
 *
 * @throws {Error} If the benchmark process fails.
 */
export async function runBenchmarks(): Promise<void> {
	const command = new Deno.Command('deno', {
		args: ['bench', '-A', 'tests/benchmarks/*.bench.ts'],
		stdout: 'inherit',
		stderr: 'inherit',
	});

	console.log('🚀 Running benchmarks...');

	const status = await command.output();

	if (!status.success) {
		throw new Error('Failed to run benchmarks.');
	}

	console.log('✅ Benchmarks completed successfully.');
}
