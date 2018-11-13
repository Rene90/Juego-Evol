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
    malo:"./img/malo.png"
}
var enemigos = []
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
    

}
function Mono(){
    this.frameIndex = 0
    this.tickCount = 0
    this.ticksPerFrame = 0
    this.numberOfFrames = 3
    this.x = 50
    this.y = canvas.height-60
    this.speedx = 0
    this.speedy = 0
    this.height = 60
    this.width = 180
    this.image = new Image()
    this.image.src = images.mono
    
    this.draw = function(){
       
        if(frames%10===0) {
            this.frameIndex++
            
        }
        if(this.y+this.height> canvas.height-10){
            this.y = canvas.height-this.height}
        if(this.x+this.width> canvas.width-10){
                this.x = canvas.width-this.width}
        if(this.y<= 350){
                this.y = 350}
        if(this.x<= 0){
        this.x = 0}
        

        
        if(this.frameIndex > this.numberOfFrames-1) this.frameIndex =0
        ctx.drawImage(this.image,this.frameIndex * this.width / this.numberOfFrames,0,this.width / this.numberOfFrames,this.height,this.x,this.y,this.width / this.numberOfFrames,
            this.height)
    }
    this.newPos = function(){
        this.x += this.speedx
        this.y += this.speedy 
    }
    this.isTouching = function(item){
        return (this.x < item.x+(item.width/5)) && 
        (this.x+(this.width/3)>item.x)&&
        (this.y<item.y+item.height)&& 
        (this.y+this.height>item.y)
    }
}
function Dragon(){
    this.frameIndex = 0
    this.tickCount = 0
    this.ticksPerFrame = 0
    this.numberOfFrames = 6
    this.x = 0
    this.y = 0
    this.height = 66
    this.width = 308
    this.image = new Image()
    this.image.src = images.dragon
    
    this.draw = function(){
       
        if(frames%10===0) {
            this.frameIndex++
            
        }

        
        if(this.frameIndex > this.numberOfFrames-1) this.frameIndex =0
        ctx.drawImage(this.image,this.frameIndex * this.width / this.numberOfFrames,0,this.width / this.numberOfFrames,this.height,this.x,this.y,this.width / this.numberOfFrames,
            this.height)
        
    }
}
function Tanque(){
    this.frameIndex = 0
    this.tickCount = 0
    this.ticksPerFrame = 0
    this.numberOfFrames = 5
    this.x = 0
    this.y = 0
    this.height = 63
    this.width = 338
    this.image = new Image()
    this.image.src = images.tanque
    
    this.draw = function(){
       
        if(frames%10===0) {
            this.frameIndex++
            
        }

        
        if(this.frameIndex > this.numberOfFrames-1) this.frameIndex =0
        ctx.drawImage(this.image,this.frameIndex * this.width / this.numberOfFrames,0,this.width / this.numberOfFrames,this.height,0,0,this.width / this.numberOfFrames,
            this.height)
        
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
//isntancias 
var personaje = new Mono()
var dragon = new Dragon()
var fondo = new Bg()

//funciones princiaples
function start(){
    if(!interval){
        interval = setInterval(update,1000/60)}
}
function update(){
    frames++
    ctx.clearRect(0,0,canvas.width, canvas.height)
    
    fondo.draw()
    //dragon.draw()
    personaje.newPos()
    personaje.draw()
    drawEnemigos()
    checkCollition()
    
}
function gameOver(){
    clearInterval(interval)
    interval = null
    ctx.font ="bold 80px Helvetica"
    ctx.fillStyle = "white"
    ctx.fillText("Game Over",200,200)
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
function generador(){
    if(frames%180 ===0){
      
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
    enemigos.forEach(function(obs){
      if(personaje.isTouching(obs)){
        gameOver()
      }
    })
  }



//funciones de movilidad del personaje
function moveLeft(){
    console.log("iz")
    personaje.speedx -=1;
  }
  function moveRight(){
    console.log("der")
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
    }
}
document.onkeyup = function(e){
    stopMove();
  }

drawCover();
