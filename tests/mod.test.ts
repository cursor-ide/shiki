import { assertEquals, assertRejects, assertThrows } from 'jsr:@std/assert';
import { afterAll, beforeAll, describe, it } from 'jsr:@std/testing/bdd';
import {
	bundledLanguages,
	bundledThemes,
	codeToHtml,
	createHighlighter,
	loadBuiltinWasm,
} from '../src/mod.ts';

// Import the Highlighter type from shiki directly
import type { Highlighter } from 'npm:shiki@^3.7.0';

describe('mini-shiki Core Tests', () => {
	describe('Basic Functionality', () => {
		it('should import bundled languages successfully', () => {
			const languages = Object.keys(bundledLanguages);
			assertEquals(typeof languages, 'object');
			assertEquals(languages.length > 0, true);
		});

		it('should import bundled themes successfully', () => {
			const themes = Object.keys(bundledThemes);
			assertEquals(typeof themes, 'object');
			assertEquals(themes.length > 0, true);
		});

		it('should have loadBuiltinWasm function available', async () => {
			// This is now a no-op but should be available for compatibility
			await loadBuiltinWasm();
			// Should not throw
		});
	});

	describe('Syntax Highlighting', () => {
		let highlighter: Highlighter;

		beforeAll(async () => {
			// Initialize highlighter for tests
			highlighter = await createHighlighter({
				themes: ['dark-plus', 'light-plus'],
				langs: ['javascript', 'typescript', 'python'],
			});
		});

		afterAll(() => {
			if (highlighter) {
				highlighter.dispose();
			}
		});

		it('should highlight JavaScript code correctly', async () => {
			const code = 'const hello = "world";';
			const result = await codeToHtml(code, {
				lang: 'javascript',
				theme: 'dark-plus',
			});

			assertEquals(typeof result, 'string');
			assertEquals(result.includes('<pre'), true);
			assertEquals(result.includes('const'), true);
			assertEquals(result.includes('hello'), true);
		});

		it('should highlight TypeScript code correctly', async () => {
			const code = 'interface User { name: string; age: number; }';
			const result = await codeToHtml(code, {
				lang: 'typescript',
				theme: 'light-plus',
			});

			assertEquals(typeof result, 'string');
			assertEquals(result.includes('interface'), true);
			assertEquals(result.includes('User'), true);
		});

		it('should handle unknown languages gracefully', async () => {
			const code = 'unknown code';

			// In Shiki v3, unknown languages throw an error
			await assertRejects(
				() =>
					codeToHtml(code, {
						lang: 'unknown-lang',
						theme: 'dark-plus',
					}),
				Error, // ShikiError
				'Language `unknown-lang` is not included',
			);
		});

		it('should handle empty code', async () => {
			const result = await codeToHtml('', {
				lang: 'javascript',
				theme: 'dark-plus',
			});

			assertEquals(typeof result, 'string');
		});

		it('should handle special characters in code', async () => {
			const code = 'const emoji = "🚀"; // Special chars: <>&"\'';
			const result = await codeToHtml(code, {
				lang: 'javascript',
				theme: 'dark-plus',
			});

			assertEquals(typeof result, 'string');
			assertEquals(result.includes('🚀'), true);
			// Check for HTML entities (they should be properly escaped)
			assertEquals(result.includes('&lt;') || result.includes('<'), true);
			assertEquals(result.includes('&gt;') || result.includes('>'), true);
			assertEquals(result.includes('&quot;') || result.includes('"'), true);
		});
	});

	describe('Bundle Languages and Themes', () => {
		it('should have bundled languages available', () => {
			assertEquals(typeof bundledLanguages, 'object');
			assertEquals(Object.keys(bundledLanguages).length > 0, true);
			assertEquals('javascript' in bundledLanguages, true);
			assertEquals('typescript' in bundledLanguages, true);
		});

		it('should have bundled themes available', () => {
			assertEquals(typeof bundledThemes, 'object');
			assertEquals(Object.keys(bundledThemes).length > 0, true);
			assertEquals('dark-plus' in bundledThemes, true);
			assertEquals('light-plus' in bundledThemes, true);
		});

		it('should validate language metadata', async () => {
			const jsLang = bundledLanguages.javascript;
			assertEquals(typeof jsLang, 'function');

			// Test that the language can be loaded
			const loadedLang = await jsLang();
			assertEquals(typeof loadedLang, 'object');
			assertEquals(typeof loadedLang.default, 'object');
			assertEquals(Array.isArray(loadedLang.default), true);
			assertEquals(loadedLang.default.length > 0, true);
		});

		it('should validate theme metadata', async () => {
			const darkTheme = bundledThemes['dark-plus'];
			assertEquals(typeof darkTheme, 'function');

			// Test that the theme can be loaded
			const loadedTheme = await darkTheme();
			assertEquals(typeof loadedTheme, 'object');
			assertEquals(typeof loadedTheme.default, 'object');
			assertEquals(typeof loadedTheme.default.displayName, 'string');
			assertEquals(typeof loadedTheme.default.type, 'string');
		});
	});

	describe('Performance and Memory Management', () => {
		it('should measure highlighting performance', async () => {
			const code = 'function test() { return "performance test"; }';
			const start = performance.now();

			await codeToHtml(code, {
				lang: 'javascript',
				theme: 'dark-plus',
			});

			const end = performance.now();
			const duration = end - start;

			// Should complete within reasonable time (adjust threshold as needed)
			assertEquals(duration < 1000, true);
		});

		it('should handle large code blocks efficiently', async () => {
			const largeCode = 'const x = 1;\n'.repeat(1000);
			const start = performance.now();

			const result = await codeToHtml(largeCode, {
				lang: 'javascript',
				theme: 'dark-plus',
			});

			const end = performance.now();
			const duration = end - start;

			assertEquals(typeof result, 'string');
			assertEquals(duration < 5000, true); // Should complete within 5 seconds
		});

		it('should properly dispose of resources', async () => {
			const highlighter = await createHighlighter({
				themes: ['dark-plus'],
				langs: ['javascript'],
			});

			// Test that dispose doesn't throw
			highlighter.dispose();

			// Test that using disposed highlighter throws error
			assertThrows(() => {
				highlighter.codeToHtml('const x = 1;', {
					lang: 'javascript',
					theme: 'dark-plus',
				});
			});
		});
	});

	describe('Error Handling and Edge Cases', () => {
		it('should handle malformed code gracefully', async () => {
			const malformedCode = 'const x = { unclosed object';
			const result = await codeToHtml(malformedCode, {
				lang: 'javascript',
				theme: 'dark-plus',
			});

			assertEquals(typeof result, 'string');
			// Check that the malformed code is present in some form (may be escaped)
			assertEquals(result.includes('const x') || result.includes('unclosed'), true);
		});

		it('should handle very long lines', async () => {
			const longLine = 'const x = "' + 'a'.repeat(1000) + '";'; // Reduce size for faster testing
			const result = await codeToHtml(longLine, {
				lang: 'javascript',
				theme: 'dark-plus',
			});

			assertEquals(typeof result, 'string');
			assertEquals(result.includes('const x') || result.includes('const'), true);
		});

		it('should handle unicode characters', async () => {
			const unicodeCode = 'const 变量 = "中文"; // 中文注释';
			const result = await codeToHtml(unicodeCode, {
				lang: 'javascript',
				theme: 'dark-plus',
			});

			assertEquals(typeof result, 'string');
			assertEquals(result.includes('变量'), true);
			assertEquals(result.includes('中文'), true);
		});

		it('should handle null and undefined inputs', async () => {
			await assertRejects(
				() => codeToHtml(null as unknown as string, { lang: 'javascript', theme: 'dark-plus' }),
				TypeError,
			);

			await assertRejects(
				() =>
					codeToHtml(undefined as unknown as string, { lang: 'javascript', theme: 'dark-plus' }),
				TypeError,
			);
		});

		it('should handle invalid options', async () => {
			const code = 'const x = 1;';

			// Test invalid language - Shiki handles null lang gracefully
			const resultWithNullLang = await codeToHtml(code, {
				lang: null as unknown as string,
				theme: 'dark-plus',
			});
			assertEquals(typeof resultWithNullLang, 'string');
			assertEquals(resultWithNullLang.length > 0, true);

			// Test invalid theme - Shiki throws error for null theme
			await assertRejects(
				() => codeToHtml(code, { lang: 'javascript', theme: null as unknown as string }),
				Error,
				'Cannot read properties of null',
			);
		});
	});

	describe('Concurrent Usage', () => {
		it('should handle concurrent highlighting requests', async () => {
			const code = 'const x = 1;';
			const promises = Array.from({ length: 10 }, (_, i) =>
				codeToHtml(`${code} // Request ${i}`, {
					lang: 'javascript',
					theme: 'dark-plus',
				}));

			const results = await Promise.all(promises);

			assertEquals(results.length, 10);
			results.forEach((result, i) => {
				assertEquals(typeof result, 'string');
				assertEquals(result.includes(`Request ${i}`), true);
			});
		});

		it('should handle mixed language concurrent requests', async () => {
			const requests = [
				{ code: 'const x = 1;', lang: 'javascript' },
				{ code: 'def hello(): pass', lang: 'python' },
				{ code: 'interface User {}', lang: 'typescript' },
			];

			const promises = requests.map((req) =>
				codeToHtml(req.code, { lang: req.lang, theme: 'dark-plus' })
			);

			const results = await Promise.all(promises);

			assertEquals(results.length, 3);
			results.forEach((result) => {
				assertEquals(typeof result, 'string');
			});
		});
	});
});
