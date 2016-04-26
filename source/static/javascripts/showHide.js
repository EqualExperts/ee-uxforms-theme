if(!window.console) {
    window.console = { log: $.noop, debug: $.noop};
}

function addListeners(sectionUrl) {
    $(":input").blur(function () {
        refreshVisibility(sectionUrl)
    });
    $("input:radio").change(function() {
        refreshVisibility(sectionUrl);
    });
    var $blockLabels = $(".block-label input[type='radio'], .block-label input[type='checkbox']");
}

function refreshVisibility(sectionUrl) {
    console.debug("refreshing visibility for " + sectionUrl);

    $.ajax({
        url: sectionUrl,
        type: 'POST',
        data: $("form").serializeArray(),
        dataType: 'json',
        success: function (response) {
            $.each(response, function (elementId, properties) {
                var elem = $("#" + elementId);
                if (properties.hidden) {
                    console.debug("hiding element " + elem.attr("id"));
                    elem.find("input:radio, input:checkbox").removeAttr("checked");
                    elem.hide();
                } else {
                    console.debug("showing element " + elem.attr("id"));
                    elem.removeClass("hidden"); // written server-side to help(?) non-javascript viewers
                    elem.show();
                }
            })
        }
    });

}
