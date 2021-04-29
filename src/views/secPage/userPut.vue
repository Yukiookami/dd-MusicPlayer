<template>
  <div class="add-page fix-top">
    <Modal
      v-model="show"
      footer-hide
      :closable="false"
      width="300"
      @on-ok="ok">
      <div class="model-box">
        <span>是否删除用户(该用户将会失去所有权限)</span>
        
        <div class="button-box">
          <img class="save-button" src="../../assets/img/del.svg" 
          @click="cancel" alt="">
          <img class="save-button" src="../../assets/img/ok.svg" 
          @click="ok">
        </div>
      </div>
    </Modal>

    <div class="get-cd-info-box">
      <div class="img-upload">
        <upload @upSuccess="getImgUrl"></upload>

        <img :src="upimg" alt="">
      </div>

      <div class="title-info-box">
        <div>
          <input class="cd-name-input change-width" @focus="stopPlayBar(true)" @blur="stopPlayBar(false)" 
          v-model="username" type="text" placeholder="请输入用户名" name="">

          <button @click="getIdByUsername" class="save-button">获取用户信息</button>
        </div>

        <input class="cd-name-input" @focus="stopPlayBar(true)" @blur="stopPlayBar(false)" 
        v-model="password" type="text" placeholder="请输入密码" name="">

        <input class="cd-name-input" @focus="stopPlayBar(true)" @blur="stopPlayBar(false)" 
        v-model="netCloUsername" type="text" placeholder="请输入网易云用户名" name="">

        <input class="cd-name-input" @focus="stopPlayBar(true)" @blur="stopPlayBar(false)" 
        v-model="netCloPassword" type="text" placeholder="请输入网易云密码" name="">

        <div>
          <button @click="delCd" class="save-button">删除</button>
          <button @click="save" class="save-button">保存</button>
        </div>
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
        netCloPassword: '',
        userId: '',
        show: false
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
      // 根据用户名获得用户id以及信息
      getIdByUsername () {
        this.$http.get(`${getUserAPI()}/getId?username=${this.username}`)
          .then(res => {
            let data = res.data.data
            
            if (data) {
              this.upimg = data.icon
              this.username = data.username
              this.password = data.password
              this.netCloUsername = data.netCloUsername
              this.netCloPassword = data.netCloPassword
              this.userId = data._id
            } else {
              this.$Message.warning('查无此人');
            }
          })
      },
      // 修改用户信息
      save () {
        if (!this.username ||
        !this.password) {
          this.$Message.warning('还没填完 草peko');
        } else {
          let password = this.$md5(this.password)

          this.$http.put(`${getUserAPI()}/putUser`, {
            'id': this.userId,
            'username': this.username,
            'password': password,
            'netCloUsername': this.netCloUsername,
            'netCloPassword': this.netCloPassword,
            'icon': this.upimg
          }).then(res => {
            if (res.data.status === 2000) {
              this.$Message.success('修改成功');
  
              this.upimg = ''
              this.username = ''
              this.password = ''
              this.netCloUsername = ''
              this.netCloPassword = ''
              this.userId = ''
            } else {
              this.$Message.error('修改失败请重试');
            }
          })
        }
      },
      // 删除专辑
      delCd () {
        this.cancel()
      },
      // 确认删除
      ok () {
        this.$http.delete(`${getUserAPI()}/delUser?id=${this.userId}`)
          .then(res => {
            if (res.data.status === 2000) {
              this.$Message.success('删除成功');

              this.upimg = ''
              this.username = ''
              this.password = ''
              this.netCloUsername = ''
              this.netCloPassword = ''
              this.userId = ''
            } else {
              this.$Message.error('删除失败请重试');
            }
          })
        this.cancel()
      },
      // 取消删除
      cancel () {
        this.show = !this.show
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

      .change-width {
        width: 128px;
      }

      .save-button {
        margin-left: 10px;
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