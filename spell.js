;(function(){

	"use strict";

	var write = document.getElementById("words"),
		input = document.getElementById("text"),
		timeout, xhr;

	input.addEventListener("keyup", function(e){

		if (timeout) clearTimeout(timeout);

		if (!this.value.trim()) words.innerHTML = '';

		timeout = setTimeout(function() {

			var test_phrase = shuffle_words( input.value );
			
			spell_check(test_phrase);

			timeout = null;

		}, 500);

	});

	function shuffle_words(inp) {
		
		inp = inp.replace(/\s+/g, ' '); //matching character combinations

		var arr = inp.split(" "),  //sorting of arrays
			n = arr.length;
 
		while (n > 0) { 
			var i = Math.floor(Math.random() * n--),
				t = arr[n];  //specify the number of arrays
			arr[n] = arr[i];
			arr[i] = t;  //rate of return
		}

		return arr.join(' ');
	}

	function spell_check(text){

		if (xhr) xhr.abort();

		xhr = $.ajax({
		    url: 'https://montanaflynn-spellcheck.p.mashape.com/check/',
		    headers: {
		    	'X-Mashape-Key': 'U3ogA8RAAMmshGOJkNxkTBbuYYRTp1gMAuGjsniThZuaoKIyaj',
		    	'Accept': 'application/json'
		    },
		    data: { 
		    	'text': text
		    },
		    cache: false,
		    success: function(result){

		    	xhr = null;
		    	suggest_words(result);

		    }
		});

	}

	function suggest_words(obj){  //obj-modifier/autocomplete function

		if (!obj.corrections) return;

		words.innerHTML = '';

		for (var key in obj.corrections) {

			if (obj.corrections.hasOwnProperty(key)) {  //returns true if the suggested words have access to a property with a given name

				var div = document.createElement("div");
				div.className = "word";
				div.innerHTML = obj.corrections[key] [0];
				div.orig = key; //array of nos & doubles its value
				
				div.onmouseover = function() {
					var start = input.value.indexOf(this.orig);  //returns info on a string & returns the position on first occurrence.  
					input.selectionStart = start;
					input.selectionEnd = start + this.orig.length;
				};

				div.onmouseout = function() {
					var len = input.value.length;
					input.selectionStart = len;
					input.selectionEnd = len;
				}

				div.onclick = function() {
					input.value = input.value.replace(this.orig, this.innerHTML);
					this.parentNode.removeChild(this);
				}

				words.appendChild(div);

			}

		}

	}

})();