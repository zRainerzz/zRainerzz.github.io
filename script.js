// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuToggle) {
    menuToggle.addEventListener("click", function() {
      mobileMenu.classList.toggle("active");
    });
  }

  // Header Scroll Effect
  const header = document.getElementById("header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("py-2");
      header.classList.remove("py-3");
    } else {
      header.classList.add("py-3");
      header.classList.remove("py-2");
    }
  });

  // Navigation functionality for landing page with smooth scrolling
  const navLinks = document.querySelectorAll("nav ul li a, #mobile-menu ul li a");
  const ctaButtons = document.querySelectorAll(".cta-buttons .btn");
  
  // Smooth scrolling function
  function smoothScroll(target, duration) {
    const targetElement = document.querySelector(target);
    if (!targetElement) return;
    
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }

  // Handle navigation clicks for landing page
  navLinks.forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      const sectionId = this.getAttribute("data-section");
      
      // Update active nav link
      navLinks.forEach(navLink => {
        navLink.classList.remove("active");
      });
      this.classList.add("active");
      
      // Close mobile menu if open
      if (mobileMenu.classList.contains("active")) {
        mobileMenu.classList.remove("active");
      }
      
      // Smooth scroll to section
      smoothScroll("#" + sectionId + "-section", 1000);
    });
  });

  // Add click event to CTA buttons
  ctaButtons.forEach(button => {
    button.addEventListener("click", function(e) {
      e.preventDefault();
      const sectionId = this.getAttribute("data-section");
      
      // Update active nav link
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("data-section") === sectionId) {
          link.classList.add("active");
        }
      });
      
      // Smooth scroll to section
      smoothScroll("#" + sectionId + "-section", 1000);
    });
  });

  // Portfolio filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const filterValue = button.getAttribute('data-filter');
      
      portfolioItems.forEach(item => {
        if (filterValue === 'all') {
          item.classList.remove('hidden');
        } else {
          const categories = item.getAttribute('data-category').split(' ');
          if (categories.includes(filterValue)) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        }
      });
    });
  });

  // Service details modal functionality
  const serviceDetailsBtns = document.querySelectorAll(".service-details-btn");
  const modal = document.getElementById("service-details-modal");
  const closeModal = document.querySelector(".close-modal");
  const modalContents = document.querySelectorAll(".modal-service-content");

  serviceDetailsBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      const serviceType = this.parentElement.getAttribute("data-service");

      // Hide all modal contents
      modalContents.forEach(content => {
        content.classList.remove("active");
      });

      // Show selected service content
      document.getElementById("modal-content-" + serviceType).classList.add("active");

      // Show modal
      modal.classList.add("active");
    });
  });

  // Close modal on X click
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  // Close modal when clicking outside
  window.addEventListener("click", e => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });

  // Contact form submission
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", e => {
      e.preventDefault();
      
      // Here you would normally send the form data to a server
      // For now, just show a success message
      alert("Message sent successfully! We will get back to you soon.");
      
      // Reset form
      contactForm.reset();
    });
  }

  // Initialize scroll animations
  initScrollAnimations();
});

// Initialize scroll animations
function initScrollAnimations() {
  // Select all elements to animate
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  // Intersection Observer options
  const options = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.1 // 10% of the element must be visible
  };
  
  // Create observer
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        // Optionally stop observing the element after it's animated
        // observer.unobserve(entry.target);
      }
    });
  }, options);
  
  // Observe all animated elements
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// Initialize loading screen animation
function initLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen");
  const loadingBar = document.querySelector(".loading-bar");

  // Force the loading screen to complete and disappear
  let width = 0;
  const loadingInterval = setInterval(() => {
    if (width >= 100) {
      clearInterval(loadingInterval);
      
      // Update loading text
      const loadingText = document.querySelector(".loading-text");
      if (loadingText) {
        loadingText.textContent = "Environment secured. Entering...";
      }
      
      // Hide loading screen after a short delay
      setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.style.opacity = "0";
          setTimeout(() => {
            loadingScreen.style.display = "none";
            // Initialize 3D scene after loading
            initScene();
          }, 500);
        }
      }, 500);
    } else {
      width += 5;
      if (loadingBar) {
        loadingBar.style.width = width + "%";
      }
    }
  }, 50); // Faster loading for better user experience
}

// Initialize Three.js scene
function initScene() {
  try {
    // Import Three.js library
    const THREE = window.THREE;

    // Get the container element
    const container = document.getElementById("scene-container");
    if (!container) return;

    // Scene, camera, and renderer setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0B0C10); // Deep black background

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;

    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

    // Updated particle color to match your new accent color (purple)
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 064420, // Updated to match new purple accent color
      transparent: true,
      opacity: 0.8,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Add controls if available
    if (typeof THREE.OrbitControls !== 'undefined') {
      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      
      // Animation loop with controls
      function animateWithControls() {
        requestAnimationFrame(animateWithControls);
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0005;
        controls.update();
        renderer.render(scene, camera);
      }
      
      animateWithControls();
    } else {
      // Animation loop without controls
      function animate() {
        requestAnimationFrame(animate);
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0005;
        renderer.render(scene, camera);
      }
      
      animate();
    }

    // Handle window resize
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  } catch (error) {
    console.error("Error initializing 3D scene:", error);
    // Fallback to simple background if Three.js fails
    const container = document.getElementById("scene-container");
    if (container) {
      container.style.backgroundColor = "#0B0C10";
    }
  }
}

// Wait for the page to fully load
window.addEventListener("load", function() {
  // Start the loading screen animation
  initLoadingScreen();
});