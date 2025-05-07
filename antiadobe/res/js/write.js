function Write(element) {
	var text = $(element).html();
	var i = 1;

	var toot = setInterval(function() {
		$(element).html(text.substring(0,i));
		//type.play();
		i += 1;
		if (i > text.length) {
			clearInterval(toot);
			$(element).html(text);
			//finish.play();
		}
	}, 100);
}
