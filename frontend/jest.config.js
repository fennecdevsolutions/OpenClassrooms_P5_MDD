/* import type { Config } from 'jest';
import { createCjsPreset } from 'jest-preset-angular/presets';

export default {
    ...createCjsPreset(),
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
} satisfies Config;
 */

const { createCjsPreset } = require('jest-preset-angular/presets/index.js');

/** @type {import('jest').Config} */
module.exports = {
    ...createCjsPreset(),
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
};