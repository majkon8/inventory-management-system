import console from 'console';
import { Container } from 'typedi';
import { graylog } from 'graylog2';

import { config } from '@/config';

import type { ILogType } from '@/types/common';

export class Logger {
    private static graylogClient: graylog | null;

    private static passToGrayLog(message: Record<string, unknown> | string, type: ILogType) {
        if (!Container.has('graylogClient')) {
            return;
        }

        if (this.graylogClient === undefined) {
            this.graylogClient = Container.get('graylogClient');
        }

        if (this.graylogClient === null) {
            return;
        }

        this.graylogClient[type](message);
    }

    static info(message: string) {
        if (config.app.isTest) {
            return;
        }

        console.info(message);

        this.passToGrayLog(message, 'info');
    }

    static emergency(message: string) {
        if (config.app.isTest) {
            return;
        }

        console.warn(message);

        this.passToGrayLog(message, 'emergency');
    }

    static alert(message: string) {
        if (config.app.isTest) {
            return;
        }

        console.warn(message);

        this.passToGrayLog(message, 'alert');
    }

    static critical(message: string) {
        if (config.app.isTest) {
            return;
        }

        console.warn(message);

        this.passToGrayLog(message, 'critical');
    }

    static error(message: string) {
        if (config.app.isTest) {
            return;
        }

        console.error(message);

        this.passToGrayLog(message, 'error');
    }

    static warning(message: string) {
        if (config.app.isTest) {
            return;
        }

        console.warn(message);

        this.passToGrayLog(message, 'warning');
    }

    static warn(message: string) {
        if (config.app.isTest) {
            return;
        }

        console.warn(message);

        this.passToGrayLog(message, 'warn');
    }

    static notice(message: string) {
        if (config.app.isTest) {
            return;
        }

        console.log(message);

        this.passToGrayLog(message, 'notice');
    }

    static debug(message: string) {
        if (config.app.isTest) {
            return;
        }

        console.debug(message);

        this.passToGrayLog(message, 'debug');
    }
}
