<template>
  <div class="cd-sec">
    <div class="model-box"></div>

    <Modal
      v-model="show"
      footer-hide
      :closable="false"
      width="200"
      @on-ok="ok">
      <div class="model-box">
        <span>是否删除歌曲</span>
        
        <div class="button-box">
          <img class="save-button" src="../../assets/img/del.svg" 
          @click="cancel" alt="">
          <img class="save-button" src="../../assets/img/ok.svg" 
          @click="ok">
        </div>
      </div>
    </Modal>

    <!-- 专辑标题封面区域 -->
    <div class="cd-title-sec"> 
      <div class="img-box">
        <img :src="imgUrl" alt="">
      </div>

      <div class="cd-title-box">
        <h3 class="cd-title">{{title}}</h3>
      </div>
    </div>
    <!-- 专辑标题封面区域end -->

    <!-- 歌曲列表区域 -->
    <div class="bm-cd-list-sec">
      <div class="bm-list-title">
        <h3 class="list-title">歌曲列表</h3>
      </div>

      <table border="0" cellpadding="0" cellspacing="0" class="bm-table-list">
        <tr class="title-box">
          <th class="table-index"></th>
          <!-- <th class="table-index"></th> -->
          <th class="table-title">音乐标题</th>
          <th class="table-singer">歌手</th>
          <th class="table-time">时长</th>
          <th class="table-del-song">删除</th>
        </tr>
        <tr @dblclick="playSong(index)" :class="{'back-down': index % 2}" class="list-item" v-for="(item, index) in musicList" :key="index">
          <td :class="{'change-red': index === lisenIndex && 
          item.musicUrl === lisenMusicUrl}" 
          class="table-index">
            <Icon type="ios-heart" />
          </td>
          <!-- <td class="color-down table-index">{{index}}</td> -->
          <td class="table-title">{{item.title}}</td>
          <td class="table-singer">{{item.singer}}</td>
          <td class="color-down table-time">{{item.time}}</td>
          <td class="table-del-song">
            <img @click="delSong(item._id)" src="../../assets/img/del.svg" alt="">
          </td>
        </tr>
      </table>
    </div>
    <!-- 歌曲列表区域end -->
  </div>
</template>

<script>
  // import {PrefixInteger} from '../../assets/js/common'
  import { getAPI } from '../../assets/js/common'

  export default {
    data () {
      return {
        // 专辑封面
        imgUrl: require('../../assets/img/cd-box/6F2C547A67239590175C6D451816644D.gif'),
        // 专辑名称
        title: '仕事用BGMなのだ！',
        // 伪随机数组
        pesranList: [],
        // 专辑内音乐
        musicList: [],
        // 显示删除modle
        show: false,
        // 歌曲id
        id: '',
        // 专辑id
        cdId: ''
      }
    },
    created () {
      this.getWorkCd()
    },
    mounted () {
      
    },
    methods: {
      /**
       * 获得范围内随机数
       * 
       * @param {Number} m 下限
       * @param {Number} n 上限
       * @returns {Number} 
       * */ 
      getRandom (m,n) {
        return Math.floor(Math.random()*(m - n) + n)
      },
      // 双击播放歌曲
      playSong (index) {
        let fun = this.$store
        let song = this.musicList[index]
        this.$store.commit('changeCdPageId', this.cdId)
        
        fun.commit('changeImg', song.img)
        fun.commit('setTime', song.time)
        fun.commit('changeTitle', song.title)
        fun.commit('changeSinger', song.singer)
        fun.commit('changeMusicUrl', song.musicUrl)
        fun.commit('changeMusicIndex', index)
      },
      // 获取工作用BGM歌单
      getWorkCd () {
        this.$http.get(`${getAPI()}/getWorkBGM`)
          .then(res => {
            this.musicList = res.data.list
          })
      },
      /**
       * 根据id删除歌曲
       * @param {String} id
       */
      delSong (id) {
        this.id = id
        this.cancel()
      },
      // 点击确定后删除歌曲
      ok () {
        this.$http.delete(`${getAPI()}/delWorkBGM?id=${this.id}`)
          .then(res => {
            if (res.data.status === 2000) {
              this.$Message.success('删除成功');
              this.getWorkCd()
            } else {
              this.$Message.error('删除失败请重试');
            }
          })
        this.cancel()
      },
      // 点击取消
      cancel () {
        this.show = !this.show
      }
    },
    computed: {
      // 当前播放歌曲index
      lisenIndex () {
        return this.$store.state.musicIndex
      },
      // 当前播放音乐的链接
      lisenMusicUrl () {
        return this.$store.state.musicUrl
      }
    }
  }
</script>

<style lang="scss" scoped>
.model-box {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  .button-box {
    display: flex;
    align-items: center;
  }

  .save-button {
    margin-left: 5px;
    height: 15px;
    width: 15px;
    outline: none;
    cursor: pointer;
  }
}

.cd-sec {
  user-select: none;
  min-height: calc(100vh - 60px);
  padding: 0 0 60px 0;
    
  // 专辑封面，标题样式
  .cd-title-sec {
    display: flex;
    padding-left: 30px;

    .img-box {
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #FFF;
      height: 204px;
      width: 204px;
      margin-right: 30px;
      border-radius: 15px;

      & img {
        width: 100%;
      }
    }

    .cd-title-box {
      display: flex;
      // align-items: center;

      .cd-title {
        font-size: 20px;
        color: #b0b0b0;

        &::before {
          content: '专辑';
          padding: 1px 5px;
          margin-right: 10px;
          border: 1px solid #c53e2a;
          font-size: 14px;
          color: #c53e2a;
          border-radius: 5px;
        }
      }
    }
  }
  // 专辑封面标题end
  // 列表样式区域
  .bm-cd-list-sec {
    // 列表名称
    .bm-list-title {
      margin: 30px 0 0 30px;
      border-bottom: 1px solid #2b2b2b;

      .list-title {
        padding-bottom: 5px;
        width: 4rem;
        text-align: center;
        color: #c53e2a;
        border-bottom: #c53e2a solid 2px;
      }
    }
    // 列表表格
    .bm-table-list {
      width: 100%;
      color: #d6d6d6;
      text-align: left;
      line-height: 2;

      & tr {
        display: flex;
      }

      & td {
        padding: 5px 0;
        display: block;
        overflow: hidden; 
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .title-box {
        color: #808080;
      }

      .table-index {
        display: flex;
        justify-content: center;
        align-items: center;
        // color: #c53e2a;
        width: 30px;
      }

      .change-red {
        color: #c53e2a;
      }

      .table-title {
        width: 400px;
      }

      .table-singer {
        width: 200px;
      }

      .table-time {
        width: 140px;
      }

      .table-del-song {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;

        & img {
          width: 40%;
          cursor: pointer;
        }
      }

      .list-item {
        &:hover {
          background-color: #505050;
        }

        .color-down {
          color: #606060;
        }
      }

      .back-down {
        background-color: #272727;
      }
    }
  }
  // 列表样式区域end
}
</style>