function insert (num) {
   var numero = document.getElementById('resultado' ).innerHTML;
    document.getElementById( 'resultado' ). innerHTML = numero  + num ;
}

function clean(){
    document.getElementById('resultado').innerHTML =  ""  ;
}


function back (){

    var resultado = document.getElementById( 'resultado' ).innerHTML ;
    document.getElementById( 'resultado').innerHTML = resultado.substring(0, resultado.length -1);
 }


 function calcular() {
    var numero = document.getElementById('resultado').innerHTML;
    if (numero) { // Verifica se há algum valor em 'numero'
        document.getElementById('resultado').innerHTML = eval(numero);
    }

    else{
        document.getElementById('resultado').innerHTML =  "Nada....";


}}
