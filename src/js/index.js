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
            closeOnEsc: true,
            trigger: trigger
        });

    });

    // dialog content
    $('.modal-trigger').on('click', function(event) {
        event.preventDefault();

        var id = $(this).data('id');

        var $popup = $('#popup');
        var $introWrap = $popup.find('.intro-wrap'),
            $detailWrap = $popup.find('.topic-wrap'),
            $photo = $popup.find('.photo');

        $.getJSON( "data.json", function( info ) {
            var intro ='',
                detail = '';
            $.each(info.speakers, function(index, val) {
                 if (id === val.id) {

                    $photo.src = val.img;

                    for (var key in val) {
                        if (val.hasOwnProperty(key)) {
                            if (key !== 'id' || key!== 'intro' || key!== 'topic') {
                                // console.log(key,val[key]);
                                $popup.find('.'+key).text(val[key]);
                            };
                        }
                    }

                    $.each(val.intro, function(index, val) {
                         intro += '<p>' + val+'</p>';
                    });
                    $.each(val.detail, function(index, val) {
                         detail += '<p>' + val+'</p>';
                    });

                    $introWrap.html(intro);
                    $detailWrap.html(detail);
                }
            });
        });
    });

    //parallax
    var scene = document.getElementById('parallax-scene');
    var parallax = new Parallax(scene);
});

