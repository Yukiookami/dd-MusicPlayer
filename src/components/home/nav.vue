<template>
  <div class="bm-nav">
    <!-- 登录 -->
    <Modal
      v-model="show"
      footer-hide
      :closable="false"
      width="300" class="modle-box">
      <div class="title-info-box">
        <input class="cd-name-input" @focus="stopPlayBar(true)" @blur="stopPlayBar(false)" 
        v-model="postUsername" type="text" placeholder="请输入用户名" name="">

        <input class="cd-name-input" @focus="stopPlayBar(true)" @blur="stopPlayBar(false)" 
        v-model="postPassword" type="password" placeholder="请输入密码" name="">

        <div class="button-box">
          <button @click="logOff" class="save-button">注销</button>
          <button @click="login" class="save-button">登录</button>
        </div>
      </div>
    </Modal>

    <!-- 头像区域 -->
    <div @click="showLogin" class="icon-sec">
      <div class="icon-img">
        <img :src="icon" alt="">
      </div>
      <span class="icon-text">{{username}}</span>
    </div>
    <!-- 头像区域end -->
    
    <!-- 导航栏区域 -->
    <nav>
      <ul class="nav-list-ul">
        <li @click="changeSel(index)" class="nav-list-li" 
        :class="{'nav-sel': selIndex === index}" 
        v-for="(item, index) in navList" :key="index">
          <router-link :to="item.url">
            <Icon class="nav-list-icon" :type="item.icon" />
            <span>{{item.title}}</span>
          </router-link>
        </li>
      </ul>
    </nav>
    <!-- 导航栏区域end -->
  </div>
</template>

<script>
  import { getUserAPI } from '../../assets/js/common'

  export default {
    // 用户名
    props: ['username', 'icon'],
    data () {
      return {
        // 控制选中
        selIndex: 0,
        // 用户登陆
        show: false,
        // 用户名
        postUsername: '',
        // 密码
        postPassword: '',
        // 导航栏list
        navList: [
          {
            title: '永遠に単推し',
            url: '/myOnlyLove',
            icon: 'ios-heart'
          },
          {
            title: 'だれでも大好き',
            url: '/ddPlayPage',
            icon: 'md-thumbs-up'
          },
          {
            title: '仕事用キラ彡☆',
            url: '/workBGM',
            icon: 'md-code-working' 
          },
          {
            title: '単推し増える',
            url: '/addCd',
            icon: 'md-disc'
          },
          {
            title: '変な曲が増えてる',
            url: '/addSong',
            icon: 'md-headset' 
          },
          {
            title: '仕事用増える',
            url: '/addWorkBGM',
            icon: 'ios-musical-notes' 
          },
          {
            title: '単推し管理',
            url: '/putCd',
            icon: 'ios-disc' 
          },
          {
            title: 'ユーザーADD',
            url: '/userAdd',
            icon: 'md-contacts' 
          },
          {
            title: 'ユーザー管理',
            url: '/userPut',
            icon: 'md-ionitron' 
          }
        ]
      }
    },
    methods: {
      // 检测是否开始输入
      stopPlayBar (flag) {
        this.$store.commit('changeTextInFlag', flag)
      },
      /**
       * @param {Number} index 所选index
       * 控制选中状态
       */
      changeSel (index) {
        this.selIndex = index
      },
      /**
       * 显示登录界面
       */
      showLogin () {
        this.show = !this.show
      },
      /**
       * 登录
       */
      login () {
        if (!this.postUsername || !this.postPassword) {
          this.$Message.warning('没输完草peko');
        } else {
          let password = this.$md5(this.postPassword)

          this.$http.post(`${getUserAPI()}/login`, {
            username: this.postUsername,
            password: password
          }).then(res => {
            if (res.data.status === 2000) {
              let data = res.data.data

              this.$store.commit('changeUsername', data.username)
              data.icon ? this.$store.commit('changeIcon', data.icon) : 0

              this.$cookies.set('username', data.username, '30d')
              this.$cookies.set('icon', data.icon, '30d')
              this.$cookies.set('userId', data.userId, '30d')

              this.postUsername = ''
              this.postPassword = ''

              this.showLogin()
            } else if (res.data.status === 2) {
              this.$Message.error('账号或密码错误');
            } else {
              this.$Message.error('服务器错误');
            }
            
          })
        }
      },
      // 注销
      logOff () {
        this.$cookies.remove('username')
        this.$cookies.remove('icon')
        this.$cookies.remove('userId')

        this.$store.commit('changeUsername', 'いらっしゃい〜')
        this.$store.commit('changeIcon', require('../../assets/img/icon.jpg'))

        this.showLogin()
      }
    }
  }
</script>

<style lang="scss" scoped>
::v-deep .ivu-modal-body {
  background-color: #212121;
  border-radius: 5px;
}

.title-info-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 110px;
  width: 100%;
  background-color: #212121;

  .cd-name-input {
    padding: 5px;
    width: 100%;
    border-radius: 5px;
    background-color: #303030;
    border: none;
    color: #FFF;
    outline: none;
  }

  .button-box {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    width: 100%;

    .save-button {
      user-select: none;
      width: 100px;
      background-color: #82342c;
      color: #FFF;
      border: none;
      border-radius: 10px;
      padding: 5px 20px;
      outline: none;
      cursor: pointer;
    }
  }
}

.bm-nav {
  user-select: none;
  position: fixed;
  left: 0;
  padding: 40px 20px 0;
  width: 200px;
  height: 100%;
  background-color: #1d1d1d;

  // 头像区域
  .icon-sec {
    display: flex;
    align-items: center;
    cursor: pointer;

    .icon-img {
      overflow: hidden;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;

      & img {
        width: 100%;
      }
    }

    .icon-text {
      color: #b0b0b0;
      font-size: 14px;
      font-weight: 600;
    }
  }
  // 头像区域end

  // 导航栏区域
  .nav-list-ul {
    margin-top: 18px;
    list-style: none;

    .nav-list-li {
      font-size: 14px;
      border-radius: 5px;

      & a {
        display: block;
        padding: 10px 0 10px 15px;
        color: #b0b0b0;
      }

      .nav-list-icon {
        margin-right: 7px;
      }
    }

    .nav-sel {
      background-color: #191919;

      & a {
        color: #c53e2a;
      }
    }
  }
  // 导航栏区域end
}
</style>