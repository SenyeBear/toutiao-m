<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
       class="edit-btn"
       type="danger" 
       plain 
       round
       size="mini"
       @click="isEdit = !isEdit"
       >{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
       class="grid-item" 
       v-for="(channel,index) in myChannels" 
       :key="index"
       @click="onMyChannelClick(channel,index)" 
       >
        <van-icon
         v-show="isEdit && !fixedChannels.includes(channel.id)"
         slot="icon" 
         name="clear"
         ></van-icon>
        <span
         class="text" 
         slot="text"
         :class="{active: index === active}">{{channel.name}}</span>
      </van-grid-item>
    </van-grid>

     <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
       class="grid-item"
       v-for="(channel,index) in recommendChannels"
       :key="index"
       icon="plus"
       :text="channel.name"
       @click="onAddChannel(channel)"
      />
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
import { 
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制关闭按钮的显示
      fixedChannels: [0] // 固定频道 不允许删除
    }
  },
  computed: {
    ...mapState(['user']),
    // 获取推荐频道
    recommendChannels () {
      const channels = []
      this.allChannels.forEach(channel => {
        // find遍历数组 找到满足条件的元素项、
        const ret = this.myChannels.find(myChannels => {
            return myChannels.id === channel.id
        })
        // 我的频道中不包含的 收集到推荐频道
        if (!ret) {
            channels.push(channel)
        }
      })
      
      // 把计算结果返回
      return channels
    }
  },
  props: {
    myChannels: {
        type: Array,
        required: true
    },
    active: {
        type: Number,
        required: true
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    // 加载所有频道
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },

    // 添加频道
    async onAddChannel (channel) {
      this.myChannels.push(channel)

      // 数据持久化处理
      if (this.user) {
        try {
          // 已登录 数据放线上
          await addUserChannel({
            id: channel.id, // 频道id
            seq: this.myChannels.length // 序号
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 未登录 数据存本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)

      }
    }, 

    // 切换/删除频道
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        // 1.如果是固定频道 不删除
        if (this.fixedChannels.includes(channel.id)) return
        // 2.编辑状态 执行删除频道
        this.myChannels.splice(index, 1)
        // 3.如果删除激活频道之前的频道 需要更新激活频道项的active
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true)
        }

        // 4.处理持久化
        this.deleteChannel(channel)

      } else {
        // 非编辑状态 执行切换频道
        this.$emit('update-active', index, false)
      }
    },

    async deleteChannel (channel) {
      try {
        if (this.user) {
          // 已登录 数据更新线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录 数据更新本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
          console.log(err)
          this.$toast('删除频道失败，请稍后重试')
      }
    }
  }
}
</script>

<style  scoped lang="less">
.channel-edit {
    padding: 85px 0;

    .title-text {
        font-size: 32px;
        color: #333333;
    }
    .edit-btn {
        width: 104px;
        height: 48px;
        font-size: 26px;
        color: #f85959;
        border: 1px solid #f85959;
    }

    /deep/ .grid-item {
        width: 160px;
        height: 86px;
        .van-grid-item__content {
            white-space: nowrap; // 不折行
          background-color: #f4f5f6;

          .van-grid-item__text, .text {
            font-size: 28px;
            color: #222222;
            margin-top: 0;
          }
          .active {
            color: red;
          }

          .van-grid-item__icon-wrapper {
            position: unset;
          }
        }
    }
    
    /deep/ .my-grid {
        .grid-item {
          .van-icon-clear {
              position: absolute;
              top: -10px;
              right: -10px;
              font-size: 30px;
              color: #cacaca;
              z-index: 2;
          }
        }
    }
    
    /deep/ .recommend-grid {
        .grid-item {
          .van-grid-item__content {
            flex-direction: row;
            .van-icon-plus {
                font-size: 28px;;
                margin-right: 6px;
            }
            
          }
        }
    }

    
}
</style>
