# @shikijs/shiki

[![JSR Scope](https://jsr.io/badges/@shikijs)](https://jsr.io/@shikijs)
[![JSR](https://jsr.io/badges/@shikijs/shiki)](https://jsr.io/@shikijs/shiki)
[![JSR Score](https://jsr.io/badges/@shikijs/shiki/score)](https://jsr.io/@shikijs/shiki/score)
[![GitHub CI](https://img.shields.io/github/actions/workflow/status/cursor-ide/shiki/publish.yml?branch=main&label=sync)](https://github.com/cursor-ide/shiki/actions/workflows/publish.yml)
[![Last Updated](https://img.shields.io/github/last-commit/cursor-ide/shiki?label=last%20synced)](https://github.com/cursor-ide/shiki/commits/main)
[![License](https://img.shields.io/github/license/cursor-ide/shiki)](https://github.com/cursor-ide/shiki/blob/main/LICENSE)

🦕 A Deno-native JSR package of [Shiki](https://shiki.style/) that provides a minimal, production-ready bundle for syntax highlighting. This package strips out unnecessary dependencies while maintaining full compatibility with the Shiki ecosystem.

## Features

- 🚀 **Optimized for Deno**: Native Deno/JSR package with minimal dependencies
- 🎨 **Full Shiki Compatibility**: All themes and languages supported
- 🔧 **TypeScript Support**: Full type definitions included
- 📦 **Tree-shakeable**: Only import what you need
- 🏎️ **Performance Optimized**: Efficient WASM loading and resource management
- 🛡️ **Error Handling**: Comprehensive error handling and edge case coverage

## Installation

### Using JSR (Recommended)

```typescript
import { codeToHtml, createHighlighter } from "jsr:@shikijs/shiki@^3.7.0";
```

### Using Deno with import map

Add to your `deno.json`:

```json
{
  "imports": {
    "@shikijs/shiki": "jsr:@shikijs/shiki@^3.7.0"
  }
}
```

Then import:

```typescript
import { codeToHtml, createHighlighter } from "@shikijs/shiki";
```

## Usage

### Basic Usage

```typescript
import { codeToHtml } from "jsr:@shikijs/shiki@^3.7.0";

const code = `
function hello() {
  console.log("Hello, World!");
}
`;

const html = await codeToHtml(code, {
  lang: 'javascript',
  theme: 'dark-plus'
});

console.log(html);
```

### Advanced Usage with Custom Highlighter

```typescript
import { createHighlighter } from "jsr:@shikijs/shiki@^3.7.0";

// Create a highlighter with specific themes and languages
const highlighter = await createHighlighter({
  themes: ['dark-plus', 'light-plus'],
  langs: ['javascript', 'typescript', 'python']
});

// Use the highlighter
const html = highlighter.codeToHtml(code, {
  lang: 'javascript',
  theme: 'dark-plus'
});

// Don't forget to dispose when done
highlighter.dispose();
```

## API Reference

### `codeToHtml(code: string, options: CodeToHtmlOptions): Promise<string>`

Converts code to HTML with syntax highlighting.

- `code`: The source code to highlight
- `options.lang`: The language identifier (e.g., 'javascript', 'typescript')
- `options.theme`: The theme name (e.g., 'dark-plus', 'light-plus')

### `createHighlighter(options: HighlighterOptions): Promise<Highlighter>`

Creates a highlighter instance with specified themes and languages.

- `options.themes`: Array of theme names to load
- `options.langs`: Array of language names to load

## Supported Themes

All Shiki themes are supported, including:

- `dark-plus`, `light-plus`
- `github-dark`, `github-light`
- `dracula`, `monokai`
- `nord`, `one-dark-pro`
- And many more...

## Supported Languages

All Shiki languages are supported, including:

- JavaScript/TypeScript
- Python, Java, C++, C#
- HTML, CSS, JSON
- Markdown, YAML, TOML
- And 100+ more...

## Migration from Shiki

This package is a drop-in replacement for Shiki in Deno environments:

```typescript
// Before (npm shiki)
import { codeToHtml } from "npm:shiki@^3.7.0";

// After (JSR shiki)
import { codeToHtml } from "jsr:@shikijs/shiki@^3.7.0";
```

## Error Handling

The package includes comprehensive error handling:

```typescript
try {
  const html = await codeToHtml(code, {
    lang: 'unknown-language',
    theme: 'dark-plus'
  });
} catch (error) {
  console.error('Highlighting failed:', error.message);
}
```

## Performance

This package is optimized for performance with efficient WASM loading and resource management.

### Benchmarks

| benchmark                           | time/iter (avg) |        iter/s |      (min … max)      |      p75 |      p99 |     p995 |
| ----------------------------------- | --------------- | ------------- | --------------------- | -------- | -------- | -------- |
| Small JavaScript highlighting       |        450.1 µs |         2,222 | (349.8 µs …   2.3 ms) | 469.8 µs |   1.0 ms |   1.2 ms |
| Medium JavaScript highlighting      |          3.7 ms |         269.6 | (  3.3 ms …   5.3 ms) |   4.0 ms |   5.1 ms |   5.3 ms |
| Large JavaScript highlighting       |        183.5 ms |           5.5 | (177.9 ms … 202.0 ms) | 182.6 ms | 202.0 ms | 202.0 ms |
| TypeScript highlighting             |          2.5 ms |         398.1 | (  2.4 ms …   5.0 ms) |   2.5 ms |   3.7 ms |   4.1 ms |
| Python highlighting                 |          4.6 ms |         215.5 | (  4.5 ms …   6.2 ms) |   4.6 ms |   6.0 ms |   6.2 ms |
| Highlighter creation and disposal   |         30.1 ms |          33.2 | ( 29.1 ms …  36.7 ms) |  30.3 ms |  36.7 ms |  36.7 ms |
| Multiple theme highlighting         |          1.7 ms |         600.0 | (  1.5 ms …   7.5 ms) |   1.6 ms |   5.7 ms |   6.7 ms |
| Multiple language highlighting      |        668.1 µs |         1,497 | (605.4 µs …   5.4 ms) | 650.5 µs | 999.7 µs |   1.3 ms |
| Memory usage monitoring             |          3.5 ms |         287.2 | (  3.2 ms …   5.8 ms) |   3.4 ms |   5.4 ms |   5.8 ms |
| Error handling performance          |         57.6 µs |        17,350 | ( 54.1 µs …   1.1 ms) |  56.2 µs |  85.3 µs |  96.3 µs |

## Version Compatibility

This package maintains version compatibility with Shiki:

- Major/minor versions match Shiki exactly
- Patch versions may differ for Deno-specific fixes
- All Shiki features are supported

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Run `deno task test` to verify
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Shiki](https://shiki.style/) - The original syntax highlighter
- [Deno](https://deno.land/) - The secure JavaScript runtime
- [JSR](https://jsr.io/) - The JavaScript registry for Deno
