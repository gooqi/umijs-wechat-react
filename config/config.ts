import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  antd: { mobile: false },
  fastRefresh: {},
  mfsu: {},
});
