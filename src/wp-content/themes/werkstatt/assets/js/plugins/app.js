window.onpageshow = function(event) {
  if (event.persisted) {
    window.location.reload();
  }
};
(function($, window) {
  'use strict';

  var $doc = $(document),
    win = $(window),
    body = $('body'),
    adminbar = $('#wpadminbar'),
    mobile_menu = $('#mobile-menu'),
    thb_css_ease = 'cubic-bezier(0.35, 0.3, 0.2, 0.85)',
    thb_ease = new BezierEasing(0.35, 0.3, 0.2, 0.85),
    thb_ease_2 = new BezierEasing(1, 0, 0, 1),
    thb_md = new MobileDetect(window.navigator.userAgent);

  var SITE = SITE || {};

  gsap.defaults({
    ease: thb_ease
  });

  gsap.config({
    nullTargetWarn: false
  });

  window.lazySizesConfig = window.lazySizesConfig || {};
  window.lazySizesConfig.expand = 250;
  window.lazySizesConfig.loadMode = 1;
  window.lazySizesConfig.loadHidden = false;

  SITE = {
    activeSlider: false,
    menuscroll: $('#menu-scroll'),
    init: function() {
      var self = this,
        obj;

      if ($('.header-lateral-off').length) {
        var borders = $('.thb-borders').css("border-top-width");

        win.on('resize.page-padding', function() {
          $('.page-padding').css({
            'paddingTop': $('.header').outerHeight() + ($('.page-padding').hasClass('extra') ? 30 : 0) + ($('.thb-borders').length ? parseInt(borders) : 0)
          });
        }).trigger('resize.page-padding');
      } else {
        win.on('resize.page-padding', function() {
          if ($(window).outerWidth() < 1024) {
            $('.page-padding').css({
              'paddingTop': $('.header').outerHeight() + ($('.page-padding').hasClass('extra') ? 30 : 0) + ($('.thb-borders').length ? parseInt(borders) : 0)
            });
          }

        }).trigger('resize.page-padding');
      }

      function initFunctions() {
        for (obj in self) {
          if (self.hasOwnProperty(obj)) {
            var _method = self[obj];
            if (_method.selector !== undefined && _method.init !== undefined) {
              if ($(_method.selector).length > 0) {
                _method.init();
              }
            }
          }
        }
      }

      if (themeajax.settings.page_transition === 'on' && !body.hasClass('compose-mode') && !body.hasClass('elementor-editor-active')) {
        $('.thb-page-transition-on')
          .animsition({
            inClass: themeajax.settings.page_transition_style + '-in',
            outClass: themeajax.settings.page_transition_style + '-out',
            inDuration: parseInt(themeajax.settings.page_transition_in_speed, 10),
            outDuration: parseInt(themeajax.settings.page_transition_out_speed, 10),
            loading: false,
            touchSupport: false,
            linkElement: '.animsition-link, a[href]:not([target="_blank"]):not([target=" _blank"]):not([href^="' + themeajax.settings.current_url + '#"]):not([href^="#"]):not([href*="javascript"]):not([href*=".rar"]):not([href*=".zip"]):not([href*=".jpg"]):not([href*=".jpeg"]):not([href*=".gif"]):not([href*=".png"]):not([href*=".mov"]):not([href*=".swf"]):not([href*=".mp4"]):not([href*=".flv"]):not([href*=".avi"]):not([href*=".mp3"]):not([href^="tel:"]):not([href^="mailto:"]):not([class="no-animation"]):not(.add_to_cart_button):not([class*="ftg-lightbox"]):not(.wpcf7-submit):not(.comment-reply-link):not(.mfp-image):not(.mfp-video):not([id*="cancel-comment-reply-link"]):not(.do-not-animate)'
          })
          .on('animsition.inEnd', function() {
            initFunctions();
          });
      } else {
        initFunctions();
      }

    },
    headRoom: {
      selector: '.midnight_off .header',
      portfolio_header: false,
      regular_header: false,
      tl: gsap.timeline({
        paused: true
      }),
      init: function() {
        var base = this,
          container = $(base.selector);


        base.portfolio_header = $('.portfolio-header', container);
        base.regular_header = $('.regular-header', container);

        if (base.portfolio_header.length) {
          base.tl
            .to(base.regular_header, {
              duration: 0.5,
              y: "-100%",
              autoAlpha: 0
            }, "s")
            .to(base.portfolio_header, {
              duration: 0.5,
              y: "0%",
              autoAlpha: 1
            }, "s+=0.1");

        }
        win.on('scroll', function() {
          base.scroll(container);
        });
      },
      scroll: function(container) {
        var wOffset = win.scrollTop(),
          stick = 'hover',
          base = this;

        if (wOffset > 0) {
          _.defer(function() {
            container.addClass(stick);
            if (base.portfolio_header.length) {
              base.tl.play();
            }
          });

        } else {
          _.defer(function() {
            container.removeClass(stick);
            if (base.portfolio_header.length) {
              base.tl.reverse();
            }
          });
        }
      }
    },
    scrollSpy: {
      selector: '.scroll-spy-on',
      init: function() {
        var base = this,
          container = $(base.selector),
          ah = (adminbar.outerHeight() || 0) + 5,
          offset = (body.hasClass('disable_header_fill-on') || body.hasClass('midnight_on')) ? ah : $('.header').outerHeight() + ah;

        offset = $('.header').hasClass('style3') ? 0 : offset;

        if ($('#full-menu').length && !body.hasClass('thb_row_pagination_on')) {
          body.scrollspy({
            target: '#full-menu',
            offset: offset
          });
        }
      }
    },
    search: {
      selector: '#quick_search',
      init: function() {
        var base = this,
          container = $(base.selector),
          search = $('#searchpopup'),
          field = $('.searchform', search),
          tl = gsap.timeline({
            paused: true,
            onComplete: function() {
              field.find('input').get(0).focus();
            }
          });

        tl
          .to(search, {
            duration: 0.5,
            autoAlpha: 1
          })
          .to(field, {
            duration: 0.5,
            y: 0
          });

        container.on('click', function() {
          var _this = $(this);

          tl.timeScale(1).play();
          return false;
        });

        $('.thb-search-close, .cc', search).on('click', function() {
          tl.timeScale(1.6).reverse();

          return false;
        });

        $doc.on('keyup', function(e) {
          if (e.keyCode === 27) { // ESC button
            tl.timeScale(1.6).reverse();
          }
        });
      }
    },
    retinaJS: {
      selector: 'img.retina_size:not(.retina_active)',
      init: function() {
        var base = this,
          container = $(base.selector);

        container.each(function() {
          var _this = $(this);
          _this.attr('width', function() {
            var w = _this.attr('width') / 2;
            return w;
          });
          if (_this.attr('height')) {
            _this.attr('height', function() {
              var h = _this.attr('height') / 2;
              return h;
            });
          }
          _this.addClass('retina_active');
        });
      }
    },
    midnight: {
      selector: '.midnight_on:not(.page-template-template-onepage):not(.header-lateral-on)',
      init: function() {

        $('.header').midnight({
          defaultClass: 'dark-title'
        });
      }
    },
    responsiveNav: {
      selector: '#wrapper',
      init: function() {
        var base = this,
          container = $(base.selector),
          onepage = body.hasClass('page-template-template-onepage'),
          music_toggle = $('#music_toggle'),
          toggle = $('.mobile-toggle'),
          target = mobile_menu,
          behaviour = target.data('behaviour'),
          animation = target.data('animation'),
          close = $('.thb-close', target),
          main_menu = $('.thb-mobile-menu'),
          mobile_menu_button = $('.thb-header-button', target),
          links = target.find('.thb-mobile-language-switcher>a,.thb-mobile-menu>li>.link_container>.link_inner'),
          footer_links = target.find('.thb-secondary-menu a, .menu-footer>div'),
          tl = gsap.timeline({
            paused: true,
            onStart: function() {
              if (target.hasClass('style3')) {
                $('.header').addClass('no-transition');
              }
            },
            onComplete: function() {
              SITE.menuscroll.update();
              if (target.hasClass('style3')) {
                $('.header').removeClass('no-transition');
              }
            },
            onReverseComplete: function() {
              gsap.set(target, {
                clearProps: 'all'
              });
              gsap.set($('div[role="main"]'), {
                clearProps: 'all'
              });
            }
          }),
          all_links = $('.thb-mobile-menu a'),
          span = behaviour === 'thb-submenu' ? target.find('.thb-mobile-menu li.menu-item-has-children>.link_container .link_inner') : target.find('.thb-mobile-menu .next'),
          active_sub_menu = gsap.timeline({
            paused: true
          }),
          music_tl = gsap.timeline({
            paused: true
          }),
          mobile_menu_speed = themeajax.settings.mobile_menu_speed;


        if (target.hasClass('style3')) {
          tl
            .to($('div[role="main"], .header'), {
              duration: mobile_menu_speed,
              x: "-100%",
              ease: thb_ease_2
            }, "start")
            .to(target, {
              duration: mobile_menu_speed,
              x: "0%",
              ease: thb_ease_2
            }, "start");

        } else if (target.hasClass('style2')) {
          tl
            .to(target, {
              duration: mobile_menu_speed,
              display: 'flex',
              scale: 1,
              autoAlpha: 1
            });
        } else {
          tl
            .to(target, {
              duration: mobile_menu_speed,
              x: "0%"
            });

        }
        if (animation === 'style1') {
          tl
            .to(links, {
              duration: 0.2,
              y: "0",
              stagger: 0.07
            }, "animation-style1-start")
            .to(footer_links, {
              duration: 0.1,
              y: "0",
              stagger: 0.02
            }, "-=0.1");

          if (mobile_menu_button.length) {
            tl.to(mobile_menu_button, {
              duration: 0.2,
              y: "0",
              autoAlpha: 1
            }, "animation-style1-start");
          }
        }

        if (themeajax.sounds.menu_open_sound === 'on') {
          if (typeof Howl !== "undefined") {
            var menu_open_sound = new Howl({
              src: themeajax.sounds.menu_open_sound_file,
              preload: true,
              volume: 0.5
            });
          }
        }
        if (themeajax.sounds.menu_close_sound === 'on') {
          if (typeof Howl !== "undefined") {
            var menu_close_sound = new Howl({
              src: themeajax.sounds.menu_close_sound_file,
              preload: true,
              volume: 0.5
            });
          }

        }

        /* Swipe Right */
        // var mc = new Hammer(target[0]);
        //
        // mc.on("swiperight", function(ev) {
        // 	if (themeajax.sounds.menu_close_sound === 'on') {
        // 		menu_close_sound.play();
        // 	}
        // 	container.removeClass('open-menu');
        // 	if (span.length && active_sub_menu.totalProgress() > 0) {
        // 		active_sub_menu.reverse();
        // 	}
        // 	tl.reverse();
        // 	return false;
        // });
        span.each(function() {
          var _this = $(this),
            sub_menu = _this.parents('.link_container').next('.sub-menu'),
            sub_menu_back = sub_menu.find('>li:eq(0) .back'),
            sub_menu_links = sub_menu.find('>li>.link_container>.link_inner'),
            sub_tl = gsap.timeline({
              paused: true,
              onComplete: function() {
                SITE.menuscroll.update();
              },
              onReverseComplete: function() {
                SITE.menuscroll.update();
              }
            });

          sub_tl
            .set(main_menu, {
              minHeight: sub_menu.outerHeight()
            })
            .to(main_menu, {
              duration: 0.5,
              x: "-=100%"
            }, "start")
            .to(main_menu.find('>li>.link_container'), {
              duration: 0.5,
              autoAlpha: 0
            }, "start")
            .to(sub_menu, {
              duration: 0.5,
              autoAlpha: 1
            }, "start")
            .to(sub_menu_links, {
              duration: 0.2,
              y: "0",
              stagger: 0.1
            }, "start");

          _this.on('click touchstart', function() {
            active_sub_menu = sub_tl;
            sub_tl.play();
            return false;
          });

          sub_menu_back.on('click touchstart', function() {
            sub_tl.reverse();
            return false;
          });
        });

        all_links.on('click', function(e) {
          var _this = $(this),
            url = _this.attr('href'),
            ah = adminbar.outerHeight() || 0,
            fh = (body.hasClass('disable_header_fill-on') || body.hasClass('midnight_on') || body.hasClass('header-lateral-on')) ? 0 : $('.header').outerHeight(),
            hash = url ? (url.indexOf("#") !== -1 ? url.substring(url.indexOf("#") + 1) : '') : false,
            pos = hash ? $('#' + hash).offset().top - ah - fh : 0,
            time = thb_md.mobile() ? 0 : 1;

          if (hash && onepage) {
            container.removeClass('open-menu');
            tl.reverse();
          } else if (hash && !pos) {
            return true;
          } else if (hash) {
            pos = (hash === 'footer') ? "max" : pos;
            container.removeClass('open-menu');
            tl.reverse();
            gsap.to(win, {
              duration: time,
              scrollTo: {
                y: pos,
                autoKill: false
              }
            });
            return false;
          }
        });
        all_links.add('.thb-secondary-menu a').on('touchstart', function() {
          $(this).trigger('click');
        });

        toggle.on('click touchstart', function() {
          if (themeajax.sounds.menu_open_sound === 'on') {
            if (typeof Howl !== "undefined") {
              menu_open_sound.play();
            }
          }
          container.toggleClass('open-menu');
          tl.timeScale(1).restart();
          return false;
        });


        $('.click-capture').add(close).on('click', function() {
          if (themeajax.sounds.menu_close_sound === 'on') {
            if (typeof Howl !== "undefined") {
              menu_close_sound.play();
            }
          }
          container.removeClass('open-menu');
          if (span.length && active_sub_menu.totalProgress() > 0) {

            active_sub_menu.reverse();
          }
          tl.reverse();
          return false;
        });

        $doc.on('keyup', function(e) {
          if (e.keyCode === 27) { // ESC button
            if (span.length) {
              active_sub_menu.reverse();
            }
            tl.reverse();
          }
        });
      }
    },
    mmBgFill: {
      selector: '.mm-link-animation-bg-fill',
      init: function() {
        var links = $('a[data-menubg]:not([data-menubg=""])', mobile_menu),
          ph = $('.menubg-placeholder', mobile_menu),
          style3 = mobile_menu.hasClass('style3');

        links.each(function() {
          if ($(this).data('menubg') !== '') {
            var image = new Image();
            image.src = $(this).data('menubg');
          }
        });
        links.hoverIntent(
          function() {
            ph.css({
              'background-image': 'url(' + $(this).data('menubg') + ')',
              'opacity': style3 ? 1 : 0.2
            });
          },
          function() {
            if (!style3) {
              ph.css({
                'background-image': '',
                'opacity': 0
              });
            }
          }
        );
        if (style3 && links.eq(0).data('menubg') !== '') {
          ph.css({
            'background-image': 'url(' + links.eq(0).data('menubg') + ')',
            'opacity': style3 ? 1 : 0.2
          });
        }
      }
    },
    fullMenu: {
      selector: '.thb-full-menu',
      init: function() {
        var base = this,
          container = $(base.selector),
          onepage = body.hasClass('page-template-template-onepage'),
          li_org = container.find('a'),
          children = container.find('li.menu-item-has-children');

        children.each(function() {
          var _this = $(this),
            menu = _this.find('>.sub-menu'),
            li = menu.find('>li>a'),
            tl = gsap.timeline({
              paused: true
            });

          tl
            .to(menu, {
              duration: 0.5,
              autoAlpha: 1
            }, "start")
            .to(li, {
              duration: 0.1,
              opacity: 1,
              y: 0,
              stagger: 0.03
            }, "start");

          if (body.hasClass('header-lateral-on')) {
            _this.find('>a').on('click',
              function() {
                _this.toggleClass('sfHover');
                menu.slideToggle('200');

                return false;
              }
            );
          } else {
            _this.hoverIntent(
              function() {
                _this.addClass('sfHover');
                if (!$('.header').hasClass('style3')) {
                  tl.timeScale(1).restart();
                } else {
                  menu.slideDown('200');
                }
              },
              function() {
                _this.removeClass('sfHover');
                if (!$('.header').hasClass('style3')) {
                  tl.timeScale(1.5).reverse();
                } else {
                  menu.slideUp('200');
                }
              }
            );
          }
        });

        li_org.on('click', function(e) {
          var _this = $(this),
            url = _this.attr('href'),
            ah = $('#wpadminbar').outerHeight() || 0,
            fh = (body.hasClass('disable_header_fill-on') || body.hasClass('midnight_on') || body.hasClass('header-lateral-on')) ? 1 : $('.header').outerHeight(),
            hash = url.indexOf("#") !== -1 ? url.substring(url.indexOf("#") + 1) : '',
            pos = (hash && $('#' + hash).length) ? $('#' + hash).offset().top - ah - fh : 0;

          if (hash && onepage) {
            return true;
          } else if (hash && !pos) {
            return true;
          } else if (hash) {
            pos = (hash === 'footer') ? "max" : pos;
            gsap.to(win, {
              duration: 0.5,
              scrollTo: {
                y: pos,
                autoKill: false
              }
            });
            return false;
          } else {
            return true;
          }
        });
      }
    },
    snap_rows: {
      selector: '.thb-snap-rows-on',
      init: function() {
        var base = this,
          container = $(base.selector),
          rows = $('.page.type-page>.row.wpb_row, .post.portfolio-detail .post-content>.row.wpb_row, .post.portfolio-detail .post-gallery, .elementor-section-wrap>.elementor-section'),
          positions = [];

        if (!thb_md.mobile()) {
          rows.imagesLoaded(function() {
            rows.each(function(i) {
              positions.push($(this).offset().top);
            });
          });

          win.on('resize', function() {
            positions.length = 0;
            rows.each(function(i) {
              positions.push($(this).offset().top);
            });
          });
          win.on('scroll', function() {
            var progress = win.scrollTop();
            clearTimeout(win.timer);

            win.isScrolling = true;
            win.timer = setTimeout(function() {
              win.isScrolling = false;
              base.goTo(Math.round(progress), positions);
            }, 200);
          });
        }
      },
      goTo: function(progress, positions) {
        var offset = (body.hasClass('disable-row-offset-on') ? 0 : $('.header.hover').outerHeight()) + ($('#wpadminbar').outerHeight() || 0);
        if (win.isScrolling) {
          return;
        }

        function getClosest(array, target) {
          var rows = _.map(array, function(val) {
            return [val, Math.abs(val - target)];
          });
          var closest = _.reduce(rows, function(memo, val) {

            return (memo[1] < val[1]) ? memo : val;
          }, [-1, 999])[0];

          return closest;
        }
        var el = getClosest(positions, progress);

        gsap.to(win, {
          duration: 0.3,
          scrollTo: {
            y: el,
            offsetY: offset
          }
        });
      }
    },
    socialSharing: {
      selector: '.thb-portfolio-share .social, .thb-share-icons .social',
      init: function() {
        var base = this,
          container = $(base.selector);

        container.data('pin-no-hover', true);
        container.on('click', function() {
          var left = (screen.width / 2) - (640 / 2),
            top = (screen.height / 2) - (440 / 2) - 100;

          if (!container.hasClass('email')) {
            window.open($(this).attr('href'), 'mywin', 'left=' + left + ',top=' + top + ',width=640,height=440,toolbar=0');
            return false;
          }
        });
      }
    },
    hashLinks: {
      selector: '.btn[href*="#"], .button[href*="#"]',
      init: function() {
        var base = this,
          container = $(base.selector);

        container.on('click', function(e) {
          var _this = $(this),
            url = _this.attr('href'),
            ah = adminbar.outerHeight() || 0,
            hash,
            pos;

          if (url) {
            hash = url.indexOf("#") !== -1 ? url.substring(url.indexOf("#") + 1) : '';
            pos = hash && $('#' + hash).length ? $('#' + hash).offset().top - ah : 0;
          }
          if (hash && pos) {
            pos = (hash === 'footer') ? "max" : pos;

            if (!$('#' + hash).hasClass('vc_tta-panel')) {
              gsap.to(win, {
                duration: 1,
                scrollTo: {
                  y: pos,
                  autoKill: false
                }
              });
            }
            e.preventDefault();
          }
        });
      }
    },
    custom_scroll: {
      selector: '.custom_scroll',
      init: function() {
        var base = this,
          container = $(base.selector);

        container.each(function() {
          var _this = $(this),
            args = {
              suppressScrollX: true
            };

          if (_this.hasClass('portfolio-show-all')) {
            args = {
              suppressScrollX: false,
              suppressScrollY: true
            };
          }
          if (typeof PerfectScrollbar !== "undefined") {
            var ps = new PerfectScrollbar(_this[0], args);

            if (_this.attr('id') === 'menu-scroll') {
              SITE.menuscroll = ps;
            }
          }

        });

      }
    },
    freeScroll: {
      selector: '.thb-freescroll',
      init: function() {
        var base = this,
          container = $(base.selector);


        container.each(function() {
          var _this = $(this),
            direction = _this.data('direction'),
            pause_on_hover = _this.data('pause'),
            args = {
              prevNextButtons: false,
              wrapAround: true,
              pageDots: false,
              freeScroll: true,
              adaptiveHeight: true,
              imagesLoaded: true
            };
          _this.flickity(args);

          var flkty = _this.data('flickity');

          flkty.paused = true;

          function loop() {
            if (direction === 'thb-left-to-right') {
              flkty.x++;
            } else {
              flkty.x--;
            }


            flkty.integratePhysics();
            flkty.settle(flkty.x);

            if (!flkty.paused) {
              flkty.raf = window.requestAnimationFrame(loop);
            }
          }

          function pause() {
            if (!thb_md.mobile() && !thb_md.tablet()) {
              flkty.paused = true;
            }
          }

          function play() {
            if (!thb_md.mobile() && !thb_md.tablet()) {
              flkty.paused = false;
              loop();
            }
          }
          if (pause_on_hover) {
            container.on('mouseenter', function() {
              pause();
            }).on('mouseleave', function() {
              play();
            });
          }

          win.on('scroll.flkty', function(e) {
            if (_this.is(':in-viewport')) {
              if (flkty.paused) {
                flkty.paused = false;
                loop(flkty);
              }
            } else {
              flkty.paused = true;
            }
          }).trigger('scroll.flkty');

        });

      }
    },
    // skrollr: {
    // 	selector: '.parallax_bg',
    // 	init: function() {
    // 		var args = {
    // 					forceHeight: false,
    // 					easing: thb_ease,
    // 					mobileCheck: function() {
    // 						return false;
    // 					}
    // 				};
    //     if (typeof(vcParallaxSkroll) !== 'undefined' && vcParallaxSkroll ) {
    //       vcParallaxSkroll.refresh();
    //     }	else {
    //       window.skroller = skrollr.init(args);
    //     }
    // 	}
    // },
    jarallax: {
      selector: '.parallax',
      init: function(el) {
        var base = this,
          container = el ? el : $(base.selector);

        container.each(function() {
          var _this = $(this),
            args = {
              speed: 0.8
            },
            imgElement = '.parallax_bg';

          if (!_this.find('.parallax_bg').length) {
            imgElement = '.lazyload';
          }
          args.imgElement = imgElement;
          _this.jarallax(args);
        });
      }
    },
    postShortcodeLoadmore: {
      selector: '.posts-pagination-style2',
      init: function() {
        var base = this,
          container = $(base.selector);

        container.each(function() {
          var _this = $(this),
            security = _this.data('security'),
            load_more = $(_this.data('loadmore')),
            thb_loading = false,
            page = 2;

          load_more.on('click', function() {
            var loadmore = $(this),
              id = loadmore.data('posts-id'),
              text = loadmore.text(),
              pajax = ('thb_postsajax_' + id),
              count = window[pajax].count,
              loop = window[pajax].loop,
              style = window[pajax].style,
              columns = window[pajax].columns;

            if (thb_loading === false) {
              loadmore.prop('title', themeajax.l10n.loading);
              loadmore.text(themeajax.l10n.loading).addClass('loading');
              thb_loading = true;
              $.ajax(themeajax.url, {
                method: 'POST',
                data: {
                  action: 'thb_posts_ajax',
                  security: security,
                  page: page++,
                  loop: loop,
                  columns: columns,
                  style: style,
                },
                beforeSend: function() {
                  thb_loading = true;
                },
                success: function(data) {
                  var d = $.parseHTML($.trim(data)),
                    l = d ? d.length : 0;

                  if (data === '' || data === 'undefined' || data === 'No More Posts' || data === 'No $args array created') {
                    loadmore.html(themeajax.l10n.nomore).removeClass('loading').off('click');
                  } else {

                    $(d).appendTo(_this).hide().imagesLoaded(function() {
                      if (_this.data('isotope')) {
                        _this.isotope('appended', $(d));
                      }
                      $(d).show();
                      var animate = $(d).find('.animation').length ? $(d).find('.animation') : $(d).filter(function() {
                        return this.nodeType === 1;
                      });
                      gsap.to(animate, {
                        duration: 0.5,
                        autoAlpha: 1,
                        x: 0,
                        y: 0,
                        z: 0,
                        rotationZ: '0deg',
                        rotationX: '0deg',
                        rotationY: '0deg',
                        stagger: 0.15,
                        onComplete: function() {
                          thb_loading = false;
                        }
                      });
                    });

                    if (l < count) {
                      loadmore.html(themeajax.l10n.nomore).removeClass('loading');
                    } else {
                      loadmore.html(text).removeClass('loading');
                    }
                  }
                }
              });
            }
            return false;
          });
        });
      }
    },
    paginationStyle2: {
      selector: '.pagination-style2',
      init: function() {
        var base = this,
          container = $(base.selector),
          security = container.data('security'),
          load_more = $('.thb_load_more'),
          thb_loading = false,
          page = 2;

        load_more.on('click', function() {
          var _this = $(this),
            text = _this.text(),
            count = _this.data('count');

          if (thb_loading === false) {
            _this.html('<span>' + themeajax.l10n.loading + '</span>').addClass('loading');

            $.ajax(themeajax.url, {
              method: 'POST',
              data: {
                action: 'thb_blog_ajax',
                page: page++,
                security: security,
              },
              beforeSend: function() {
                thb_loading = true;
              },
              success: function(data) {
                thb_loading = false;
                var d = $.parseHTML($.trim(data)),
                  l = d ? d.length : 0;

                if (data === '' || data === 'undefined' || data === 'No More Posts' || data === 'No $args array created') {
                  _this.html('<span>' + themeajax.l10n.nomore + '</span>').removeClass('loading').off('click');
                } else {

                  $(d).appendTo(container).hide().imagesLoaded(function() {
                    if (container.data('isotope')) {
                      container.isotope('appended', $(d));
                    }
                    $(d).show();
                    gsap.fromTo($(d), {
                      opacity: 0,
                      y: 30
                    }, {
                      duration: 0.5,
                      y: 0,
                      opacity: 1,
                      stagger: 0.25
                    });
                  });

                  if (l < count) {
                    _this.html('<span>' + themeajax.l10n.nomore + '</span>').removeClass('loading');
                  } else {
                    _this.html('<span>' + text + '</span>').removeClass('loading');
                  }
                }
              }
            });
          }
          return false;
        });
      }
    },
    paginationStyle3: {
      selector: '.pagination-style3',
      init: function() {
        var base = this,
          container = $(base.selector),
          security = container.data('security'),
          page = 2,
          thb_loading = false,
          count = container.data('count'),
          preloader = container.parents('.blog-container').find('.thb-preloader');

        var scrollFunction = _.debounce(function() {

          if (thb_loading === false) {
            if (preloader.length) {
              gsap.set(preloader, {
                autoAlpha: 1
              });
            }
            $.ajax(themeajax.url, {
              method: 'POST',
              data: {
                action: 'thb_blog_ajax',
                page: page++,
                security: security,
              },
              beforeSend: function() {
                thb_loading = true;
              },
              success: function(data) {
                thb_loading = false;
                var d = $.parseHTML($.trim(data)),
                  l = d ? d.length : 0;
                if (preloader.length) {
                  gsap.to(preloader, {
                    duration: 0.25,
                    autoAlpha: 0
                  });
                }
                if (data === '' || data === 'undefined' || data === 'No More Posts' || data === 'No $args array created' || !$(d).length) {
                  win.off('scroll', scrollFunction);
                } else {
                  $(d).appendTo(container).hide().imagesLoaded(function() {
                    if (container.data('isotope')) {
                      container.isotope('appended', $(d));
                    }
                    $(d).show();
                    gsap.from($(d), {
                      duration: 0.5,
                      y: 30,
                      opacity: 0,
                      stagger: 0.25
                    });
                  });

                  if (l >= count) {
                    win.on('scroll', scrollFunction);
                  }
                }
              }
            });
          }
        }, 30);

        win.scroll(scrollFunction);
      }
    },
    isotope: {
      selector: '.masonry',
      init: function() {
        var base = this,
          container = $(base.selector),
          header = $('.logo-holder', '.header'),
          ah = adminbar.outerHeight() || 0;

        Outlayer.prototype._setContainerMeasure = function(measure, isWidth) {
          if (measure === undefined) {
            return;
          }
          var elemSize = this.size;
          // add padding and border width if border box
          if (elemSize.isBorderBox) {
            measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight +
              elemSize.borderLeftWidth + elemSize.borderRightWidth :
              elemSize.paddingBottom + elemSize.paddingTop +
              elemSize.borderTopWidth + elemSize.borderBottomWidth;
          }

          measure = Math.max(measure, 0);
          measure = Math.floor(measure);
          this.element.style[isWidth ? 'width' : 'height'] = measure + 'px';
        };

        container.each(function(index) {
          var _this = $(this),
            security = _this.data('security'),
            layoutMode = _this.data('layoutmode') ? _this.data('layoutmode') : 'masonry',
            preload = _this.data('preload') === 'nobg' ? false : '.thb-placeholder',
            variable_height = _this.hasClass('variable-height'),
            el = _this.find('.columns'),
            animation = _this.data('thb-animation'),
            animationspeed = _this.data('thb-animation-speed') ? _this.data('thb-animation-speed') : 0.5,
            preloader = _this.find('.thb-preloader:not(.detail)'),
            loadmore = $(_this.data('loadmore')),
            page = 2,
            args = {
              layoutMode: layoutMode,
              percentPosition: true,
              itemSelector: '.columns',
              transitionDuration: 0,
              originLeft: !body.hasClass('rtl'),
              hiddenStyle: {},
              visibleStyle: {},
            },
            org,
            items,
            filters = $('#' + _this.data('filter') + ''),
            menu_filter = _this.hasClass('thb-filter-style4'),
            args_in,
            args_out,
            in_speed = animationspeed,
            out_speed = in_speed / 2,
            stagger_speed = in_speed / 5,
            grid_type = _this.data('grid_type'),
            large_items = $('.masonry-large', _this),
            tall_items = $('.masonry-tall', _this),
            small_items = $('.masonry-small', _this),
            wide_items = $('.masonry-wide', _this),
            all_items = $('.columns', _this),
            thb_loading = false,
            filter_selector,
            filter_function = function() {
              _this.isotope({
                filter: filter_selector
              });
            };

          /* Animation Args */
          if (animation === 'thb-fade') {
            args_in = {
              opacity: 1
            };
            args_out = {
              opacity: 0
            };
          } else if (animation === 'thb-scale') {
            args_in = {
              opacity: 1,
              scale: 1
            };
            args_out = {
              opacity: 0,
              scale: 0
            };
          } else if (animation === 'thb-reveal-left') {
            in_speed = 1;
            out_speed = 0.5;
            stagger_speed = 0.3;
            args_in = {
              clipPath: "polygon(100% 0, 0 0, 0 100%, 100% 100%)"
            };
            args_out = {
              clipPath: "polygon(0% 0, 0 0, 0 100%, 0% 100%)"
            };
          } else if (animation === 'thb-none') {
            in_speed = out_speed = 0;
            stagger_speed = 0;
            args_in = {
              opacity: 1
            };
            args_out = {
              opacity: 0
            };
          } else {
            args_in = {
              y: 0,
              opacity: 1
            };
            args_out = {
              y: 30,
              opacity: 0
            };
          }
          args_in.duration = in_speed;
          args_out.duration = out_speed;
          args_in.stagger = stagger_speed;
          args_out.stagger = stagger_speed;
          args_out.onComplete = filter_function;

          /* Load More */
          loadmore.on('click', function() {
            var text = loadmore.text(),
              i = portfolioajax.i,
              aspect = portfolioajax.aspect,
              columns = portfolioajax.columns,
              style = portfolioajax.style,
              masonry_layout = portfolioajax.masonry_layout,
              count = portfolioajax.count,
              loop = portfolioajax.loop,
              hover_style = portfolioajax.hover_style,
              title_position = portfolioajax.title_position,
              animation_style = portfolioajax.animation_style;

            loadmore.prop('title', themeajax.l10n.loading);
            loadmore.find('span').text(themeajax.l10n.loading).addClass('loading');

            $.post(themeajax.url, {
              action: 'thb_ajax',
              security: security,
              loop: loop,
              i: i,
              aspect: aspect,
              columns: columns,
              masonry_layout: masonry_layout,
              style: style,
              page: page,
              hover_style: hover_style,
              title_position: title_position,
              animation_style: animation_style

            }, function(data) {

              page++;
              var d = $.parseHTML($.trim(data)),
                l = d ? d.length : 0;

              if (data === '' || data === 'undefined' || data === 'No More Posts' || data === 'No $args array created') {
                loadmore.prop('title', themeajax.l10n.nomore);
                loadmore.find('span').text(themeajax.l10n.nomore).removeClass('loading').off('click');
              } else {
                var added = $(d);
                added.imagesLoaded(function() {

                  added.appendTo(_this).hide();

                  _this.isotope('appended', added);

                  added.show();

                  if (added.find('.mfp-image').length) {
                    SITE.magnificImage.init();
                  }
                  if (added.find('.mfp-video').length) {
                    SITE.magnificVideo.init();
                  }
                  if (l < count) {
                    loadmore.prop('title', themeajax.l10n.nomore);
                    loadmore.find('span').text(themeajax.l10n.nomore).removeClass('loading');
                  } else {
                    loadmore.prop('title', text);
                    loadmore.find('span').text(text).removeClass('loading');
                  }
                });
              }

            });
            return false;
          });

          /* Variable Heights */
          function getGutter() {
            var ml = parseInt(_this.css('marginLeft'), 10);
            return Math.abs(ml);
          }

          function resizeVariables() {
            var gutter = getGutter(),
              imgselector = '.wp-post-image:not(.thb_3dimage)';


            if (large_items.length) {
              large_items.find(imgselector).height(function() {
                var height = parseInt(large_items.eq(0).outerHeight(), 10);
                return height + 'px';
              });

              if (tall_items.length) {
                tall_items.find(imgselector).height(function() {
                  var height = large_items.eq(0).outerHeight();
                  return height + 'px';
                });
              }
              if (small_items.length) {
                small_items.find(imgselector).height(function() {
                  var height = (large_items.eq(0).outerHeight() / 2) - gutter;
                  return height + 'px';
                });
              }
              if (wide_items.length) {
                wide_items.find(imgselector).height(function() {
                  var height = (large_items.eq(0).outerHeight() / 2) - gutter;
                  return height + 'px';
                });
              }
            } else if (tall_items.length) {
              tall_items.find(imgselector).height(function() {
                var height = parseInt(tall_items.eq(0).outerHeight(), 10);
                return height + 'px';
              });
              if (small_items.length) {
                small_items.find(imgselector).height(function() {
                  var height = (tall_items.eq(0).outerHeight() / 2) - gutter;
                  return height + 'px';
                });
              }
              if (wide_items.length) {
                wide_items.find(imgselector).height(function() {
                  var height = (tall_items.eq(0).outerHeight() / 2) - gutter;
                  return height + 'px';
                });
              }
            } else if (wide_items.length) {
              if (wide_items.length) {
                wide_items.find(imgselector).height(function() {
                  var height = small_items.eq(0).outerHeight();
                  return height + 'px';
                });
              }
            }
          }

          if (variable_height) {
            resizeVariables();
            win.on('resize.variables', function() {
              resizeVariables();
            });
            $doc.on('lazyloaded', function(e) {
              win.trigger('resize.variables');
            });
            all_items.find('.wp-post-image.lazyload:not(.thb_3dimage)').on('load', function() {
              _this.isotope('layout');
            });
          }

          /* Scroll Animation */
          var elms;
          win.on('scroll.masonry-animation', _.debounce(function(e, addeditems) {
            var to_filter = addeditems ? addeditems : elms;
            items = $(to_filter).filter(':in-viewport').filter(function() {
              return $(this).data('thb-in-viewport') === undefined || $(this).data('thb-in-viewport') === false;
            });
            if (!items.length) {
              return;
            }
            items.addClass('thb-added');
            gsap.to(items.find('.portfolio-holder'), args_in);
          }, 20)).trigger('scroll.masonry-animation');

          _this.on('layoutComplete', function(e, addeditems) {
            elms = _.map(addeditems, 'element');

            win.trigger('scroll.masonry-animation', [elms]);
            win.trigger('resize');
          }).isotope(args); // end layoutComplete


          /* Filter - Header Animation */
          if (filters.length) {
            if (filters.hasClass('style1')) {
              header.append(filters);
              gsap.set(filters, {
                autoAlpha: 0,
                display: 'none'
              });

              var filter_check = _.debounce(function() {
                if (win.scrollTop() + ah >= _this.offset().top - $('.header').outerHeight() && win.scrollTop() <= (_this.offset().top + _this.outerHeight() - $('.header').outerHeight() - ah)) {
                  if ((win.width() > 1025)) {
                    gsap.to(filters, {
                      duration: 0.5,
                      autoAlpha: 1,
                      display: 'inline-flex'
                    });
                  } else {
                    gsap.to(filters, {
                      duration: 0.5,
                      autoAlpha: 0,
                      display: 'none'
                    });
                  }
                } else {
                  gsap.to(filters, 0.5, {
                    duration: 0.5,
                    autoAlpha: 0,
                    display: 'none'
                  });
                }
              }, 10);
              win.scroll(filter_check);
              win.resize(filter_check);
            }
          }

          /* Filters */
          function thb_animate_out() {
            var items_out = $(_this.isotope('getFilteredItemElements')).find('.portfolio-holder');

            if (items_out.length) {
              items_out.removeClass('thb-added');
              items_out.data('thb-in-viewport', false);
              gsap.to(items_out, args_out);
            } else {
              filter_function();
            }
          }
          if (filters.length || menu_filter) {
            var a = menu_filter ? $('.full-menu a[data-filter]').add($('.thb-mobile-menu a[data-filter]')) : filters.find('a');

            a.on('click', function() {
              var _that = $(this);

              filter_selector = _that.data('filter');

              a.not(_that).removeClass('active');

              if (!_that.hasClass('active')) {
                _that.addClass('active');
              } else {
                _that.removeClass('active');
                filter_selector = '*';
                a.filter('[data-filter="*"]').addClass('active');
              }

              thb_animate_out();
              return false;
            });
          }

          /* Images Loaded */
          _this.imagesLoaded(function() {
            if (preloader.length) {
              gsap.to(preloader, {
                duration: 0.25,
                autoAlpha: 0
              });
            }
            SITE.style6hover.start();
            _this.addClass('thb-loaded');
            _this.isotope('layout');
          });

          if (_this.parents('.vc_tta').length) {
            $("[data-vc-accordion]").on("show.vc.accordion", function(e) {
              _this.isotope('layout');
            });
          }
        });
      }
    },
    headerFilter: {
      selector: '.thb-portfolio-filter, .thb-portfolio-share',
      init: function() {
        var base = this,
          container = $(base.selector);

        container.each(function() {
          var _this = $(this),
            a = _this.find('li>a, li>span'),
            tl = gsap.timeline({
              paused: true
            }),
            port = _this.hasClass('thb-portfolio-share'),
            time = port ? 0.1 : 0.2,
            nav = $('nav.full-menu', '.header');

          tl
            .to(a, {
              duration: time,
              x: '0%',
              stagger: time - 0.05
            });

          if (_this.hasClass('thb-portfolio-filter') && _this.hasClass('style1') && nav.length && !$('.header').hasClass('style3')) {
            tl.
            to(nav, {
              duration: 1,
              opacity: 0
            }, 0);
          }
          if (port) {
            a.on('click', function() {
              a.removeClass('active');
              $(this).addClass('active');
            });
          }
          _this.hoverIntent(
            function() {
              if (!_this.hasClass('alt')) {
                tl.timeScale(1).play();
              }
            },
            function() {
              if (!_this.hasClass('alt')) {
                tl.timeScale(2).reverse();
              }
            }
          );
        });
      }
    },
    gradientFillHover: {
      selector: '.type-portfolio.thb-gradient-fill-hover',
      init: function() {
        var base = this,
          container = $(base.selector);

        container.each(function() {
          var _this = $(this),
            target = $('.thb-gradient-fill', _this),
            rel = $('.portfolio-link', _this),
            style2 = _this.hasClass('style2'),
            h = ((_this.outerHeight() - rel.outerHeight() - 10) / _this.outerHeight()) * 100 + '%';
          _this.hoverIntent(function() {
            gsap.to(target, {
              duration: 0.25,
              easing: Linear,
              clipPath: function() {
                if (style2) {
                  return 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
                } else {
                  return 'polygon(0% ' + h + ', 100% ' + h + ', 100% 100%, 0% 100%)';
                }
              }
            });
          }, function() {
            gsap.to(target, {
              duration: 0.25,
              easing: Linear,
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
            });
          });
        });
      }
    },
    verticalDeck: {
      selector: '.vertical-deck',
      pageIndex: 0,
      init: function() {
        var base = this,
          container = $(base.selector),
          pagi = $('.swiper-pagination'),
          active = $('.swiper-pagination-current', pagi);

        container.curtain({
          prevSlide: function() {
            if (!thb_md.mobile()) {
              active.html($('.vertical-page.current').index() + 1);
            }
          },
          nextSlide: function() {
            if (!thb_md.mobile()) {
              active.html($('.vertical-page.current').index() + 1);
            }
          }
        });

      }
    },
    videoPlayButton: {
      selector: '.thb_video_play_button_enabled',
      init: function() {
        var base = this,
          container = $(base.selector);

        container.each(function() {
          var _this = $(this),
            button = _this.find('.thb_video_play'),
            icon = $('svg', button),
            instance = _this.data("vide");

          if (instance) {
            var video = instance.getVideoObject();


            if (button) {
              button.on('click', function() {
                if (video) {
                  if (video.paused) {
                    _this.addClass('thb_video_active');
                    video.play();
                    icon.addClass('playing');
                  } else {
                    _this.removeClass('thb_video_active');
                    video.pause();
                    icon.removeClass('playing');
                  }
                }
                return false;
              });
            }
          }
        });
      }
    },
    portfolio_video: {
      selector: '.thb-video-item',
      init: function(el) {
        var base = this,
          container = el ? el : $(base.selector);

        container.each(function() {
          var _this = $(this),
            video = _this.find('.thb-portfolio-video').data('vide');

          if (video) {
            video = video.getVideoObject();
            video.currentTime = 0.15;
          }
          _this.hoverIntent(
            function() {
              if (video) {
                video.currentTime = 0.15;
                video.play();
              }
            },
            function() {
              if (video) {
                video.pause();
                video.currentTime = 0.15;
              }
            }
          );
        });
      }
    },
    slick: {
      selector: '.slick',
      init: function(el) {
        var base = this,
          container = el ? el : $(base.selector);

        container.each(function() {
          var that = $(this),
            data_columns = that.data('columns'),
            thb_columns = data_columns.length > 2 ? parseInt(data_columns.substr(data_columns.length - 1)) : data_columns,
            children = that.find('.columns'),
            columns = data_columns.length > 2 ? (thb_columns === 5 ? 5 : (12 / thb_columns)) : data_columns,
            fade = (that.data('fade') ? true : false),
            navigation = (that.data('navigation') === true ? true : false),
            autoplay = (that.data('autoplay') === true ? true : false),
            pagination = (that.data('pagination') === true ? true : false),
            center = (that.data('center') ? (((children.length > columns) && (columns % 2)) ? that.data('center') : false) : false),
            infinite = (that.data('infinite') === false ? false : true),
            autoplay_speed = that.data('autoplay-speed') ? that.data('autoplay-speed') : 4000,
            asNavFor = that.data('asnavfor'),
            rtl = body.hasClass('rtl');

          if (data_columns.length > 2 && thb_columns === 8) {
            columns = 8;
          }

          var args = {
            dots: pagination,
            arrows: navigation,
            infinite: infinite,
            speed: 1000,
            fade: fade,
            centerPadding: 0,
            centerMode: center,
            slidesToShow: columns,
            slidesToScroll: 1,
            rtl: rtl,
            cssEase: thb_css_ease,
            autoplay: autoplay,
            autoplaySpeed: autoplay_speed,
            pauseOnHover: true,
            accessibility: true,
            focusOnSelect: true,
            prevArrow: '<button type="button" class="slick-nav slick-prev"><span><svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="thb-arrow" x="0" y="0" width="16.7" height="11.3" viewBox="0 0 16.7 11.3" enable-background="new 0 0 16.664 11.289" xml:space="preserve"><polygon fill-rule="evenodd" clip-rule="evenodd" points="0 5.6 1.4 4.2 1.4 4.2 5.7 0 7.1 1.4 3.8 4.7 16.7 4.7 16.7 6.7 3.9 6.7 7.1 9.9 5.7 11.3 1.4 7.1 1.4 7.1 0 5.7 0 5.6 "/></svg></span></button>',
            nextArrow: '<button type="button" class="slick-nav slick-next"><span><svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="thb-arrow" x="0" y="0" width="16.7" height="11.3" viewBox="0 0 16.7 11.3" enable-background="new 0 0 16.664 11.289" xml:space="preserve"><polygon fill-rule="evenodd" clip-rule="evenodd" points="16.7 5.6 15.3 4.2 15.2 4.2 11 0 9.6 1.4 12.9 4.7 0 4.7 0 6.7 12.8 6.7 9.6 9.9 11 11.3 15.2 7.1 15.3 7.1 16.7 5.7 16.7 5.6 "/></svg></span></button>',
            responsive: [{
                breakpoint: 1025,
                settings: {
                  slidesToShow: (columns < 3 ? columns : 3)
                }
              },
              {
                breakpoint: 780,
                settings: {
                  slidesToShow: (columns < 2 ? columns : 2)
                }
              },
              {
                breakpoint: 640,
                settings: {
                  slidesToShow: 1,
                }
              }
            ]
          };
          if (that.hasClass('thb-floating-portfolio-slider')) {
            args.pauseOnHover = false;
            args.pauseOnFocus = false;
            args.speed = 400;
            that.on('beforeChange', function(e, slick, currentSlide) {
              var thb_currentSlide = slick.$slides[currentSlide],
                progress = $(thb_currentSlide).find('.thb-floating-progress>span');
              gsap.set(progress, {
                scaleX: 0
              });
            });
            that.on('init afterChange', function(e, slick) {
              var thb_currentSlide = slick.$slides[slick.currentSlide],
                progress = $(thb_currentSlide).find('.thb-floating-progress>span');
              gsap.fromTo(progress, {
                scaleX: 0
              }, {
                duration: autoplay_speed / 1000,
                scaleX: 1
              });
            });
          }
          if (asNavFor && $(asNavFor).is(':visible')) {
            args.asNavFor = asNavFor;
          }
          if (that.data('fade')) {
            args.fade = true;
          }
          if (that.hasClass('thb-client-carousel')) {
            args.adaptiveHeight = true;
          }
          if (that.hasClass('product-thumbnails')) {
            args.responsive = false;
          }
          if (center) {
            that.on('init', function() {
              that.addClass('centered');
            });
          }
          that.slick(args);

        });
      }
    },
    floatingPortfolio: {
      selector: '.thb-floating-portfolio',
      init: function() {
        var base = this,
          container = $(base.selector),
          footer = $('#footer');

        if (!footer.length) {
          return;
        }
        win.on('scroll.floating-portfolio', function() {
          var h = footer.outerHeight();
          if ((win.scrollTop() + win.height() + 150) > ($doc.height() - h)) {
            container.addClass('thb-floating-hidden');
          } else {
            container.removeClass('thb-floating-hidden');
          }

        }).trigger('scroll.floating-portfolio');
      }
    },
    magnificInline: {
      selector: '.mfp-inline',
      init: function() {
        var base = this,
          container = $(base.selector);

        container.magnificPopup({
          tClose: themeajax.l10n.lightbox_close,
          type: 'inline',
          fixedContentPos: false,
          tLoading: themeajax.l10n.lightbox_loading,
          mainClass: 'mfp-zoom-in',
          removalDelay: 400,
          closeBtnInside: false,
          callbacks: {
            imageLoadComplete: function() {
              var _this = this;
              _.delay(function() {
                _this.wrap.addClass('mfp-image-loaded');
              }, 10);
            },
            beforeOpen: function() {
              this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
            }
          }
        });

      }
    },
    magnificGallery: {
      selector: '.mfp-gallery, .post-content .gallery',
      init: function(el) {
        var base = this,
          container = el ? el : $(base.selector);

        container.each(function() {
          var _this = $(this),
            delegate = 'a';
          if (_this.hasClass('vc_grid-container')) {
            delegate = 'a.mfp-image';
          }
          _this.magnificPopup({
            tClose: themeajax.l10n.lightbox_close,
            delegate: delegate,
            type: 'image',
            tLoading: themeajax.l10n.lightbox_loading,
            mainClass: 'mfp-zoom-in',
            removalDelay: 400,
            fixedContentPos: false,
            gallery: {
              enabled: true,
              arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir% mfp-prevent-close thb-animated-arrow circular">' + themeajax.svg.prev_arrow + '</button>',
              tPrev: themeajax.l10n.prev_arrow_key,
              tNext: themeajax.l10n.next_arrow_key,
              tCounter: '<span class="mfp-counter">' + themeajax.l10n.of + '</span>'
            },
            image: {
              verticalFit: true,
              titleSrc: function(item) {
                return item.img.attr('alt');
              }
            },
            callbacks: {
              imageLoadComplete: function() {
                var _this = this;
                _.delay(function() {
                  _this.wrap.addClass('mfp-image-loaded');
                }, 10);
              },
              beforeOpen: function() {
                this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
              },
              open: function() {
                $.magnificPopup.instance.next = function() {
                  var _this = this;
                  _this.wrap.removeClass('mfp-image-loaded');

                  setTimeout(function() {
                    $.magnificPopup.proto.next.call(_this);
                  }, 125);
                };

                $.magnificPopup.instance.prev = function() {
                  var _this = this;
                  this.wrap.removeClass('mfp-image-loaded');

                  setTimeout(function() {
                    $.magnificPopup.proto.prev.call(_this);
                  }, 125);
                };
              }
            }
          });
        });

      }
    },
    magnificImage: {
      selector: '.mfp-image:not(.thb-portfolio-link)',
      init: function() {
        var base = this,
          container = $(base.selector),
          groups = [],
          groupNames = [],
          args = {
            tClose: themeajax.l10n.lightbox_close,
            type: 'image',
            mainClass: 'mfp-zoom-in',
            tLoading: themeajax.l10n.lightbox_loading,
            removalDelay: 400,
            fixedContentPos: false,
            callbacks: {
              imageLoadComplete: function() {
                var _this = this;
                _.delay(function() {
                  _this.wrap.addClass('mfp-image-loaded');
                }, 10);
              },
              beforeOpen: function() {
                this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
              }
            }
          },
          gallery_args = {
            tClose: themeajax.l10n.lightbox_close,
            type: 'image',
            tLoading: themeajax.l10n.lightbox_loading,
            mainClass: 'mfp-zoom-in',
            removalDelay: 400,
            fixedContentPos: false,
            gallery: {
              enabled: true,
              arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir% mfp-prevent-close thb-animated-arrow circular">' + themeajax.svg.prev_arrow + '</button>',
              tPrev: themeajax.l10n.prev_arrow_key,
              tNext: themeajax.l10n.next_arrow_key,
              tCounter: '<span class="mfp-counter">' + themeajax.l10n.of + '</span>'
            },
            image: {
              verticalFit: true,
              titleSrc: function(item) {
                return item.img.attr('alt');
              }
            },
            callbacks: {
              imageLoadComplete: function() {
                var _this = this;
                _.delay(function() {
                  _this.wrap.addClass('mfp-image-loaded');
                }, 10);
              },
              beforeOpen: function() {
                this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
              },
              open: function() {
                $.magnificPopup.instance.next = function() {
                  var _this = this;
                  _this.wrap.removeClass('mfp-image-loaded');

                  setTimeout(function() {
                    $.magnificPopup.proto.next.call(_this);
                  }, 125);
                };

                $.magnificPopup.instance.prev = function() {
                  var _this = this;
                  this.wrap.removeClass('mfp-image-loaded');

                  setTimeout(function() {
                    $.magnificPopup.proto.prev.call(_this);
                  }, 125);
                };
              }
            }
          };

        container.each(function() {
          var _this = $(this),
            groupID = _this.data('thb-group');

          if (groupID && groupID !== '') {
            groupNames.push(groupID);
          } else {
            if (_this.parents('.vc_grid-container').length) {
              return;
            }
            container.magnificPopup(args);
          }
        });
        var uniq_groups = _.uniq(groupNames);
        $.each(uniq_groups, function(key, value) {
          groups.push($('.mfp-image[data-thb-group="' + value + '"]'));
        });
        if (uniq_groups.length) {
          $.each(groups, function(key, value) {
            var _gallery = value;
            _gallery.magnificPopup(gallery_args);
          });
        }

      }
    },
    magnificVideo: {
      selector: '.mfp-video',
      init: function() {
        var base = this,
          container = $(base.selector);

        container.magnificPopup({
          tClose: themeajax.l10n.lightbox_close,
          type: 'iframe',
          tLoading: themeajax.l10n.lightbox_loading,
          mainClass: 'mfp-zoom-in',
          removalDelay: 400,
          fixedContentPos: false
        });
      }
    },
    vcMediaGrid: {
      selector: '.vc_grid-container',
      init: function() {
        var base = this,
          container = $(base.selector);

        $(window).on('grid:items:added', function(e, el) {
          $(el).each(function() {
            var _this = $(this);
            if (_this.find('.mfp-image').length && !_this.hasClass('mfp-gallery')) {
              _this.addClass('mfp-gallery');
            }

            SITE.magnificGallery.init(_this);
          });

        });
      }
    },
    onePage: {
      selector: '#thb_fullscreen_rows',
      init: function() {
        var base = this,
          container = $(base.selector),
          animationspeed = 1150,
          footer = $('.footer-container'),
          elementor_wrap = $('.elementor-section-wrap'),
          names = [],
          anchors = [];

        SITE.fullPageEnabled = true;
        if (footer.length) {
          footer.appendTo(container);
        }
        $('>.wpb_row, .elementor-section', container).each(function() {
          var _this = $(this),
            anchor = _this.data('onepage-anchor') ? _this.data('onepage-anchor') : '';

          _this.find('.wpb_row').removeClass('wpb_row');
          anchors.push(anchor);
          names.push(_this.data('row-title'));
        });
        if (elementor_wrap.length) {
          $('.fullpage-wrapper').attr('id', false);
          elementor_wrap.attr('id', 'thb_fullscreen_rows');
          elementor_wrap.addClass('fullpage-wrapper');
          container = elementor_wrap;
        }
        container.fullpage({
          licenseKey: 'ED50BABA-C5C44874-87F06876-A9535AB5',
          sectionSelector: '.wpb_row, .elementor-section',
          navigation: true,
          scrollingSpeed: animationspeed,
          anchors: anchors,
          touchSensitivity: 15,
          scrollOverflow: true,
          scrollOverflowOptions: {
            click: false,
            preventDefaultException: {
              tagName: /.*/
            }
          },
          navigationPosition: body.hasClass('rtl') ? 'left' : 'right',
          navigationTooltips: names,
          afterLoad: function(origin, destination, direction) {
            var firstRow = $('.wpb_row.fp-section:eq(' + destination.index + ')', container),
              color = firstRow.data('midnight');

            SITE.animation.container(firstRow);
            var ins = firstRow.data('vide');
            if (ins) {
              ins.getVideoObject().play();
              ins.resize();
            }
            if (color && !body.hasClass(color)) {
              body.removeClass('light-title').removeClass('dark-title').addClass(color);
            }
            container.imagesLoaded(function() {
              $.fn.fullpage.reBuild();
            });
            win.trigger('scroll resize');
          },
          onLeave: function(origin, destination, direction) {
            var currentRow = $('.wpb_row.fp-section:eq(' + origin.index + ')', container),
              nextRow = $('.wpb_row.fp-section:eq(' + destination.index + ')', container),
              color = nextRow.data('midnight'),
              dir = direction === 'down' ? 1 : -1;


            function animateSlide(dir) {
              gsap
                .to(currentRow, {
                  duration: animationspeed / 1000,
                  y: (dir * 50) + '%',
                  ease: thb_ease,
                  clearProps: "all"
                });
            }

            if (currentRow.data('vide')) {
              currentRow.data('vide').getVideoObject().pause();
              currentRow.data('vide').resize();
            }

            if (direction === 'down') {
              if (!nextRow.hasClass('footer-container')) {
                animateSlide(dir);
              } else {
                currentRow.addClass('before-footer');
              }
            } else {
              if (!nextRow.hasClass('before-footer')) {
                animateSlide(dir);
              }
            }
            var ins = nextRow.data('vide');
            if (ins) {
              ins.getVideoObject().play();
              ins.resize();
            }
            _.delay(function() {
              SITE.animation.container(nextRow);
              currentRow.removeClass('active');

              if (nextRow.find('.masonry')) {
                nextRow.find('.masonry').isotope('layout');
              }

              if (ins) {
                ins.getVideoObject().play();
              }
              nextRow.imagesLoaded(function() {
                $.fn.fullpage.reBuild();
              });
            }, animationspeed);

          }
        });
      }
    },
    shopLoading: {
      selector: '.post-type-archive-product ul.products.thb-main-products, .tax-product_cat ul.products.thb-main-products',
      thb_loading: false,
      scrollInfinite: false,
      href: false,
      init: function() {
        var base = this,
          container = $(base.selector),
          type = themeajax.settings.shop_product_listing_pagination;

        if ($('.woocommerce-pagination').length && (body.hasClass('post-type-archive-product') || body.hasClass('tax-product_cat'))) {
          if (type === 'style2') {
            base.loadButton(container);
          } else if (type === 'style3') {
            base.loadInfinite(container);
          }
        }
      },
      loadButton: function(container) {
        var base = this;

        $('.woocommerce-pagination').before('<div class="thb_load_more_container text-center"><a class="thb_load_more button">' + themeajax.l10n.loadmore + '</a></div>');

        if ($('.woocommerce-pagination a.next').length === 0) {
          $('.thb_load_more_container').addClass('is-hidden');
        }
        $('.woocommerce-pagination').hide();

        body.on('click', '.thb_load_more:not(.no-ajax)', function(e) {
          var _this = $(this);
          base.href = $('.woocommerce-pagination a.next').attr('href');


          if (base.thb_loading === false) {
            _this.html(themeajax.l10n.loading).addClass('loading');

            base.loadProducts(_this, container);
          }
          return false;
        });
      },
      loadInfinite: function(container) {
        var base = this;

        if ($('.woocommerce-pagination a.next').length === 0) {
          $('.thb_load_more_container').addClass('is-hidden');
        }
        $('.woocommerce-pagination').hide();

        base.scrollInfinite = _.debounce(function() {
          if ((base.thb_loading === false) && ((win.scrollTop() + win.height() + 150) >= (container.offset().top + container.outerHeight()))) {

            base.href = $('.woocommerce-pagination a.next').attr('href');
            base.loadProducts(false, container, true);
          }
        }, 30);

        win.on('scroll', base.scrollInfinite);
      },
      loadProducts: function(button, container, infinite) {
        var base = this;
        $.ajax(base.href, {
          method: 'GET',
          beforeSend: function() {
            base.thb_loading = true;

            if (infinite) {
              win.off('scroll', base.scrollInfinite);
            }
          },
          success: function(response) {
            var resp = $(response),
              products = resp.find('ul.products.thb-main-products li');

            $('.woocommerce-pagination').html(resp.find('.woocommerce-pagination').html());

            if (button) {
              if (!resp.find('.woocommerce-pagination .next').length) {
                button.html(themeajax.l10n.nomore_products).removeClass('loading').addClass('no-ajax');
              } else {
                button.html(themeajax.l10n.loadmore).removeClass('loading');
              }
            } else if (infinite) {
              if (resp.find('.woocommerce-pagination .next').length) {
                win.on('scroll', base.scrollInfinite);
              }
            }
            if (products.length) {
              products.addClass('will-animate').appendTo(container);
              gsap.set(products, {
                opacity: 0,
                y: 30
              });
              gsap.to(products, {
                duration: 0.3,
                y: 0,
                opacity: 1,
                stagger: 0.15
              });
            }
            base.thb_loading = false;
          }
        });
      }
    },
    fsStyle1: {
      selector: '.swiper-container.style1',
      init: function() {
        var base = this,
          container = $(base.selector),
          footer_style = container.data('footer-style'),
          active = false,
          paginationType = footer_style === 'footer_style2' ? 'bullets' : 'fraction',
          autoplay = container.data('autoplay') ? {
            delay: container.data('autoplay')
          } : false;

        // General Slider
        var params = {
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          speed: 1000,
          pagination: {
            el: '.swiper-pagination',
            type: paginationType,
            clickable: true,
            renderFraction: function(currentClass, totalClass) {
              return '<span class="' + currentClass + '"></span>' +
                ' - ' +
                '<span class="' + totalClass + '"></span>';
            },
            renderBullet: function(index, className) {
              function n(n) {
                return n > 9 ? "" + n : "0" + n;
              }
              return '<span class="' + className + '">' + n(index + 1) + '</span>';
            }
          },
          loop: true,
          autoplay: autoplay,
          effect: 'fade',
          direction: 'vertical',
          keyboard: {
            enabled: true
          },
          mousewheel: {
            forceToAxis: true
          },
          on: {
            init: function() {
              var i = this.activeIndex,
                color = this.slides.eq(i).data('color');

              if (!body.hasClass(color)) {
                body.removeClass('light-title dark-title').addClass(color);
              }
            },
            slideChangeTransitionStart: function() {
              var i = this.activeIndex,
                color = this.slides.eq(i).data('color');
              body.removeClass('light-title dark-title').addClass(color);
            }
          }
        };
        SITE.activeSlider = new Swiper(base.selector, params);
      }
    },
    fsStyle3: {
      selector: '.swiper-container.style3',
      init: function() {
        var base = this,
          container = $(base.selector),
          footer_style = container.data('footer-style'),
          paginationType = footer_style === 'footer_style2' ? 'bullets' : 'fraction',
          titles,
          autoplay = container.data('autoplay') ? {
            delay: container.data('autoplay')
          } : false;

        // General Slider
        var params = {
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          speed: 1000,
          pagination: {
            el: '.swiper-pagination',
            type: paginationType,
            clickable: true,
            renderFraction: function(currentClass, totalClass) {
              return '<span class="' + currentClass + '"></span>' +
                ' - ' +
                '<span class="' + totalClass + '"></span>';
            },
            renderBullet: function(index, className) {
              function n(n) {
                return n > 9 ? "" + n : "0" + n;
              }
              return '<span class="' + className + '">' + n(index + 1) + '</span>';
            }
          },
          loop: false,
          autoplay: autoplay,
          direction: 'vertical',
          keyboard: {
            enabled: true
          },
          mousewheel: true,
          on: {
            init: function() {
              titles = container.find('h1');

              titles.each(function(i, el) {
                var _this = $(el),
                  split = new SplitText(_this, {
                    type: "words,chars",
                    charsClass: "char"
                  }),
                  tl = gsap.timeline({
                    paused: true
                  });

                tl
                  .set(_this, {
                    display: 'flex'
                  })
                  .to(split.chars, {
                    duration: 1,
                    opacity: 1,
                    y: "0%",
                    stagger: 0.1
                  });

                _this.data('tl', tl);
                _this.css('font-size', parseInt(((100 / split.chars.length), 10)) * 1.5 + 'vw');

                if (i === 0) {
                  tl.play();
                }
              });
              var i = this.activeIndex,
                color = this.slides.eq(i).data('color');

              if (!body.hasClass(color)) {
                body.removeClass('light-title dark-title').addClass(color);
              }

            },
            slideChangeTransitionStart: function() {
              var previousSlide = this.slides.eq(this.previousIndex),
                activeSlide = this.slides.eq(this.activeIndex),
                is_light = activeSlide.hasClass('light-title'),
                body_color = is_light ? 'light-title' : 'dark-title',
                tl = activeSlide.find('h1').data('tl');


              titles.eq(this.previousIndex).data('tl').timeScale(2).reverse();
              titles.eq(this.activeIndex).data('tl').timeScale(1).play();

              body.removeClass('light-title dark-title').addClass(body_color);
            }
          }
        };
        SITE.activeSlider = new Swiper(base.selector, params);
      }
    },
    fsStyle4: {
      selector: '.swiper-container.style4',
      init: function() {
        var base = this,
          container = $(base.selector),
          footer_style = container.data('footer-style'),
          paginationType = footer_style === 'footer_style2' ? 'bullets' : 'fraction',
          autoplay = container.data('autoplay') ? {
            delay: container.data('autoplay')
          } : false;

        // General Slider
        var params = {
          speed: 1000,
          pagination: {
            el: '.swiper-pagination',
            type: paginationType,
            clickable: true,
            renderFraction: function(currentClass, totalClass) {
              return '<span class="' + currentClass + '"></span>' +
                ' - ' +
                '<span class="' + totalClass + '"></span>';
            },
            renderBullet: function(index, className) {
              function n(n) {
                return n > 9 ? "" + n : "0" + n;
              }
              return '<span class="' + className + '">' + n(index + 1) + '</span>';
            }
          },
          loop: true,
          autoplay: autoplay,
          effect: 'slide',
          direction: 'vertical',
          keyboard: {
            enabled: true
          },
          mousewheel: true
        };
        SITE.activeSlider = new Swiper(base.selector, params);

        var params2 = {
          speed: 1000,
          effect: 'fade',
          loop: true,
          mousewheel: true,
          direction: 'vertical'
        };

        var swiperThumbnails = new Swiper('.swiper-container.style4-thumbnails', params2);

        SITE.activeSlider.controller.control = swiperThumbnails;
        swiperThumbnails.controller.control = SITE.activeSlider;
      }
    },
    fsStyle5: {
      selector: '.swiper-container.style5',
      init: function() {
        var base = this,
          container = $(base.selector),
          footer_style = container.data('footer-style'),
          paginationType = footer_style === 'footer_style2' ? 'bullets' : 'fraction',
          titles = container.find('h1'),
          autoplay = container.data('autoplay') ? {
            delay: container.data('autoplay')
          } : false,
          box_animations = [],
          boxes = [{
              pieces: 3,
              positions: [{
                  top: 0,
                  left: 0,
                  width: 30,
                  height: 54
                },
                {
                  top: 62,
                  left: 19,
                  width: 40,
                  height: 38
                },
                {
                  top: 28,
                  left: 55,
                  width: 45,
                  height: 40
                }
              ]
            },
            {
              pieces: 4,
              positions: [{
                  top: 0,
                  left: 7,
                  width: 33,
                  height: 71
                },
                {
                  top: 0,
                  left: 51,
                  width: 22,
                  height: 30
                },
                {
                  top: 38,
                  left: 60,
                  width: 40,
                  height: 51
                },
                {
                  top: 65,
                  left: 0,
                  width: 45,
                  height: 25
                }
              ]
            },
            {
              pieces: 4,
              positions: [{
                  top: 30,
                  left: 0,
                  width: 41,
                  height: 70
                },
                {
                  top: 0,
                  left: 48,
                  width: 33,
                  height: 69
                },
                {
                  top: 18,
                  left: 76,
                  width: 24,
                  height: 36
                },
                {
                  top: 79,
                  left: 63,
                  width: 26,
                  height: 11
                }
              ]
            },
            {
              pieces: 4,
              positions: [{
                  top: 14,
                  left: 5,
                  width: 38,
                  height: 57
                },
                {
                  top: 0,
                  left: 48,
                  width: 33,
                  height: 56
                },
                {
                  top: 50,
                  left: 70,
                  width: 26,
                  height: 50
                },
                {
                  top: 83,
                  left: 30,
                  width: 26,
                  height: 17
                }
              ]
            }
          ];
        // General Slider
        var params = {
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          speed: 1000,
          pagination: {
            el: '.swiper-pagination',
            type: paginationType,
            clickable: true,
            renderFraction: function(currentClass, totalClass) {
              return '<span class="' + currentClass + '"></span>' +
                ' - ' +
                '<span class="' + totalClass + '"></span>';
            },
            renderBullet: function(index, className) {
              function n(n) {
                return n > 9 ? "" + n : "0" + n;
              }
              return '<span class="' + className + '">' + n(index + 1) + '</span>';
            }
          },
          loop: false,
          autoplay: autoplay,
          direction: 'vertical',
          keyboard: {
            enabled: true
          },
          mousewheel: true,
          on: {
            init: function() {
              var slides = this.slides;

              slides.each(function(i, el) {
                var _this = $(el),
                  segmenter,
                  args = {
                    animation: {
                      duration: 8000,
                      translateZ: {
                        min: 80,
                        max: 140
                      },
                    },
                    onReady: function() {
                      box_animations[i] = segmenter.animate();

                      if (i === 0) {
                        box_animations[i].play();
                      }
                    }
                  };

                args.pieces = boxes[(i % 4)].pieces;
                args.positions = boxes[(i % 4)].positions;
                segmenter = new Segmenter(el, args);
              });

              var i = this.activeIndex,
                color = this.slides.eq(i).data('color');

              if (!body.hasClass(color)) {
                body.removeClass('light-title dark-title').addClass(color);
              }
            },
            slideChangeTransitionStart: function() {
              var i = this.activeIndex,
                color = this.slides.eq(i).data('color');
              body.removeClass('light-title dark-title').addClass(color);
            },
            slideChangeTransitionEnd: function() {
              var previousSlide = this.slides.eq(this.previousIndex),
                activeSlide = this.slides.eq(this.activeIndex);

              box_animations[this.previousIndex].timeScale(2).reverse();
              box_animations[this.activeIndex].timeScale(1).play();
            }
          }
        };
        SITE.activeSlider = new Swiper(base.selector, params);
      }
    },
    fsStyle6: {
      selector: '.swiper-container.style6',
      getRandomGlitchParams: function() {
        return {
          seed: Math.round(Math.random() * 3000),
          quality: Math.floor(Math.random() * (80 - 40 + 1)) + 70,
          amount: Math.floor(Math.random() * (99 - 25 + 1)) + 15,
          iterations: 8
        };
      },
      generateGlitchedImageData: function(frameCount, image) {
        var base = this;
        var glitchPromises = [];
        for (var i = 0; i < frameCount; ++i) {
          glitchPromises[i] = glitch(base.getRandomGlitchParams())
            .fromImage(image)
            .toImage();
        }
        glitchPromises[frameCount] = image;
        return Promise.all(glitchPromises);
      },
      distortCanvas: function(canvas, src, cover) {
        var base = this,
          ctx = canvas.getContext('2d'),
          aspect = win.outerWidth() / win.outerHeight(),
          imgAspect = 1,
          image = new Image(),
          framesCache = [],
          currentFrameIndex = 0,
          isAnimating = false,
          fps = 50,
          frameCount = 5;

        function resizeCanvas() {
          if ((win.outerWidth() / win.outerHeight()) < imgAspect) {
            //taller
            $(canvas).css({
              'width': 'auto',
              'height': win.outerHeight() + 'px'
            });
          } else {
            //wider
            $(canvas).css({
              'width': win.outerWidth() + 'px',
              'height': 'auto'
            });
          }
        }

        function showNextFrame() {
          var delay = 0;

          if (isAnimating) {
            if (framesCache.length) {
              currentFrameIndex++;

              if (currentFrameIndex > framesCache.length - 1) {
                currentFrameIndex = 0;
              } else if (currentFrameIndex + 1 === framesCache.length) {
                delay = 3000;
              }
            }

            window.requestAnimationFrame(function() {
              ctx.drawImage(framesCache[currentFrameIndex], 0, 0, canvas.width, canvas.height);
              setTimeout(showNextFrame, (1000 / fps) + delay);
            });
          }
        }

        function startAnimation() {
          isAnimating = true;
          showNextFrame();
          //cover.hide();
        }

        function stopAnimation() {
          isAnimating = false;
          //cover.show();
        }

        function toggleAnimation() {
          if (isAnimating) {
            stopAnimation();
          } else {
            startAnimation();
          }
        }

        image.onload = function() {
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          imgAspect = canvas.width / canvas.height;

          base.generateGlitchedImageData(frameCount, image).then(function(frames) {
            frames[frameCount] = image;
            framesCache = frames;
            resizeCanvas();
            startAnimation();
          });
        };

        image.src = canvas.getAttribute("data-image");

        win.on('resize', function() {
          resizeCanvas();
        });
      },
      init: function() {
        var base = this,
          container = $(base.selector),
          footer_style = container.data('footer-style'),
          paginationType = footer_style === 'footer_style2' ? 'bullets' : 'fraction',
          autoplay = container.data('autoplay') ? {
            delay: container.data('autoplay')
          } : false;

        // General Slider
        var params = {
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          speed: 1000,
          pagination: {
            el: '.swiper-pagination',
            type: paginationType,
            clickable: true,
            renderFraction: function(currentClass, totalClass) {
              return '<span class="' + currentClass + '"></span>' +
                ' - ' +
                '<span class="' + totalClass + '"></span>';
            },
            renderBullet: function(index, className) {
              function n(n) {
                return n > 9 ? "" + n : "0" + n;
              }
              return '<span class="' + className + '">' + n(index + 1) + '</span>';
            }
          },
          loop: false,
          autoplay: autoplay,
          direction: 'vertical',
          keyboard: {
            enabled: true
          },
          mousewheel: true,
          on: {
            init: function() {
              var _this = this,
                i = _this.activeIndex,
                color = _this.slides.eq(i).data('color'),
                canvas = $('.glitch', _this.slides.eq(i)),
                cover = $('.glitch-image', _this.slides.eq(i)),
                image = canvas.data('image');

              setTimeout(function() {
                _this.slides.eq(i).addClass('thb-animate-slide-text');
              }, 900);
              if (!canvas.data('active')) {
                base.distortCanvas(canvas[0], image, cover);
                canvas.data('active', 1);
              }
              if (!body.hasClass(color)) {
                body.removeClass('light-title dark-title').addClass(color);
              }
            },
            slideChangeTransitionStart: function() {
              var previousSlide = this.slides.eq(this.previousIndex),
                activeSlide = this.slides.eq(this.activeIndex),
                is_light = activeSlide.hasClass('light-title'),
                body_color = is_light ? 'light-title' : 'dark-title';

              previousSlide.removeClass('thb-animate-slide-text');

              body.removeClass('light-title dark-title').addClass(body_color);
            },
            slideChangeTransitionEnd: function() {
              var previousSlide = this.slides.eq(this.previousIndex),
                activeSlide = this.slides.eq(this.activeIndex),
                canvas = $('.glitch', activeSlide),
                cover = $('.glitch-image', activeSlide),
                image = canvas.data('image');


              setTimeout(function() {
                activeSlide.addClass('thb-animate-slide-text');
              }, 900);
              if (!canvas.data('active')) {
                base.distortCanvas(canvas[0], image, cover);
                canvas.data('active', 1);
              }
            }
          }
        };
        SITE.activeSlider = new Swiper(base.selector, params);
      }
    },
    fsStyle7: {
      selector: '.swiper-container.style7',
      init: function() {
        var base = this,
          container = $(base.selector),
          active = false,
          borders = $('.thb-borders'),
          org_border_color = borders.length ? borders.css("border-color") : false,
          footer_style = container.data('footer-style'),
          paginationType = footer_style === 'footer_style2' ? 'bullets' : 'fraction',
          autoplay = container.data('autoplay') ? {
            delay: container.data('autoplay')
          } : false;


        // General Slider
        var params = {
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          speed: 1500,
          pagination: {
            el: '.swiper-pagination',
            type: paginationType,
            clickable: true,
            renderFraction: function(currentClass, totalClass) {
              return '<span class="' + currentClass + '"></span>' +
                ' - ' +
                '<span class="' + totalClass + '"></span>';
            },
            renderBullet: function(index, className) {
              function n(n) {
                return n > 9 ? "" + n : "0" + n;
              }
              return '<span class="' + className + '">' + n(index + 1) + '</span>';
            }
          },
          loop: true,
          autoplay: autoplay,
          direction: 'horizontal',
          keyboard: {
            enabled: true
          },
          mousewheel: true,
          parallax: true,
          on: {
            init: function() {
              var i = this.activeIndex,
                color = this.slides.eq(i).data('color'),
                maincolor = this.slides.eq(i).data('main-color');
              if (!body.hasClass(color)) {
                body.removeClass('light-title dark-title').addClass(color);
              }
              if (borders.length) {
                var bordercolor = maincolor ? maincolor : org_border_color;
                borders.css('border-color', bordercolor);
              }
              var titles = container.find('h1');

              titles.each(function(i, el) {
                var _this = $(el),
                  compressor = 1.1;
                var resizer = function() {
                  _this.css('font-size', Math.max(Math.min(_this.width() / (compressor * 10), parseFloat('180px')), parseFloat('20px')));
                };
                resizer();

              });
            },
            slideChangeTransitionStart: function() {
              var color = $('.swiper-slide-active').data('color'),
                maincolor = $('.swiper-slide-active').data('main-color');

              body.removeClass('light-title dark-title').addClass(color);

              if (borders.length) {
                var bordercolor = maincolor ? maincolor : org_border_color;
                borders.css('border-color', bordercolor);
              }
            }
          }
        };
        SITE.activeSlider = new Swiper(base.selector, params);
      }
    },
    fsStyle8: {
      selector: '.swiper-container.style8',
      init: function() {
        var base = this,
          container = $(base.selector),
          footer_style = container.data('footer-style'),
          active = false,
          paginationType = footer_style === 'footer_style2' ? 'bullets' : 'fraction',
          autoplay = container.data('autoplay') ? {
            delay: container.data('autoplay')
          } : false;

        // General Slider
        var params = {
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          speed: 1000,
          pagination: {
            el: '.swiper-pagination',
            type: paginationType,
            clickable: true,
            renderFraction: function(currentClass, totalClass) {
              return '<span class="' + currentClass + '"></span>' +
                ' - ' +
                '<span class="' + totalClass + '"></span>';
            },
            renderBullet: function(index, className) {
              function n(n) {
                return n > 9 ? "" + n : "0" + n;
              }
              return '<span class="' + className + '">' + n(index + 1) + '</span>';
            }
          },
          loop: true,
          autoplay: autoplay,
          direction: 'vertical',
          keyboard: {
            enabled: true
          },
          mousewheel: true,
          on: {
            init: function() {
              var i = this.activeIndex,
                color = this.slides.eq(i).data('color');

              if (!body.hasClass(color)) {
                body.removeClass('light-title dark-title').addClass(color);
              }
            },
            slideChangeTransitionStart: function() {
              var i = this.activeIndex,
                color = this.slides.eq(i).data('color');
              body.removeClass('light-title dark-title').addClass(color);
            }
          }
        };
        SITE.activeSlider = new Swiper(base.selector, params);
      }
    },
    carousel: {
      selector: '.swiper-container.carousel',
      init: function() {
        var base = this,
          container = $(base.selector),
          change_colors = container.hasClass('thb_change_header'),
          pagination = $('div', '.thb-swiper-pagination'),
          autoplay_speed = container.data('autoplay-speed') ? container.data('autoplay-speed') : '5000',
          autoplay = container.data('autoplay') ? {
            delay: autoplay_speed,
            disableOnInteraction: false
          } : false,
          preloader = container.find('.thb-preloader'),
          count = $('.columns', container).length,
          circular_progress = $('<div class="thb-circular-progress-timer"><svg class="thb-circular-progress-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48"><circle cx="24" cy="24" r="18"/></svg></div>'),
          circular_progress_enabled = container.hasClass('thb-circular-progress'),
          pagination_ani = gsap.timeline({
            paused: true
          }),
          circular_progress_ani = gsap.timeline({
            paused: true
          });

        // General Slider
        var params = {
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          speed: 1000,
          pagination: {
            el: '.thb-swiper-pagination',
            clickable: true,
            bulletElement: 'div',
            renderBullet: function(index, className) {
              var title = $('[data-swiper-slide-index=' + index + ']').data('title');
              return '<div class="' + className + '"><span><span class="progress"></span></span><h6>' + title + '</h6></div>';
            }
          },
          slideClass: 'columns',
          slideActiveClass: 'slide-active',
          loop: container.find('.type-portfolio').length > 1 ? true : false,
          autoplay: autoplay,
          slidesPerView: 'auto',
          loopedSlides: count,
          keyboard: {
            enabled: true
          },
          mousewheel: {
            forceToAxis: true
          },
          on: {
            init: function() {
              if (autoplay && circular_progress_enabled) {
                var as = autoplay ? parseInt(autoplay_speed / 1000, 10) : 5;
                container.append(circular_progress);
                gsap.set($('.thb-circular-progress-icon circle', container), {
                  drawSVG: "0% 0%"
                });
                circular_progress_ani
                  .clear()
                  .to($('.thb-circular-progress-icon circle', container), {
                    duration: as,
                    drawSVG: "0% 100%"
                  });
              }
            },
            paginationRender: function(swiper, paginationContainer) {
              var as = autoplay ? parseInt(autoplay_speed / 1000, 10) : 5;
              pagination_ani
                .clear()
                .to($('.progress', paginationContainer), {
                  duration: as,
                  scaleX: 1
                });
            },
            autoplayStart: function() {
              if (pagination && this.autoplay.running) {
                pagination_ani.play();
              }
              if (circular_progress_enabled && this.autoplay.running) {
                circular_progress_ani.play();
              }
            },
            slideChangeTransitionStart: function() {
              var activeIndex = this.slides.eq(this.activeIndex).attr('data-swiper-slide-index'),
                is_light = $('[data-swiper-slide-index=' + activeIndex + ']').hasClass('light-title'),
                body_color = is_light ? 'light-title' : 'dark-title',
                color = is_light ? 'light-pagination' : 'dark-pagination';

              this.$wrapperEl.removeClass('light-pagination dark-pagination').addClass(color);
              if (change_colors) {
                body.removeClass('light-title').addClass(body_color);
              }
              if (pagination) {
                pagination_ani.pause().progress(0);
              }
              if (circular_progress_enabled) {
                this.$el.removeClass('light-title').addClass(body_color);
                circular_progress_ani.pause().progress(0);
              }
              if (lazySizes) {
                lazySizes.loader.checkElems();
              }
            },
            slideChangeTransitionEnd: function() {
              if (pagination && this.autoplay.running) {
                pagination_ani.progress(0);
                pagination_ani.restart();
              }
              if (circular_progress_enabled && this.autoplay.running) {
                circular_progress_ani.progress(0);
                circular_progress_ani.restart();
              }
              if (lazySizes) {
                lazySizes.loader.checkElems();
              }
            }
          }
        };
        if (preloader.length) {
          container.imagesLoaded(function() {

            gsap.to(preloader, {
              duration: 0.25,
              autoAlpha: 0
            });
            container.addClass('thb-loaded');

            var carousel = new Swiper(base.selector, params);
          });
        } else {
          container.addClass('thb-loaded');

          var carousel = new Swiper(base.selector, params);
        }
      }
    },
    thb_3dImg: {
      selector: '.thb_3dimg',
      init: function(el) {
        var base = this,
          container = $(base.selector),
          target = el ? el.find(base.selector) : container;

        target.thb_3dImg({
          scale: 1.4,
          processExit: false,
          sensitivity: 1.2,
          threed: true
        });
      }
    },
    showAll: {
      selector: '.show-all.style1',
      init: function() {
        var base = this,
          container = $(base.selector),
          i = 0,
          curtains = $('.curtains'),
          tl = gsap.timeline({
            paused: true,
            onReverseComplete: function() {
              if (curtains.length) {
                var pos = curtains.find('li').eq(i).data('position');
                gsap.to(win, {
                  duration: 2,
                  scrollTo: pos,
                  autoKill: false
                });
              } else {
                if (SITE.activeSlider.params.loop) {
                  i = jQuery(SITE.activeSlider.slides).filter('[data-swiper-slide-index=' + i + ']').index();
                }
                SITE.activeSlider.slideTo(i);
              }
            },
            onComplete: function() {
              win.trigger('resize');
            }
          }),
          all = $('.thb-show-all'),
          items = $('li>div', all);

        win.on('resize.show-all', function() {
          all.find('ul').css({
            'width': (items.length * items.eq(0).width()) + 'px'
          });
        }).trigger('resize.show-all');
        tl
          .timeScale(1)
          .to(all, 1, {
            duration: 1,
            autoAlpha: 1
          })
          .fromTo(items, {
            y: '100%'
          }, {
            duration: 0.5,
            y: '0%',
            stagger: 0.1
          }, "-=0.3");

        container.on('click', function() {
          var _this = $(this);

          tl.play();
          return false;
        });

        $('.thb-close').on('click', function() {
          tl.timeScale(1.6).reverse();

          return false;
        });
        items.on('click', function() {
          i = $(this).parents('li').index();
          tl.timeScale(1.6).reverse();
        });

        $doc.on('keyup', function(e) {
          if (e.keyCode === 27) { // ESC button
            tl.timeScale(1.6).reverse();
          }
        });
      }
    },
    listPortfolio: {
      selector: '.thb-list-portfolio',
      init: function() {
        var base = this,
          container = $(base.selector);


        container.each(function() {
          var _this = $(this),
            zoom = _this.data('zoom-effect'),
            content_side = _this.find('.thb-content-side'),
            images = _this.find('.portfolio-image'),
            links = _this.find('.type-portfolio'),
            preloader = _this.find('.thb-preloader');

          function animateOver(i, el) {
            var color = $(el).data('color');
            links.removeClass('active');
            $(el).addClass('active');
            if (!content_side.hasClass(color)) {
              content_side.removeClass('light-title dark-title').addClass(color);
            }

            var tl = gsap.timeline();
            if (!images.eq(i).is(':visible')) {
              tl
                .to(images.filter(':visible'), {
                  duration: 0.5,
                  autoAlpha: 0,
                  scale: 1,
                  display: 'none'
                }, 0)
                .to(images.eq(i), {
                  duration: 0.5,
                  autoAlpha: 1,
                  display: 'block'
                }, 0);
            }

            if (zoom) {
              tl
                .to(images.eq(i), {
                  duration: 5,
                  scale: 1.05
                });
            }
            el.animation = tl;
            return tl;

          }
          links.on('mouseenter touchstart', function() {
            var i = $(this).index();
            animateOver(i, this);
          });

          animateOver(0, links.eq(0));


          if (preloader.length) {
            container.imagesLoaded({
              background: '.portfolio-image'
            }, function() {
              container.addClass('thb-loaded');
              gsap.to(preloader, {
                duration: 0.25,
                autoAlpha: 0
              });
            });
          } else {
            container.addClass('thb-loaded');
            gsap.to(preloader, {
              duration: 0.25,
              autoAlpha: 0
            });
          }
        });
      }
    },
    rowPagination: {
      selector: '.thb_row_pagination_on',
      init: function() {
        var rows = $('.row.wpb_row:not(.vc_inner)'),
          position = body.hasClass('row_pagination_position-right') ? 'row_pagination_position-right' : '',
          container = $('<ul class="thb_row_pagination ' + position + '"/>'),
          offset = body.hasClass('disable-row-offset-on') ? 0 : $('.header').outerHeight(),
          i = 1,
          ids = [];

        container.appendTo('#wrapper div[role="main"]');
        body.scrollspy({
          target: '.thb_row_pagination',
          offset: offset + (adminbar.outerHeight() || 0) + 5
        });
        rows.each(function() {
          var _this = $(this),
            id = _this.attr('id'),
            title = _this.data('row-title') ? '<span>' + _this.data('row-title') + '</span>' : '';
          if (!id) {
            _this.attr('id', 'thb_id_' + Math.random().toString(35).substr(2, 7) + '');
          }
          if (title !== '') {
            if (body.hasClass('row_pagination_position-right')) {
              $('<li href="#' + _this.attr('id') + '">' + title + '<b>' + i + '</b></li>').appendTo(container);
            } else {
              $('<li href="#' + _this.attr('id') + '"><b>' + i + '</b>' + title + '</li>').appendTo(container);
            }

            i++;
          }
        });

        body.scrollspy('refresh');
        gsap.to(container.find('li'), {
          duration: 0.2,
          delay: 1,
          y: 0,
          opacity: 1,
          stagger: 0.1
        });
        container.on('click', 'li', function() {
          var id = $(this).attr('href'),
            offset = body.hasClass('disable-row-offset-on') ? 0 : $('.header').outerHeight();
          gsap.to(win, {
            duration: 1,
            scrollTo: {
              y: id,
              offsetY: offset - 1,
              autoKill: false
            }
          });
        });
      }
    },
    sounds: {
      selector: '#wrapper',
      init: function() {
        var music_toggle = $('#music_toggle');
        if (typeof Howl === "undefined") {
          return;
        }
        /* Background Music */
        if (themeajax.sounds.music_sound === 'on' && (themeajax.sounds.music_sound_toggle_home === 'on' ? body.hasClass('home') : true)) {
          var bg_music = new Howl({
            src: [themeajax.sounds.music_sound_file],
            preload: true,
            loop: true,
            volume: 0.5
          }).on('load', function() {
            bg_music.play();

            /* There is toggle */
            if (music_toggle.length) {
              music_toggle.data('state', 'on').addClass('on');
              music_toggle.on('click', function() {
                music_toggle.toggleClass('on');
                if (music_toggle.data('state') === 'on') {
                  bg_music.pause();
                  music_toggle.data('state', 'off');
                } else {
                  bg_music.play();
                  music_toggle.data('state', 'on');
                }
                return false;
              });
            }

          });
        }

        /* Hover Sound */
        if (themeajax.sounds.menu_item_hover_sound === 'on') {
          var hover_sound = new Howl({
            src: [themeajax.sounds.menu_item_hover_sound_file],
            preload: true,
            volume: 0.5
          });
          $('a', mobile_menu).add('.thb-full-menu a').on('hover', function() {
            hover_sound.play();
          });
        }

        /* Click Sound */
        if (themeajax.sounds.click_sound === 'on') {
          var click_sound = new Howl({
            src: [themeajax.sounds.click_sound_file],
            preload: true,
            volume: 0.3
          });
          $(document).on('click', function() {
            click_sound.play();
          });
        }
      }
    },
    toTop: {
      selector: '#scroll_to_top',
      init: function() {
        var base = this,
          container = $(base.selector);

        container.on('click', function() {
          gsap.to(win, {
            duration: 1,
            scrollTo: {
              y: 0,
              autoKill: false
            }
          });
          return false;
        });
        win.scroll(_.debounce(function() {
          base.control();
        }, 20));
      },
      control: function() {
        var base = this,
          container = $(base.selector);

        if (win.scrollTop() > 100) {
          container.addClass('active');
        } else {
          container.removeClass('active');
        }
      }
    },
    toBottom: {
      selector: '.scroll-bottom',
      init: function() {
        var base = this,
          container = $(base.selector);

        container.each(function() {
          var _this = $(this);

          _this.on('click', function() {
            if (SITE.fullPageEnabled) {
              $.fn.fullpage.moveSectionDown();
            } else {
              var p = _this.parents('.post-gallery').length ? _this.parents('.post-gallery') : _this.closest('.row'),
                h = p.outerHeight(),
                header = $('.header:not(.style3)').outerHeight(),
                finalScroll = p.offset().top + h - ((body.hasClass('disable_header_fill-on') || body.hasClass('midnight_on')) ? 0 : header);

              gsap.to(win, {
                duration: 1,
                scrollTo: {
                  y: finalScroll,
                  autoKill: false
                }
              });
            }
            return false;
          });
        });
      }
    },
    animation: {
      selector: '.animation, .thb-counter, .thb-iconbox, .portfolio-title:not(.not-activated), .thb-highlight, .thb-fadetype, .thb-slidetype, .thb-progressbar',
      init: function() {
        var base = this,
          container = $(base.selector);

        if (!$('#thb_fullscreen_rows').length) {
          base.control(container, true);

          $('.animation.bottom-to-top-3d, .animation.top-to-bottom-3d, .animation.bottom-to-top-3d-small, .animation.top-to-bottom-3d-small').parent(':not(.slick-track)').addClass('perspective-wrap');

          win.on('scroll.thb-animation', function() {
            base.control(container, true);
          }).trigger('scroll.thb-animation');
        }
      },
      container: function(container) {
        var base = this,
          element = $(base.selector, container);

        base.control(element, false);
      },
      control: function(element, filter) {
        var t = 0,
          speed = 0.75,
          delay = 0.3,
          el = filter ? element.filter(':in-viewport') : element;

        el.each(function() {
          var _this = $(this),
            params = {
              autoAlpha: 1,
              x: 0,
              y: 0,
              z: 0,
              rotationZ: '0deg',
              rotationX: '0deg',
              rotationY: '0deg',
              delay: t * delay
            };

          if (_this.hasClass('thb-client') || _this.hasClass('thb-counter') || _this.hasClass('thb-iconlist-li')) {
            speed = 0.2;
            delay = 0.05;
          } else if (_this.hasClass('thb-team-member')) {
            speed = 0.4;
            delay = 0.1;
          } else {
            speed = 0.5;
            delay = 0.15;
          }
          params.duration = speed;
          if (_this.data('thb-animated') === undefined) {
            _this.data('thb-animated', true);
            if (_this.hasClass('thb-iconbox')) {
              SITE.iconbox.control(_this, t * delay);
            } else if (_this.hasClass('thb-counter')) {
              SITE.counter.control(_this, t * delay);
            } else if (_this.hasClass('portfolio-title')) {
              SITE.portfolioTitle.control(_this, t * delay);
            } else if (_this.hasClass('thb-highlight')) {
              SITE.highlight.control(_this, t * delay);
            } else if (_this.hasClass('thb-fadetype')) {
              SITE.fadeType.control(_this, t * delay);
            } else if (_this.hasClass('thb-slidetype')) {
              SITE.slideType.control(_this, t * delay);
            } else if (_this.hasClass('thb-progressbar')) {
              SITE.progressBar.control(_this, t * delay);
            } else {
              if (_this.hasClass('scale')) {
                params.scale = 1;
              }
              gsap.to(_this, params);
            }
            t++;
          }
        });
      }
    },
    portfolioFloat: {
      selector: '.portfolio-floating-button',
      init: function() {
        var base = this,
          container = $(base.selector),
          toggle = container.find('.thb-toggle'),
          content = container.find('.header-content'),
          scroll = container.find('.custom_scroll'),
          tl = gsap.timeline({
            paused: true
          }),
          header = $('.header'),
          borders = $('.thb-borders').css("border-top-width"),
          hh = !header.hasClass('style3') ? header.outerHeight() : 30;

        win.on('resize', _.debounce(function() {
          container.css({
            'marginTop': hh + ($('.thb-borders').length ? parseInt(borders) : 0) + 15
          });
        }, 30)).trigger('resize');

        tl
          .set(content, {
            display: 'flex',
            autoAlpha: 1
          })
          .from(content, {
            duration: 1,
            width: 0,
            height: 0,
            padding: 0
          })
          .to(container.find('>div'), {
            duration: 1,
            autoAlpha: 1
          });


        toggle.on('click', function(e) {
          if (!toggle.data('toggled')) {
            tl.timeScale(1).restart();
            toggle.find('.show-message').hide();
            toggle.find('.hide-message').css('display', 'inline-flex');
            toggle.data('toggled', true);
          } else {
            toggle.find('.hide-message').hide();
            toggle.find('.show-message').css('display', 'inline-flex');
            tl.timeScale(1.5).reverse();
            toggle.removeData('toggled');
          }
          e.preventDefault();
          return false;
        });
      }
    },
    progressBar: {
      selector: '.thb-progressbar',
      control: function(container, delay, skip) {
        if ((container.data('thb-in-viewport') === undefined) || skip) {
          var progress = container.find('.thb-progress'),
            value = progress.data('progress');

          var tl = gsap.timeline();

          tl
            .to(container, {
              duration: 0.6,
              autoAlpha: 1,
              delay: delay
            })
            .to(progress.find('span'), {
              duration: 1,
              scaleX: value / 100
            });

        }
      }
    },
    fixedMe: {
      selector: '.thb-fixed',
      init: function(el) {
        var base = this,
          container = el ? el : $(base.selector),
          ah = adminbar.outerHeight() || 0;
        if (container.parents('.sidebar').length || container.hasClass('header-offset')) {
          if (!$('.header-lateral-on').length) {
            ah += $('.header').outerHeight();
          }
        }

        if (!thb_md.mobile()) {
          container.each(function() {
            var _this = $(this);

            _this.stick_in_parent({
              offset_top: ah,
              spacer: false
            });
            _this.find('.thb-lazyload').on('lazyloaded', function() {
              $(document.body).trigger("sticky_kit:recalc");
            });
          });

          $('.post-content, .products, .product-images').imagesLoaded(function() {
            $(document.body).trigger("sticky_kit:recalc");
          });
          win.on('resize', _.debounce(function() {
            $(document.body).trigger("sticky_kit:recalc");
          }, 30));
          win.on('scroll', _.debounce(function() {
            $(document.body).trigger("sticky_kit:recalc");
          }, 50));
        }
      }
    },
    portfolioTitle: {
      selector: '.portfolio-title',
      tl: false,
      control: function(container, delay, skip) {
        if (((container.data('thb-in-viewport') === undefined) || skip) && themeajax.settings.portfolio_title_animation === 'on') {
          container.data('thb-in-viewport', true);
          var base = this,
            h1 = container.find('.entry-title'),
            h4 = container.find('h4'),
            p = container.find('p'),
            attr = container.find('.attribute'),
            splith1 = new SplitText(h1, {
              type: "lines"
            }),
            splith4 = h4.length ? new SplitText(h4, {
              type: "lines"
            }) : false,
            splitp = p.length ? new SplitText(p, {
              type: "lines"
            }) : false,
            all = $(splith1.lines).add(splith4 ? $(splith4.lines) : false).add(splitp ? $(splitp.lines) : false).add(attr);

          base.tl = gsap.timeline({
            paused: true
          });

          base.tl
            .set(container, {
              display: 'block',
              autoAlpha: 1
            })
            .from(all, {
              duration: 0.75,
              autoAlpha: 0,
              delay: delay,
              y: 20,
              stagger: 0.2
            }, '+=0', function() {
              splith1.revert();
              if (p.length) {
                win.one('resize', function() {
                  splitp.revert();
                });
              }
              if (h4.length) {
                win.one('resize', function() {
                  splith4.revert();
                });
              }
            });

          if (!skip) {
            base.tl.play();
          } else {
            return base.tl;
          }
        }
      }
    },
    style6hover: {
      selector: '.type-portfolio.style6',
      start: function() {
        var base = this,
          container = $(base.selector),
          ah = adminbar.outerHeight() || 0,
          contentbox = $('.portfolio-hover-content');

        if (contentbox.length) {
          container.each(function() {
            var _this = $(this),
              box = _this.find('.style6-box'),
              id = box.data('id'),
              box_width,
              box_height;

            _this.hoverIntent(function() {
              contentbox.addClass('active');

              box.imagesLoaded(function() {

                if (contentbox.data('active-box') !== id) {
                  contentbox.find('.thb-replace').html(box.html());
                  contentbox.data('active-box', id);
                }
                contentbox.addClass('loaded');
                box_width = contentbox.outerWidth();
                box_height = contentbox.outerHeight();
              });
            }, function() {
              contentbox.removeClass('active loaded');
            });

            if (!_this.data('binded')) {
              _this.bind('mousemove', function(e) {

                _this.data('binded', 1);

                var cursor_area = _this,
                  offset = cursor_area.offset(),
                  mouseX = ((e.clientX + box_width + 40) > win.outerWidth() ? e.clientX - box_width - 40 : e.clientX + 40),
                  mouseY = ((e.clientY + (box_height / 2)) > win.outerHeight() ? e.clientY - Math.abs(e.clientY + box_height - win.outerHeight()) : (e.clientY - (box_height / 2)));

                if (mouseY < 0) {
                  mouseY = 0;
                }
                if (mouseX < 0) {
                  mouseX = 0;
                }

                gsap.set(contentbox, {
                  x: mouseX,
                  y: mouseY,
                  force3D: true
                });

              });
            }
          });
        }
      }
    },
    autoType: {
      selector: '.thb-autotype',
      init: function() {
        var base = this,
          container = $(base.selector);

        container.each(function() {
          var _this = $(this),
            entry = _this.find('.thb-autotype-entry'),
            strings = entry.data('strings'),
            speed = entry.data('speed') ? entry.data('speed') : 50,
            loop = entry.data('thb-loop') ? entry.data('thb-loop') : false;

          if (!container.find('.thb-autotype-entry').length) {
            return;
          }

          strings = _.map(strings, function(val) {
            return val.replace('&', '&amp;');
          });
          var typed = new Typed(entry[0], {
            strings: strings,
            loop: loop,
            contentType: 'html',
            typeSpeed: speed,
            backDelay: 1000,
          });
        });
      }
    },
    fadeType: {
      selector: '.thb-fadetype',
      control: function(container, delay, skip) {
        if ((container.data('thb-in-viewport') === undefined) || skip) {
          container.data('thb-in-viewport', true);
          var split = new SplitText(
              $('.thb-fadetype-entry', container), {
                type: "words,chars"
              }
            ),
            tl = gsap.timeline({
              onComplete: function() {
                split.revert();
              }
            }),
            args = {};

          tl
            .set(container, {
              visibility: "visible"
            });

          if (container.hasClass('thb-fadetype-style1')) {

            args = {
              duration: 0.4,
              autoAlpha: 0,
              y: 0,
              rotationX: '90deg',
              delay: delay,
              stagger: 0.07
            };
            tl.from(split.chars, args);
          } else if (container.hasClass('thb-fadetype-style2')) {
            for (var t = split.chars.length, n = 0; n < t; n++) {
              var i = split.chars[n],
                r = 0.5 * Math.random();
              tl
                .from(i, {
                  duration: 2,
                  opacity: 0,
                  ease: Linear.easeNone
                }, r)
                .from(i, {
                  duration: 2,
                  yPercent: -50,
                  ease: Expo.easeOut
                }, r);
            }
          } else if (container.hasClass('thb-fadetype-style3')) {
            for (var q = split.chars.length, m = 0; m < q; m++) {
              var iq = split.chars[m],
                rq = Math.round((0.5 + Math.random()) * 10) / 10;
              tl
                .fromTo(iq, {
                  opacity: 0.15,
                  scale: 0.9
                }, {
                  uration: 1,
                  opacity: 1,
                  scale: 1,
                  yoyo: true,
                  repeat: -1,
                  ease: Power1.easeInOut
                }, rq);

            }
          }
        }
      }
    },
    highlight: {
      selector: '.thb-highlight',
      control: function(container, delay, skip) {
        if ((container.data('thb-in-viewport') === undefined) || skip) {
          container.data('thb-in-viewport', true);

          gsap.to(container, {
            duration: 1,
            backgroundSize: "+=100% +=0%",
            delay: delay
          });
        }
      }
    },
    slideType: {
      selector: '.thb-slidetype',
      control: function(container, delay, skip) {
        if ((container.data('thb-in-viewport') === undefined) || skip) {
          container.data('thb-in-viewport', true);
          var style = container.data('style'),
            split,
            tl = gsap.timeline({
              onComplete: function() {
                if (style !== 'style1') {
                  split.revert();
                }
              }
            }),
            animated_split,
            dur = 0.25,
            stagger = 0.05;
          if (!container.find('.thb-slidetype-entry').length) {
            return;
          }
          if (style === 'style1') {
            animated_split = container.find('.thb-slidetype-entry .lines');
            dur = 0.65;
            stagger = 0.15;
          } else if (style === 'style2') {
            split = new SplitText(container.find('.thb-slidetype-entry .lines'), {
              type: 'lines,words'
            });
            animated_split = split.words;
            dur = 0.65;
            stagger = 0.15;
          } else if (style === 'style3') {
            split = new SplitText(container.find('.thb-slidetype-entry .lines'), {
              type: 'lines,chars'
            });
            animated_split = split.chars;
          }

          tl
            .set(container, {
              visibility: "visible"
            })
            .from(animated_split, {
              duration: dur,
              y: '200%',
              delay: delay,
              stagger: stagger
            }, '+=0');

        }
      }
    },
    keyNavigation: {
      selector: '.portfolio_nav',
      init: function() {
        var base = this,
          container = $(base.selector);

        var thb_nav_click = function(e) {
          if (e.keyCode === 78) { // Next
            if (container.find('.post_nav_link.next').length) {
              container.find('.post_nav_link.next')[0].click();
            }
          }
          if (e.keyCode === 80) { // Prev
            if (container.find('.post_nav_link.prev').length) {
              container.find('.post_nav_link.prev')[0].click();
            }
          }
        };
        $doc.on('keyup', thb_nav_click);

        $('input, textarea').on('focus', function() {
          $doc.off('keyup', thb_nav_click);
        });
        $('input, textarea').on('blur', function() {
          $doc.on('keyup', thb_nav_click);
        });
      }
    },
    counter: {
      selector: '.thb-counter',
      control: function(container, delay) {
        if (container.data('thb-in-viewport') === undefined) {
          container.data('thb-in-viewport', true);

          var _this = container,
            el = _this.find('.h1:not(.counter-text), .counter:not(.counter-text)').eq(0),
            counter = el[0],
            count = el.data('count'),
            speed = el.data('speed'),
            svg = _this.find('svg'),
            separator = _this.data('separator'),
            svg_el = svg.find('path, circle, rect, ellipse'),
            params = {
              el: counter,
              value: 0,
              duration: speed,
              theme: 'minimal'
            },
            tl = gsap.timeline({
              paused: true
            });

          if (!separator || separator === '') {
            params.format = '';
          }
          var od = new Odometer(params);
          tl
            .set(_this, {
              visibility: 'visible'
            });

          if (svg.length) {
            tl
              .set(svg, {
                display: 'block'
              })
              .from(svg_el, {
                duration: (speed / 2000),
                drawSVG: "0%",
                stagger: (speed / 10000)
              });
          }
          setTimeout(function() {
            tl.play();
            od.update(count);
          }, delay);
        }
      }
    },
    iconbox: {
      selector: '.thb-iconbox',
      control: function(container, delay) {
        if (container.data('thb-in-viewport') === undefined && !container.hasClass('animation-off')) {
          container.data('thb-in-viewport', true);

          var _this = container,
            animation_speed = _this.data('animation_speed') !== '' ? _this.data('animation_speed') : '1.5',
            svg = _this.find('svg'),
            img = _this.find('img:not(.thb_image_hover)'),
            el = svg.find('path, circle, rect, ellipse'),
            h = _this.find('h5'),
            p = _this.find('p'),
            line = _this.find('.thb-iconbox-line'),
            dot = _this.find('.thb-iconbox-line em'),
            tl = gsap.timeline({
              delay: delay,
              paused: true,
              clearProps: 'all'
            }),
            all = h.add(p).add(img);

          if (!(_this.hasClass('left') || _this.hasClass('right'))) {
            all.add(_this.find('.thb-read-more'));
          }

          tl
            .set(_this, {
              visibility: 'visible'
            })
            .set(svg, {
              visibility: 'visible'
            })
            .from(el, {
              duration: animation_speed,
              drawSVG: "0%",
              stagger: 0.2
            }, "s")
            .fromTo(all, {
              autoAlpha: 0,
              y: '20px'
            }, {
              duration: (animation_speed / 2),
              autoAlpha: 1,
              y: '0px',
              stagger: 0.1
            }, "s-=" + (animation_speed / 2));

          if (dot.length) {
            tl
              .to(dot, {
                duration: (animation_speed / 2),
                scale: '1'
              }, "s-=" + (animation_speed / 1.5));
          }

          if (line.length) {
            tl
              .to(line, {
                duration: (animation_speed / 2),
                scaleX: '1'
              }, "s-=" + (animation_speed / 1.5));
          }

          tl.play();
        }
      }
    },
    contact: {
      selector: '.contact_map:not(.disabled)',
      init: function() {
        var base = this,
          container = $(base.selector);


        container.each(function() {
          var _this = $(this),
            mapzoom = _this.data('map-zoom'),
            mapstyle = _this.data('map-style'),
            mapType = _this.data('map-type'),
            panControl = _this.data('pan-control'),
            zoomControl = _this.data('zoom-control'),
            mapTypeControl = _this.data('maptype-control'),
            scaleControl = _this.data('scale-control'),
            streetViewControl = _this.data('streetview-control'),
            locations = _this.find('.thb-location'),
            once;

          var bounds = new google.maps.LatLngBounds();

          var mapOptions = {
            styles: mapstyle,
            zoom: mapzoom,
            scrollwheel: false,
            panControl: panControl,
            zoomControl: zoomControl,
            mapTypeControl: mapTypeControl,
            scaleControl: scaleControl,
            streetViewControl: streetViewControl,
            mapTypeId: mapType,
            gestureHandling: 'cooperative'
          };

          var map = new google.maps.Map(_this[0], mapOptions);

          map.addListener('tilesloaded', function() {
            if (!once) {
              locations.each(function(i) {
                var location = $(this),
                  options = location.data('option'),
                  lat = options.latitude,
                  long = options.longitude,
                  latlng = new google.maps.LatLng(lat, long),
                  marker = options.marker_image,
                  marker_size = options.marker_size,
                  retina = options.retina_marker,
                  title = options.marker_title,
                  desc = options.marker_description,
                  pinimageLoad = new Image();

                bounds.extend(latlng);

                pinimageLoad.src = marker;

                $(pinimageLoad).on('load', function() {
                  base.setMarkers(i, locations.length, map, lat, long, marker, marker_size, title, desc, retina);
                });
                once = true;
              });

              if (mapzoom > 0) {
                map.setCenter(bounds.getCenter());
                map.setZoom(mapzoom);
              } else {
                map.setCenter(bounds.getCenter());
                map.fitBounds(bounds);
              }
            }
          });

          win.on('resize.google_map', _.debounce(function() {
            map.setCenter(bounds.getCenter());
          }, 50)).trigger('resize.google_map');

        });
      },
      setMarkers: function(i, count, map, lat, long, marker, marker_size, title, desc, retina) {

        function showPin(i) {

          var markerExt = marker.toLowerCase().split('.');
          markerExt = markerExt[markerExt.length - 1];

          if ($.inArray(markerExt, ['svg']) || retina) {
            marker = new google.maps.MarkerImage(marker, null, null, null, new google.maps.Size(marker_size[0] / 2, marker_size[1] / 2));
          }
          var g_marker = new google.maps.Marker({
              position: new google.maps.LatLng(lat, long),
              map: map,
              animation: google.maps.Animation.DROP,
              icon: marker,
              optimized: false
            }),
            contentString = '<h3>' + title + '</h3>' + '<div>' + desc + '</div>';

          // info windows
          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });

          g_marker.addListener('click', function() {
            infowindow.open(map, g_marker);
          });
        }
        setTimeout(showPin, i * 250, i);
      }
    },
    ajaxAddToCart: {
      selector: '.add_to_cart_button',
      init: function() {
        var base = this,
          container = $(base.selector);

        body.on('added_to_cart', function(e, fragments, cart_hash, $button) {
          $button.find('.thb_button_icon').html(themeajax.l10n.added_svg);
          $button.find('span').text(themeajax.l10n.added);
        });
      }
    },
    productAjaxAddtoCart: {
      selector: '.thb-single-product-ajax-on.single-product .product-type-variable form.cart, .thb-single-product-ajax-on.single-product .product-type-simple form.cart',
      init: function() {
        var base = this,
          container = $(base.selector),
          btn = $('.single_add_to_cart_button', container);

        if (typeof wc_add_to_cart_params !== 'undefined') {
          if (wc_add_to_cart_params.cart_redirect_after_add === 'yes') {
            return;
          }
        }
        $doc.on('submit', 'body.single-product form.cart', function(e) {
          e.preventDefault();
          var _this = $(this),
            btn_text = btn.text();

          if (btn.is('.disabled') || btn.is('.wc-variation-selection-needed')) {
            return;
          }

          var data = {
            product_id: _this.find("[name*='add-to-cart']").val(),
            product_variation_data: _this.serialize()
          };

          $.ajax({
            method: 'POST',
            data: data.product_variation_data,
            dataType: 'html',
            url: wc_cart_fragments_params.wc_ajax_url.toString().replace('%%endpoint%%', 'add-to-cart=' + data.product_id + '&thb-ajax-add-to-cart=1'),
            cache: false,
            headers: {
              'cache-control': 'no-cache'
            },
            beforeSend: function() {
              body.trigger('adding_to_cart');
              btn.addClass('disabled').text(themeajax.l10n.adding_to_cart);
            },
            success: function(data) {
              var parsed_data = $.parseHTML(data);

              var thb_fragments = {
                '.float_count': $(parsed_data).find('.float_count').html(),
                '.thb_prod_ajax_to_cart_notices': $(parsed_data).find('.thb_prod_ajax_to_cart_notices').html(),
                '.widget_shopping_cart_content': $(parsed_data).find('.widget_shopping_cart_content').html()
              };

              $.each(thb_fragments, function(key, value) {
                $(key).html(value);
              });
              body.trigger('wc_fragments_refreshed');
              btn.removeClass('disabled').text(btn_text);
            },
            error: function(response) {
              body.trigger('wc_fragments_ajax_error');
              btn.removeClass('disabled').text(btn_text);
            }
          });
        });
      }
    },
    variations: {
      selector: 'form.variations_form',
      init: function() {
        var base = this,
          container = $(base.selector),
          slider = $('#product-images'),
          thumbnails = $('#product-thumbnails'),
          first_selector = '.woocommerce-product-gallery__image:first-of-type img',
          org_image = $(first_selector, slider).attr('src'),
          org_thumb = $(first_selector, thumbnails).attr('src'),
          price_container = $('p.price', '.product-information').eq(0),
          org_price = price_container.html();

        if (org_image === 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==') {
          org_image = $(first_selector, slider).data('src');
        }
        container.on("show_variation", function(e, variation) {

          if (variation.price_html) {
            price_container.html(variation.price_html);
          } else {
            price_container.html(org_price);
          }

          if (variation.hasOwnProperty("image") && variation.image.src) {
            $(first_selector, slider).attr("src", variation.image.src).attr("srcset", "");
            $(first_selector, thumbnails).attr("src", variation.image.thumb_src).attr("srcset", "");

            if (slider.hasClass('slick-initialized')) {
              slider.slick('slickGoTo', 0);
            }
          }
        }).on('reset_image', function() {
          price_container.html(org_price);
          $(first_selector, slider).attr("src", org_image).attr("srcset", "");
          $(first_selector, thumbnails).attr("src", org_thumb).attr("srcset", "");
        });
        if (container.find('.single_variation').is(':visible')) {
          if (container.find('.single_variation .woocommerce-variation-price').html()) {
            price_container.html(container.find('.single_variation .woocommerce-variation-price').html());
          }
        }
      }
    },
    cookieBar: {
      selector: '.thb-cookie-bar',
      init: function() {
        var base = this,
          container = $(base.selector),
          button = $('.button', container);
        if (typeof Cookies === "undefined") {
          return;
        }
        if (Cookies.get('thb-werkstatt-cookiebar') !== 'hide') {
          gsap.to(container, {
            duration: 0.5,
            opacity: '1',
            y: '0%'
          });
        }
        button.on('click', function() {
          Cookies.set('thb-werkstatt-cookiebar', 'hide', {
            expires: 30
          });
          gsap.to(container, {
            duration: 0.5,
            opacity: '0',
            y: '100%'
          });
          return false;
        });
      }
    },
    footerUnfold: {
      selector: '.fixed-footer-container',
      init: function() {
        var base = this,
          container = $(base.selector);

        base.run(container);

        win.on('resize', _.debounce(function() {
          base.run(container);
        }, 50));
      },
      run: function(container) {
        var h;
        container.imagesLoaded({
          background: true
        }, function() {
          h = container.outerHeight();
          body.css('padding-bottom', h);
        });
      }
    },
    widget_nav_menu: {
      selector: '.widget_nav_menu, .widget_pages',
      init: function() {
        var base = this,
          container = $(base.selector),
          items = container.find('.menu-item-has-children, .page_item_has_children');

        items.each(function() {
          var _this = $(this),
            link = $('>a', _this);

          link.append('<div class="thb-arrow"><i class="fa fa-angle-down"></i></div>');

          $('.thb-arrow', _this).on('click', function(e) {
            var that = $(this),
              parent = that.parents('a'),
              menu = parent.next('.sub-menu, .children');

            if (parent.hasClass('active')) {
              parent.removeClass('active');
              menu.slideUp('200');
            } else {
              parent.addClass('active');
              menu.slideDown('200');
            }
            e.stopPropagation();
            e.preventDefault();
          });
          if (link.attr('href') === '#') {
            link.on('click', function(e) {
              var that = $(this),
                menu = that.next('.sub-menu');
              if (that.hasClass('active')) {
                that.removeClass('active');
                menu.slideUp('200');
              } else {
                that.addClass('active');
                menu.slideDown('200');
              }
              e.preventDefault();
            });
          }
        });
      }
    },
    wooWidgets: {
      selector: '.widget.woo',
      init: function() {
        var base = this,
          container = $(base.selector),
          demos = $('.thb-demo-holder');

        $('h6', container).on('click', function() {
          $(this).parents('.widget').toggleClass('active');
          return false;
        });
      }
    },
    right_click: {
      selector: '.right-click-on',
      init: function() {
        var target = $('#right_click_content'),
          clickMain = gsap.timeline({
            paused: true,
            onStart: function() {
              target.css('display', 'flex');
            },
            onReverseComplete: function() {
              target.css('display', 'none');
            }
          }),
          el = target.find('.columns>*');


        clickMain
          .to(target, {
            duration: 0.5,
            opacity: 1,
            ease: thb_ease
          }, "start")
          .from(el, {
            duration: 0.5,
            y: 20,
            opacity: 0,
            ease: thb_ease,
            stagger: 0.1
          });

        win.on("contextmenu", function(e) {
          if (e.which === 3) {
            clickMain.play();
            return false;
          }
        });
        $doc.on('keyup', function(e) {
          if (e.keyCode === 27) {
            clickMain.reverse();
          }
        });
        target.on('click', function() {
          clickMain.reverse();
        });
      }
    }
  };

  $(function() {
    if ($('#vc_inline-anchor').length) {
      win.on('vc_reload', function() {
        SITE.init();
      });
    } else {
      SITE.init();
    }
  });

})(jQuery, this);