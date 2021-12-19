# webpack5 工程搭建

## 使用方式

1. 切到适用分支；
2. 解压对应分支 node_modules 压缩包；
3. yarn dev 

## 基本结构

- 工程用到的依赖较多，需要在 package.json 写配置的依赖都有自己单独的配置文件，储存在根目录下。

- 目录结构如下：

  > |-- **`root`**
  >
  > ​		|-- **`config`**
  >
  > ​		|-- `pages.config.js`
  >
  > ​		|-- `webpack.config.js`
  >
  > ​		|-- **`src`**
  >
  > ​				|-- **`pages`**
  >
  > ​						|-- **`pageA`**
  >
  > ​						|-- **`pageB`**
  >
  > ​				|-- **`public`**
  >
  > ​						|-- **`fonts`**
  >
  > ​						|-- **`icons`**
  >
  > ​						|-- **`images`**
  >
  > ​						|-- **`utils`**
  >
  > ​				|-- `shim-vue.d.ts`（ts 版本才需要，vue3 项目需要的类型声明文件。）
  >
  > ​		|-- `.eslintrc.js`
  >
  > ​		|-- `.gitignore`（声明 git 不应该监听的指定路径下的文件）
  >
  > ​		|-- `babel.config.js`（js 语法向后兼容，多浏览器兼容。）
  >
  > ​		|-- `package.json`
  >
  > ​				|-- browserslist（babel 和 postcss 用的，声明应该支持到多旧的浏览器。）
  >
  > ​				|-- postcss（清除打包后 css 注释，css 语法向后兼容，多浏览器兼容。）
  >
  > ​		|-- `tsconfig.json`（仅 ts，指定静态类型检查和语法提示的细则。）
  >
  > ​		|-- `yarn.lock`（用的是 yarn，会有这个 lock，用于保证 install 依赖一致。）

  > 补充：`package.json` 中的配置项可以独立为配置文件，但因为内容简单，为了保持根目录清爽，于是收入 `package.json` 中，起到的作用是相同的。

## 主要文件夹

### pages

- pages 下每个文件夹是一个页面，这里页面指 SPA 中的 A，也就是说 `pageA 和` `pageB` 会被打包为两个分开的文件夹。
- 如果是 ts 版本，多页面的实现里要求了入口页面也为 ts 文件，因此所有脚本文件都得是 ts 文件，否则会报类型错误。

### public

- public 中每个文件夹都加了 alias，可以方便的使用，推荐所有静态资源都放在这里。
- 虽然相同图片放在不同文件夹打包出来只会有一份，但是保持只有 one true source 是可维护性更佳的方案。
- 这里面的图片会在打包时自动压缩，因此可以不使用 tinypng 等压缩平台手动压缩了。

## 主要配置文件

### .eslintrc.js

- 声明 eslint 规则，现在的规则包括但不限于：

  - 数组开口和闭合处无空格；
  - 强制驼峰命名，在必须使用 `_` 的地方可以用 `''` 即引号包括变量名，这样可以绕开 eslint 检查；
  - 强制最后一行无逗号；
  - 强制 tab 缩进；
  - 强制 unix 风格的换行；
  - 强制代码间无冗余空格；
    - 强制代码末尾无冗余空格；
    - 强制无分号。

- eslint 的依赖是

  > - 'eslint:recommended'
  > - 'plugin:@typescript-eslint/recommended'
  >
  > - 'plugin:vue/vue3-essential'
  >
  > - '@vue/typescript/recommended'

- 除了命名错误需要手动改，其他不合规则的都会在 command+s 时**自动修复**。

### pages.config.js

- 这是无配置多页面的实现：
  - 利用了 nodejs 的 `fs` 和 `path`模块；
  - 利用了 webpack 的 `HTMLWebpackPlugin` 插件；
  - fs 和 path 读取 src -> pages 路径下面的文件夹，
    迭代每个文件夹入口文件的绝对路径，new HTMLWebpackPlugin 并推入数组，
    同时维护 entry 数组。

### package.json

- 分为 dependencies 和 devDependencies。

- > |-- dependencies
  >
  > ​     |-- axios
  >
  > ​     |-- dayjs
  >
  > ​     |-- vue
  >
  > ​     |-- vue-router
  >
  > ​     |-- vuex
  >
  > 这五个是打包内容里必有的依赖：
  >
  > - vue 三件套很常规；
  > - axios 用于封装网络请求；
  > - dayjs 用于处理日期格式，相对于 momentjs 的优势是包体积很小，相对于自己写 utils 的优势是健壮和节省人力。

- devDependencies 相当多，每个都有相应的用处，接下来的配置文件说明中详述。
  devDependencies 虽然多，但主要是让工程易于使用，完成更多功能，但不会使打包体积变大。

