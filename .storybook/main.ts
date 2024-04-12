/** @type { import('@storybook/nextjs').StorybookConfig } */
import type { StorybookConfig } from '@storybook/nextjs';
const path = require('path');
module.exports = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (config, { configType }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, "../src/"),
      '@assets': path.resolve(__dirname, "../src/assets"),
      '@components': path.resolve(__dirname, "../src/components"),
    };

    return config;
  },
}

