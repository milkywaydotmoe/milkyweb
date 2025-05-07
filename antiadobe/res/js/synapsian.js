function synapsify() {
	$(".synapsian").each(function() {
		var data = $(this).attr("data-content");
		var output = "";

		var spaces = data.split(";");

		spaces.forEach(function(space) {
			var chars = space.split(",");

			output += '<div class="synapsian_space';

			chars.forEach(function(char, index) {
				if (index === 0) {
					// This is the starting char, which tells us if there's ground, sky, or both.
					switch (char) {
						case "N":
							output += '">';
							break;
						case "S":
							output += ' sky">';
							break;
						case "G":
							output += ' ground">';
							break;
						case "B":
							output += ' both">';
							break;
					}
				} else {
					// This is a normal character.
					output += '<div class="synapsian_character';
					switch (char.charAt(0)) {
						case "F":
							output += ' full';
							break;
						case "W":
							output += ' wide';
							break;
						case "T":
							output += ' thin';
							break;
						case "S":
							output += ' single';
							break;
					}

					switch (char.charAt(3)) {
						case "N":
							break;
						case "S":
							output += ' single_bar';
							break;
						case "D":
							output += ' double_bar';
							break;
					}

					output += '"><span class="synapsian_bit">';

					switch (char.charAt(2)) {
						case "N":
							output += char.charAt(1);
							break;
						case "A":
							output += char.charAt(1) + "}";
							break;
						case "B":
							output += "{" + char.charAt(1);
							break;
					}

					output += '</span></div>';
				}
			});

			output += '</div>';
		});

		$(this).html(output);
	});
}