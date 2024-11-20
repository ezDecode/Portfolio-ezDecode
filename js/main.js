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
    
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Mobile animations
        sections.forEach((section, i) => {
            const content = section.querySelector('.project-content');
            const image = section.querySelector('.project-image');
            const number = content.querySelector('.project-number');
            const title = content.querySelector('.project-title');
            const description = content.querySelector('.project-description');
            const link = content.querySelector('.project-link');
            
            // Set initial states
            gsap.set([number, title, description, link], { 
                y: 50,
                opacity: 0 
            });
            gsap.set(image, { 
                y: 100,
                opacity: 0,
                scale: 0.95
            });
            
            ScrollTrigger.create({
                trigger: section,
                start: "top center+=100",
                end: "bottom center",
                onEnter: () => {
                    // Animate content elements with stagger
                    gsap.to([number, title, description, link], {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "power3.out"
                    });
                    
                    // Animate image with scale
                    gsap.to(image, {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 1.2,
                        delay: 0.2,
                        ease: "power3.out"
                    });
                }
            });
        });
    } else {
        // Desktop horizontal scroll setup
        gsap.set(container, {
            width: sections.length * 100 + "vw",
            height: "100vh"
        });
        
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
                    ease: "power2.inOut",
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

        // Enhanced animations for each section
        sections.forEach((section, i) => {
            const content = section.querySelector('.project-content');
            const image = section.querySelector('.project-image');
            const number = content.querySelector('.project-number');
            const title = content.querySelector('.project-title');
            const description = content.querySelector('.project-description');
            const link = content.querySelector('.project-link');
            
            // Set initial states for non-first sections
            if (i > 0) {
                gsap.set([number, title, description, link], { 
                    x: 100,
                    opacity: 0 
                });
                gsap.set(image, { 
                    x: 150,
                    opacity: 0,
                    scale: 0.9,
                    rotate: 5
                });
            }
            
            ScrollTrigger.create({
                trigger: section,
                containerAnimation: tl,
                start: "left center",
                end: "right center",
                onEnter: () => {
                    // Staggered content animation
                    gsap.to([number, title, description, link], {
                        x: 0,
                        opacity: 1,
                        duration: 1,
                        stagger: 0.1,
                        ease: "power3.out"
                    });
                    
                    // Enhanced image animation
                    gsap.to(image, {
                        x: 0,
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                        duration: 1.2,
                        ease: "power3.out"
                    });
                },
                onLeave: () => {
                    // Animate out to left
                    gsap.to([number, title, description, link], {
                        x: -100,
                        opacity: 0,
                        duration: 0.8,
                        stagger: 0.05,
                        ease: "power2.in"
                    });
                    gsap.to(image, {
                        x: -150,
                        opacity: 0,
                        scale: 0.9,
                        rotate: -5,
                        duration: 0.8,
                        ease: "power2.in"
                    });
                },
                onEnterBack: () => {
                    // Animate in from left
                    gsap.to([number, title, description, link], {
                        x: 0,
                        opacity: 1,
                        duration: 1,
                        stagger: 0.1,
                        ease: "power3.out"
                    });
                    gsap.to(image, {
                        x: 0,
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                        duration: 1.2,
                        ease: "power3.out"
                    });
                },
                onLeaveBack: () => {
                    // Animate out to right
                    gsap.to([number, title, description, link], {
                        x: 100,
                        opacity: 0,
                        duration: 0.8,
                        stagger: 0.05,
                        ease: "power2.in"
                    });
                    gsap.to(image, {
                        x: 150,
                        opacity: 0,
                        scale: 0.9,
                        rotate: 5,
                        duration: 0.8,
                        ease: "power2.in"
                    });
                }
            });
        });
    }

    // Refresh ScrollTrigger after everything is set up
    ScrollTrigger.refresh();
  };

  // Add resize handler with debounce
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        initHorizontalScroll();
    }, 250);
  });

  // Initialize ScrollTrigger after page load
  window.addEventListener("load", () => {
    initHorizontalScroll();
  });

  // Navbar functionality
  const initNavbar = () => {
    const hamburger = document.querySelector(".hamburger-menu");
    const navWrapper = document.querySelector(".nav-wrapper");
    const navbar = document.querySelector(".navbar");

    if (hamburger) {
        // Add click event to hamburger
        hamburger.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger clicked'); // Debug log
            hamburger.classList.toggle("active");
            navWrapper.classList.toggle("active");
        });

        // Close menu when clicking outside
        document.addEventListener("click", (e) => {
            if (!navbar.contains(e.target) && navWrapper.classList.contains("active")) {
                hamburger.classList.remove("active");
                navWrapper.classList.remove("active");
            }
        });

        // Close menu when clicking a link
        const navLinks = document.querySelectorAll(".nav-links a");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navWrapper.classList.remove("active");
            });
        });
    }
  };

  // Add this function for navbar scroll behavior
  const handleNavbarVisibility = () => {
    const navbar = document.querySelector(".navbar");
    let lastScroll = 0;
    let hideTimeout;

    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;

      // Clear any existing timeout
      clearTimeout(hideTimeout);

      if (currentScroll <= 0) {
        // At the top of the page
        navbar.classList.remove("hidden");
        return;
      }

      if (currentScroll > lastScroll) {
        // Scrolling down
        navbar.classList.add("hidden");
      } else {
        // Scrolling up
        navbar.classList.remove("hidden");

        // Hide after 3 seconds
        hideTimeout = setTimeout(() => {
          navbar.classList.add("hidden");
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
