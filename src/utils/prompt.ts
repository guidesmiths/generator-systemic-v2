// Modules
import { prompt } from 'enquirer';

export async function promptForAnswer({ type, message }: { type: string; message: string }): Promise<string> {
    const { answer } = (await prompt({
        type,
        name: 'answer',
        message,
    })) as { answer: string };
    return answer;
}
