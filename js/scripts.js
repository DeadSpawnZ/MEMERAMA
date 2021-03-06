var contenedor = document.getElementById("contenedor");
var titulo = document.getElementById("titulo");
var matrix;

window.onload = function(){

	//BASE DE DATOS
	db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    db.transaction(function(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS USUARIO(nombre TEXT, mins INTEGER, segs INTEGER, movimientos INTEGER, abandonos INTEGER)');
    });
}

var nombre;
function aceptar(){
	nombre = document.getElementById("nombre").value;
	if(nombre != ""){
		titulo.innerHTML = document.getElementById("nombre").value;
		contenedor.innerHTML = "<p>Selecciona el tema</p>"+
		"<select id='tema'>"+
		  	"<option value='Pokemon'>Pokemon</option>"+
		  	"<option value='Redes'>Redes</option>"+
		  	"<option value='League'>LOL</option>"+
		"</select>"+
		"<p>Selecciona el tamaño</p>"+
		"<select id='tam'>"+
		  "<option value='4x4'>4x4</option>"+
		  "<option value='4x5'>4x5</option>"+
		"</select>"+
		"<button onclick='GO()'>GO</button>";
	}
}

var tema;
var size;
function GO(){
	document.getElementById("li_terminar").style.display="block";
	document.getElementById("li_solucion").style.display="block";
	document.getElementById("li_ver").style.display="none";
	document.getElementById("li_inicio").style.display="none";
	
	tema = document.getElementById("tema").value;
	var tam = document.getElementById("tam").value;
	if(tam == "4x4"){
		initMemerama(4);
		size = 4;
	}
	if(tam == "4x5"){
		initMemerama(5);
		size = 5;
	}
}

function gira(card){
	var fil = parseInt(card.id/4);
	var col = card.id-(fil*4);  
	if(card.className == "carta44"){
		card.className = "carta44 carta444";
		card.style.backgroundImage = "url(Imagenes/"+tema+"/"+matrix[col][fil]+".png)";
	}else{
		card.className = "carta44";
		card.style.backgroundImage = "url(Imagenes/"+tema+"/reves.png)";
	}
}

var movimientos = 0;
var par = 0;
var carta1, id1, carta2;
function parea(carta){
	document.getElementById("movimientos").innerHTML = "Movimientos: "+ ++movimientos;
	var fil = parseInt(carta.id/4);
	var col = carta.id-(fil*4);
	par++;
	if(par < 2){
		gira(carta);
		carta1 = matrix[col][fil];
		id1 = carta.id;
	}else{
		if(par == 2){
			gira(carta);
			carta2 = matrix[col][fil];
			if(carta1 == carta2){
				document.getElementById(id1).disabled = true;
				carta.disabled = true;
			}else{
				carta1 = null;
				carta2 = null;
				var v1 = carta;
				var v2 = document.getElementById(id1);
				setTimeout(function(){
					gira(v1);
					gira(v2);
				}, 3500);
			}
			par = 0;
		}
	}
	ha_ganado();
}

function moves(){
	var movi = document.createElement("div");
	movi.setAttribute("id", "movimientos");
	movi.innerHTML = "Movimientos: 0";
	contenedor.appendChild(movi);
}

var iniciado = false;
function initMemerama(tam){
	iniciado = true;
	contenedor.innerHTML = " ";
	start_cronometro();
	moves();
	show_cards(tam);
	matrix_random(tam);
	
	//alert con distribucion
	var lol = "";
	for(i = 0; i < tam; i++){
		for(j = 0; j < 4; j++){
			lol += matrix[j][i]+"|"; 
		}
		lol += "\n";
	}
	alert(lol);
}

function matrix_random(tam){
	//LLENA LA MATRIZ CON UNA DISTRIBUCION RANDOM
	var posiciones = new Array(tam*4);
	var i, j, k, l = 0, x;
	for(x = 0; x < tam*4; x++){
		posiciones[x] = "x";
	}
	matrix = new Array(tam);
	for(i = 0; i < 4; i++){
		matrix[i] = new Array(4);
	}
	for(i = 0; i < tam*2; i++){
		for(j = 0; j < 2; j++){
			do{
				var pos = Math.floor(Math.random() * tam*4);
				var banderilla = false;
				for(k = 0; k < tam*4; k++){
					if(pos == posiciones[k]){
						banderilla = true;
					}
				}
				if(banderilla == false){
					var fil = parseInt(pos/4);
					var col = pos-(fil*4);
					matrix[col][fil] = i;
					posiciones[l++] = pos;
				}
			}while(banderilla == true);
		}
	}
}

function show_cards(tam){
	//CREA LAS CARTAS DINAMICAMENTE
	var cont = 0;
	var i, j;
	for(i = 0; i < tam; i++){
		var fila = document.createElement("div");
		fila.setAttribute("class", "fila");
		for(j = 0; j < 4; j++){
			var carta = document.createElement("button");
			carta.setAttribute("id", cont++);
			carta.setAttribute("class", "carta44");
			carta.style.backgroundImage = "url(Imagenes/"+tema+"/reves.png)";
			carta.setAttribute("onclick", "parea(this);");
			fila.appendChild(carta);
		}
		contenedor.appendChild(fila);
	}
}

