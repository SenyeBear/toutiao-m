<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button 
      class="search-btn"
      slot="title" 
      type="info"
      size="small"
      round
      icon="search"
      >搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <!-- v-model绑定当前激活标签的索引值，默认情况启用第一个标签 -->
    <!-- 通过 animated 属性可以开启切换标签内容时的转场动画 -->
    <!-- 通过 swipeable 属性可以开启滑动切换标签页 -->
    <van-tabs 
    class="channel-tabs" 
    v-model="active" 
    animated 
    swipeable
    >
      <van-tab 
      v-for="channel in channels"
      :title="channel.name" :key="channel.id">
        <!-- 文章列表 -->
        <article-list :channel="channel" />
        <!-- /文章列表 -->
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
          <!-- 汉堡按钮 -->
      <div 
      slot="nav-right" 
      class="hamburger-btn"
      @click="isChannelEditShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /频道列表 -->

    <!-- 频道编辑弹出层 -->
    <van-popup
     v-model="isChannelEditShow"
     closeable
     close-icon-position="top-left"
     position="bottom"
     :style="{ height: '100%' }"
    >
      <channel-edit
       :my-channels="channels" 
       :active="active"
       @update-active="onUpdateActive" 
      />
    </van-popup>
    <!-- /频道编辑弹出层 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      active: 0,
      channels: [], // 频道列表
      isChannelEditShow: false, // 控制编辑频道弹出层的显示状态
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    this.loadChannels();
  },
  methods: {
    async loadChannels () {
      // (旧)请求获取频道数据
      // const { data } = await getUserChannels()
      // this.channels = data.data.channels

      // 正确获取频道数据
        // 已登录 请求获取用户频道列表
        // 未登录 判断有无本地存储数据
              // 有 使用
              // 无 请求获取默认数据
      let channels = []
      try {
        if (this.user) {
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          const localChannels = getItem('TOUTIAO_CHANNELS')
          if (localChannels) {
            channels = localChannels
          } else {
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch (err) {

      } 
    
      
    },

    onUpdateActive (index, isChannelEditShow = true) {
      // 更新激活的频道状态
      this.active = index
      // 关闭弹层
      this.isChannelEditShow = isChannelEditShow
    }
  }
}
</script>

<style  scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }

  // 不加只作用在根节点 要想影响更深的子节点 需要加::deep or /deep/
/deep/.channel-tabs {
  .van-tabs__wrap {
    position: fixed;
    top: 92px;
    z-index: 1;
    left: 0;
    right: 0;
    height: 82px;
  }
  .van-tab {
    min-width: 200px;
    border-right: 1px solid #edeff3;
    font-size: 30px;
    color: #777;
  }
  .van-tab--active {
    color: #333;
  }
  .van-tabs__nav {
    padding-bottom: 0;
  }
  .van-tabs__line {
    bottom: 8px;
    width: 31px;
    height: 6px;
    background-color: #3296fa;
  }

  .placeholder {
    flex-shrink: 0; // 默认是1参与flex容器剩余空间计算 0不参与
    width: 66px;
    height: 82px;
  }

  .hamburger-btn {
    position: fixed;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 66px;
    height: 82px;
    background-color: #fff;
    opacity: 0.902;
    i.toutiao {
      font-size: 33px;
    }
    // 伪元素+背景图片 实现汉堡按钮左侧渐变边框效果
    &:before {
      content: '';
      position: absolute;
      left: 0;
      width: 1px;
      height: 100%;
      background-image: url(~@/assets/gradient-gray-line.png);
      background-size: contain;
    }
  }
 }
}


</style>

<style lang="less" scoped>
/deep/.van-nav-bar__title {
    max-width: unset;
  }
</style>

