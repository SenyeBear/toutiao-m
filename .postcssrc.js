// PostCSS配置文件 
module.exports = {
    // 配置要使用的PostCSS插件
    plugins: {
      // postcss-pxtorem 插件的版本需要 >= 5.0.0
      'postcss-pxtorem': {
        // {} es6参数解构
        rootValue({ file }) {
            // 如果找到的是vant的css文件就设置根字号为37.5  vant组件基于37.5来写的
            // 如果不是就表明是我们自己的 根据自己的设计稿来写
            // 这样就可以分别计算 不需要再除了
          return file.indexOf('vant') !== -1 ? 37.5 : 75;
        },
        // 配置要转换的css属性 *表示所有
        propList: ['*'],

        // 配置不要转换的样式资源
        exclude: 'github-markdown'
      },
    },
  };