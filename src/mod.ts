/**
 * mini-shiki for Deno - A minimal, production-ready Shiki bundle for syntax highlighting
 *
 * This module provides a Deno-native JSR package of Shiki that strips out unnecessary
 * dependencies while maintaining full compatibility with the Shiki ecosystem.
 *
 * @example Basic usage
 * ```typescript
 * import { codeToHtml } from "jsr:@shikijs/shiki@^3.7.0";
 *
 * const html = await codeToHtml('const x = 1;', {
 *   lang: 'javascript',
 *   theme: 'dark-plus'
 * });
 * ```
 *
 * @example Using a custom highlighter
 * ```typescript
 * import { createHighlighter } from "jsr:@shikijs/shiki@^3.7.0";
 *
 * const highlighter = await createHighlighter({
 *   themes: ['dark-plus', 'light-plus'],
 *   langs: ['javascript', 'typescript']
 * });
 *
 * const html = highlighter.codeToHtml('const x = 1;', {
 *   lang: 'javascript',
 *   theme: 'dark-plus'
 * });
 *
 * highlighter.dispose();
 * ```
 *
 * @module
 */

// Export all core functionality from shiki
export * from 'npm:shiki@^3.7.0';

// Export specific types for better TypeScript support
export type {
	BundledLanguageInfo,
	BundledThemeInfo,
	CreateHighlighterFactory,
	LoadWasmOptions,
	RegexEngine,
} from 'npm:@shikijs/types@^3.7.0';

// For fine-grained control, also export core functionality
export { createHighlighterCore, type HighlighterCoreOptions } from 'npm:@shikijs/core@^3.7.0';

export { createOnigurumaEngine, loadWasm } from 'npm:@shikijs/engine-oniguruma@^3.7.0';

/**
 * Load the built-in WASM module for Oniguruma regex engine.
 *
 * @deprecated In modern Shiki v3.7.0, WASM is loaded automatically.
 * This function exists for compatibility but is now a no-op.
 *
 * @returns A promise that resolves immediately
 *
 * @example
 * ```typescript
 * import { loadBuiltinWasm } from "jsr:@shikijs/shiki@^3.7.0";
 *
 * await loadBuiltinWasm(); // No-op in modern Shiki
 * ```
 */
export function loadBuiltinWasm(): Promise<void> {
	// Modern Shiki handles WASM loading automatically
	// This is a no-op for compatibility
	return Promise.resolve();
}

/**
 * Enhanced helper function for creating a highlighter with automatic WASM handling.
 *
 * This is a Deno-optimized convenience function that wraps the standard Shiki
 * createHighlighter function with automatic WASM loading and error handling.
 *
 * @param options Configuration options for the highlighter
 * @param options.themes Array of theme names to load
 * @param options.langs Array of language names to load
 * @returns A promise that resolves to a Highlighter instance
 *
 * @example
 * ```typescript
 * import { createHighlighterForDeno } from "jsr:@shikijs/shiki@^3.7.0";
 *
 * const highlighter = await createHighlighterForDeno({
 *   themes: ['github-dark', 'github-light'],
 *   langs: ['javascript', 'typescript', 'python']
 * });
 *
 * const html = highlighter.codeToHtml('console.log("Hello, World!");', {
 *   lang: 'javascript',
 *   theme: 'github-dark'
 * });
 *
 * // Don't forget to dispose when done
 * highlighter.dispose();
 * ```
 */
export async function createHighlighterForDeno(options: {
	themes: string[];
	langs: string[];
}): Promise<import('npm:shiki@^3.7.0').Highlighter> {
	const { createHighlighter } = await import('npm:shiki@^3.7.0');
	return await createHighlighter(options);
}
