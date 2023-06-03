import fs from 'fs';
import path from 'path';
const root = path.resolve(process.cwd(), 'snippets');
const files = fs
    .readdirSync(root)
    .map((item) => path.resolve(root, item));
const stringify = (scope: string, configs: string[][]) =>
    `### ${scope}\n\n| 触发词 | 描述 |\n| ------ | -------------- |\n${configs
        .map(
            ([prefix, description]) =>
                `| ${prefix}  | ${description} |\n`
        )
        .join('')}`;
const md = files
    .map((file) => {
        const scope = path.basename(
            file,
            path.extname(file)
        );
        const content = String(fs.readFileSync(file));
        const configs = Object.values<{
            prefix: string;
            body: string;
            description: string;
        }>(JSON.parse(content)).map((item) => [
            item.prefix,
            item.description,
        ]);
        return stringify(scope, configs);
    })
    .join('\n\n');
let template = String(
    fs.readFileSync(path.resolve(__dirname, 'doc.md'))
);
template = template.replace('@@configs', md);
fs.writeFileSync(
    path.resolve(process.cwd(), 'README.md'),
    template
);
