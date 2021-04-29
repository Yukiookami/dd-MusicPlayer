<template>
  <div class="play-bar">
    <!-- 真正的播放器 -->
    <audio ref="audio" @ended="nextSong" 
    preload class="audio-hide" :src="this.$store.state.musicUrl"></audio>

    <!-- 播放进度条 -->
    <div class="play-pro" @click="changePlayTime">
      <progress class="play-pro-item" max="100" :value="playPro"></progress>
    </div>

    <div class="bm-play-main">
      <!-- 信息面板 -->
      <div class="bm-info-sec">
        <div class="bm-info-box">
          <!-- 歌曲封面(暂时以专辑封面) -->
          <div class="img-box">
            <img :src="this.$store.state.img" alt="">
          </div>

          <!-- 歌曲信息 -->
          <div class="bm-song-info-box">
            <!-- 歌曲名，歌手 -->
            <div class="bm-singer-box">
              <h3 class="title">{{this.$store.state.title}}</h3>
              <span>- {{this.$store.state.singer}}</span>
            </div>
            <!-- 歌曲时长 -->
            <div class="time-box">
              <span>{{nowTime}} /</span>
              <span> {{this.$store.state.time}}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 信息面板end -->

      <!-- 功能按键 -->
      <div class="play-botton-sec">
        <img @click="lastSong" class="bn" src="../../assets/img/play/back.svg" alt="">
        <div @click="playMusic" class="play">
          <img class="play-botton" v-if="!this.$store.state.play" src="../../assets/img/play/play.svg" alt="">
          <img v-else src="../../assets/img/play/stop.svg" alt="">
        </div>
        <img @click="nextSong('next')" class="bn" src="../../assets/img/play/next.svg" alt="">
      </div>
      <!-- 功能按键end -->

      <!-- 歌曲信息版，播放模式，音量 -->
      <div class="play-mode-sec">
        <!-- 添加到dd歌单 -->
        <div class="play-mode-box">
          <Icon @click="addFav" class="add-dd" type="md-add-circle" />
        </div>  

        <!-- 播放模式 -->
        <div @click="changeMode" class="play-mode-box">
          <img v-if="playMode === 1" src="../../assets/img/play/all.svg" alt="">
          <img v-else-if="playMode === 2" src="../../assets/img/play/redom.svg" alt="">
          <img v-else src="../../assets/img/play/single.svg" alt="">
        </div>

        <!-- 播放信息版，感觉使用频率过低， -->
        <!-- <div @click="showSongList" class="play-mode-box">
          <img v-if="!showList" src="../../assets/img/play/song-list.svg" alt="">
          <img v-else src="../../assets/img/play/song-list-sel.svg" alt="">
        </div>   -->

        <!-- 音量按钮 -->
        <div class="play-mode-box">
          <volume :vol="vol" @getVolume="getVolume"></volume>
        </div>  
      </div>
      <!-- 歌曲信息版，播放模式，音量end -->
    </div>
  </div>
</template>

