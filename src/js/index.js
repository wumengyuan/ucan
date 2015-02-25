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


});

