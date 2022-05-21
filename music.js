const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const player  = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn =$('.btn-repeat')
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
songs: [
    {
      name: "Click Pow Get Down",
      singer: "Raftaar x Fortnite",
      path: "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
    },
    {
      name: "Tu Phir Se Aana",
      singer: "Raftaar x Salim Merchant x Karma",
      path: "https://cdn.pagalworld.us/songs/new/192/Tu Phir Se Aana - Raftaar.mp3",
      image:
        "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
    },
    {
      name: "Naachne Ka Shaunq",
      singer: "Raftaar x Brobha V",
      path:
        "https://pagalsong.in/uploads/systemuploads/mp3/Mr. Nair/Naachne Ka Shaunq - Mr.Nair 128 Kbps.mp3",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
    },
    {
      name: "Mantoiyat",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "https://songs14.vlcmusic.com/mp3/org/38604.mp3",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
    },
    {
      name: "Aage Chal",
      singer: "Raftaar",
      path: "https://pagalsong.in/uploads/systemuploads/mp3/Aage Chal - Raftaar/Aage Chal - Raftaar 128 Kbps.mp3",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
    },
    {
      name: "Feeling You",
      singer: "Raftaar x Harjas",
      path: "https://tainhacmienphi.biz/get/song/api/200214",
      image:
        "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
    }
  ],
  render: function(){
     const htmls = this.songs.map((song,index) => {
         return `
         <div class="song ${index === this.currentIndex ? 'active' : ''}">
         <div class="thumb" style="background-image: url('${song.image}')">
         </div>
         <div class="body">
           <h3 class="title">${song.name}</h3>
           <p class="author">${song.singer}</p>
         </div>
         <div class="option">
           <i class="fas fa-ellipsis-h"></i>
         </div>
       </div>
         `
     })
    $('.playlist').innerHTML = htmls.join('');
  },
  defineProperties: function(){
    Object.defineProperty(this, 'currentSong',{
    get: function(){
      return this.songs[this.currentIndex]
    }})
  },
  handleEvent: function(){
    const cdWidth = cd.offsetWidth
    // xu ly CD quay va dung
   const cdThumbAnimate = cdThumb.animate([
      {transform: 'rotate(360deg'}
    ],{
      duration:10000, //quay 10s
      iterations: Infinity  
    })
    cdThumbAnimate.pause()
    // xử lý phóng to thu nhỏ cd
    document.onscroll = function(){
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop
      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' :0
      cd.style.opacity = newCdWidth / cdWidth
    }
    //xử lý khi click play
    playBtn.onclick = function(){
      if(app.isPlaying){
      audio.pause()
      }else{
      audio.play()
      }
    }
    // khi song play 
    audio.onplay =function(){
      app.isPlaying = true
      player.classList.add('playing')
      cdThumbAnimate.play()
    }
      // khi song bi play 
      audio.onpause =function(){
        app.isPlaying = false
        player.classList.remove('playing')
        cdThumbAnimate.pause()
      }
    //khi tien do bai hat thay doi
    audio.ontimeupdate =function(){
      if(audio.duration){
        const progressPercent = Math.floor(audio.currentTime / audio.duration*100)
        progress.value = progressPercent
      }
    }
    // su ly khi tua song 
    progress.onchange = function(e){
      const seekTime = audio.duration / 100 * e.target.value
      audio.currentTime = seekTime
    }
    // khi next song
    nextBtn.onclick = function(){
      if(app.isRandom){
        app.playRandomSong()
      }else{
        app.nextSong()
      }
      audio.play()
      app.render()
    }
     // khi prev song
     prevBtn.onclick = function(){
      if(app.isRandom){
        app.playRandomSong()
      }else{
        app.prevSong()
      }
      audio.play()
    }
    // xử lý random bật tắt
    randomBtn.onclick = function(e){
      app.isRandom = !app.isRandom
      randomBtn.classList.toggle('active',app.isRandom)
    }
    // xử lý phát lại 1 bài hát
    repeatBtn.onclick = function(e){
      app.isRepeat = !app.isRepeat;
      repeatBtn.classList.toggle('active',app.isRepeat)
    }
    // xử lý next song khi audio ended
    audio.onended = function(){
      if(app.isRepeat){
        audio.play()
      }else{
        nextBtn.click()
      }
    }
  },
  loadCurrentSong: function(){
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
  },
  nextSong: function(){
    this.currentIndex++
    if(this.currentIndex >= this.songs.length){
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },
  prevSong: function(){
    this.currentIndex--
    if(this.currentIndex < 0){
      this.currentIndex = this.songs.length - 1
    }
    this.loadCurrentSong()
  },
  playRandomSong : function(){
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * this.songs.length)
    } while (newIndex === this.currentIndex)
    this.currentIndex = newIndex
    this.loadCurrentSong()
  },
  start: function(){
    // định nghĩa các thuộc tính cho object
      this.defineProperties()
      // lắng nghe / xử lý  các sự kiện (Dom events)
      this.handleEvent()
      //tai thông tin bài hát đầu tiên vào Ui khi chạy
      this.loadCurrentSong()
      // render playlist
      this.render()
  }
}
app.start(); 