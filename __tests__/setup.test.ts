// Resources
process.env.AVOID_AUTOSTART = 'true';
// Modules
import path from 'path';
import { removeSync, mkdirSync, copySync } from 'fs-extra';
// LIBs
import { main } from '../setup';

describe('Testing generated ouput files', () => {
    const outputPath: string = path.join(__dirname, 'tmp-output');
    const projectTemplateFolder: string = path.join(__dirname, '../_templates');
    const removeTemplatesFolder = () => removeSync(projectTemplateFolder);

    beforeAll(() => {
        removeSync(outputPath);
        mkdirSync(outputPath);
    });

    beforeEach(() => {
        removeTemplatesFolder();
    });

    afterEach(() => {
        removeTemplatesFolder();
    });

    describe('should not fail', () => {
        beforeAll(() => {
            copySync('./__tests__/templates/template_one', projectTemplateFolder);
        });

        it('should generate the expected output files', async () => {
            await main({
                generator: 'docker-node-lts,nvm',
                output: outputPath,
            });
        });
    });
});
