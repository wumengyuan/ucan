$(document).ready(function() {
    // navbar
    $('#nav').onePageNav({
        currentClass: 'active',
        changeHash: true
    });

    // tabs
    $('ul.tabs').each(function(){
        var $active,
            $content,
            $links = $(this).find('a');

        // Show first content as default
        $active = $($links[0]);
        $active.addClass('active');

        $content = $($active[0].hash);

        // Hide the remaining content
        $links.not($active).each(function () {
            $(this.hash).hide();
        });

        // Bind the click event handler
        $(this).on('click', 'a', function(e){
            // Make the old tab inactive.
            $active.removeClass('active');
            $content.hide();

            // Update the variables with the new link and content
            $active = $(this);
            $content = $(this.hash);

            // Make the tab active.
            $active.addClass('active');
            $content.show();

            // Prevent the anchor's default click action
            e.preventDefault();
        });
    });

    // dialog
    $('div.modal-dialog').each(function(){

        var modal_id = this.id || $(this).data('modal');
        var trigger = $('a.modal-trigger[data-modal="' + modal_id + '"]');

        $(this).jqm({
            toTop: true,
            trigger: trigger
        });

    });

    $.getJSON( "data.json", function( info ) {
        var output='';
        for (var i = 0; i < info.links.length; i++) {
            for (var key in info.links[i]) {
                if (info.links[i].hasOwnProperty(key)) {
                    output += '<li><a href="'+info.links[i].key+'">'+key+'</a></li>';
                }
            }
        }

        var links = document.getElementById('links');
        links.innerHTML = output;
    });


});

