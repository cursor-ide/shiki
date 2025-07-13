#!/usr/bin/env -S deno run -A --unstable
/**
 * main.ts
 *
 * This script is the entry point for the 'test' task. It orchestrates the
 * process of running the tests.
 *
 * It delegates the core logic to the 'mod.ts' module and provides robust
 * error handling and command-line feedback.
 *
 * Usage:
 *   deno task -A test
 */

import { runTests } from './mod.ts';

if (import.meta.main) {
	try {
		await runTests();
	} catch (err) {
		console.error(`❌ Error running tests: ${(err as Error).message}`);
		Deno.exit(1);
	}
}
