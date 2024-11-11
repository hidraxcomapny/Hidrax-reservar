var imagen_animada = document.getElementById("imagen_animada")
var change = true
setInterval(()=>{
    if(change){
        imagen_animada.src = "./assets/mono_aguacate_2.png"
        change = false
    }else{
        imagen_animada.src = "./assets/mono_aguacate.png"
        change = true
    }
},1000)


var tablet = document.getElementById("tablet")
var tablet_text = document.getElementById("tablet_text")

var date = document.getElementById("date")
var hour = document.getElementById("hour")
var nam = document.getElementById("name")
var tel = document.getElementById("tel")

var button_submit = document.querySelector("#button_submit")
var button_x = document.querySelector("#boton_x")
var button_y = document.querySelector("#boton_y")

var button_x_2 = document.getElementById("boton_x")
var button_y_2 = document.getElementById("boton_y")
var mega_box = document.getElementById("mega_box")

var a
var checking = 0

var database = firebase.database()
var dias_especiales = []

database.ref("/Dias_especiales").on("value", (s)=>{
    for(data in s.val()){
        dias_especiales.push(s.val()[data])
    }

})

var opacity = 0

var fechas = []

var alerta_activate = true

actionActivate = true

var val_to_send = {
    "cantidad": 0,
    "nombre": "",
    "hora": 0,
    "dia": 0,
    "mes": 0,
    "año": 0,
    "tipo": "",
    "tel": 0
}

setInterval(()=>{
    tablet_text.textContent = parseInt(tablet.value)

    val_to_send.cantidad = tablet_text.textContent
    val_to_send.nombre = nam.value
    val_to_send.hora = hour.value

    fechas = date.value.split("-")

    val_to_send.año = fechas[0]
    val_to_send.mes = fechas[1] 
    val_to_send.dia = fechas[2]

    val_to_send.tel = tel.value

    buttonActions()
    actionActivate = true

    if(opacity <= 1){
        opacity +=0.005
        mega_box.style.opacity = opacity
    }

},10) 


button_submit.addEventListener("click", ()=>{
    checkValues(val_to_send)
    alerta_activate = true
})

function resetAll(val){
    button_x_2.style.backgroundColor =  "rgb(0, 0, 0)"
    button_y_2.style.backgroundColor =  "rgb(0, 0, 0)"
    val.cantidad = 0
    val.nombre = ""
    val.hora = 0
    val.dia = 0
    val.mes = 0
    val.año = 0
    val.tipo = ""
    val.tel = 0
    tablet.value = 1
    tel.value = ""
    nam.value = ""
    hour.value = null
    date.value = null
}


function alertas(text1){
    if(alerta_activate){
        Swal.fire({
            title: "Error",
            text: text1,
            color: "#fff",
            icon: "error",
            padding: "2em",
            background: "rgb(24,24,24)",
            backdrop: "rgba(4,40,4,0.8)",
            timer: 4000,
            showConfirmButton: false
        })
        alerta_activate = false
    }
}

function buttonActions(){
    button_x.addEventListener("click", ()=>{
        if(actionActivate){
            if(val_to_send.tipo !== "aguacate"){
                button_x_2.style.backgroundColor = "rgb(58, 169, 33)"
                button_y_2.style.backgroundColor = "rgb(0, 0, 0)"
                val_to_send.tipo = "aguacate"
                console.log(val_to_send.tipo)
            }else{
                button_x_2.style.backgroundColor = "rgb(0, 0, 0)"
                val_to_send.tipo = ""
                console.log(val_to_send.tipo)
            }
            actionActivate = false
        }   
    })
    

    button_y.addEventListener("click", ()=>{
        if(actionActivate){
            if(val_to_send.tipo !== "Naranja con platano"){
                button_y_2.style.backgroundColor = "rgb(58, 169, 33)"
                button_x_2.style.backgroundColor = "rgb(0, 0, 0)"
                val_to_send.tipo = "Naranja con platano"
                console.log(val_to_send.tipo)
            }else{
                button_y_2.style.backgroundColor = "rgb(0, 0, 0)"
                val_to_send.tipo = ""
                console.log(val_to_send.tipo)
            }
            actionActivate = false
        }
    })
}


function checkValues(val){
    checking = 0
    for(data in val){
        console.log(val[data])
        if(val[data] === 0 || val[data] === "" || val[data] === undefined){
            alertas("Faltan huecos por rellenar")
        }else{
            checking+=(1/8)
        }
    }
    var info_year = new Date().getFullYear()
    var info_day = new Date(date.value).getDay()
    var info_month = new Date().getMonth()
    var info_date = new Date().getDate()

    if(parseInt(val.año) === parseInt(info_year)){
        checking+=1
    }else{
        alertas("Ha habido un error en el año, revisa las instrucciones de abajo")
    }
    if(parseInt(info_day) <= 5 && parseInt(info_day) > 0){
        checking+=1
    }else{
        alertas("Ha habido un error en el día, revisa las instrucciones de abajo")
    }
    if(parseInt(val.hora.split(":")[0]) >= 8 && parseInt(val.hora.split(":")[0]) < 15){
        checking+=1
    }else{
        alertas("Ha habido un error en la hora, revisa las instrucciones de abajo")
    }
    for(var i = 0; i < dias_especiales.length; i++){
        if(fechas.value === dias_especiales[i]){
            alertas("Ese día no habra estaremos repartiendo, una disculpa")
        }else{
            checking += (1/dias_especiales.length)
        }
    }
    if(parseInt(val.mes) > parseInt(info_month)+1){
        checking+=1
    }else if(parseInt(val.dia) - 2 > parseInt(info_date)){
        checking+=1
    }else{
        alertas("El día que escogiste ya ha pasado o esta muy cercas del actual")
    }

    if(parseInt(tel.value) !== undefined && tel.value.length === 10){
        checking+=1
    }else{
        alertas("El número de telefono no es valido")
    }
    console.log(checking)
    
    if(Math.round(checking) === 7){
        submit(val)
    } 


}

function submit(val){
    console.log("asderd")
    var ran = Math.round(Math.random()*9999999999)
    database.ref(`/pedido/${ran}+${val.nombre}/`).set({
        Cliente: `${ran}+${val.nombre}`,
        Cantidad: val.cantidad,
        Sabor: val.tipo,
        Mes: val.mes,
        Dia: val.dia,
        Hora: val.hora
    })
    resetAll(val)
    Swal.fire({
        title: "¡Reserva exitosa!",
        text: "Espera tu llamada de confirmación",
        color: "#fff",
        imageUrl: "./assets/mono.gif",
        padding: "2em",
        background: "rgb(24,24,24)",
        backdrop: "rgba(4,40,4,0.8)",
        timer: 4000,
        showConfirmButton: false
      });

    var sound = new Audio("./assets/congratulations-deep-voice-172193.mp3")
    sound.load()
    sound.play() 
}

document.addEventListener("touchend", ()=>{
    var sound = new Audio("./assets/water-droplet-2-165634.mp3")
    sound.load()
    sound.play() 
})
document.addEventListener("click", ()=>{
    var sound = new Audio("./assets/water-droplet-2-165634.mp3")
    sound.load()
    sound.play() 
})
