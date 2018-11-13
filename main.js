var boton = document.getElementById("boton")
var portada = document.getElementById("portada")
var juego = document.getElementById("juego")
boton.addEventListener("click",function(){
    portada.classList.add("ocultar")
    juego.classList.remove("ocultar")


})