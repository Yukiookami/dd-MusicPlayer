<template>
<keep-alive>
  <div class="fix-top">
    <swiper :imgList="imgList"></swiper>

    <div class="bm-love-sec">
      <h2 class="bm-love-title">单推专辑</h2>

      <div class="cd-item-sec">
        <cd-item :img="allSong.img" :title="allSong.title"
        :id="allSong.id"></cd-item>

        <cd-item v-for="(item, index) in cdList" :key="index"
        :img="item.imgUrl" :title="item.title" :id="item._id"></cd-item>
      </div>
    </div>
  </div>
</keep-alive>
</template>

<script>
  import swiper from '../../components/swiper/swiper'
  import cdItem from '../../components/cd/cdItem'
  import { getAPI } from '../../assets/js/common'

  export default {
    data () {
      return {
        // 轮播图数组，最少存在3个数据
        imgList: [
          {
            imgUrl: require('../../assets/img/swiper/73713002_p0.jpg')
          },
          {
            imgUrl: require('../../assets/img/swiper/77635312_p0.jpg')
          },
          {
            imgUrl: require('../../assets/img/swiper/78468133_p0.jpg')
          }
        ],
        // cd数组
        cdList: [],
        // 总歌单
        allSong: {
          img: require('../../assets/img/allSong.jpg'),
          title: '歌单汇总',
          id: '001'
        }
      }
    },
    created () {
      this.getCd()
    },
    methods: {
      // 获得cdlist
      getCd () {
        this.$http.get(`${getAPI()}/getCd`)
          .then(res => {
            this.cdList = res.data.list
          })
      }
    },
    components: {
      swiper,
      cdItem
    }
  }
</script>

<style lang="scss" scoped>
.bm-love-sec {
  min-height: 100vh;
  padding: 0 20px 100px;

  .bm-love-title {
    margin-bottom: 20px;
    font-size: 16px;
    color: #b0b0b0;
    font-weight: normal;
  }

  .cd-item-sec {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    width: 100%;
  }
}
</style>