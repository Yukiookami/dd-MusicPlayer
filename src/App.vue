<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
// 设置文字不可被选取
span,
p,
h1,
h2,
h3,
h4,
h5,
h6 {
  user-select:none;
}

::-webkit-scrollbar {
  display: none;
}

#app {
  background-color: #212121;
}
</style>
