var canvas =document.getElementById("c")
var ctx = canvas.getContext("2d")
//variables
var frames=0
var interval
var images = {
    mono:"./img/mono.png",
    bg:"./img/pixil-frame-0.png",
    dragon:"./img/rene.png",
    titulo:"./img/samus.jpg",
    tanque:"./img/tanque.png",
    malo:"./img/malo.png",
    gameover:"./img/gameover.jpg"
}
var enemigos = []
var disparos = []
var transformacion = "dragon"
var guessedLetter = ''
var imageGameOver = new Image()
imageGameOver.srcset=images.gameover
var scores = []
//clases
function Bg(){
    this.x =0
    this.y =0
    this.width= canvas.width
    this.height=canvas.height
    this.image = new Image()
    this.image.src = images.bg
    this.draw = function(){
        this.x--
        if(this.x < -this.width)this.x=0

        ctx.drawImage(this.image,this.x,this.y, this.width, this.height)
        ctx.drawImage(this.image,this.x+this.width,this.y, this.width, this.height)
        
    }
    this.drawScore = function(){
        ctx.font ="bold 40px Helvetica"
        ctx.fillStyle = "white"
        ctx.fillText(Math.floor(frames/60),50,50)

    }
    

}
function Mono(ente){
    this.ente = "mono"
    this.frameIndex = 0
    this.tickCount = 0
    this.ticksPerFrame = 0
    this.numberOfFrames = this.ente ==="dragon"?6:3
    this.x = this.ente ==="dragon"? 50:50
    this.y = this.ente ==="dragon"?100:canvas.height-60
    this.speedx = 0
    this.speedy = 0
    this.height = this.ente ==="dragon"?66:60
    this.width = this.ente ==="dragon"?308:180
    this.image = new Image()
    //this.image.src = this.ente ==="dragon"?images.dragon:images.mono
    this.ancho =80
    this.altura =80
    this.frames1 = 0
    this.vida = 100
    this.draw = function(){
        this.image.src = this.ente ==="dragon"?images.dragon:images.mono
        
        if(this.ente === "dragon" ) {
            this.frames1++
            this.y= this.y*1.02+.2
        }

        if(this.ente ==="dragon" && this.frames1%1000===0 ){
            
            this.frames1 = 0
            this.image.src  =images.mono
            this.ente ="mono"
            this.vida = this.vida -10
        }
       
        if(frames%10===0) {
            this.frameIndex++
            
        }
        if (this.ente ==="dragon"){
            if(this.y+this.altura> 350-10){
                this.y = 350-this.altura}
            if(this.x+this.ancho> canvas.width-10){
                    this.x = canvas.width-this.ancho}
            if(this.y<= 0){
                    this.y = 0}
            if(this.x<= 0){
            this.x = 0}
        }else{
        if(this.y+this.altura> canvas.height-10){
            this.y = canvas.height-this.altura}
        if(this.x+this.ancho> canvas.width-10){
                this.x = canvas.width-this.ancho}
        if(this.y<= 350){
                this.y = 350}
        if(this.x<= 0){
        this.x = 0}
        }
        

        
        if(this.frameIndex > this.numberOfFrames-1) this.frameIndex =0
        if(this.ente ==="dragon"){
            ctx.drawImage(this.image,this.frameIndex * this.width / this.numberOfFrames,0,this.width / this.numberOfFrames,this.height,this.x,this.y,this.ancho+20,this.altura+20)
        }else{
        ctx.drawImage(this.image,this.frameIndex * this.width / this.numberOfFrames,0,this.width / this.numberOfFrames,this.height,this.x,this.y,this.ancho,this.altura)
        }
    }
    this.newPos = function(){
        if(this.ente ==="dragon"){
        this.x += this.speedx+(this.speedx*1.2)
        this.y += this.speedy+(this.speedy*1.2)
        }else{
        this.x += this.speedx
        this.y += this.speedy 
        }
    }
    this.isTouching = function(item){

        return (this.x < item.x+(item.width/5)) && 
        (this.x+(80)>item.x)&&
        (this.y<item.y+item.height)&& 
        (this.y+80>item.y)
    }
    this.drawLife= function(){
        ctx.fillStyle = "red"
        ctx.fillRect(canvas.width-150,30,100,30)
        ctx.fillStyle = "white"
        ctx.fillRect(canvas.width-150,30,this.vida,30)
        ctx.filStyle = "orange"
        ctx.strokeText("Vida",canvas.width-150,60)
    }
}

function Enemigo(position){
    this.frameIndex =0
    this.numberOfFrames=5
    this.x=canvas.width+30
    this.y=position
    this.width=338
    this.height=60
    this.image = new Image()
    this.image.src= images.malo
    this.draw = function(){
       
        if(frames%10===0) {
            this.frameIndex++
                       
        }
        if(frames%1===0){
            this.x--
        }       
        if(this.frameIndex > this.numberOfFrames-1) this.frameIndex =0
        ctx.drawImage(this.image,this.frameIndex * this.width / this.numberOfFrames,0,this.width / this.numberOfFrames,this.height,this.x,this.y,this.width / this.numberOfFrames,
            this.height)
    }

}
function Disparo(x,y){
    this.x =x
    this.y =y
    this.radius= 10
    this.draw = function(){
        this.x = this.x +5
        this.y = this.y +5
        ctx.beginPath()
        ctx.fillStyle="red"
        ctx.arc(this.x,this.y,this.radius,0,(Math.PI*2),true)
        ctx.fill()
        ctx.closePath()

    }
    this.isTouching = function(item){

        return (this.x < item.x+(item.width/5)) && 
        (this.x+this.radius>item.x)&&
        (this.y<item.y+item.height)&& 
        (this.y+this.radius>item.y)
    }
}
//isntancias 
var personaje = new Mono()

