<template>
  <div class="cd-sec">
    
  </div>
</template>

<script>
  // import {PrefixInteger} from '../../assets/js/common'
  import { getAPI, getUserAPI } from '../../assets/js/common'

  export default {
    data () {
      return {
        // 伪随机数组
        pesranList: [],
        // 专辑内音乐
        musicList: [],
        // 歌曲id
        id: '',
        // 专辑id
        cdId: ''
      }
    },
    created () {
      
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
        
        fun.commit('changeImg', song.img)
        fun.commit('setTime', song.time)
        fun.commit('changeTitle', song.title)
        fun.commit('changeSinger', song.singer)
        fun.commit('changeMusicUrl', song.musicUrl)
        fun.commit('changeMusicIndex', index)
        fun.commit('changeSongId', song._id)
      },
      // 根据id获取专辑信息
      getCdById () {
        if (this.$store.state.userPlay) {
          this.userId = this.$cookies.get('userId')

          this.$http.get(`${getUserAPI()}/getUserAllSong?id=${this.userId}`)
            .then(res => {
              let data = res.data.data
              this.musicList = data.musicList

              if (this.$store.state.sortText === "时间升序") {
                this.musicList.reverse()
              }
            })
        } else {
          this.$http.get(`${getAPI()}/getCdById?id=${this.cdId}`)
            .then(res => {
              if (this.cdId === '001') {
                res.data.data.forEach(ele => {
                  this.musicList.push(...ele.musicList)
                })
              } else {
                let data = res.data.data
                this.musicList = data.musicList
              }
  
              if (this.$store.state.sortText === "时间升序") {
                this.musicList.reverse()
              }
            })
        }
      }
    },
    computed: {
      // 当前播放歌曲index
      lisenIndex () {
        return this.$store.state.musicIndex
      },
      lisenNextSong () {
        return this.$store.state.nextSongFlag
      },
      lisenLastSong () {
        return this.$store.state.lastSongFlag
      },
      // 当前歌单id
      lisenCdId () {
        return this.$store.state.cdPageId
      },
      // 改变排序方式
      listenSortText () {
        return this.$store.state.sortText
      }
    },
    watch: {
      lisenIndex (newVal) {
        return newVal
      },
      lisenNextSong (newVal) {
        let playMode = this.$store.state.playMode

        this.$nextTick(() => {
          if (newVal) {
            if (playMode === 1) {
              this.$store.commit('changeLoopPlay', false)
  
              // 列表循环
              if (this.musicList.length === 1) {
                this.$store.commit('changeLoopPlay', true)
              } else if (this.lisenIndex + 1 > this.musicList.length - 1) {
                this.playSong(0)
              } else {
                this.playSong(this.lisenIndex + 1)
              }
  
              this.pesranList.splice(0)
            } else if (playMode === 2) {
              // 随机播放（采用伪随机）
              let index = this.lisenIndex
              this.$store.commit('changeLoopPlay', false)
              let random = this.getRandom(0, this.musicList.length)
  
              this.pesranList.push(index)
              
              if (this.pesranList.length === this.musicList.length) {
                this.pesranList.splice(0)
              }
  
              while (this.pesranList.indexOf(random) + 1) {
                random = this.getRandom(0, this.musicList.length)
              }
  
              if (this.musicList.length === 1) {
                this.$store.commit('changeLoopPlay', true)
              } else {
                this.playSong(random)
              }
            } else if (playMode === 3) {
              // 单曲循环
              this.$store.commit('changeLoopPlay', true)
  
              if (this.$store.state.buttonNextFlag) {
                if (this.lisenIndex + 1 > this.musicList.length - 1) {
                  this.playSong(0)
                } else {
                  this.playSong(this.lisenIndex + 1)
                }
  
                this.$store.commit('changeButtonNextFlag', false)
              }
  
              this.pesranList.splice(0)
            }
            
            this.$store.commit('changeNextSongFlag', false)
          }
        })
      },
      lisenLastSong (newVal) {
        let playMode = this.$store.state.playMode

        if (newVal) {
          if (playMode === 2) {
            let index = this.pesranList.length - 1

            this.playSong(this.pesranList[index])

            this.pesranList.splice(index, 1)
          } else {
            if (this.lisenIndex - 1 < 0) {
              this.playSong(this.musicList.length - 1)
            } else {
              this.playSong(this.lisenIndex - 1)
            }
          }
        }

        this.$store.commit('changeLastSongFlag', false)
      },
      lisenCdId (newVal) {
        this.cdId = newVal
        this.getCdById()
      },
      listenSortText () {
        this.musicList.reverse()
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>