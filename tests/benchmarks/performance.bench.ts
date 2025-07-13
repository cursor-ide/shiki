import { codeToHtml, createHighlighter } from '../../src/mod.ts';

// Test data for benchmarking
const testCodes = {
	smallJs: `function hello() {
		console.log('Hello, World!');
	}`,

	mediumJs: `
class Calculator {
	constructor() {
		this.result = 0;
	}
	
	add(a, b) {
		this.result = a + b;
		return this;
	}
	
	subtract(a, b) {
		this.result = a - b;
		return this;
	}
	
	multiply(a, b) {
		this.result = a * b;
		return this;
	}
	
	divide(a, b) {
		if (b === 0) {
			throw new Error('Division by zero');
		}
		this.result = a / b;
		return this;
	}
	
	getResult() {
		return this.result;
	}
}

const calc = new Calculator();
const result = calc.add(5, 3).multiply(2, 4).getResult();
console.log('Result:', result);
`,

	largeJs: `
// Large JavaScript code for performance testing
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Mock data
const users = [
	{ id: 1, name: 'John Doe', email: 'john@example.com' },
	{ id: 2, name: 'Jane Smith', email: 'jane@example.com' },
	{ id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
];

const products = [
	{ id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
	{ id: 2, name: 'Book', price: 19.99, category: 'Education' },
	{ id: 3, name: 'Coffee Mug', price: 12.99, category: 'Kitchen' }
];

// Helper functions
function validateUser(user) {
	if (!user.name || !user.email) {
		throw new Error('Invalid user data');
	}
	return true;
}

function validateProduct(product) {
	if (!product.name || !product.price || !product.category) {
		throw new Error('Invalid product data');
	}
	return true;
}

// Routes
app.get('/', (req, res) => {
	res.json({ message: 'Welcome to the API' });
});

app.get('/users', (req, res) => {
	res.json(users);
});

app.get('/users/:id', (req, res) => {
	const id = parseInt(req.params.id);
	const user = users.find(u => u.id === id);
	if (!user) {
		return res.status(404).json({ error: 'User not found' });
	}
	res.json(user);
});

app.post('/users', (req, res) => {
	try {
		const newUser = req.body;
		validateUser(newUser);
		newUser.id = users.length + 1;
		users.push(newUser);
		res.status(201).json(newUser);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

app.put('/users/:id', (req, res) => {
	const id = parseInt(req.params.id);
	const userIndex = users.findIndex(u => u.id === id);
	if (userIndex === -1) {
		return res.status(404).json({ error: 'User not found' });
	}
	try {
		const updatedUser = req.body;
		validateUser(updatedUser);
		users[userIndex] = { ...users[userIndex], ...updatedUser };
		res.json(users[userIndex]);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

app.delete('/users/:id', (req, res) => {
	const id = parseInt(req.params.id);
	const userIndex = users.findIndex(u => u.id === id);
	if (userIndex === -1) {
		return res.status(404).json({ error: 'User not found' });
	}
	users.splice(userIndex, 1);
	res.status(204).send();
});

app.get('/products', (req, res) => {
	res.json(products);
});

app.get('/products/:id', (req, res) => {
	const id = parseInt(req.params.id);
	const product = products.find(p => p.id === id);
	if (!product) {
		return res.status(404).json({ error: 'Product not found' });
	}
	res.json(product);
});

app.post('/products', (req, res) => {
	try {
		const newProduct = req.body;
		validateProduct(newProduct);
		newProduct.id = products.length + 1;
		products.push(newProduct);
		res.status(201).json(newProduct);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

app.listen(port, () => {
	console.log(\`Server running on port \${port}\`);
});
`.repeat(10), // Repeat to make it really large
};

// Benchmark function
async function runBenchmark(name: string, fn: () => Promise<void>, iterations = 5) {
	const times: number[] = [];

	for (let i = 0; i < iterations; i++) {
		const start = performance.now();
		await fn();
		const end = performance.now();
		times.push(end - start);
	}

	const average = times.reduce((a, b) => a + b) / times.length;
	const min = Math.min(...times);
	const max = Math.max(...times);

	console.log(`${name}:`);
	console.log(`  Average: ${average.toFixed(2)}ms`);
	console.log(`  Min: ${min.toFixed(2)}ms`);
	console.log(`  Max: ${max.toFixed(2)}ms`);
	console.log(`  Iterations: ${iterations}`);
	console.log();
}

// Benchmark tests
Deno.bench('Small JavaScript highlighting', async () => {
	await codeToHtml(testCodes.smallJs, {
		lang: 'javascript',
		theme: 'dark-plus',
	});
});

Deno.bench('Medium JavaScript highlighting', async () => {
	await codeToHtml(testCodes.mediumJs, {
		lang: 'javascript',
		theme: 'dark-plus',
	});
});

Deno.bench('Large JavaScript highlighting', async () => {
	await codeToHtml(testCodes.largeJs, {
		lang: 'javascript',
		theme: 'dark-plus',
	});
});

