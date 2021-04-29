<template>
<!-- 0->0 1->1 2->2 3->0 4->1 5->2 6->0 -->
  <div class="bm-swiper-sec">
    <!-- 盒子1 2-->
    <div class="img-box box-index-2" :class="{
      'show-mark': !(totalCont % 3 - 2)
    }">
      <img :src="imgList[2].imgUrl" alt="">
    </div>
    <!-- 盒子1end -->
    <!-- 盒子2 0-->
    <div class="img-box box-index-0 show-box" :class="{
      'show-mark': !(totalCont % 3)
    }">
      <img :src="imgList[0].imgUrl" alt="">
    </div>
    <!-- 盒子2end -->
    <!-- 盒子3 1-->
    <div class="img-box box-index-1" :class="{
      'show-mark': !(totalCont % 3 - 1)
    }">
      <img :src="imgList[1].imgUrl" alt="">
    </div>
    <!-- 盒子3end -->
  </div>
</template>

<script>
  import './swiper.css'

  export default {
    // 图片数组，最少存在3张轮播图(暂时只支持3张轮播图)
    props: ['imgList'],
    data () {
      return {
        cont: 0,
        totalCont: 0
      }
    },
    computed: {
      box1Cont () {
        return this.cont - 1 < 0 ? this.imgList.length - 1 : this.cont - 1
      },
      box2Cont () {
        return this.cont + 1 >= this.imgList.length ?  0 : this.cont + 1
      },
    },
    mounted () {
      // setInterval(() => {
      //   if (this.cont++ >= this.imgList.length) {
      //     this.cont = 0
      //   } else{
      //     this.cont++
      //   }
      // }, 4000)
    }
  }
</script>

<style lang="scss" scoped>
.bm-swiper-sec {
  display: flex;
  align-items: center;
  position: relative;
  height: 240px;

  // 图片盒子通用样式
  .img-box {
    position: absolute;
    top: 0;
    overflow: hidden;
    border-radius: 15px;
    height: 200px;
    width: 540px;
    transition: all ease-in-out .5s;
    line-height: 0;

    &::after {
      content: '';
      position: absolute;
      display: block;
      border-radius: 15px;
      background-color: rgba(0, 0, 0, .5);
      transition: all ease-in-out .5s;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
    }

    & img {
      width: 100%;
    } 
  }

  // 出来
  .show-box {
    position: absolute;
    top: 0;
    left: calc(50% - 270px);
    z-index: 999;
  }

  // .show-mark {
  //   &::after {
  //     background-color: rgba(0, 0, 0, 0);
  //   }
  // }
}
</style>