$(function() {

    var app_menu = $('#apps ul');
    app_menu.hide();
    if(!app_menu.length)
        return;

    // restore existing order
    $.get(OC.filePath('apporder','ajax','order.php'), { requesttoken: oc_requesttoken}, function(data) {
        var json = data.order;
        var order = []
        try {
            var order = JSON.parse( json ).reverse();
        } catch (e) {
            order = [];
        }
        if (order.length === 0) {
            $('#apps ul').show();
            return;
        }
        available_apps = {};
        app_menu.find('li').each(function() {
            var id =  $(this).find('a').attr('href');
            available_apps[id] = $(this);
        });
        $.each(order,function(order,value) {
            app_menu.prepend(available_apps[value]);
        });
        $('#apps ul').show();
    });

    // make app menu sortable
    $( "#apps ul" ).sortable({
        handle: 'a',
        stop: function( event, ui ) {
            var items = [];
            $("#apps ul").children().each(function(i,el){
                var item = $(el).find('a').attr('href');
                items.push(item);
            });

            var json = JSON.stringify(items);
            localStorage.setItem("apporder-order", json);
            $.get(OC.filePath('apporder','ajax','personal.php'), { order: json, requesttoken: oc_requesttoken}, function(data) {
                $(event.srcElement).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
            });
        }
    });

    // Sorting inside settings
    $( "#appsorter" ).sortable({
        forcePlaceholderSize: true,
        placeholder: 'placeholder',
        stop: function( event, ui ) {
            var items = []
                $("#appsorter").children().each(function(i,el){
                    var item = $(el).find('a').attr('href');
                    items.push(item)
                });
            var json = JSON.stringify(items);
            $.get(OC.filePath('apporder','ajax','admin.php'), { order: json, requesttoken: oc_requesttoken}, function(data) {
                $(event.srcElement).effect("highlight", {}, 1000);
            });
        }
    });
});
