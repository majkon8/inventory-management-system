/* eslint-disable no-var */

import type { SuperAgentTest } from 'supertest';

declare global {
    var request: SuperAgentTest & { csrfTokens?: string[] };

    namespace jest {
        interface Matchers {
            toContainMatchingObject(expected: object): CustomMatcherResult;
        }
    }
}
