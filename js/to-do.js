	var todo_json = [];
	var cantidad_de_selecciones = 0;
	var inicial;
	if(localStorage["to_do"]){
		var json_local_storage = JSON.parse(localStorage["to_do"]);
		inicial = false;
	}else{
		inicial = true;
		var json_local_storage = JSON.parse('[{"id":"id1367733341454","valor":"To-dos de prueba","tildado":false,"fecha":"2013-05-05T06:05:48.908Z","fecha_iso":"2013-05-05T06:05:48.908Z"},{"id":"id1367733346323","valor":"Puedes borrarlos seleccionándolos","tildado":false,"fecha":"2013-05-05T06:05:48.908Z","fecha_iso":"2013-05-05T06:05:48.908Z"},{"id":"id1367733350884","valor":"Y agregar nuevos también.","tildado":false,"fecha":"2013-05-05T06:05:48.908Z","fecha_iso":"2013-05-05T06:05:48.908Z"}]');
	}
	function cambiar_estado (info){
		var id_unica = info.target.id;
		var posicion_en_array;
		$.each(todo_json, function(i, val) {
			if(val){
				if(val.id == id_unica){
					posicion_en_array = i;
				}
			}
		});
		var todo_a_editar = todo_json[posicion_en_array];
		console.log("Ahora el Todo: "+todo_a_editar.valor+" está: "+ todo_a_editar.tildado);
		if(todo_a_editar.tildado){
			todo_a_editar.tildado = false;
			$(".row .span6 input#"+id_unica).attr("checked", "");
			$(".row .span6 input#"+id_unica).parent().removeClass("tildado");
			cantidad_de_selecciones--;
		}else{
			todo_a_editar.tildado = true;
			$(".row .span6 input#"+id_unica).attr("checked", "checked");
			$(".row .span6 input#"+id_unica).parent().addClass("tildado");
			cantidad_de_selecciones++;
		}	
		actualizar_contador();
		localStorage.setItem("to_do", JSON.stringify(todo_json));
			
	}
	function actualizar_contador (info) {
		var ahora_hay = cantidad_de_selecciones;
		var antes_habia = $("span.numero-de-selecciones").text();
		console.log("Antes habia: "+antes_habia);
		console.log("Ahora hay: "+ahora_hay);
		if(antes_habia == 0){
			if(ahora_hay >0){
				$("div#info-selecciones").slideDown();
			}
		}
		if(ahora_hay <=0){
			cantidad_de_selecciones = 0;
			$("div#info-selecciones").slideUp();

		}
		$("span.numero-de-selecciones").html(cantidad_de_selecciones);
	}

	function eliminar_todo(info){
		  var a_borrar = 0;		
		  $( ".row .span6#lista-todos input[checked='checked']" ).each(function( index ) {
		  console.log( index + ": " + $(this).parent().attr("for") );
		  var id_unica = $(this).parent().attr("for");
		  var posicion_en_array;

		    $.each(todo_json, function(i, val) {
		    	if(val){
					if(val.id == id_unica){
						posicion_en_array = i;
						a_borrar++;
					}
				}
			});
			delete todo_json[posicion_en_array];
			$(".row .span6#lista-todos label[for='"+id_unica+"']").remove();
			localStorage.setItem("to_do", JSON.stringify(todo_json));

		});
		if(a_borrar>0){
			console.log("Se van a borrar: "+a_borrar)
			console.log("Hay actualmente: "+cantidad_de_selecciones+" selecciones");
			for(i=0; i<a_borrar; i++) {
				cantidad_de_selecciones--;
				console.log("Borro 1 selccion");
			}
			cantidad_de_selecciones - a_borrar;
			actualizar_contador();
			console.log("Hay actualmente: "+cantidad_de_selecciones+" selecciones");
		}
		
	}
	function enviar_todo (info) {
		if($("form input:first").val()){
		if(json_local_storage == ""){
			$(".row .span6#lista-todos label").remove();
		}
		var nuevo_todo = new Object;
		nuevo_todo.id = 'id' + (new Date()).getTime();
		nuevo_todo.valor = $("form input:first").val();
		nuevo_todo.tildado = false;
		var fecha=new Date();
		var fecha_iso=fecha.toISOString();
		nuevo_todo.fecha = fecha;
		nuevo_todo.fecha_iso = fecha_iso;
		todo_json.push(nuevo_todo);
		localStorage.setItem("to_do", JSON.stringify(todo_json));
		$("form input:first").val("");
		console.log(todo_json);
		$(".row .span6#lista-todos").append('<label for='+ nuevo_todo.id +' class="checkbox"><input id='+ nuevo_todo.id +' name="todo" type="checkbox">'+ nuevo_todo.valor +'<time class="timeago" datetime="'+nuevo_todo.fecha_iso+'">'+nuevo_todo.fecha+'</time></label>')
		// body...
		}else{
			alert("Tienes que ingresar un texto a tu tarea!");
		}
		$("time.timeago").timeago();

	}	
	function cargar_todos (info) {

		$.each(json_local_storage, function(i, val) {
			console.log(val);
		if(val){
			todo_json.push(val);
			$(".row .span6#lista-todos").append('<label for='+ val.id +' class="checkbox"><input id='+ val.id +' name="todo" type="checkbox">'+ val.valor +'<time class="timeago" datetime="'+val.fecha_iso+'">'+val.fecha+'</time></label></label>')
		    if(val.tildado){
		    	cantidad_de_selecciones++;
				$(".row .span6 input#"+val.id).attr("checked", "checked");	
				$(".row .span6 input#"+val.id).parent().addClass("tildado");

		    }
		}
	    });	
	    actualizar_contador();

	}

	function verificar_tildados () {
		
	}

	function inicio () {
		cargar_todos();
		verificar_tildados();
		$(".row .span6 form").submit(enviar_todo);
		$(".row .span6#lista-todos").delegate("label", "click", cambiar_estado);
		$(".row .span6 input#eliminar").on("click", eliminar_todo);
		$("form input.btn").on("click", enviar_todo);
  		$("time.timeago").timeago();

	}
	$(document).on("ready", inicio);
