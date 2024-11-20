document.addEventListener("DOMContentLoaded", () => {
  // Initialize loader first
  const loader = document.querySelector(".loader");
  const mainContent = document.querySelector("#main-content");
  const navbar = document.querySelector(".navbar");
  const percentage = document.querySelector(".loader-percentage");
  let progress = 0;

  // Hide main content and navbar initially
  mainContent.style.opacity = "0";
  navbar.style.opacity = "0";
  navbar.style.transform = "translate(-50%, -20px)";

  // Function to scroll to hero section
  const scrollToHero = () => {
    window.scrollTo({
      top: 0,
      behavior: "instant", // Use 'instant' instead of 'smooth' to avoid visible scrolling
    });
  };

  const startLoader = () => {
    const interval = setInterval(() => {
      progress += 2;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Hide loader and show content
        loader.classList.add("hidden");
        mainContent.style.opacity = "1";

        // Show navbar with proper animation
        setTimeout(() => {
          navbar.style.opacity = "1";
          navbar.style.pointerEvents = "all";
          
          // Force scroll to top
          window.scrollTo(0, 0);
          
          // Initialize horizontal scroll after a delay
          setTimeout(() => {
            initHorizontalScroll();
          }, 100);
        }, 300);
      }
      percentage.textContent = progress + "%";
    }, 30);
  };

  // Prevent scroll during load
  document.body.style.overflow = "hidden";

  // Start the loader
  startLoader();

  // Release scroll lock after loader
  loader.addEventListener("transitionend", () => {
    if (loader.classList.contains("hidden")) {
      document.body.style.overflow = "";
    }
  });

  // Update ScrollTrigger on window resize
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh(true);
  });

  // Initialize GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Horizontal Scroll Animation
  const initHorizontalScroll = () => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Kill any existing scroll triggers
    ScrollTrigger.getAll().forEach(st => st.kill());
    
    const sections = gsap.utils.toArray(".panel");
    const container = document.querySelector(".panels-container");
    
    // Set the container width based on number of panels
    gsap.set(container, {
        width: sections.length * 100 + "vw",
        height: "100vh"
    });
    
    // Set each panel to full viewport width
    gsap.set(sections, {
        width: "100vw",
        height: "100vh"
    });
    
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".horizontal-sections",
            pin: true,
            pinSpacing: true,
            start: "top top",
            end: () => "+=" + (container.offsetWidth - window.innerWidth),
            scrub: 1,
            snap: {
                snapTo: 1 / (sections.length - 1),
                duration: { min: 0.2, max: 0.3 },
                ease: "power1.inOut",
                inertia: false
            },
            invalidateOnRefresh: true
        }
    });

    tl.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        duration: sections.length
    });

    // Add fade effects for content
    sections.forEach((section, i) => {
        const content = section.querySelector('.project-content');
        const image = section.querySelector('.project-image');
        
        if (i > 0) {
            gsap.set([content, image], { opacity: 0.5, x: 50 });
        }
        
        ScrollTrigger.create({
            trigger: section,
            containerAnimation: tl,
            start: "left center",
            end: "right center",
            onEnter: () => {
                gsap.to([content, image], {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: "power2.out"
                });
            },
            onLeave: () => {
                gsap.to([content, image], {
                    opacity: 0.5,
                    x: -50,
                    duration: 0.4,
                    stagger: 0.1
                });
            },
            onEnterBack: () => {
                gsap.to([content, image], {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    stagger: 0.1
                });
            },
            onLeaveBack: () => {
                gsap.to([content, image], {
                    opacity: 0.5,
                    x: 50,
                    duration: 0.4,
                    stagger: 0.1
                });
            }
        });
    });

    // Refresh ScrollTrigger after everything is set up
    ScrollTrigger.refresh();
  };

  // Add resize handler
  window.addEventListener("resize", () => {
    // Debounce the refresh
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
        initHorizontalScroll();
    }, 250);
  });

  // Initialize ScrollTrigger after page load
  window.addEventListener("load", () => {
    initHorizontalScroll();
  });

  // Navbar functionality
  const initNavbar = () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navWrapper = document.querySelector(".nav-wrapper");

    menuToggle?.addEventListener("click", () => {
      navWrapper.classList.toggle("active");
      menuToggle.setAttribute(
        "aria-expanded",
        menuToggle.getAttribute("aria-expanded") === "false" ? "true" : "false"
      );
    });
  };

  // Add this function for navbar scroll behavior
  const handleNavbarVisibility = () => {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    let hideTimeout;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Clear any existing timeout
        clearTimeout(hideTimeout);

        if (currentScroll <= 0) {
            // At the top of the page
            navbar.classList.remove('hidden');
            return;
        }

        if (currentScroll > lastScroll) {
            // Scrolling down
            navbar.classList.add('hidden');
        } else {
            // Scrolling up
            navbar.classList.remove('hidden');
            
            // Hide after 3 seconds
            hideTimeout = setTimeout(() => {
                navbar.classList.add('hidden');
            }, 3000);
        }

        lastScroll = currentScroll;
    });
  };

  // Initialize everything
  initHorizontalScroll();
  initNavbar();

  // Initialize navbar visibility handler
  handleNavbarVisibility();
});
