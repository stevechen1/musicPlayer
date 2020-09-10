function $(selector){
    return document.querySelector(selector)
}
var timer
var musicList

var music = new Audio()
music.autoplay = true
var musicIndex = 0
function getMusic(callback){
    var xhr = new XMLHttpRequest()
    xhr.open('get','/music.json',true)
    xhr.send()
    xhr.onload = function(){
        if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
            callback(JSON.parse(xhr.responseText))
        }
    }
}
function setPlaylist(musiclist){
    var container = document.createDocumentFragment()
    musiclist.forEach(function(musicObj){
        var node = document.createElement('li')
        node.innerText = musicObj.author + '-' + musicObj.title
        // console.log(node)
        container.appendChild(node)
    })
    $('.musicbox .list').appendChild(container)
}
function loadMusic(songObj){
    music.src = songObj.src
    $('.musicbox .author').innerText = songObj.author
    $('.musicbox .title').innerText = songObj.title
    $('.cover').style.backgroundImage = 'url(' + songObj.img + ')'
    for(var i = 0; i < $('.musicbox .list').children.length; i++){
        $('.musicbox .list').children[i].classList.remove('playing')
    }
    $('.musicbox .list').children[musicIndex].classList.add('playing')
}
function loadNextMusic(){
    musicIndex++
    musicIndex = musicIndex % musicList.length
    loadMusic(musicList[musicIndex])
    
}
function loadLastMusic(){
    musicIndex--
    musicIndex = (musicIndex + musicList.length) % musicList.length
    loadMusic(musicList[musicIndex])   
    icon.classList.toggle('icon-pause')      
}
function updateProgress() {
    var percent = (music.currentTime / music.duration) * 100 + '%'
    $('.musicbox .progress-now').style.width = percent

    var minutes = parseInt(music.currentTime / 60)
    var seconds = parseInt(music.currentTime % 60) + ''
    seconds = seconds.length == 2 ? seconds : '0' + seconds
    $('.musicbox .time').innerText = minutes + ':' + seconds
}

getMusic(function(list){
    musicList = list
     setPlaylist(list)
     loadMusic(list[musicIndex])

})
$('.musicbox .play').onclick = function(){
    var icon =$('.play .iconfont')
    if(icon.classList.contains('icon-play')){
        music.play()
    }else{
        music.pause()
    }
    icon.classList.toggle('icon-play')
    icon.classList.toggle('icon-pause')
}
    $('.musicbox .icon-next').onclick = loadNextMusic
    $('.musicbox .icon-last').onclick = loadLastMusic
    music.onended = loadNextMusic
    music.shouldUpdate = true
music.onplaying = function(){
    timer = setInterval(function(){
        updateProgress()
    },1000)
    console.log('play')
}
music.onpause = function(){
    console.log('pause')
    clearInterval(timer)
}
music.ontimeupdate = updateProgress

$('.musicbox .progress .bar').onclick = function(e){
    var percent = e.offsetX / parseInt(getComputedStyle(this).width)
    music.currentTime = percent * music.duration
    $('.musicbox .progress-now').style.width = percent * 100 + '%'
}

$('.musicbox .list').onclick = function(e){
    if(e.target.tagName.toLowerCase() === 'li')
        for(var i = 0;  i < this.children.length; i++){
            if(this.children[i] === e.target){
                musicIndex  = i
            }
        }
        console.log(musicIndex)
        loadMusic(musicList[musicIndex])
}


