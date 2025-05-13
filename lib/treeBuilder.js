import fg from 'fast-glob';
import chalk from "chalk";

const ROUTE_SEPARATOR = '/'

export async function buildRouteTree(baseDir, options = { skipApi: true, pdf: false}) {
    const files = await fg(['**/page.{js,jsx,ts,tsx}', '**/route.{js,jsx,ts,tsx}'], {
        cwd: baseDir,
        onlyFiles: true,
    });

    const root = { name: '/', type: 'route', children: [] };

    for (const file of files) {
        const parts = file.split(ROUTE_SEPARATOR);
        const dirs = parts.slice(0, -1);

        //API skiping
        if (options.skipApi && dirs.includes('api')) continue;

        //Catch All skipping like [...not-found], [...nextauth], etc
        const hasCatchAll = dirs.some(part => part.startsWith('[...'));

        if (hasCatchAll) continue;

        insertNode(root, dirs);
    }

    return options.pdf ? renderPdfTree(root) : renderTree(root);
}

function isGroup(name) {
    return name.startsWith('(') && name.endsWith(')');
}

function isSlot(name) {
    return name.startsWith('@');
}

function insertNode(node, parts) {
    let current = node;

    for (const part of parts) {
        const name = part;
        const type = isGroup(name)
            ? 'group'
            : isSlot(name)
                ? 'slot'
                : 'route';

        const label = type === 'group' ? name.slice(1, -1) : name;

        let child = current.children.find(c => c.name === label && c.type === type);
        if (!child) {
            child = { name: label, type, children: [] };
            current.children.push(child);
        }
        current = child;
    }
}

function renderTree(node, depth = 0) {
    const pad = '  '.repeat(depth);
    const typeColor = {
        route: chalk.white,
        group: chalk.gray,
        slot: chalk.blueBright,
    };

    const typeSuffix = node.type === 'group' ? ' (group)'
        : node.type === 'slot' ? ' (slot)'
            : '';

    const pathLabel = node.name === '/' || node.name === '' ? '/' : `/${node.name}`;
    const result = `${pad}${typeColor[node.type](pathLabel)}${chalk.dim(typeSuffix)}\n`;

    return result + node.children
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(child => renderTree(child, depth + 1))
        .join('');
}

export function renderPdfTree(node, depth = 0) {
    const pad = '  '.repeat(depth);
    const label = node.name === '/' || node.name === '' ? '/' : `/${node.name}`;

    const typeSuffix = node.type === 'group' ? ' (group)'
        : node.type === 'slot' ? ' (slot)'
            : '';

    const line = `${pad}${label}${typeSuffix}\n`;

    return line + node.children
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(child => renderPdfTree(child, depth + 1))
        .join('');
}