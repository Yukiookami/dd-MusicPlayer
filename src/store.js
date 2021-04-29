import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // username
    username: 'いらっしゃい〜',
    // icon
    icon: require('./assets/img/icon.jpg'),
    // 控制playBar
    // 是否正在播放
    play: false,
    // 是否在用户页面播放
    userPlay: false,
    // 是否循环播放
    loopPlay: false,
    // 歌曲封面
    img: require('./assets/img/cd-box/CE10A839581963020C36D834532C7DAC.png'),
    // 歌曲总时间
    time: '00:00', 
    // 歌曲名
    title: '',
    // 歌手
    singer: '',
    // 音乐id
    songId: '',
    // 音乐链接
    musicUrl: '',
    // 当前专辑播放音乐index
    musicIndex: -1,
    // 播放模式
    playMode: 1,
    // 是否开始播放下一首
    nextSongFlag: false,
    // 是否开始播放下一首
    lastSongFlag: false,
    // 是否为点击按键进行下一首
    buttonNextFlag: false,
    // 是否在输入文字
    textInFlag: false,
    // cd页面id
    cdPageId: '',
    // 歌单排序
    sortText: '时间降序'
  },
  mutations: {
    // 设置用户名
    changeUsername (state, name) {
      state.username = name
    },
    // 设置头像
    changeIcon (state, icon) {
      state.icon = icon
    },
    // 控制播放
    changePlay (state) {
      state.play = !state.play
    },
    // 是否为在用户页面播放
    changeUserPlay (state, flag) {
      state.userPlay = flag
    },
    // 锁定播放
    setPlay (state, play) {
      state.play = play
    },
    // 切换封面
    changeImg (state, img) {
      state.img = img
    },
    // 设置歌曲id
    changeSongId (state, songId) {
      state.songId = songId
    },
    // 设置时间
    setTime (state, time) {
      state.time = time
    },
    // 切换歌名
    changeTitle (state, title) {
      state.title = title
    },
    // 切换歌手
    changeSinger (state, singer) {
      state.singer = singer
    },
    // 切换链接
    changeMusicUrl (state, url) {
      state.musicUrl = url
    },
    // 更新index
    changeMusicIndex (state, index) {
      state.musicIndex = index
    },
    // 设置播放模式
    changePlayMode (state, playMode) {
      state.playMode = playMode
    },
    // 是否开始下一首
    changeNextSongFlag (state, flag) {
      state.nextSongFlag = flag
    },
    // 是否循环播放
    changeLoopPlay (state, flag) {
      state.loopPlay = flag
    },
    // 是否开始上一首
    changeLastSongFlag (state, flag) {
      state.lastSongFlag = flag
    },
    // 是否为点击按键开启下一首
    changeButtonNextFlag (state, flag) {
      state.buttonNextFlag = flag
    },
    // 是否在输入文字
    changeTextInFlag (state, flag) {
      state.textInFlag = flag
    },
    // 歌单id
    changeCdPageId (state, id) {
      state.cdPageId = id
    },
    // 改变歌单排序
    changeSortText (state, text) {
      state.sortText = text
    }
  },
  actions: {

  }
})
