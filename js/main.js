// function to randomize elements
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

	var $container = $('.quiz-container'),
	$box = $('.box'),
	objIndex,
	JSONLength = 3-1,
	size;


	function size(){
	    var height = Math.max($(document).height(), $(window).height());
		//var width = Math.max (window.innerWidth,  body.clientWidth)	
		$container.height(height);
	}

	function init(){
		objIndex=0;
		size();
		$box.eq(objIndex).randomize(".question .answers", "a").show();
		// load stuff
	}

	$(document).on('click', '.answers a', function (e) {
	      e.preventDefault();
	      checkAnswer($(this).data('response')); // id contains direction
	})

	function wrongAnswer(response){
		alert(response);
	}

	function nextQuestion(){
	// advance the frames
		$box.hide();
		objIndex++;
		$box.eq(objIndex).fadeIn("fast");
		console.log("correct");
	}

	function checkAnswer(response){
	 	response ==""||null ? nextQuestion() : wrongAnswer(response);
	}

	init();

	$( window, document ).resize(function() {
		size();
	});



});


	