var contador_s=0;
var contador_m=0;
function start_cronometro(){
	//ELEMENTOS CREADOS PARA EL CRONOMETRO
	var time = document.createElement("div");
	time.setAttribute("id", "time");
	var m = document.createElement("span");
 	var s = document.createElement("span");
	m.innerHTML = "00:";
	s.innerHTML = "00";
	time.appendChild(m)
	time.appendChild(s);
	contenedor.appendChild(time);

	//CRONOMETRO
	contador_s = 0;
	contador_m = 0;
	var cronometro = setInterval(
		function(){
			if(contador_s == 60){
				contador_s = 0;
				contador_m++;
				m.innerHTML = contador_m + ":";

				if(contador_m == 60){
					contador_m = 0;
				}
			}
			s.innerHTML = contador_s;
			contador_s++;
		}
	,1000);
}

var menu_out = false;
function show_menu(){
	var temp = document.getElementById("menu_chido");
	if(!menu_out){
		temp.style.left= "0";
		menu_out = true;
	}else{
		temp.style.left= "-47.5%";
		menu_out = false;
	}
}

function inicio(){
	show_menu();
	titulo.innerHTML ="MEMERAMA";
	contenedor.innerHTML = "<div class='inst'><p>Ingresa tu nombre</p>"+
		"<input id='nombre' type='text' placeholder='Tu nombre aquí' required/>"+
		"<button onclick='aceptar()'>Aceptar</button></div>";
		
	iniciado = false;
}

function terminar(){
	document.getElementById("li_terminar").style.display="none";
	document.getElementById("li_solucion").style.display="none";
	document.getElementById("li_ver").style.display="block";
	document.getElementById("li_inicio").style.display="block";
	db.transaction(function(tx){
        tx.executeSql("INSERT INTO USUARIO(nombre,mins,segs,movimientos,abandonos) VALUES (?,?,?,?,?)", [nombre, contador_m,contador_s, movimientos, "1"]);
    });
	inicio();
}

function solucion(){
	if(iniciado){
		var i, carta_aux;
		show_menu();
		for(i = 0; i < size*4; i++){
			carta_aux = document.getElementById(i);
			if(carta_aux.className == "carta44"){
				gira(carta_aux);
			}
			carta_aux.disabled = true;
		}
	}
}

function ha_ganado(){
	var cont = 0;
	for(i = 0; i < size*4; i++){
		carta_aux = document.getElementById(i);
		if(carta_aux.disabled){
			cont++;
		}
	}
	if(cont == size*4){
		document.getElementById("li_terminar").style.display="none";
		document.getElementById("li_solucion").style.display="none";
		document.getElementById("li_ver").style.display="block";
		document.getElementById("li_inicio").style.display="block";
		contenedor.innerHTML += "<div id='ganador'>¡FELICIDADES "+nombre+" TERMINASTE EL JUEGO EN UN TIEMPO DE "+
		contador_m+":"+contador_s+"  y "+movimientos+" movimientos!</div>";

		db.transaction(function(tx){
	        tx.executeSql("INSERT INTO USUARIO(nombre,mins,segs,movimientos,abandonos) VALUES (?,?,?,?,?)", [nombre, contador_m,contador_s, movimientos, "0"]);
	    });
	    iniciado = false;
	}
}

function puntuaciones(){
	show_menu();
	var maxid=0,i;
	db.transaction(function(tx){
		tx.executeSql(("SELECT DISTINCT nombre FROM USUARIO"),[],
					function(tx, results){
							maxid=results.rows.length;
							var nams=new Array(maxid);
							for(i=0;i<maxid;i++){
								nams[i]=results.rows.item(i).nombre;
							}
							if(maxid>0){
								var code;
								contenedor.innerHTML="";
								for(i=1;i<=maxid;i++){
									tx.executeSql(("SELECT nombre, SUM(abandonos) AS s1, SUM(mins) AS min, SUM(segs) AS seg, SUM(movimientos) AS s2 FROM USUARIO where nombre=?"),[nams[i-1]],
												function(tx, results){
													code="<div class='user'>";
													code+="<h3>"+results.rows.item(0).nombre+"</h3>"+
															"<p>Juegos abandonados: "+results.rows.item(0).s1+"</p>"+
															"<p>Tiempo total jugado: "+getTtime(results.rows.item(0).min,results.rows.item(0).seg)+"</p>"+
															"<p>Movimientos hechos: "+results.rows.item(0).s2+"</p>"+
															"</div>";
													contenedor.innerHTML+=code;
												});
								}
							}else{
								contenedor.innerHTML="<div class='inst'><p>No hay nada que mostrar</p></div>";
							}
					});
	});
}

function getTtime(min, seg){
	var div=Math.floor(seg/60);
	return (min+div)+":"+(seg-60*div);
}