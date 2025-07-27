import { context } from 'esbuild';

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

async function client() {
    const ctx = await context({
        entryPoints: ['client/src/extension.ts'],
        bundle: true,
        format: 'cjs',
        minify: production,
        sourcemap: !production,
        sourcesContent: false,
        platform: 'node',
        outfile: 'client/out/extension.js',
        external: ['vscode'],
        logLevel: 'warning',
        plugins: [
        ]
    });
    if (watch) {
        await ctx.watch();
    } else {
        await ctx.rebuild();
        await ctx.dispose();
    }
}

async function server() {
    const ctx = await context({
        entryPoints: ['server/src/server.ts'],
        bundle: true,
        format: 'cjs',
        minify: production,
        sourcemap: !production,
        sourcesContent: false,
        platform: 'node',
        outfile: 'server/out/server.js',
        external: ['vscode'],
        logLevel: 'warning',
        plugins: [
        ]
    });
    if (watch) {
        await ctx.watch();
    } else {
        await ctx.rebuild();
        await ctx.dispose();
    }
}

async function main() {
    await client();
    await server();
}

main().catch((error) => {
    console.error('Build failed:', error);
    process.exit(1);
});