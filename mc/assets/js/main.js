var highlightInvalid = function (element, errorClass, validClass) {
    var $element = $(element);
    $element.addClass(errorClass).removeClass(validClass);
    $element.parents('form').find('.button').disableElement();
};
var unhighlightValid = function (element, errorClass, validClass) {
    var $element = $(element);
    $element.addClass(validClass).removeClass(errorClass);
    $element.siblings('.error').remove();
    var form = $element.parents('form');
    if (!form.find('input.error').length) {
        // No more errors, enable button.
        form.find('.button').enableElement();
    }
};

var trackEvent = function(category, action, label, value){
    _gaq.push(['_trackEvent', category, action, label, value]);
};

var flashError = function (message, $target) {
    $('.error.flash').remove();
    var $div = $('<div>', {html: '<p><strong>Error!</strong> ' + message + '</p>'}).addClass('error').addClass('flash');
    var $intro = $target.find('.intro');
    if ($intro.length) {
        $div.insertAfter($intro);
    } else {
        $div.prependTo($target);
    }
    var button = $target.find('.button').show().enableElement();
    var originalText = button.data('originalText');
    if (originalText) {
        button.text(originalText);
    }
    $('#loader').remove();
};
var showError = function (container, message) {
    container.empty().append($('<p>').html(message).addClass('error'));
};

var pathName = window.location.pathname;
if (pathName.indexOf('./login.html') >= 0 || pathName.indexOf('./register.html') >= 0 || pathName.indexOf('store') >= 0) {
    if (top.location != self.location) {
        top.location = self.location.href
    }
}

var dropdownMenuItem = 0;
var dropdownCloseTimer = 0;
var dropdownOpen = function () {
    dropdownCancelTimer();
    dropdownClose();
    dropdownMenuItem = $(this).find('ul').show();
}

var dropdownClose = function () {
    if (dropdownMenuItem.length > 0) {
        $(dropdownMenuItem[0]).hide();
    }
}

var dropdownTimer = function () {
    dropdownCloseTimer = window.setTimeout(dropdownClose, 500);
}

var dropdownCancelTimer = function () {
    window.clearTimeout(dropdownCloseTimer);
    dropdownCloseTimer = null;
}

var oldCodeLength = 0;
var formatCode = function (el) {
    newVal = "";
    for (var i = 0; i < el.val().length; i++) {
        if (newVal.length >= 14) break;
        if (!el.val()[i].match(/[\s-]/))
            newVal += el.val()[i];
        if (newVal.length < 13 && (newVal.length + 1) % 5 == 0) {
            newVal += "-";
        }
    }
    el.val(newVal);
}

var countTo = function (el, val) {
    if (el.text().length != val.length) {
        el.text(val);
        el.css('width', el.width() + 'px').css('display', 'inline-block');
        return false;
    }
    var digits = el.text().split('');
    el.css('width', el.width() + 'px').css('display', 'inline-block');
    el.html("");
    var offset = new Array();
    var digitEles = new Array();
    for (i in digits) {
        var digit = $("<span></span>").text(digits[i]).appendTo(el);
        offset.push(digit.position().left);
        digitEles.push(digit);
    }
    for (i in digitEles) {
        digitEles[i].css({
            top: 0,
            left: offset[i] + "px",
            position: 'absolute'
        })
    }

    var newDigits = val.split('');
    for (i in newDigits) {
        if (newDigits[i] != digits[i]) {
            var newDigit = $('<span></span>').text(newDigits[i]).appendTo(el);
            newDigit.css({
                top: "-10px",
                left: offset[i] + "px",
                position: 'absolute'
            });
            newDigit.animate({
                top: '+=10',
                opacity: 1.0
            }, 200), function () {
                el.html(val)
            };
            digitEles[i].animate({
                top: '+=10',
                opacity: 0.0
            }, 200, function () {
                $(this).remove()
            });
        }
    }

//$($('.total_users span')[4]).animate({top: '-=15', opacity: 1.0 },500, function(){$(this).remove()});
}

var addThousandSeparator = function (nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1;
}

