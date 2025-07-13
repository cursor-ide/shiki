#!/usr/bin/env -S deno run -A --unstable
/**
 * main.ts
 *
 * This script is the entry point for the 'bench' task. It orchestrates the
 * process of running the benchmarks.
 *
 * It delegates the core logic to the 'mod.ts' module and provides robust
 * error handling and command-line feedback.
 *
 * Usage:
 *   deno task -A bench
 */

import { runBenchmarks } from './mod.ts';

if (import.meta.main) {
	try {
		await runBenchmarks();
	} catch (err) {
		console.error(`❌ Error running benchmarks: ${(err as Error).message}`);
		Deno.exit(1);
	}
}
