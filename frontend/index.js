/**
 * FITCLUB - Enhanced Adaptive Navigation
 * jQuery-based interactive navigation with animations
 * Assignment #8 - Interactive Website
 *
 * Features:
 * - Responsive burger menu for mobile devices
 * - Smooth scroll animations
 * - Sticky navigation on scroll
 * - Interactive hover effects
 * - Fade and slide animations
 */

$(document).ready(function () {
  // ========================================
  // BURGER MENU TOGGLE
  // ========================================
  $("#navBurger, .nav__burger").on("click", function (e) {
    e.stopPropagation();

    // Toggle active classes
    $(this).toggleClass("active");
    $(".nav__links, #navLinks").toggleClass("active");
    $(".nav__overlay, #navOverlay").fadeToggle(300);

    // Prevent body scroll when menu is open
    if ($(this).hasClass("active")) {
      $("body").css("overflow", "hidden");
    } else {
      $("body").css("overflow", "auto");
    }
  });

  // ========================================
  // CLOSE MENU ON OVERLAY CLICK
  // ========================================
  $(".nav__overlay, #navOverlay").on("click", function () {
    $(".nav__burger, #navBurger").removeClass("active");
    $(".nav__links, #navLinks").removeClass("active");
    $(this).fadeOut(300);
    $("body").css("overflow", "auto");
  });

  // ========================================
  // CLOSE MENU WHEN LINK IS CLICKED (Mobile)
  // ========================================
  $(".nav__links a, #navLinks a").on("click", function () {
    if ($(window).width() <= 768) {
      $(".nav__burger, #navBurger").removeClass("active");
      $(".nav__links, #navLinks").removeClass("active");
      $(".nav__overlay, #navOverlay").fadeOut(300);
      $("body").css("overflow", "auto");
    }
  });

  // ========================================
  // STICKY NAVIGATION ON SCROLL
  // ========================================
  let lastScrollTop = 0;
  $(window).on("scroll", function () {
    const scrollTop = $(this).scrollTop();

    // Add sticky class when scrolled down
    if (scrollTop > 100) {
      $("nav, #navbar").addClass("sticky");
    } else {
      $("nav, #navbar").removeClass("sticky");
    }

    lastScrollTop = scrollTop;
  });

  // ========================================
  // ACTIVE LINK MANAGEMENT
  // ========================================
  $(".nav__links a, #navLinks a").on("click", function (e) {
    const href = $(this).attr("href");

    // Only prevent default for hash links
    if (href && href.startsWith("#")) {
      e.preventDefault();

      // Remove active class from all links
      $(".nav__links a, #navLinks a").removeClass("active");

      // Add active class to clicked link
      $(this).addClass("active");

      // Smooth scroll to section
      const target = $(href);
      if (target.length) {
        $("html, body").animate(
          {
            scrollTop: target.offset().top - 100,
          },
          800,
          "swing"
        );
      }
    }
  });

  // ========================================
  // SMOOTH SCROLL FOR ALL ANCHOR LINKS
  // ========================================
  $('a[href^="#"]').on("click", function (e) {
    const target = $(this.hash);
    if (target.length && this.hash !== "#") {
      e.preventDefault();
      $("html, body").animate(
        {
          scrollTop: target.offset().top - 100,
        },
        800,
        "swing"
      );
    }
  });

  // ========================================
  // JOIN BUTTON CLICK ANIMATION (обе кнопки!)
  // ========================================
  $("#joinBtn, #mobileJoinBtn").on("click", function (e) {
    const $btn = $(this);

    // Add pulse animation
    $btn.addClass("pulse");
    setTimeout(() => {
      $btn.removeClass("pulse");
    }, 600);

    // Create and show notification
    const $notification = $("<div>")
      .addClass("notification")
      .html('<i class="ri-check-line"></i> Welcome to Fitclub!')
      .css({
        position: "fixed",
        top: "20px",
        right: "-300px",
        background:
          "linear-gradient(135deg, var(--secondary-color), var(--secondary-color-light))",
        color: "white",
        padding: "1rem 2rem",
        borderRadius: "10px",
        fontSize: "1rem",
        zIndex: 10000,
        boxShadow: "0 5px 20px rgba(139, 21, 56, 0.4)",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      })
      .appendTo("body");

    // Slide in notification
    $notification.animate({ right: "20px" }, 400);

    // Slide out and remove after delay
    setTimeout(() => {
      $notification.animate({ right: "-300px" }, 400, function () {
        $(this).remove();
      });
    }, 3000);

    // ✅ ЗАКРЫВАЕМ мобильное меню после клика
    if ($(window).width() <= 768) {
      $(".nav__burger, #navBurger").removeClass("active");
      $(".nav__links, #navLinks").removeClass("active");
      $(".nav__overlay, #navOverlay").fadeOut(300);
      $("body").css("overflow", "auto");
    }
  });

  // ========================================
  // WINDOW RESIZE HANDLER
  // ========================================
  let resizeTimer;
  $(window).on("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // Close mobile menu on desktop resize
      if ($(window).width() > 768) {
        $(".nav__links, #navLinks").removeClass("active");
        $(".nav__burger, #navBurger").removeClass("active");
        $(".nav__overlay, #navOverlay").hide();
        $("body").css("overflow", "auto");
      }
    }, 250);
  });
});