var loadFacebook = function () {
    $('#facebook .fbarea').html('<iframe src="https://www.facebook.com/plugins/likebox.php?href=http%3A%2F%2Fwww.facebook.com%2Fminecraft&amp;width=300&amp;colorscheme=dark&amp;connections=10&amp;stream=false&amp;header=false&amp;height=255" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:300px; height:255px;" allowTransparency="true"></iframe>');
}

var oc = function (a) {
    var o = {};
    for (var i = 0; i < a.length; i++) {
        o[a[i]] = '';
    }
    return o;
}

$(document).ready(function () {
    var location = window.location.pathname;

    if($('a#psnstore').length){
        $.get('/store/psn/url', function(response){
            $('a#psnstore').attr('href', response);
        }).fail(function(){
                // If failing, use a default url
                $('a#psnstore').attr('href', 'https://store.sonyentertainmentnetwork.com/#!/en-us/games/minecraft-playstation3-edition/cid=UP4433-NPUB31419_00-TRIALUPGRADE0001')
            }
        );
    }

    var mainclasses = $('#main').attr('class').split(' ');
    for (var i = 0; i < mainclasses.length; i++) {
        var mainclass = mainclasses[i];
        if (mainclass.match(/(path_|verb_)/)) {
            $('#main').removeClass(mainclass);
        }
    }
    $('#main').addClass("path_" + location.toString().replace(/[^0-9a-zA-Z]/g, ""));
    //        $('#main').addClass("verb_" + app.last_route.verb);

    $('#menu > li').bind('mouseover', dropdownOpen);
    $('#menu > li').bind('mouseout', dropdownTimer);

    // Specific locations
    if (location == "./" || "./index.html") {
        loadFacebook();

        $('aside#animals p.USD').append($('<p>', {text:'26.95 USD'}).addClass('price'));
        $('aside#animals p.EUR').append($('<p>', {text:'19.95 EUR'}).addClass('price'));
        $('aside#animals p.GBP').append($('<p>', {text:'17.95 GBP'}).addClass('price'));

        if (typeof justLoggedIn != 'undefined' && justLoggedIn) {
            _gaq.push(['_trackEvent', 'Account', 'Login-completed', 'Minecraft']);
        }

        $('#hideJapanesePush').click(function (e) {
            setCookie("hideJapanesePush", 1, 90);
            $('#japanesePush').fadeOut(150);
            e.preventDefault();
            return false;
        });
    } else if (location == "./download.html") {
        $('#platform-all').click(function (event) {
            event.preventDefault();
            $('.platform').show();
            $(this).remove();
            return false;
        });
        if (typeof operating_system !== 'undefined') {
            $('#platform-' + operating_system).show();
        } else {
            $('.platform').show();
        }
        $('.download-link').click(function (e) {
            var link = $(e.currentTarget);
            var dist = link.attr('data-dist');
            var platform = link.attr('data-platform');
            _gaq.push(['_trackEvent', 'Downloads', 'Download-' + dist, platform]);

            return true;
        });
    } else if (location == "./classic/list.html") {
        var durToTime = function (dur) {
            var regex = /(\d+)([dhms])/;
            var match = regex.exec(dur);
            var type = match[2];
            if (type == "s") {
                return match[1];
            } else if (type == "m") {
                return match[1] * 60;
            } else if (type == "h") {
                return match[1] * 60 * 60;
            } else if (type == "d") {
                return match[1] * 60 * 60 * 24;
            }
        }
        $.fn.dataTableExt.oSort['duration-asc'] = function (x, y) {
            return ((durToTime(x) < durToTime(y)) ? -1 : ((durToTime(x) > durToTime(y)) ? 1 : 0));
        };

        $.fn.dataTableExt.oSort['duration-desc'] = function (x, y) {
            return ((durToTime(x) < durToTime(y)) ? 1 : ((durToTime(x) > durToTime(y)) ? -1 : 0));
        };
        $('#servers').dataTable({
            "aaSorting": [
                [ 3, "desc" ]
            ],
            "aoColumns": [
                null,
                null,
                null,
                {
                    "sType": "duration"
                },
                null
            ]
        });
    }
});