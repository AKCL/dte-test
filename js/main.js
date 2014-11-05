// PLugins //

// function to randomize display order of answer choices elements
(function($) {
  
  $.fn.randomize = function(tree, childElem) {
    return this.each(function() {
      var $this = $(this);
      if (tree) $this = $(this).find(tree);
      var unsortedElems = $this.children(childElem);
      var elems = unsortedElems.clone();
      
      elems.sort(function() { return (Math.round(Math.random())-0.5); });  

      for(var i=0; i < elems.length; i++)
        unsortedElems.eq(i).replaceWith(elems[i]);
    });    
  };

})(jQuery);

$(document).ready(function(){

	var $quizContainer = $('.quiz-container'),
	$box,
	$startContainer = $('.start-container'),
	$endContainer = $('.end-container'),
	$start = $(' a.start'),
	JSONObj,
	objIndex,
	JSONLength, // length of array - 1 // 
	size;

	var _QUESTION  = $("#question-template").html();
	var questionTemplate = Handlebars.compile(_QUESTION);
	
	Handlebars.registerHelper('format', function(item) {
       item = Handlebars.Utils.escapeExpression(item);
    	item = item.replace(/(\r\n|\n|\r)/gm, '<p>');
    	return new Handlebars.SafeString(item);
    });


	function size(){
		$box = $('.box');
	    var height = Math.max($(document).height(), $(window).height());
		//var width = Math.max (window.innerWidth,  body.clientWidth)	
		$box.height(height);
		// apply backgrounds?
	}

	// set page up ////

	function nextQuestion(){
		$box.fadeOut(500);
		if  (objIndex < JSONLength){// advance the frames
			$box.eq(objIndex)
				.backstretch("img/moon.jpg")
				.randomize(".question .answers", "a")
				.delay(500)
				.fadeIn("fast");
			objIndex++;
		} else{
			$quizContainer.hide();
			$endContainer.delay(500).fadeIn(500);
		}
	}

	function init(JSONObj){
        JSONLength = _.size(JSONObj.Questions);
        console.log(JSONLength);
		objIndex=0;
		_.defer(size); // wait a moment until new DOM elements loaded
		$quizContainer.show().append (questionTemplate(JSONObj));
		
		// load first - temp
		// apply backgrounds to all boxes
		// load stuff
	}

	$(document).on('click', '.answers a', function (e) {
	      e.preventDefault();
	      checkAnswer($(this).data('response')); // id contains direction
	})

	function wrongAnswer(response){
		alert(response);
	}

	$start.click(function(e){
		e.preventDefault();
		$startContainer.fadeOut(500);
		nextQuestion();
	})

	function checkAnswer(response){
	 	response ==""||null ? nextQuestion() : wrongAnswer(response);
	}

    $.getJSON( "quiz.json?nocache=" + (new Date()).getTime(), function( data ) {
      JSONObj = data;
      init(JSONObj);	
  	});

	$( window, document ).resize(function() {
		size();
	});

});


	