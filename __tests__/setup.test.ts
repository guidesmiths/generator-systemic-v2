// Resources
process.env.AVOID_AUTOSTART = 'true';
// Modules
import path from 'path';
import { isArray } from 'lodash';
import { removeSync, mkdirSync, copySync, pathExistsSync } from 'fs-extra';
import { prompt, PromptModule } from 'inquirer';
jest.mock('inquirer');
// LIBs
jest.mock('../src/utils/git');
import { clone as gitClone } from '../src/utils/git';
import { main } from '../setup';
// Dev types
import { TestConstants } from './@types/setup.type';
// Triggers
const mockedGitClone = gitClone as jest.Mock<Promise<void>>;
const mockedInquirerPrompt = (prompt as unknown) as jest.Mock<PromptModule>;

describe('Testing generated ouput files', () => {
    const outputPath: string = path.join(__dirname, 'tmp-output');
    const projectTemplateFolder: string = path.join(__dirname, '../_templates');
    const removeTemplatesFolder = () => removeSync(projectTemplateFolder);
    const constants: TestConstants = {
        promptCounter: 0,
    };

    beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        console.log = () => {};
        removeSync(outputPath);
        mkdirSync(outputPath);
    });

    beforeEach(() => {
        constants.promptCounter = 0;
        removeTemplatesFolder();
    });

    afterEach(() => {
        removeTemplatesFolder();
        jest.clearAllMocks();
    });

    describe('should not fail', () => {
        it('should generate "docker-node-lts,nvm" templates output files', async () => {
            mockedGitClone.mockImplementation(async () => {
                copySync('./__tests__/templates/template_one', projectTemplateFolder);
            });
            mockedInquirerPrompt.mockImplementation(
                (params): PromptModule => {
                    const { name } = isArray(params) ? params[0] : params;
                    if (name === 'fs_remove_confirm') {
                        return 'y' as never;
                    } else if (name === 'npm_package_version') {
                        return { npm_package_version: 14 } as never;
                    }
                },
            );

            await main({
                generator: 'docker-node-lts,nvm',
                output: outputPath,
            });
            expect(pathExistsSync(`${outputPath}/.dockerignore`)).toBeTruthy();
            expect(pathExistsSync(`${outputPath}/Dockerfile`)).toBeTruthy();
        });
    });
});
