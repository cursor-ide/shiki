#!/usr/bin/env -S deno run -A --unstable
/**
 * main.ts
 *
 * This script is the entry point for the 'coverage' task. It orchestrates the
 * process of generating the test coverage report.
 *
 * It delegates the core logic to the 'mod.ts' module and provides robust
 * error handling and command-line feedback.
 *
 * Usage:
 *   deno task -A coverage
 */

import { generateCoverage } from './mod.ts';

if (import.meta.main) {
	try {
		await generateCoverage();
	} catch (err) {
		console.error(
			`❌ Error generating coverage report: ${(err as Error).message}`,
		);
		Deno.exit(1);
	}
}