<script>
  import {PrefixInteger, formatDecimal, getUserAPI} from '../../assets/js/common'
  import volume from './plug/volume'

  export default {
    data () {
      return {
        // 播放进度
        playPro: 0,
        // 当前时间
        nowTime: '00:00',
        // 总时间
        // time: '02:26',
        // 是否正在播放
        // play: false,
        // 播放模式
        playMode: 1,
        // 是否显示列表
        showList: false,
        // 更新时间计时器
        timeSet: null,
        // 更新进度条计时器
        timeSetPro: null,
        // 当前播放歌曲index
        nowIndex: -1,
        // 音量条
        vol: 100,
        // 记录音量条
        oldVol: 100,
        // 音量渐变计时器
        timeVolUp: null,
        timeVolDown: null,
      }
    },
    // this.$refs.audio.duration 获取音频时间长度
    methods: {
      /**
       * 添加到dd歌单
       */
      addFav () {
        let body = this.$store.state

        if (this.$cookies.get('userId')) {
          let userId = this.$cookies.get('userId')
  
          this.$http.post(`${getUserAPI()}/addSongUser`, {
            img: body.img,
            title: body.title,
            singer: body.singer,
            time: body.time,
            musicUrl: body.musicUrl,
            songId: body.songId,
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
       * 设置音量
       * @param {Number} val
       */
      getVolume (val) {
        let video = this.$refs.audio
        
        if (val.val) {
          let newVal = val.val
          this.vol = newVal

          this.oldVol = newVal

          video.volume = newVal / 100
        } else {
          this.vol = val
  
          video.volume = val / 100
        }
      },
      /**
       * 全局监听键盘改变音量，进度条
       */
      changeVolumebar () {
        let video = this.$refs.audio
        let vol = video.volume

        document.onkeydown = e => {
          if (this.$store.state.textInFlag || !this.$store.state.musicUrl) {
            return
          } else {
            e.preventDefault()
            let key = window.event.keyCode
  
            if (key === 38) {
              // 上
              if (vol + 0.1 < 1) {
                vol = vol + 0.1
              } else {
                vol = 1
              }
            } else if (key === 40) {
              // 下
              if (vol - 0.1 > 0) {
                vol = vol - 0.1
              } else {
                vol = 0
              }
            } else if (key === 37) {
              // 左
              if (this.playPro - 1 <= 0) {
                this.playPro = 0
              } else {
                this.playPro -= 1
              }
  
              video.currentTime = (this.playPro * video.duration) / 100
              this.setNowTime()
            } else if (key === 39) {
              // 右
              if (this.playPro + 1 >= 100) {
                // 大于1000时切换下一首
                video.pause()
              } else {
                this.playPro += 1
              }
  
              video.currentTime = (this.playPro * video.duration) / 100
              this.setNowTime()
            }
            // } else if (key === 32) {
            //   // 空格
            //   this.playMusic()
            // }
  
            video.volume = vol
            this.vol = vol * 100

            return
          }
        }
      },
      /**
       * 更改进度条播放时间
       */
      changePlayTime (val) {
        let audio = this.$refs.audio
        let value = val.offsetX
        this.playPro = value / 10

        audio.currentTime = (this.playPro * audio.duration) / 100
        this.setNowTime()
      },
      /**
       * @param {Boolean} play 是否为双击切换播放
       * 播放音乐
       */
      playMusic (play) {
        if (this.$refs.audio.src) {
          if (play === true) {
            this.$store.commit('setPlay', true)
          } else {
            this.$store.commit('changePlay')
          }
  
          // let totalTime = formatDecimal(this.$refs.audio.duration, 0)
          // this.$store.commit('setTime', `${PrefixInteger(formatDecimal(totalTime / 60, 0), 2)}:${PrefixInteger(totalTime % 60, 2)}`) 
  
          if (this.$store.state.play) {
            // 当前播放时间与总时间
            this.timeSet = setInterval(() => {
              if (!(formatDecimal(this.$refs.audio.currentTime, 1) % 1)) {
                this.setNowTime()
              }
            }, 100)
  
            this.timeSetPro = setInterval(() => {
              let time = this.$refs.audio.currentTime
              let allTime = this.$refs.audio.duration
  
              this.playPro = (time / allTime) * 100
            }, 1)
          } else {
            clearInterval(this.timeSet)
            clearInterval(this.timeSetPro)
          }
  
          setTimeout(() => {
            // 播放音频

            if (this.$store.state.play) {
              let oldVol = this.oldVol
              let nowVol = 1
              this.$refs.audio.play()

              this.timeVolUp = setInterval(() => {
                if (nowVol <= oldVol) {
                  this.getVolume(nowVol)
                  nowVol++
                } else {
                  clearInterval(this.timeVolUp)
                }
              }, 1)
            } else {
              this.oldVol = this.vol
              let nowVol = this.oldVol
              
              new Promise((resolve) => {
                this.timeVolDown = setInterval(() => {
                  if (nowVol > 1) {
                    this.getVolume(nowVol)
                    nowVol--
                  } else {
                    resolve('success')
                    clearInterval(this.timeVolDown)
                  }
                }, 1)
              }).then(() => {
                this.$refs.audio.pause()
              })
            }
          }, 0)
        }
      },
      /**
       * 设置当前时间
       */
      setNowTime () {
        let nowTime = ''
        let time = formatDecimal(this.$refs.audio.currentTime, 0)

        time >= 60 ? nowTime = `${PrefixInteger(formatDecimal(time / 60, 0), 2)}:${PrefixInteger(time % 60, 2)}`: 
        nowTime = `00:${PrefixInteger(time, 2)}`
        this.nowTime = nowTime
      },
      // 更换播放模式
      changeMode () {
        this.playMode + 1 > 3 ? this.playMode = 1 : this.playMode++

        this.$store.commit('changePlayMode', this.playMode)
      },
      /**
       * 播放下一首
       * @param {String} flag 是否为点击按键触发下一首事件
       */
      nextSong (flag) {
        if (this.$store.state.play) {
          this.oldVol = this.vol
        }
        this.$store.commit('changeNextSongFlag', true)

        if (flag === 'next') {
          this.$store.commit('changeButtonNextFlag', true)
        }
      },
      /**
       * 播放上一首
       */
      lastSong () {
        this.$store.commit('changeLastSongFlag', true)
      }
      // 显隐列表
      // showSongList () {
      //   this.showList = !this.showList
      // }
    },
    computed: {
      // 当前播放歌曲index
      lisenMusicUrl () {
        return this.$store.state.musicUrl
      },
      // 是否循环播放
      listenLoopPlay () {
        return this.$store.state.loopPlay
      },
      // 是否需要开始播放下一首
      listenNextSongFlag () {
        return this.$store.state.nextSongFlag
      }
    },
    mounted () {
      // 全局监听键盘事件
      this.changeVolumebar()
    },
    watch: {
      lisenMusicUrl (newVal) {
        this.playMusic(true)
        
        return newVal
      },
      listenNextSongFlag (newVal) {
        let audio = this.$refs.audio
        
        this.$nextTick(() => {
          if (newVal && this.listenLoopPlay) {
            audio.currentTime = 0
            this.playMusic(true)
          }
        })
      }
    },
    components: {
      volume
    }
  }
</script>

<style lang="scss" scoped>
.play-bar {
  user-select: none;
  position: fixed;
  bottom: 0;
  width: 100vw;
  z-index: 99999;

  .play-pro {
    position: relative;
    height: 4px;
    z-index: 9999;

    // 进度条样式
    .play-pro-item {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 2px;
      background-color: #c53e2a;
    }

    .play-pro-item::-webkit-progress-bar{     
      background-color: #1e1e1e;
    }

    .play-pro-item::-webkit-progress-value {
      background-color: #c53e2a;
    }
    // 进度条样式end
  }

  .bm-play-main {
    display: flex;
    background-color: #1e1e1e;

    // 信息面板样式
    .bm-info-sec {
      padding: 5px 10px 10px;
      width: 40%;

      // 头像，歌手，时间信息
      .bm-info-box {
        display: flex;

        .img-box {
          overflow: hidden;
          width: 42px;
          height: 42px;
          border-radius: 5px;

          & img {
            width: 100%;
          }
        }
        
        .bm-song-info-box {
          margin-left: 10px;

          .bm-singer-box {
            display: flex;
            align-items: flex-end;
            color: #d5d5d5;
            margin-bottom: 5px;

            .title {
              max-width: 160px;
              margin-right: 5px;
              overflow: hidden; 
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }

          .time-box {
            color: #999;
          }
        }
      }
    }
    // 信息面板样式end

    // 功能按键样式
    .play-botton-sec {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 26%;

      .play {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 42px;
        width: 42px;
        border-radius: 50%;
        background-color: #c53e2a;
        margin: 0 30px;
        cursor: pointer;

        & img {
          width: 40%;
        }

        .play-botton {
          margin-left: 2px;
        }
      }

      .bn {
        height: 20px;
        width: 20px;
        cursor: pointer;
        
        & img {
          width: 100%;
        }
      }
    }
    // 功能按键样式end

    // 播放区域样式
    .play-mode-sec {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 33%;

      .play-mode-box {
        height: 20px;
        width: 20px;
        margin-right: 20px;
        cursor: pointer;

        .add-dd {
          font-size: 20px;
          color: #FFF;
        }

        & img {
          width: 100%;
        } 
      }
    }
    // 播放区域样式end
  }
}
</style>