<template>
  <Upload
    class="up-modle"
    multiple
    type="drag"
    :on-success="upSuccess"
    :action="api">
    <div style="padding: 100px 0"></div>
  </Upload>
  <!-- http://47.100.222.2:8001/jp/admin/fileUpload -->
</template>

<script>
  import { getUpAPI } from '../../assets/js/common' 

  export default {
    data () {
      return {
        api: getUpAPI()
      }
    },
    methods: {
      upSuccess (val) {
        this.$emit('upSuccess', val)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .up-modle {
    opacity: 0;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999999;
  }
</style>