Deno.bench('TypeScript highlighting', async () => {
	const tsCode = `
interface User {
	id: number;
	name: string;
	email: string;
}

class UserService {
	private users: User[] = [];
	
	async getUser(id: number): Promise<User | null> {
		return this.users.find(u => u.id === id) || null;
	}
	
	async createUser(userData: Omit<User, 'id'>): Promise<User> {
		const newUser: User = {
			id: Date.now(),
			...userData,
		};
		this.users.push(newUser);
		return newUser;
	}
}
`;

	await codeToHtml(tsCode, {
		lang: 'typescript',
		theme: 'dark-plus',
	});
});

Deno.bench('Python highlighting', async () => {
	const pythonCode = `
import asyncio
import json
from typing import Dict, List, Optional

class DataProcessor:
    def __init__(self):
        self.data: List[Dict] = []
    
    async def process_data(self, raw_data: str) -> Dict:
        """Process raw data and return structured result"""
        try:
            parsed = json.loads(raw_data)
            result = {
                'processed': True,
                'items': len(parsed) if isinstance(parsed, list) else 1,
                'timestamp': asyncio.get_event_loop().time()
            }
            return result
        except json.JSONDecodeError as e:
            return {'error': str(e), 'processed': False}
    
    def get_stats(self) -> Dict:
        return {
            'total_items': len(self.data),
            'average_size': sum(len(str(item)) for item in self.data) / len(self.data) if self.data else 0
        }

async def main():
    processor = DataProcessor()
    sample_data = '{"name": "test", "value": 42}'
    result = await processor.process_data(sample_data)
    print(f"Processing result: {result}")

if __name__ == "__main__":
    asyncio.run(main())
`;

	await codeToHtml(pythonCode, {
		lang: 'python',
		theme: 'dark-plus',
	});
});

Deno.bench('Highlighter creation and disposal', async () => {
	const highlighter = await createHighlighter({
		themes: ['dark-plus'],
		langs: ['javascript'],
	});

	await highlighter.codeToHtml('const x = 1;', {
		lang: 'javascript',
		theme: 'dark-plus',
	});

	highlighter.dispose();
});

Deno.bench('Multiple theme highlighting', async () => {
	const code = 'const greeting = "Hello, World!";';

	await Promise.all([
		codeToHtml(code, { lang: 'javascript', theme: 'dark-plus' }),
		codeToHtml(code, { lang: 'javascript', theme: 'light-plus' }),
		codeToHtml(code, { lang: 'javascript', theme: 'github-dark' }),
		codeToHtml(code, { lang: 'javascript', theme: 'github-light' }),
	]);
});

Deno.bench('Multiple language highlighting', async () => {
	const jsCode = 'const x = 1;';
	const tsCode = 'const x: number = 1;';
	const pyCode = 'x = 1';

	await Promise.all([
		codeToHtml(jsCode, { lang: 'javascript', theme: 'dark-plus' }),
		codeToHtml(tsCode, { lang: 'typescript', theme: 'dark-plus' }),
		codeToHtml(pyCode, { lang: 'python', theme: 'dark-plus' }),
	]);
});

// Performance monitoring benchmark
Deno.bench('Memory usage monitoring', async () => {
	const initialMemory =
		(globalThis as { performance?: { memory?: { usedJSHeapSize?: number } } }).performance?.memory
			?.usedJSHeapSize || 0;

	const code = testCodes.mediumJs;
	await codeToHtml(code, {
		lang: 'javascript',
		theme: 'dark-plus',
	});

	const finalMemory =
		(globalThis as { performance?: { memory?: { usedJSHeapSize?: number } } }).performance?.memory
			?.usedJSHeapSize || 0;
	const memoryUsed = finalMemory - initialMemory;

	// Memory usage should be reasonable
	if (memoryUsed > 10 * 1024 * 1024) { // 10MB threshold
		console.warn(`High memory usage detected: ${memoryUsed / 1024 / 1024}MB`);
	}
});

// Error handling benchmark
Deno.bench('Error handling performance', async () => {
	try {
		await codeToHtml('invalid code', {
			lang: 'unknown-language',
			theme: 'dark-plus',
		});
	} catch {
		// Expected to fail, testing error handling performance
	}
});

// Run custom benchmarks
if (import.meta.main) {
	console.log('Running custom benchmarks...\n');

	await runBenchmark('Small code highlighting', async () => {
		await codeToHtml(testCodes.smallJs, {
			lang: 'javascript',
			theme: 'dark-plus',
		});
	});

	await runBenchmark('Medium code highlighting', async () => {
		await codeToHtml(testCodes.mediumJs, {
			lang: 'javascript',
			theme: 'dark-plus',
		});
	});

	await runBenchmark('Large code highlighting', async () => {
		await codeToHtml(testCodes.largeJs, {
			lang: 'javascript',
			theme: 'dark-plus',
		});
	});

	await runBenchmark('Concurrent highlighting', async () => {
		const promises = Array.from({ length: 10 }, () =>
			codeToHtml(testCodes.smallJs, {
				lang: 'javascript',
				theme: 'dark-plus',
			}));
		await Promise.all(promises);
	});

	console.log('Benchmarks completed!');
}
