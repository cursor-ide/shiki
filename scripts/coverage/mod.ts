#!/usr/bin/env -S deno run -A --unstable
/**
 * mod.ts
 *
 * This module contains the core logic for generating the test coverage report.
 * It is designed to be used by the main entry point of the 'coverage' script.
 *
 * It handles the actual execution of the 'deno test' and 'deno coverage'
 * commands and provides feedback on the process.
 */

/**
 * Generates the test coverage report.
 *
 * @throws {Error} If the coverage generation process fails.
 */
export async function generateCoverage(): Promise<void> {
	const testCommand = new Deno.Command('deno', {
		args: ['test', '-A', '--coverage=coverage'],
		stdout: 'inherit',
		stderr: 'inherit',
	});

	console.log('🚀 Generating test coverage report...');

	const testStatus = await testCommand.output();

	if (!testStatus.success) {
		throw new Error('Failed to run tests for coverage.');
	}

	const coverageCommand = new Deno.Command('deno', {
		args: ['coverage', 'coverage'],
		stdout: 'inherit',
		stderr: 'inherit',
	});

	const coverageStatus = await coverageCommand.output();

	if (!coverageStatus.success) {
		throw new Error('Failed to generate coverage report.');
	}

	console.log('✅ Coverage report generated successfully.');
}
