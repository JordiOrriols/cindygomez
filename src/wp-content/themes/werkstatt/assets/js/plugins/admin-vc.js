jQuery(function($){
	var template_container = $('.thb_templates_container'),
			categories = $('.thb_library_categories li');
	/* Add Template */
	$('.thb_template_import').on("click", function(e){
		var _this = $(this);
		$.ajax({
			method: 'POST',
			url: window.ajaxurl,
			data: {
				'action': 'thb_load_template',
				'template_unique_id': _this.data('thb-id')
			},
			beforeSend: function() {
				_this.addClass('disabled');
			},
			error: function(data) {
				_this.removeClass('disabled');
			},
			success: function(html) {
				_.each(vc.filters.templates, function(callback) {
				    html = callback(html);
				});
				var models = '';
				if ($('body').hasClass('compose-mode')) {
					models = vc.builder.parse( {}, html);
					_.delay( function() {
					    _.each( models, function (model) {
					        vc.builder.create(model);
					    } );
					    vc.builder.render();
					});
				} else {
					models = vc.storage.parseContent({}, html);
  				_.each(models, function(model) {
  				    vc.shortcodes.create(model);
  				});
				}
				vc.closeActivePanel();
				_this.removeClass('disabled');
			}
		});
		return false;
	});

	$('.vc_templates-button').one( 'click' , function() {
		var total = 0;
		categories.each(function() {
			var _this = $(this),
					sort = _this.attr('data-sort'),
					count = $('.thb_template.'+ sort, template_container).length;

			total = total + count;
			_this.find('.count').html( count );
			categories.filter('[data-sort="all"]').find('.count').html( total );
		});
	});
	/* Sorting */
	categories.on('click', function(e){
		var _this = $(this),
				$selectedSort = _this.attr('data-sort');

    $('.thb_library_categories li').removeClass('active');
    _this.addClass('active');

    $('.thb_template', template_container ).removeClass('hidden');

    if($selectedSort !== 'all'){
       $('.thb_template:not(.'+$selectedSort+')').addClass('hidden');
    }
    return false;
  });

  $("body").on('change','.thb_radio_image_val',function(){
  	var _this = $(this),
  			id = _this.parents('.thb-radio-image').data("radio-image-id");
  	$("#thb-radio-image-" + id).val(_this.val()).trigger('change');
  });
});