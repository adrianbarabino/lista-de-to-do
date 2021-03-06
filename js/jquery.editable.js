(function ($) {
    $.fn.editable = function (event, callback) {
        if (typeof callback != 'function') callback = function (arg) {};
        if (typeof event == "string") {
            var trigger = this;
            var action = event;
        } else {
            var trigger = event.trigger;
            var action = event.action;
        }

        var target = this;
        var edit = {};

        edit.start = function (e) {
            trigger.unbind(action == 'clickhold' ? 'mousedown' :
                action);
            if (trigger != target) trigger.hide();
            var id_unica = e.target.parentNode.htmlFor;
            var posicion_en_array;
            $.each(todo_json, function (i, val) {
                if (val) {
                    if (val.id == id_unica) {
                        posicion_en_array = i;
                    }
                }
            });
            if(posicion_en_array>=0){
                imprimir_consola("Encontre un elemento!");
            var old_value = todo_json[posicion_en_array].valor.replace(/^\s+/, '').replace(/\s+$/, '');
            }else{
                
                imprimir_consola("No encontre un elemento!");
                imprimir_consola(id_unica);
                imprimir_consola(posicion_en_array);

            var old_value =
                target.text().replace(/^\s+/, '').replace(/\s+$/, '');
            }
            var input = $('<input>').val(old_value).

            width(target.width() + target.height()).css('font-size', '100%').
            css('margin', 0).attr('id', 'editable_' + (new Date() * 1)).
            addClass('editable');

            var finish = function () {
                var res =
                    input.val().replace(/^\s+/, '').replace(/\s+$/, '');
                target.text(res);
                callback({
                    value: res,
                    target: target,
                    old_value: old_value
                });
                edit.regist();
                if (trigger != target) trigger.show();
            };

            input.blur(finish);
            input.keydown(function (e) {
                if (e.keyCode == 13) finish();
            });

            target.html(input);
            input.focus();
        };

        edit.regist = function () {
            if (action == 'clickhold') {
                var tid = null;
                trigger.bind('mousedown', function (e) {
                    tid = setTimeout(function () {
                        edit.start(e);
                    }, 500);
                });
                trigger.bind('mouseup mouseout', function (e) {
                    clearTimeout(tid);
                });
            } else {
                trigger.bind(action, edit.start);
            }
        };
        edit.regist();

        return this;
    };
})(jQuery);