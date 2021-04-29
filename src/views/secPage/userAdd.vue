<template>
  <div class="add-page fix-top">
    <div class="get-cd-info-box">
      <div class="img-upload">
        <upload @upSuccess="getImgUrl"></upload>

        <img :src="upimg" alt="">
      </div>

      <div class="title-info-box">
        <input class="cd-name-input" @focus="stopPlayBar(true)" @blur="stopPlayBar(false)" 
        v-model="username" type="text" placeholder="请输入用户名" name="">

        <input class="cd-name-input" @focus="stopPlayBar(true)" @blur="stopPlayBar(false)" 
        v-model="password" type="password" placeholder="请输入密码" name="">

        <input class="cd-name-input" @focus="stopPlayBar(true)" @blur="stopPlayBar(false)" 
        v-model="netCloUsername" type="text" placeholder="请输入网易云用户名" name="">

        <input class="cd-name-input" @focus="stopPlayBar(true)" @blur="stopPlayBar(false)" 
        v-model="netCloPassword" type="password" placeholder="请输入网易云密码" name="">

        <button @click="save" class="save-button">添加</button>
      </div>
    </div>
  </div>
</template>

<script>
  import upload from '../../components/common/upload'
  import { getUserAPI } from '../../assets/js/common'

  export default {
    data () {
      return {
        upimg: '',
        username: '',
        password: '',
        netCloUsername: '',
        netCloPassword: ''
      }
    },
    methods: {
      // 检测是否开始输入
      stopPlayBar (flag) {
        this.$store.commit('changeTextInFlag', flag)
      },
      getImgUrl (val) {
        this.upimg = val.data.fileUrl
      },
      save () {
        if (!this.username ||
        !this.password) {
          this.$Message.warning('还没填完 草peko');
        } else {
          let password = this.$md5(this.password)

          this.$http.post(`${getUserAPI()}/addUser`, {
            'username': this.username,
            'password': password,
            'netCloUsername': this.netCloUsername,
            'netCloPassword': this.netCloPassword,
            'icon': this.upimg
          }).then(res => {
            if (res.data.status === 2000) {
              this.$Message.success('添加成功');
  
              this.upimg = ''
              this.username = ''
              this.password = ''
              this.netCloUsername = ''
              this.netCloPassword = ''
            } else if (res.data.status === 1) {
              this.$Message.error('用户已存在');
            } else {
              this.$Message.error('添加失败请重试');
            }
          })
        }
      }
    },
    components: {
      upload
    }
  }
</script>

<style lang="scss" scoped>
.fix-top {
  position: absolute;
  width: 100%;
  top: 30px;
}

.add-page {
  padding: 30px 60px;

  .get-cd-info-box {
    display: flex;
    justify-content: space-between;
    width: 600px;
    margin: 0 auto;

    .title-info-box {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-end;
      height: 200px;

      .cd-name-input {
        padding: 5px;
        width: 250px;
        border-radius: 5px;
        background-color: #303030;
        border: none;
        color: #FFF;
        outline: none;
      }

      .save-button {
        user-select: none;
        background-color: #82342c;
        color: #FFF;
        border: none;
        border-radius: 10px;
        padding: 5px 20px;
        outline: none;
        cursor: pointer;
      }
    }
    
    .img-upload {
      user-select: none;
      overflow: hidden;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 5px;
      height: 200px;
      width: 200px;
      border: 2px solid #FFF;
      background-image: url('../../assets/img/upload.svg');
      background-size: 50%;
      background-repeat: no-repeat;
      background-position: center;
      z-index: 0;

      img {
        width: 100%;
        z-index: 9999;
      }
    }
  }
}
</style>