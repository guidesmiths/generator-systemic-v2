// Modules
import colors from 'colors';
import { readFileSync, existsSync } from 'fs-extra';
import { parseDocument } from 'yaml';
import { get } from 'lodash';

export function version(): void {
  const version = process.version.split('.')[0];
  const recommendedVersion = `v${process.env.npm_package_engines_node.split('.')[0]}`;

  if (version !== recommendedVersion) {
    console.log(colors.yellow(
      `Your NodeJS version ${version} is not recommended to use on this project. Recommended version: ${recommendedVersion}`,
    ));
  }
}

function checkFileExists(folder: string, files: string): void {
  for (const file of files) {
    const path: string = `${folder}${file}`;
    console.log(colors.blue(
      `Validating output generator path: ${path}`,
    ));
    if (!existsSync(path)) {
      console.log(colors.red(`File ${path} does not exists, check this generator`));
      process.exit(1);
    }
  }
}

export function testOutputFiles(generatorsList: string[], outputFolder: string) {
  for (const generatorName of generatorsList) {
    const output = `./_templates/generator/${generatorName}/output.yaml`;
    if (existsSync(output)) {
      const yamlFile = readFileSync(output, 'utf-8');
      const parsedYaml = parseDocument(yamlFile);
      const expected = get(parsedYaml, 'contents.items');
      const { value: folder } = (expected.find(({ key }) => key.value === 'folder')).value;
      const files = ((expected.find(({ key }) => key.value === 'files')).value.items).map(({ value }) => value);
      checkFileExists(`${outputFolder}/${folder}`, files);
    }
  }
}