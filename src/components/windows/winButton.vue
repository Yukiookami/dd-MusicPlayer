<template>
  <!-- 自定义窗口按钮组件 -->
  <div class="button" 
  :style="style" 
  @click="click"
  @mouseover="changeIcon"
  @mouseleave="changeIcon('out')"
  ></div>
</template>

<script>
  const { ipcRenderer : ipc } = require('electron');

  export default {
    props: ['type'],
    data () {
      return {
        buttonStyle: {
          max: {
            backgroundColor: '#62c755',
            backgroundImage: ''
          },
          min: {
            backgroundColor: '#f4c251',
            backgroundImage: ''
          },
          close: {
            backgroundColor: '#ec695e',
            backgroundImage: ''
          }
        }
      }
    },
    computed: {
      style () {
        return this.buttonStyle[this.type]
      }
    },
    methods: {
      // 点击按钮触发窗口按钮事件
      click () {
        ipc.send(this.type)
      },
      // 鼠标滑过显示功能按键
      changeIcon (flag) {
        let type = this.type

        if (flag === 'out') {
          this.buttonStyle[type].backgroundImage = ''
        } else {
          this.buttonStyle[type].backgroundImage = `url(icon/${type}.svg)`
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.button {
  margin-right: 10px;
  height: 12px;
  width: 12px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 1);
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: 70%;
  background-position: center;
  z-index: 2147483647;
}
</style>