### webpack.config.js

- webpack 的配置在实践中就是写一个大对象，对象的键值对指定：
  - 打包和开发时使用的工具（loader 和 plugin）；
  - 工具的使用方式（规则可以自定义）；
  - 打包后文件的分割方式（共用代码可以显著减少包体积）；
  - 打包后文件的命名方式（哈希长短和哈希策略）。
- 以下是必有的：

> |-- webpack.config.js
>
> ​      |-- entry: Array
>
> ​      |-- output: Object
>
> ​      |-- resolve: Object
>
> ​            |-- alias（用来写路径简称。）
>
> ​            |-- extensions（写 ts 显式声明要处理 ts 文件。）
>
> ​      |-- devServer: Object （指定端口和打包路径，其他的如热加载是默认开启的。）
>
> ​      |-- module: Object
>
> ​            |-- rules（用来写 loader，其中 webpack5 自带 asset type 用于取代 file loader 等基础 loader。）
>
> ​      |-- optimization: Object
>
> ​            |-- splitChunks（用来分割出多页面共用的 node_modules 中的依赖，能显著减小包体积，作用等同于 dll。）
>
> ​      |-- plugins: Array（webpack5 希望更多的功能不要在 loader 里而要在 plugin 里，这在实践中有偏差，能用就行。）

## devDependencies 详解

### 基础依赖

- webpack5 工程初始化需要的依赖：
  -    "webpack": "^5.64.0"
  -    "webpack-cli": "^4.9.1"
  -    "webpack-dev-server": "^4.5.0"

### babel，postcss，sass

- babel 的依赖，loader 用于将 babel 注入 webpack 处理流，babel 还能使项目用新语法，jsx，ts等：
  - "@babel/core"
  - "@babel/preset-env"
  - "babel-loader"
- postcss 的依赖，loader 用于将 postcss 注入 webpack 处理流：
  - "postcss"
  - "postcss-loader"
  - "postcss-preset-env"
- Sass 的依赖，sass-loader 用于将 sass 注入 webpack 处理流，css-loader 用于将处理 css：
  - "sass"
  - "sass-loader"
  - "css-loader"

### 图片自动压缩

- ImageMinimizerPlugin 里面又可以配置 plugin，用于压缩不同图片的图片，能显著减小包体积：
  - "image-minimizer-webpack-plugin"
  - "imagemin-gifsicle"
  - "imagemin-mozjpeg"
  - "imagemin-pngquant"
  - "imagemin-webp"

### eslint

- eslint 和 eslint-webpack-plugin 是必须的，为了支持 vue 和 typescript 还要加其他的
  - "eslint"
  - "eslint-plugin-vue"（支持 vue。）
  - "eslint-webpack-plugin"
  - "@typescript-eslint/eslint-plugin"（支持 ts。）
  - "@typescript-eslint/parser"（支持 ts。）
  - "@vue/eslint-config-typescript"（带 ts 的 eslint 支持 vue。）

### husky

- "husky"
  （新增 `.husky` 文件夹，利用 githooks 做一些优化，如 commit 前 lint 和 commit-message 校验。）
- "lint-staged"（只针对 staged 状态的文件 lint，提高 lint 效率。）

### typescript

- "@babel/preset-typescript"
  （将 ts 注入 babel 处理流，还能处理 vue 文件中的 ts。比再加个 ts-loader 的效率高。）
- "typescript" (编译 ts。)

### tsx

- "@vue/babel-plugin-jsx"

### 其他

#### ejs 支持

- "ejs-compiled-loader"

#### 指令跨平台

- "cross-env"

#### 体积最小化

- "mini-css-extract-plugin"（将 css 从打包出来的 js 中抽取出来作为单独的文件并进一步压缩。）
- "svgo-loader"
- "mini-svg-data-uri"（结合 "svgo-loader" 能去掉 svg 的 base64 中冗余的部分，每张图能省出几 KB。）

#### 速度最大化

- "fork-ts-checker-webpack-plugin"
  （将 ts 静态类型检查，编译和 eslint 检查分给其他线程，提升热加载和打包速度。）

#### 控制台输出美化

- "friendly-errors-webpack-plugin"（webpack devServer 原生输出比较冗余，用这个定制一下。）

#### 多页面

- "html-webpack-plugin"
  （new 不同的文件，结合 entry 数组，打包出多个 html 文件作为多个页面的入口。）

#### 多启动

- "os" 模块的 networkInterfaces
- "deasync"
- "portfinder"
  （查找可用端口，deasync 将这个异步方法转为阻塞，实现多次启动同一工程能在指定端口上自增。）