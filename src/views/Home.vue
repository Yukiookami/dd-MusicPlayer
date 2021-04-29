<template>
<!-- 1d1d1d 212121 -->
  <div class="bm-main">
    <!-- 拖拽栏 -->
    <div class="mark-drag"></div>

    <div class="win-button">
      <!-- 自定义按键 -->
      <win-button type="close"></win-button>
      <win-button type="min"></win-button>
    </div>

    <div class="bm-main-sec">
      <play-list></play-list>

      <div>
        <!-- 导航栏 -->
        <div class="bm-nav-sec">
          <bmNav :username="username" :icon="icon"></bmNav>
        </div>
        <!-- 导航栏end -->

        <!-- 页面 -->
        <div class="bm-page-sec">
          <transition name="router-loding">
            <router-view></router-view>
          </transition>
        </div>
        <!-- 页面end -->

        <!-- 播放条 -->
        <play-bar></play-bar>
        <!-- 播放条end -->
      </div>
    </div>
  </div>
</template>

<script>
  import bmNav from '../components/home/nav'
  import playBar from '../components/playBar/playBar'
  import playList from '../components/home/playList'
  import winButton from '../components/windows/winButton'

  export default {
    data () {
      return {
        username: this.$store.state.username,
        icon: this.$store.state.icon
      }
    },
    computed: {
      vuexUsername () {
        return this.$store.state.username
      },
      vuexIcon () {
        return this.$store.state.icon
      }
    },
    created () {
      let username = this.$cookies.get('username')
      let icon = this.$cookies.get('icon')

      username ? this.$store.commit('changeUsername', username) : 0
      icon ? this.$store.commit('changeIcon', icon) : 0
    },
    methods: {

    },
    mounted () {

    },
    components: {
      // 导航栏
      bmNav,
      // 播放条
      playBar,
      // 播放列表
      playList,
      // 窗口按钮
      winButton
    },
    watch: {
      '$route' (to, from) {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      },
      vuexUsername (newVal) {
        this.username = newVal
      },
      vuexIcon (newVal) {
        this.icon = newVal
      }
    }
  }
</script>

<style lang="scss" scoped>
.bm-main {
  // 拖拽以及功能区域
  .mark-drag {
    position: fixed;
    top: 0;
    left: 200px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 30px;
    width: calc(100vw - 200px);
    -webkit-app-region: drag;
  }

  .win-button {
    position: fixed;
    top: 0px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 30px;
    width: 100vw;
    z-index: 2147483647;
  }

  // 内容显示区
  .bm-main-sec {
    &>div {
      display: flex;
    }

    .bm-nav-sec {
      width: 200px;
    }

    .bm-page-sec {
      position: relative;
      padding-top: 30px;
      width: calc(100vw - 200px);
      background-color: #212121;
      min-height: 100vh;
    }
  }

    // 初始
  .router-loding-enter,
  .router-loding-leave-to {
    opacity: 0;
    // transform: translateY(calc(100vh - 30px));
    // filter: blur(10px);
  }

  // 结束
  .router-loding-enter-to,
  .router-loding-leave {
    opacity: 1;
    // transform: translateY(0);
    // filter: blur(0);
  }

  .router-loding-enter-active,
  .router-loding-leave-active {
    transition: all .2s ease-in-out
  }
}
</style>