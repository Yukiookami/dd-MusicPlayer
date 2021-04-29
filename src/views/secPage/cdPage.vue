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

        <div @click="changeSort()" class="sort-box">
          <img src="../../assets/img/sort.svg" alt="">
          <span>{{sortText}}</span>
        </div>
      </div>
    </div>
    <!-- 专辑标题封面区域end -->

    <!-- 超出范围时显示headerBar -->
    <div class="cd-title-sec header-bar" :class="{'show-header-bar': headerBarShow}"> 
      <div class="cd-title-box" :class="{'top-go': !headerBarShow}">
        <h3 class="cd-title">{{title}}</h3>

        <div @click="changeSort()" class="sort-box">
          <img src="../../assets/img/sort.svg" alt="">
          <span>{{sortText}}</span>
        </div>
      </div>
    </div>
    <!-- 超出范围时显示headerBar end -->

    <!-- 歌曲列表区域 -->
    <div ref="cdSec" class="bm-cd-list-sec">
      <div class="bm-list-title">
        <h3 class="list-title">歌曲列表</h3>

        <div class="seach-box">
          <img src="../../assets/img/search.svg" alt="">
          <input @focus="stopPlayBar(true)" @blur="stopPlayBar(false)"  
          v-model="searchText" @keyup="searchData()"
          placeholder="搜索歌单音乐" type="text">
        </div>
      </div>

      <table border="0" cellpadding="0" cellspacing="0" class="bm-table-list">
        <tr class="title-box">
          <th class="table-index"></th>
          <!-- <th class="table-index"></th> -->
          <th class="table-title">音乐标题</th>
          <th class="table-singer">歌手</th>
          <th class="table-time">时长</th>
          <th class="table-del-song">最爱</th>
          <th v-if="cdId !== '001'" class="table-del-song">删除</th>
        </tr>

        <div v-if="!searchText">
          <tr @dblclick="playSong(index)" :class="{'back-down': index % 2}" 
          class="list-item" v-for="(item, index) in musicList" :key="index">
            <td :class="{'change-red': item.musicUrl === lisenMusicUrl}" 
            class="table-index">
              <Icon type="ios-heart" />
            </td>
            <!-- <td class="color-down table-index">{{index}}</td> -->
            <td class="table-title">{{item.title}}</td>
            <td class="table-singer">{{item.singer}}</td>
            <td class="color-down table-time">{{item.time}}</td>
            <td @click="addFav(item)" class="table-index fav-icon">
              <Icon type="md-add-circle" />
            </td>
            <td class="table-del-song">
              <img v-if="cdId !== '001'" @click="delSong(item._id)" src="../../assets/img/del.svg" alt="">
            </td>
          </tr>
        </div>

        <div v-else>
          <tr @dblclick="playSong(item.musicUrl, 'search')" :class="{'back-down': index % 2}" 
          class="list-item" v-for="(item, index) in searchList" :key="index">
            <td :class="{'change-red': item.musicUrl === lisenMusicUrl}" 
            class="table-index">
              <Icon type="ios-heart" />
            </td>
            <!-- <td class="color-down table-index">{{index}}</td> -->
            <td class="table-title">{{item.title}}</td>
            <td class="table-singer">{{item.singer}}</td>
            <td class="color-down table-time">{{item.time}}</td>
            <td @click="addFav(item)" class="table-index fav-icon">
              <Icon type="md-add-circle" />
            </td>
            <td class="table-del-song">
              <img v-if="cdId !== '001'" @click="delSong(item._id)" src="../../assets/img/del.svg" alt="">
            </td>
          </tr>
        </div>
      </table>
    </div>
    <!-- 歌曲列表区域end -->
  </div>
</template>