var fondo = new Bg()
var cancion = new Musica()

//funciones princiaples
function start(){
    if(!interval){
    cancion.reload()
    cancion.play()
    frames = 0
    enemigos = []
    personaje = new Mono()
    
        interval = setInterval(update,1000/60)}
}
function update(){
    frames++
    ctx.clearRect(0,0,canvas.width, canvas.height)
    
    fondo.draw()
    //dragon.draw()
    personaje.newPos()
    personaje.draw()
    writeCorrectWord()
    drawEnemigos()
    checkCollition()
    fondo.drawScore()
    personaje.drawLife()
    drawDisparos()
    limpiar()

    
}


function gameOver(){
    cancion.pause()
    clearInterval(interval)
    interval = null
    scores.push(Math.floor(frames/60))
    ctx.clearRect(0,0,canvas.width,canvas.height)
   
    ctx.drawImage(imageGameOver,0,0,canvas.width,canvas.height)
    
    ctx.font ="bold 100px Helvetica"
    ctx.fillStyle = "black"
    ctx.fillText("Game Over",300,300)
    ctx.font ="bold 30px Helvetica"
    ctx.fillStyle = "black"
    ctx.fillText("Presiona barra espaciadora para partida nueva",300,450)
    for(let i =0;i<scores.length;i++){
    ctx.font ="bold 60px Helvetica"
    ctx.fillStyle = "orange"
    ctx.fillText(i+1+" Player Score: "+ scores[i],300,600+(i*70))
    }
    
    if(scores.length === 2) scores=[]
    
  }
function drawCover(){
    var img = new Image()
    img.src = images.titulo
    img.onload = function(){
        fondo.draw()
        ctx.drawImage(img,0,0,canvas.width,canvas.height)
        ctx.font = "bold 48px Helvetica"
        ctx.fillStyle = "white"
        ctx.fillText("Presiona la barra espaciadora para comenzar",50,300)
        ctx.fillStyle = "black"
        ctx.fillRect(canvas.width-120,canvas.height-120,80,90)

    }
}
//funciones auxiliares
function Musica(){
    this.music = new Audio()
    this.music.src="http://66.90.93.122/ost/zelda-reorchestrated-09-twilight-princess/fondpuoc/03%20-%20OrdonVillage.mp3"
    this.play = function(){
        this.music.play()
      }
    this.pause = function(){
        this.music.pause()
    }
    this.reload = function(){
        this.music.load()
    }

}
function generador(){
    if(Math.random()<1-Math.pow(.993,frames/1000)){
      
      var posicion =Math.floor(Math.random()*((canvas.height-63)-350)+350)
      enemigos.push(new Enemigo(posicion))
    }
  }
  function drawEnemigos(){
    generador()
    enemigos.forEach(function(ene){
        ene.draw()
    })
  }
  function checkCollition(){
    enemigos.forEach(function(obs,index){
      if(personaje.isTouching(obs)){
        enemigos.splice(index,1)
        personaje.vida -=20
        if(personaje.vida <=0)gameOver()
      }
      disparos.forEach(function(dis,ind){
          if(dis.isTouching(obs)){
              enemigos.splice(index,1)
              disparos.splice(ind,1)
          }
      })
    })
  }
  function limpiar(){
      enemigos.forEach(function(obs,index){
          if(obs.x+(obs.width/8)<0)  enemigos.splice(index,1)
      })
  }



//funciones de movilidad del personaje
function moveLeft(){
    
    personaje.speedx -=1;
  }
  function moveRight(){
    
    personaje.speedx +=1;
  }
  function moveUp(){
      personaje.speedy -=1;
  }
  function moveDown(){
      personaje.speedy +=1;
  }
  function stopMove(){
    personaje.speedx = 0;
    personaje.speedy = 0;
  }
  function fire(){
      var dis = new Disparo(personaje.x+40,personaje.y+40)
      disparos.push(dis)
  }
  function drawDisparos(){
      disparos.forEach(function(el){
          el.draw()
      })
      
  }

document.onkeydown=function(e){
    switch(e.keyCode){
        case 32:
        start()
        break;
        case 37:
      moveLeft()
      break;
      case 39:
      moveRight()
      break;
      case 38:
      moveUp()
      break;
      case 40:
      moveDown()
      break;
      case 70:
      if(personaje.ente==="dragon"){
          fire()}
        
      break;
    }
}
/*function writeCorrectLetter(pos){
    var letra = transformacion[pos]
    ctx.font="30px Avenir"
    ctx.fillStyle="white"
    ctx.strokeText(letra,520+index*50,100)

}*/
function writeCorrectWord(pos){
    ctx.font="90px Helvetica"
    ctx.fillStyle="white"
    ctx.fillText(guessedLetter,520,100)

}
function addCorrectLetter(i){
    guessedLetter+= transformacion[i]
}
function checkDragon(){
    if(guessedLetter===transformacion){
        guessedLetter = ''
        return true
    }
}
document.onkeypress=function(e){
    var keyCode = e.keyCode
    var key = e.key
    if(transformacion.indexOf(key) !== -1){
        var posicion = transformacion.indexOf(key);
        var pos = [posicion]
        addCorrectLetter(posicion)
        //writeCorrectLetter(posicion)
        while (posicion != -1) {
          
          posicion = transformacion.indexOf(key, posicion + 1);
          if(posicion!=-1){
          pos.push(posicion)
          addCorrectLetter(posicion)
          //writeCorrectLetter(posicion)
          }

        }
        if(checkDragon()){
          personaje.ente = "dragon"
        }
        
        
        
        
      }else{
        guessedLetter=""
        ctx.clearRect(0,0,canvas.width,canvas.height)
      }
}

document.onkeyup = function(e){
    stopMove();
  }

drawCover();
