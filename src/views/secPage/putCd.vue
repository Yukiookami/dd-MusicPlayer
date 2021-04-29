<template>
  <div class="add-page fix-top">
    <Modal
      v-model="show"
      footer-hide
      :closable="false"
      width="300"
      @on-ok="ok">
      <div class="model-box">
        <span>是否删除专辑(同时会删除该专辑内的音乐)</span>
        
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
        <input class="cd-name-input" @focus="stopPlayBar(true)" @blur="stopPlayBar(false)" 
        v-model="title" type="text" placeholder="请输入专辑名称" name="">

        <textarea @focus="stopPlayBar(true)" @blur="stopPlayBar(false)" 
        class="cd-name-input" rows="5" placeholder="请输入简介"></textarea>

        <div>
          <button @click="delCd" class="save-button">删除</button>
          <button @click="save" class="save-button">保存</button>
        </div>
      </div>
    </div>

    <div class="cd-show">
      <div class="cd-box" :class="{'cd-box-check': index === cdBoxCheck}"
      @click="pickCd(item._id, index)"
      v-for="(item, index) in cdList" :key="index">
        <cd-item class="cd-item" :img="item.imgUrl" :flag="1"
        :title="item.title" :id="item._id"></cd-item>
      </div>
    </div>
  </div>
</template>

<script>
  import upload from '../../components/common/upload'
  import cdItem from '../../components/cd/cdItem'
  import { getAPI } from '../../assets/js/common'

  export default {
    data () {
      return {
        upimg: '',
        title: '',
        cdId: '',
        cdList: [],
        cdBoxCheck: 0,
        show: false
      }
    },
    created () {
      this.getCd()
    },
    methods: {
      // 检测是否开始输入
      stopPlayBar (flag) {
        this.$store.commit('changeTextInFlag', flag)
      },
      // 获得图片url
      getImgUrl (val) {
        this.upimg = val.data
      },
      // 选择cd
      pickCd (id, index) {
        this.cdId = id
        this.cdBoxCheck = index

        let arr = this.cdList[index] 

        this.title = arr.title
        this.upimg = arr.imgUrl
      },
      // 获得cdlist
      getCd () {
        this.$http.get(`${getAPI()}/getCd`)
          .then(res => {
            this.cdList = res.data.list
            if (!this.cdList.length) {
              this.title = ''
              this.cdId = ''
              this.upimg = ''            
            } else {
              let arr = this.cdList[0] 
              
              this.title = arr.title
              this.cdId = arr._id
              this.upimg = arr.imgUrl
            }
          })
      },
      // 上传配置
      save () {
        if (!this.upimg || 
        !this.title ||
        !this.cdId) {
          this.$Message.warning('还没填完 草peko');
        } else {
          this.$http.put(`${getAPI()}/putCd`, {
            imgUrl: this.upimg,
            title: this.title,
            id: this.cdId
          }).then(res => {
            if (res.data.status === 2000) {
              this.$Message.success('修改成功');
              this.getCd()
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
        this.$http.delete(`${getAPI()}/delCd?id=${this.cdId}`)
          .then(res => {
            if (res.data.status === 2000) {
              this.$Message.success('删除成功');
              this.getCd()
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
      upload,
      cdItem
    }
  }
</script>

<style lang="scss" scoped>
.fix-top {
  position: absolute;
  background-color: #212121;
  width: 100%;
  top: 30px;
}

::v-deep .ivu-modal-body {
  background-color: #212121;
  border-radius: 5px;
  color: #FFF;
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
  padding: 30px 60px 100px;

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
        margin-left: 10px;
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

    .up-music {
      margin-top: 10px;

      .up-music-button {
        background: rgba(0, 0, 0, 0);
        color: #ccc;
        border: rgba(255, 255, 255, .2) 1px solid;
        outline: none;
      }
    }
  }

  .cd-show {
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;

    .cd-box {
      position: relative;
      padding: 15px 15px 1px 15px;
      width: 170px;
      border-radius: 15px;
      transition: all ease-in-out .3s;

      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 99999;
        cursor: pointer;
      }
    }

    .cd-box-check {
      box-shadow: 0 0 5px #82342c; 
    }

    .cd-item {
      z-index: -1;
    }
  }
}
</style>