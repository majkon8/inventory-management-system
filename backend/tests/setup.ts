import { agent, type SuperAgentTest } from 'supertest';

import { getApp } from '@/index';
import { shutdown } from '@/plugins/shutdown';

jest.setTimeout(20000);

expect.extend({
    toContainMatchingObject(received, argument) {
        const pass = this.equals(received, expect.arrayContaining([expect.objectContaining(argument)]));

        if (pass) {
            return {
                message: () =>
                    `Expected array ${this.utils.printReceived(
                        received
                    )}\nNot to contain object ${this.utils.printExpected(argument)}`,
                pass: true
            };
        } else {
            return {
                message: () =>
                    `Expected array ${this.utils.printReceived(received)}\nTo contain object ${this.utils.printExpected(
                        argument
                    )}`,
                pass: false
            };
        }
    }
});

beforeAll(async () => {
    const app = await getApp();

    global.request = new Proxy(agent(app) as SuperAgentTest & { csrfTokens?: string[] }, {
        get(target, prop) {
            return (...args: string[]) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (target as any)[prop](...args).set('csrf-token', target.csrfTokens?.[0] || '');
        }
    });
});

afterAll(async () => {
    await shutdown();
});
