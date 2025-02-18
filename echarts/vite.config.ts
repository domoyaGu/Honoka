import { UserConfig, ConfigEnv, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default ({ mode }: ConfigEnv): UserConfig => {
  // 获取 .env 环境配置文件
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      vue(),
      // svg
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]'
      }),
      AutoImport({
        // 自动导入 Vue, pinia, vue-router 相关函数
        // 甚至你还可以使用自定义的配置规则，见 https://github.com/antfu/unplugin-auto-import#configuration
        imports: ['vue', 'vue-router', 'pinia'],
        // 目标文件
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/, /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],
        resolvers: [
          // 自动导入Element Plus组件库的解析器
          ElementPlusResolver(),
        ],
        // 生成 `auto-import.d.ts` 全局声明
        dts: './auto-imports.d.ts',
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true,
        },
      }),
      Components({
        // dirs 指定组件所在位置，默认为 src/components
        // 可以让我们使用自己定义组件的时候免去 import 的麻烦
        dirs: ['src/components/'],
        // 配置需要将哪些后缀类型的文件进行自动按需引入
        extensions: ['vue', 'md'],
        include: [
          /\.vue$/, /\.vue\?vue/
        ],
        exclude: [
          /[\\/]node_modules[\\/]/,
          /[\\/]\.git[\\/]/
        ],
        resolvers: [
          // 自动导入 Element Plus 组件
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({
            // prefix: 'i', // 自动引入的Icon组件统一前缀，默认为 i，设置false为不需要前缀
            // {prefix}-{collection}-{icon} 使用组件解析器时，您必须遵循名称转换才能正确推断图标。
            // alias: { park: 'icon-park' } 集合的别名
            enabledCollections: ['ep'] // 这是可选的，默认启用 Iconify 支持的所有集合['mdi']
          }),
        ],
        // 生成文件
        dts: './components.d.ts'
      }),
      Icons({
        compiler: 'vue3', // 编译方式
        autoInstall: true,
        // scale: 1, // 缩放
        // defaultClass: '', // 默认类名
        // defaultStyle: '', // 默认样式
        // jsx: 'react' // jsx支持
      }),
    ],
    // 本地反向代理解决浏览器跨域限制
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_APP_PORT),
      open: true, // 运行自动打开浏览器
      // hmr: true, // 热更新
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_PROXY_API,
          changeOrigin: true
        }
      }
    },
    // build: {
    //   minify: 'terser', // 默认esbuild，压缩效率高
    //   terserOptions: {
    //     compress: {
    //       //生产环境时移除console
    //       drop_console: true,
    //       drop_debugger: true,
    //     },
    //   },
    // },
    // esbuild: {
    //   drop: ["console", "debugger"],
    // },
    resolve: {
      // Vite路径别名配置
      alias: {
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js', // 解决控制台报错
        '@': path.resolve('./src'),
        'img': path.resolve('src/assets/images'),
        'store': path.resolve('src/store')
      }
    }
  };
};
