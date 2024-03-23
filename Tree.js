import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function convertPathForComparison(winPath) {
	return winPath.replace(/\\/g, '/').toLowerCase();
}

function extractEnvVariables(envPath) {
	try {
		const envContent = fs.readFileSync(envPath, 'utf-8');
		const variableNames = envContent
			.split('\n')
			.filter((line) => line.trim() !== '' && !line.startsWith('#'))
			.map((line) => line.split('=')[0].trim());
		return variableNames;
	} catch (error) {
		console.error('Error reading .env file:', error);
		return [];
	}
}

function isExcluded(fullPath, excludeList) {
	const relativePath = fullPath
		.replace(__dirname + '/', '')
		.replace(/\\/g, '/')
		.toLowerCase();
	return excludeList.some((exclude) => relativePath.startsWith(exclude));
}

function createTree(dirPath, prefix = '', excludeList) {
	let tree = '';

	const files = fs.readdirSync(dirPath);
	files.forEach((file, index) => {
		const fullPath = path.join(dirPath, file);
		const isLast = index === files.length - 1;
		const relativeFullPath = fullPath.replace(__dirname + '/', '');

		if (!isExcluded(relativeFullPath, excludeList)) {
			const stat = fs.statSync(fullPath);
			tree += prefix + (isLast ? '└── ' : '├── ') + file + '\n';

			if (stat.isDirectory()) {
				tree += createTree(fullPath, prefix + (isLast ? '    ' : '│   '), excludeList);
			}
		}
	});

	return tree;
}

function generateDirectoryTree(dirPath, outputFile) {
	const excludeListRaw = [
		'.svelte-kit',
		'node_modules',
		'build',
		'src\\routes\\answers',
		'src\\routes\\bible',
		'src\\routes\\questions',
		'.gitignore',
		'.npmrc',
		'.package-lock.json',
		'pnpm-lock.yaml',
		'pnpm-workspace.yaml',
		'Tree.js',
		'Tree.txt',
		'.git'
	];

	const excludeList = excludeListRaw.map((path) => convertPathForComparison(path));
	let tree = createTree(dirPath, '', excludeList);

	const envVariables = extractEnvVariables(path.join(dirPath, '.env'));
	if (envVariables.length > 0) {
		tree += '\n.env Variables:\n' + envVariables.join('\n');
	}

	fs.writeFileSync(path.join(__dirname, outputFile), tree, { flag: 'w' });
	console.log(`Directory tree written to ${outputFile} in the root directory`);
}

generateDirectoryTree('.', 'Tree.txt');
