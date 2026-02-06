jQuery(function($){

	// Activate Product Key
	$('.thb-register:not(.disabled)').on("click", function(e){
		var _this = $(this),
				key = $('#thb_product_key').val(),
				purchase_code = $('#thb_purchase_code').val(),
				is_purchase_code = _this.hasClass('thb_purchase_code'),
				url = is_purchase_code ? _this.data('verify-by-purchase') : _this.data('verify'),
				data = {
					'domain': _this.data('domain')
				};

		if ( is_purchase_code ) {
			data.purchase_code = purchase_code;
		} else {
			data.product_key = key;
		}

		$.ajax({
			method: 'GET',
			url: url,
			data: data,
			beforeSend: function() {
				_this.addClass('disabled');
			},
			error: function(data) {
				_this.removeClass('disabled');
				if (data.responseText) {
					var response = $.parseJSON(data.responseText);
					if ( response.error_message ) {
						if ( 'Invalid product_key' === response.error_message) {
							_this.parents('.step').find('.thb_error_messages').html('<div class="thb-error"><p><span class="dashicons dashicons-warning"></span> Invalid Product Key</p><p><small>Please make sure that you are using the exactly the same​ WordPress URL inside Settings > General.</small></p></div>');
						} else if ( 'Invalid purchase_code' === response.error_message) {
							_this.parents('.step').find('.thb_error_messages').html('<div class="thb-error"><p><span class="dashicons dashicons-warning"></span> Invalid Envato Purchase Code</p><p><small>Please make sure that you are using the correct Envato Purchase Code for this theme.</small></p></div>');
						} else if ( 'Invalid domain' === response.error_message) {
							_this.parents('.step').find('.thb_error_messages').html('<div class="thb-error"><p><span class="dashicons dashicons-warning"></span> Invalid Domain</p><p><small>Please make sure that you are using the exactly the same​ WordPress URL inside Settings > General.</small></p></div>');
						} else {
							_this.parents('.step').find('.thb_error_messages').html('<div class="thb-error"><p><span class="dashicons dashicons-warning"></span> '+response.error_message+'</p></div>');
						}
					}
				}
			},
			success: function(data) {
				if (data.product_key) {
					key = data.product_key;
				}
				$.ajax( ajaxurl, {
					method : 'POST',
					data : {
						action: 'thb_update_options',
						key: key,
						expired: 0,
						security: _this.data('security'),
					},
					success:function() {
						location.reload();
					}
				});

			},
		});
		return false;
	});
	// Remove Product Key
	$('.thb-delete-key').on("click", function(e){
		var _this = $(this);
		$.ajax( ajaxurl, {
			method : 'POST',
			data : {
				action: 'thb_update_options',
				key: '',
				expired: 0,
				security: _this.data('security'),
			},
			success:function() {
				location.reload();
			}
		});
		return false;
	});

	// Thb Admin Popup
	var thb_adm_p_vars = {
		popup: $('#thb-adm-popup'),
		close: $('.thb-popup-close'),
		btn: $('.import-opts-btn')
	};

	thb_adm_p_vars.close.on('click', function() {
		$(this).closest(thb_adm_p_vars.popup).removeClass('opvis');
	});
	$(document).on('keyup', function(e) {
		if (e.keyCode === 27) {
			if (thb_adm_p_vars.popup.hasClass('opvis')) {
				thb_adm_p_vars.close.trigger('click');
			}
		}
	});
	$('.thb-check-line [type=checkbox]').on('change', function() {
		var t = $(this);
		t.toggleClass('thb-checked');
		if (t.attr('id') === 'ty-contents') {
			if (!t.hasClass('child-opened')) {
				t.addClass('child-opened').parent().next().addClass('done');
			} else {
				t.removeClass('child-opened').parent().next().removeClass('done');
			}
		}
	});

	// Open Import Popup
	thb_adm_p_vars.btn.on('click', function() {
		var t = $(this),
			selected = t.data('demo');
		thb_adm_p_vars.popup.find('.button').data('selected', selected);
		thb_adm_p_vars.popup.find('figure img').attr('src', t.closest('.theme').find('img').attr('src'));
		thb_adm_p_vars.popup.find('[type=checkbox]');
		thb_adm_p_vars.popup.addClass('opvis');
	});

	// Demo Content Import
	var thb_data = new FormData(),
			thb_once = false;

	if (typeof ocdi !== 'undefined') {
		thb_data.append( 'action', 'ocdi_import_demo_data' );
		thb_data.append( 'security', ocdi.ajax_nonce );
	}

	function thb_ajaxCall(thb_data) {

		// AJAX call.
		$.ajax({
			method:     'POST',
			url:        ocdi.ajax_url,
			data:       thb_data,
			contentType: false,
			processData: false
		})
		.done( function( response ) {
			if ( 'undefined' !== typeof response.status && 'newAJAX' === response.status ) {
				thb_ajaxCall( thb_data );
			} else if ( 'undefined' !== typeof response.status && 'afterAllImportAJAX' === response.status ) {
				// Fix for data.set and data.delete, which they are not supported in some browsers.
				var newData = new FormData();
				newData.append( 'action', 'ocdi_after_import_data' );
				newData.append( 'security', ocdi.ajax_nonce );
				thb_ajaxCall( newData );
			} else {
				location.reload();
			}
		});
	}

	// Import Form Submit
	thb_adm_p_vars.popup.find('form').on('submit', function(e) {
		e.preventDefault();
		var t = $(this),
			demo = t.find('.button').data('selected');

		thb_adm_p_vars.popup.find('form').addClass('thb-loading');
		t.closest('.thb-popup-box').find('.thb-import-loading').addClass('opvis');
		t.children('[type=submit]').addClass('disabled').attr('disabled', 'disabled').unbind('click');

		thb_data.append( 'selected', demo );
		thb_data.append( 'thb_import_options', t.serialize());

		thb_ajaxCall(thb_data);
	});
	// Header Button Field
	if ( $('.thb-button-creator-btn').length ) {
	  var link_wrap = $('#wp-link-wrap'),
				link_form = link_wrap.children('#wp-link');

	  $('.thb-button-creator-btn').on('click', function() {
	    var _this    = $(this),
					settings = $('.thb-button-creator-btn').data('thb-settings'),
					fields   = settings.fields,
					inp      = _this.next('[type=hidden]'),
					wrap     = _this.closest('.format-setting-wrap');

	    // Init Settings
	    if (settings.height) {
	      link_wrap.css( 'height', settings.height + 'px');
	    }
	    link_form.find('#link-modal-title').text(_this.text() + ' Button');
	    link_form.find('#wp-link-submit').attr('type', 'button').val(_this.text());

	    // Current Values to Popup
	    link_form.find('#wp-link-url').val(wrap.find('.thb-button-url')[0].childNodes[1].nodeValue.trim());
	    link_form.find('#wp-link-text').val(wrap.find('.thb-button-link-text')[0].childNodes[1].nodeValue.trim());
	    Object.keys(fields).forEach(function(type) {
	    	var data_item = fields[type];
				link_form.find('#search-panel').append('<h6 class="thb-link-title thb-'+ type +'">'+ data_item.label +'</h6>');

	      switch(data_item.type) {
	        case 'select':

	          data_item.data.forEach(function(field) {
	            var options     = '',
									current_val = wrap.find('.thb-btn-currents .thb-' + type + '__' + field.id)[0].childNodes[1].nodeValue.trim();

	            field.data.forEach(function(data) {
	              var selected = '';
	              if (current_val === data.label) {
	                selected = ' selected';
	              }

								options += '<option value="'+ data.value +'"'+ selected +'>'+ data.label +'</option>';
	            });

							link_form.find('#search-panel').append('<div class="thb-link-select-field"><label><span>'+ field.label +'</span><div><select name="thb-'+ type +'__'+ field.id +'">'+ options +'</select><small>'+ field.desc +'</small></div></label></div>');
	          });

	        break;
	      }
			});

			// Open Popup
			link_wrap.addClass('thb-opened');
			$('#wp-link-backdrop, #wp-link-wrap, #wp-link-wrap .wp-link-text-field').show();

			// Create Button
			link_form.find('#wp-link-submit').one('click', function() {
				// Form Data
				var datax = {
					url: $('#wp-link-url').val(),
					text: $('#wp-link-text').val(),
					target: ($('#wp-link-target').prop('checked') ? '_blank' : '_self')
				};
				Object.keys(fields).forEach(function(type) {
					var data_item = fields[type];
					data_item.data.forEach(function(val) {
						datax['thb-' + type + '__' + val.id] = $('[name=thb-' + type + '__' + val.id + ']').val();
					});
				});

				// to OT Input
				inp.val(JSON.stringify(datax));

				// to Preview
				wrap.find('.thb-button-url')[0].childNodes[1].nodeValue = datax.url;
				wrap.find('.thb-button-link-text')[0].childNodes[1].nodeValue = datax.text;
				wrap.find('.thb-button-target')[0].childNodes[1].nodeValue = datax.target;
				delete datax.url;
				delete datax.text;
				delete datax.target;

				var field_id = '',
						count    = 0;

				console.log(datax);
				Object.keys(datax).forEach(function(type) {
					var data_item = datax[type];
					if (field_id !== type.split('thb-')[1].split('__')[0]) {
						count = 0;
					}
					field_id = type.split('thb-')[1].split('__')[0];

					wrap.find('.' + type)[0].childNodes[1].nodeValue = fields[field_id].data.map(function(val) {
						return val.data.filter(function(val_2) {
							return val_2.value === data_item;
						});
					})[count][0].label;

					count ++;
				});

				$('#wp-link-close').trigger('click');
			});

			// Close Popup
			$('#wp-link-backdrop, #wp-link-close, #wp-link-cancel button').off().one('click', function() { // dont mess me WP ;)
				$('#wp-link-backdrop, #wp-link-wrap, #wp-link-wrap .wp-link-text-field').hide();
				link_form.find('.thb-link-title, .thb-link-select-field').remove();
				link_form.find('#wp-link-submit').off();
			});
			$(document).on('keyup', function(e) {
				if (e.keyCode === 27 && link_wrap.hasClass('thb-opened')) {
					$('#wp-link-close').trigger('click');
				}
			});
	  });
	}
});