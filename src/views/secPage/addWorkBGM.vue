<template>
  <div class="add-page fix-top">
    <div class="get-cd-info-box">
      <div>
        <audio class="hide-video" @canplay="setNowTime" ref="vid" :src="musicUrl"></audio>
        <div class="img-upload">
          <upload @upSuccess="getImgUrl"></upload>

          <img :src="upimg" alt="">
        </div>

        <Checkbox class="use-one" v-model="useOne">使用同一张图片</Checkbox>

        <Upload class="up-music" 
        :action="upAPI"
        :on-success="getSongUrl">
          <Button class="up-music-button" icon="ios-cloud-upload-outline">上传音乐文件</Button>
        </Upload>
      </div>

      <div class="title-info-box">
        <input class="cd-name-input" @focus="stopPlayBar(true)" @blur="stopPlayBar(false)"
        v-model="title" type="text" 
        placeholder="请输入歌曲名称" name="">

        <input class="cd-name-input" @focus="stopPlayBar(true)" @blur="stopPlayBar(false)"
        v-model="singer" type="text" 
        placeholder="请输入歌手名称" name="">

        <input class="cd-name-input" @focus="stopPlayBar(true)" @blur="stopPlayBar(false)"
        v-model="time" type="text" 
        placeholder="请输入歌曲总时长 例如: 00:00" name="">

        <button @click="save" class="save-button">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
  import upload from '../../components/common/upload'
  import { getAPI, getUpAPI } from '../../assets/js/common'
  import {PrefixInteger, formatDecimal} from '../../assets/js/common'

  export default {
    data () {
      return {
        upimg: '',
        title: '',
        time: '',
        singer: '',
        musicUrl: '',
        cdList: [],
        cdBoxCheck: 0,
        useOne: false,
        upAPI: getUpAPI()
      }
    },
    created () {

    },
    methods: {
      // 检测是否开始输入
      stopPlayBar (flag) {
        this.$store.commit('changeTextInFlag', flag)
      },
      /**
       * 设置当前时间
       */
      setNowTime () {
        let nowTime = ''
        let time = formatDecimal(this.$refs.vid.duration, 0)

        time >= 60 ? nowTime = `${PrefixInteger(formatDecimal(time / 60, 0), 2)}:${PrefixInteger(time % 60, 2)}`: 
        nowTime = `00:${PrefixInteger(time, 2)}`
        this.time = nowTime
      },
      // 获得图片url
      getImgUrl (val) {
        this.upimg = val.data.fileUrl
      },
      // 获得歌曲Url
      getSongUrl (val) {
        this.title = val.data.fileName
        this.musicUrl = val.data.fileUrl
      },
      // 上传配置
      save () {
        if (!this.upimg || 
        !this.title ||
        !this.singer ||
        !this.time ||
        !this.musicUrl) {
          this.$Message.warning('还没填完 草peko');
        } else {
          this.$http.post(`${getAPI()}/addWorkBGM`, {
            img: this.upimg,
            title: this.title,
            singer: this.singer,
            time: this.time,
            musicUrl: this.musicUrl,
            id: this.cdId
          }).then(res => {
            if (res.data.status === 2000) {
              this.$Message.success('添加成功');
  
              this.title = ''
              this.singer = ''
              this.musicUrl = ''
              if (!this.useOne) {
                this.upimg = ''
              }
              this.id = this.cdList[0]._id
              this.time = ''
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
  background-color: #212121;
  top: 30px;
}

.hide-video {
  opacity: 0;
  position: absolute;
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
      margin-top: 35px;
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

    .use-one {
      user-select: none;
      color: #FFF;
      margin: 15px 0 5px;
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