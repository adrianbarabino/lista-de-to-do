	var todo_json = [];
	var cantidad_de_selecciones = 0;
	var inicial;
	// configuracion modo debug
	var modo_debug = true;

	if (localStorage.getItem("to_do")) {
	    var json_local_storage = JSON.parse(localStorage.getItem("to_do"));
	    inicial = false;
	} else {
	    inicial = true;
	    var json_local_storage = JSON.parse('[{"id":"id1367733341454","valor":"To-dos de prueba","tildado":false,"fecha":"2013-05-05T06:05:48.908Z","fecha_iso":"2013-05-05T06:05:48.908Z"},{"id":"id1367733346323","valor":"Puedes borrarlos seleccionándolos","tildado":false,"fecha":"2013-05-05T06:05:48.908Z","fecha_iso":"2013-05-05T06:05:48.908Z"},{"id":"id1367733350884","valor":"Y agregar nuevos también.","tildado":false,"fecha":"2013-05-05T06:05:48.908Z","fecha_iso":"2013-05-05T06:05:48.908Z"}]');
	}
	function imprimir_consola (string) {
		if(modo_debug){
			console.log(string);
		}else{
			// no hacemos nada si el modo debug está apagado!!
		}
	}

	function sacar_tags(variable){
    return variable.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;

	}
	function cambiar_estado(info) {
	    var id_unica = info.target.id;
	    var posicion_en_array;
	    $.each(todo_json, function (i, val) {
	        if (val) {
	            if (val.id == id_unica) {
	                posicion_en_array = i;
	            }
	        }
	    })

	    var todo_a_editar = todo_json[posicion_en_array];
	    imprimir_consola(todo_a_editar);
	    
	    if(todo_a_editar.id){
	    	imprimir_consola("Ahora el Todo: " + todo_a_editar.valor + " está: " + todo_a_editar.tildado);
		    if (todo_a_editar.tildado) {
		        todo_a_editar.tildado = false;
		        $(".row .span6 input#" + id_unica).attr("checked", "");
		        $(".row .span6 input#" + id_unica).parent().removeClass("tildado");
		        cantidad_de_selecciones--;
		    } else {
		        todo_a_editar.tildado = true;
		        $(".row .span6 input#" + id_unica).attr("checked", "checked");
		        $(".row .span6 input#" + id_unica).parent().addClass("tildado");
		        cantidad_de_selecciones++;
		    }
		}
		
	    actualizar_seleccionados();
	    localStorage.setItem("to_do", JSON.stringify(todo_json));

	}

	function actualizar_seleccionados(info) {
	    var ahora_hay = cantidad_de_selecciones;
	    var antes_habia = $("span.numero-de-selecciones").text();
	    imprimir_consola("Antes habia: " + antes_habia);
	    imprimir_consola("Ahora hay: " + ahora_hay);
	    if (antes_habia == 0) {
	        if (ahora_hay > 0) {
	            $("div#info-selecciones").slideDown();
	        }
	    }
	    if (ahora_hay <= 0) {
	        cantidad_de_selecciones = 0;
	        $("div#info-selecciones").slideUp();

	    }
	    $("span.numero-de-selecciones").html(cantidad_de_selecciones);
	}

	function actualizar_contador(info){
		hacer_editable();
		var numero_de_items;
		numero_de_items = 0;
	    $.each(todo_json, function (i, val) {
	        if (val) {
	                numero_de_items++;
	        }
	    });
	    imprimir_consola("Hay "+numero_de_items+" Items");
	}

	function eliminar_todo(info) {
	    var a_borrar = 0;
	    $(".row .span6#lista-todos input[checked='checked']").each(function (index) {
	        imprimir_consola(index + ": " + $(this).parent().attr("for"));
	        var id_unica = $(this).parent().attr("for");
	        var posicion_en_array;

	        $.each(todo_json, function (i, val) {
	            if (val) {
	                if (val.id == id_unica) {
	                    posicion_en_array = i;
	                    a_borrar++;
	                }
	            }
	        });
	        delete todo_json[posicion_en_array];
	        $(".row .span6#lista-todos label[for='" + id_unica + "']").remove();
	        actualizar_contador();
	        localStorage.setItem("to_do", JSON.stringify(todo_json));

	    });
	    if (a_borrar > 0) {
	        imprimir_consola("Se van a borrar: " + a_borrar);
	        imprimir_consola("Hay actualmente: " + cantidad_de_selecciones + " selecciones");
	        for (i = 0; i < a_borrar; i++) {
	            cantidad_de_selecciones--;
	            imprimir_consola("Borro 1 selccion");
	        }
	        cantidad_de_selecciones - a_borrar;
	        actualizar_seleccionados();
	        imprimir_consola("Hay actualmente: " + cantidad_de_selecciones + " selecciones");
	    }

	}

	function enviar_todo(info) {
	    if ($("form input:first").val()) {
	        if (json_local_storage == "") {
	            $(".row .span6#lista-todos label").remove();
	        }
	        var nuevo_todo = new Object;
	        nuevo_todo.id = 'id' + (new Date()).getTime();
	        nuevo_todo.valor = $("form input:first").val();
	        nuevo_todo.tildado = false;
	        var fecha = new Date();
	        var fecha_iso = fecha.toISOString();
	        nuevo_todo.fecha = fecha;
	        nuevo_todo.fecha_iso = fecha_iso;
	        todo_json.push(nuevo_todo);
	        localStorage.setItem("to_do", JSON.stringify(todo_json));
	        $("form input:first").val("");
	        imprimir_consola(todo_json);

	        $(".row .span6#lista-todos").append('<label for=' + nuevo_todo.id + ' class="checkbox"><input id=' + nuevo_todo.id + ' name="todo" type="checkbox"><span class="to_do_text" onclick="return false;">' + nuevo_todo.valor + '</span><time class="timeago" datetime="' + nuevo_todo.fecha_iso + '">' + nuevo_todo.fecha + '</time></label>')
	        actualizar_contador();
	        // body...
	    } else {
	        alert("Tienes que ingresar un texto a tu tarea!");
	    }
	    $("time.timeago").timeago();

	}

	function cargar_todos(info) {

	    $.each(json_local_storage, function (i, val) {
	        imprimir_consola(val);
	        if (val) {
	            todo_json.push(val);
	            $(".row .span6#lista-todos").append('<label for=' + val.id + ' class="checkbox"><input id=' + val.id + ' name="todo" type="checkbox"><span class="to_do_text" onclick="return false;">' + sacar_tags(val.valor) + '</span><time class="timeago" datetime="' + val.fecha_iso + '">' + val.fecha + '</time></label>')
	            if (val.tildado) {
	                cantidad_de_selecciones++;
	                $(".row .span6 input#" + val.id).attr("checked", "checked");
	                $(".row .span6 input#" + val.id).parent().addClass("tildado");

	            }
	        actualizar_contador();
	        }
	    });
	    actualizar_seleccionados();

	}
       
        function editar_contenido(nombre_evento){
            imprimir_consola("Estoy en la funcion editar_contenido");
            var id = $(".row .span6#lista-todos label:contains('"+nombre_evento+"') input").attr("id");
            imprimir_consola("El id es "+id);
            var posicion_en_array;
        	$.each(todo_json, function (i, val) {
	            if (val) {
	                if (val.id == id) {
	                    posicion_en_array = i;
	                }
	            }
	        });
	        todo_json[posicion_en_array].valor = nombre_evento;
	        localStorage.setItem("to_do", JSON.stringify(todo_json));

        }


	function verificar_tildados() {

	}
	function hacer_editable (info) {
		$(".row .span6#lista-todos label span.to_do_text").each(function (index, val) {

                        $(val).editable("click", function(e){
                            imprimir_consola("Llegué");
                            if(e.old_value == e.value){
                            imprimir_consola("No hago nada, no edite nada");
                            }else{
                            editar_contenido(e.value);
                            imprimir_consola("hay un cambio !! asi que ejecuto la función");
                            }
                            imprimir_consola(e);
                        });

		})
	}

	function inicio() {
	    cargar_todos();
	    verificar_tildados();
	    $(".row .span6 form").submit(enviar_todo);
	    $(".row .span6#lista-todos").delegate("label", "click", cambiar_estado);
            $(".row .span6#lista-todos label").undelegate("span", "click", cambiar_estado);
	    $(".row .span6 input#eliminar").on("click", eliminar_todo);
	    $("form input.btn").on("click", enviar_todo);
	    $("time.timeago").timeago();
	    
		
	}
	$(document).on("ready", inicio);