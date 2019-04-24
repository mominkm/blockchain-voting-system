// stop erase animations from firing on load
document.addEventListener("DOMContentLoaded",function() {
	var q = document.querySelectorAll(".cb");
	for (var i in q) {
		if (+i < q.length) {
			q[i].addEventListener("click",function(){
				let c = this.classList,
					p = "pristine";
				if (c.contains(p)) {
					c.remove(p);
				}
			});
		}
	}
});

var $button = document.querySelector('.button');
$button.addEventListener('click', function() {
  var duration = 0.3,
      delay = 0.08;
  TweenMax.to($button, duration, {scaleY: 1.6, ease: Expo.easeOut});
  TweenMax.to($button, duration, {scaleX: 1.2, scaleY: 1, ease: Back.easeOut, easeParams: [3], delay: delay});
  TweenMax.to($button, duration * 1.25, {scaleX: 1, scaleY: 1, ease: Back.easeOut, easeParams: [6], delay: delay * 3 });
});