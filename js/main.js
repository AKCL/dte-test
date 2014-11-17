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
	JSONLength, 
	size,
	bgImageArray = []; // stores the background images //

	$.backstretch("img/"+bgImageArray[objIndex]);

	var _START  = $("#start-template").html();
	var startTemplate = Handlebars.compile(_START);

	var _QUESTION  = $("#question-template").html();
	var questionTemplate = Handlebars.compile(_QUESTION);

	var _END  = $("#end-template").html();
	var endTemplate = Handlebars.compile(_END);

	
	// replace line return with <p> //
	Handlebars.registerHelper('format', function(item) {
       	item = Handlebars.Utils.escapeExpression(item);
    	item = item.replace(/(\n|\n)/gm, '<br>');
    	item = item.replace(/(\r|\r)/gm, '<p>');
    	return new Handlebars.SafeString(item);
    });

	// basic Math helper
    Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
        
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});


	// set page up ////

	function setUp(){
		$box = $('.box'); //
		$(".fancybox").fancybox({
			maxWidth: 400,
			closeClick: true,
    		afterLoad   : function() {
        	this.content = '<p>'+ $(this.element).data('response') +'</p>';
        	this.content += '<p class="back">Back to Quiz</p>';
    	}
	});

	}

	function nextQuestion(){
		$quizContainer.show();
		$(".backstretch").fadeOut(100);
		$box.fadeOut(100);
		if  (objIndex < JSONLength){// advance the frames
			$.backstretch("img/"+bgImageArray[objIndex]);
			$(".backstretch").fadeIn("fast");
			$box.eq(objIndex)
				//.backstretch("img/"+bgImageArray[objIndex])
				.randomize(".question .answers", "a")
				.delay(200)
				.fadeIn(100);
				$('html,body').delay(500).animate({ scrollTop: 0 }, 'slow');
			objIndex++;
		} else{
			objIndex = 0; // reset object index
			$box.fadeOut(100);
			$quizContainer.hide();
			$endContainer.delay(500).fadeIn(500);
		}
	}

	function init(JSONObj){
		
	}

	$(document).on('click', '.start', function (e) {
	    e.preventDefault();
		$startContainer.fadeOut(100);
		nextQuestion();
	})

	$(document).on('click', '.restart', function (e) {
	    e.preventDefault();
		$endContainer.fadeOut(100);
		$startContainer.fadeIn(100);
		$quizContainer.show();
	})

	$(document).on('click', '.answers a', function (e) {
	      e.preventDefault();
	      checkAnswer($(this).data('response')); // id contains direction
	})

	function wrongAnswer(response){
		console.log("wrong");
	}

	function checkAnswer(response){
	 	response ==""||null ? nextQuestion() : wrongAnswer(response);
	}

    $.getJSON( "quiz.js?nocache=" + (new Date()).getTime(), function( data ) {

	  	// create bgImageArray for each question //
	    $.each(data.questions, function (index, questions) {
	        bgImageArray.push(questions.background); //push values here
	    });
	    JSONObj = data;
	    
	    //apply start background to body
	    $('body').css({'background-image':'url(img/'+ JSONObj.start[0].background+')', 'background-repeat':'no-repeat','background-size': 'cover'});

        JSONLength = _.size(JSONObj.questions);
        console.log(JSONLength);
		objIndex=0;
		$startContainer.append (startTemplate(JSONObj));
		_.defer(setUp); // wait a moment until new DOM elements loaded
		$quizContainer.append (questionTemplate(JSONObj)); // prepare quiz
		$endContainer.append (endTemplate(JSONObj));
		
		// load first - temp
		// apply backgrounds to all boxes
		// load stuff
  	});

	// $( window).resize(function() {
	// 	//size();

	// });

});

