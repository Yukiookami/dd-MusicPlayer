<template>
  <div @mousemove="showVolumeBar"
  @mouseleave="showVolumeBar('out')"
  class="volume-main"
  :class="{'volume-main-show': showButtonIcon}">
    <div class="volume-button">
      <img v-if="!muteFlag" class="volume-icon" src="../../../assets/img/play/voide.svg" @click="mute" alt="">

      <img v-if="muteFlag" class="volume-icon" src="../../../assets/img/play/voide-ban.svg" @click="mute" alt="">
    </div>

    <div @mousemove="moveVolume"
    @mousedown="move('start')"
    @mouseup="move('end')"
    v-if="volumeBarFlag" class="volume-pro">
      <div class="border-radius">
        <progress @click="getVolume" 
        class="play-pro-item" 
        max="100" :value="value"></progress>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['vol'],
    data () {
      return {
        iconImg: 'volumeButton-w',
        // 判断当前是否静音
        muteFlag: false,
        // 音量
        value: 100,
        // 记录静音前音量
        oldValue: 0,
        // 判断音量条是否打开
        volumeBarFlag: false,
        // 判断是否按下鼠标
        mousedownFlag: false
      }
    },
    computed: {
      showButtonIcon () {
        return this.$store.state.showButtonIcon
      }
    },
    watch: {
      vol (val) {
        this.value = val

        if (val === 0) {
          this.muteFlag = true
        } else {
          this.muteFlag = false
        }
      }
    },
    methods: {
      // 是否静音
      mute () {
        if (this.muteFlag) {
          // 停止静音
          // this.iconImg = 'volumeButton-w'
          if (this.oldValue) {
            this.value = this.oldValue
          } else {
            this.value = 10
          }
          this.sendVolume(this.value)
        } else {
          // 静音
          // this.iconImg = 'muteButton-w'
          this.oldValue = this.value
          this.value = 0
          this.sendVolume(this.value)
        }

        this.muteFlag = !this.muteFlag
      },
      // 获取音量
      getVolume (val) {
        this.value = val.offsetX
        this.sendVolume(this.value)
      },
      // 获得音量回调
      sendVolume (val) {
        this.$emit('getVolume', {val: val, flag: 'click'})
      },
      // 拖动改变音量
      moveVolume (val) {
        if(this.mousedownFlag) {
          this.value = val.offsetX
          this.sendVolume(this.value)
        }
      },
      /**
       * 判断是否开始移动
       * @param {String} flag start为按下鼠标，end为鼠标松开
       */ 
      move (flag) {
        if (flag === 'start') {
          this.mousedownFlag = true
        } else {
          this.mousedownFlag = false
        }
      },
      // 打开/关闭音量条
      showVolumeBar (falg) {
        if (falg === 'out') {
          this.volumeBarFlag = false
        } else {
          this.volumeBarFlag = true
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.volume-main {
  position: relative;
  height: 100%;
  width: 100%;

  .volume-pro {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    left: -49px;
    top: -64px;
    transform: rotate(-90deg);
    transition: all .2s ease-in-out;
    z-index: 99999;

    .border-radius {
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 4px;
      border-radius: 20px;

      .play-pro-item {
        width: 100px;
        height: 4px;
        background-color: #c53e2a;
        transition: all .2s ease-in-out;
        opacity: .8;
        cursor: pointer;
      }

      .play-pro-item::-webkit-progress-bar{     
        background-color: rgba(0, 0, 0, .5);
      }

      .play-pro-item::-webkit-progress-value {
        background-color: #c53e2a;
      }
    }
  }

  .volume-icon {
    height: 100%;
    width: 100%;
  }
}
</style>