import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const targets = [
  {
    source: join(root, 'src/environments/environment.ts.example'),
    destination: join(root, 'src/environments/environment.ts'),
  },
];

for (const { source, destination } of targets) {
  if (existsSync(destination)) {
    continue;
  }

  if (!existsSync(source)) {
    console.error(`Missing environment template: ${source}`);
    process.exit(1);
  }

  copyFileSync(source, destination);
  console.log(`Created ${destination} from template.`);
}