<script>
  // import {PrefixInteger} from '../../assets/js/common'
  import { getAPI, fuzzySearch, getUserAPI } from '../../assets/js/common'

  export default {
    data () {
      return {
        // 专辑封面
        imgUrl: '',
        // 专辑名称
        title: '',
        // 伪随机数组
        pesranList: [],
        // 专辑内音乐
        musicList: [],
        // 搜索数组结果
        searchList: [],
        // 显示删除modle
        show: false,
        // 歌曲id
        id: '',
        // 专辑id
        cdId: '',
        // 是否显示头部信息
        headerBarShow: false,
        // 搜索文字
        searchText: ''
      }
    },
    created () {
      window.scrollTo(0, 0)
      this.getCdById()
    },
    mounted () {
      window.addEventListener('scroll', this.handleScroll, true);
    },
    methods: {
      /**
       * 模糊搜索
       */
      searchData () {
        let keyWord = this.searchText 

        if (keyWord) {
          this.searchList = fuzzySearch(keyWord, this.musicList)
        } else {
          this.searchList.splice(0)
        }
      },
      // 检测是否开始输入
      stopPlayBar (flag) {
        this.$store.commit('changeTextInFlag', flag)
      },
      /**
       * 添加到dd歌单
       * 
       * @param {String} item 歌曲对象
       */
      addFav (body) {
        if (this.$cookies.get('userId')) {
          let userId = this.$cookies.get('userId')
  
          this.$http.post(`${getUserAPI()}/addSongUser`, {
            img: body.img,
            title: body.title,
            singer: body.singer,
            time: body.time,
            musicUrl: body.musicUrl,
            songId: body._id,
            userId: userId
          }).then(res => {
            if (res.data.status === 2000) {
              this.$Message.success('添加成功');
            } else if (res.data.status === 1) {
              this.$Message.error('歌曲已存在');
            } else {
              this.$Message.error('添加失败请重试');
            }
          })
        } else {
          this.$Message.error('权限不足,请登录');
        }
      },
      /**
       * 监听滚动
       */
      handleScroll () {
        if (document.documentElement.scrollTop >= 313) {
          this.headerBarShow = true
        } else {
          this.headerBarShow = false
        }
      },
      /**
       * 改变歌单排序方式
       */
      changeSort () {
        if (this.sortText === "时间降序") {
          this.$store.commit('changeSortText', "时间升序") 
        } else {
          this.$store.commit('changeSortText', "时间降序")
        }

        this.$store.commit('changeMusicIndex', this.musicList.length - this.lisenIndex - 1)
        this.musicList.reverse()
      },
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
      /**
       * 双击播放音乐
       * 
       * @param {Number} index 歌曲所在下标/歌曲url（搜索时用）
       * @param {String} search 是否为搜索列表
       */
      playSong (index, search) {
        let fun = this.$store
        this.$store.commit('changeCdPageId', this.cdId)
        this.$store.commit('changeUserPlay', false)

        if (!search) {
          let song = this.musicList[index]
          fun.commit('changeImg', song.img)
          fun.commit('setTime', song.time)
          fun.commit('changeTitle', song.title)
          fun.commit('changeSinger', song.singer)
          fun.commit('changeMusicUrl', song.musicUrl)
          fun.commit('changeSongId', song._id)
          fun.commit('changeMusicIndex', index)
        } else {
          this.musicList.forEach((ele, musicIndex) => {
            if (ele.musicUrl === index) {
              let song = this.musicList[musicIndex]
              fun.commit('changeImg', song.img)
              fun.commit('setTime', song.time)
              fun.commit('changeTitle', song.title)
              fun.commit('changeSinger', song.singer)
              fun.commit('changeMusicUrl', song.musicUrl)
              fun.commit('changeSongId', song._id)
              fun.commit('changeMusicIndex', musicIndex)
              return
            }
          })
        }
      },
      // 根据id获取专辑信息
      getCdById () {
        this.cdId = this.$route.query.id

        this.$http.get(`${getAPI()}/getCdById?id=${this.cdId}`)
          .then(res => {
            if (this.cdId === '001') {
              this.title = '歌单汇总'
              this.imgUrl = require('../../assets/img/allSong.jpg')

              res.data.data.forEach(ele => {
              this.musicList.push(...ele.musicList)
            })
            } else {
              let data = res.data.data
              this.title = data.title
              this.imgUrl = data.imgUrl
              this.musicList = data.musicList
            }


            if (this.$store.state.sortText === "时间升序") {
              this.musicList.reverse()
            }
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
        if (this.cdId === '001') {
          this.$Message.error('总歌单页面不支持歌曲删除')
        } else {
          this.$http.delete(`${getAPI()}/delSong?id=${this.id}&cdId=${this.cdId}`)
            .then(res => {
              if (res.data.status === 2000) {
                this.$Message.success('删除成功');
                this.getCdById()
              } else {
                this.$Message.error('删除失败请重试');
              }
            })
        }
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
      },
      sortText () {
        return this.$store.state.sortText
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
      flex-direction: column;
      // align-items: center;
      transition: all ease-in-out .2s;

      .sort-box {
        user-select: none;
        display: flex;
        align-items: center;
        margin-top: 10px;
        border: #fff solid 1px;
        border-radius: 15px;
        padding: 5px 10px;
        width: 80px;
        color: #FFF;
        font-size: 10px;
        cursor: pointer;

        & img {
          margin-right: 5px;
          width: 10px;
        }
      }

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

  .header-bar {
    position: fixed;
    background-color: #212121;
    top: 0;
    width: 100%;
    padding: 10px 30px;
    box-shadow: 0 3px 5px rgba(0, 0, 0, .5);
    z-index: -1;
    transition: all ease-in-out .2s;
    opacity: 0;

    .top-go {
      transform: translateY(-20px);
    }
  }

  .show-header-bar {
    opacity: 1;
    z-index: 999;
  }
  // 专辑封面标题end
  // 列表样式区域
  .bm-cd-list-sec {
    // 列表名称
    .bm-list-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 30px 0 0 30px;
      padding-right: 30px;
      border-bottom: 1px solid #2b2b2b;

      .seach-box {
        position: relative;

        & img {
          position: absolute;
          top: 7px;
          left: 3px;
          width: 13px;
        }

        & input {
          background-color: #202020;
          // background-color: #999;
          padding: 5px 5px 5px 20px;
          border: none;
          border-radius: 5px;
          width: 100px;
          outline: none;
          color: #fff;
        }
      }

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
        width: 110px;
      }

      .table-del-song {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;

        & img {
          filter: grayscale(80%);
          opacity: .5;
          transition: all ease-in-out .2s;
          width: 40%;
          cursor: pointer;

          &:hover {
            filter: grayscale(0%);
            opacity: 1;
          }
        }
      }

      .fav-icon {
        cursor: pointer;
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