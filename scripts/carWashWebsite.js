// Hamburger Menu
const navBar = document.querySelector(".nav__links");
const openMenuBtn = document.querySelector(".open__btn");
const closeMenuBtn = document.querySelector(".close__btn");
const navLinks = document.querySelectorAll(".nav__links a");

if(openMenuBtn && navBar) {
  openMenuBtn.addEventListener("click", () => {
    navBar.classList.add("active");
  });
}
if(closeMenuBtn && navBar) {
  closeMenuBtn.addEventListener("click", () => {
    navBar.classList.remove("active");
  });
}
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    if(navBar) navBar.classList.remove("active");
  });
});

//OnScroll Sticky Navbar Container
const stickyContainer = document.querySelector(".section__container");
const stickyNavbar = document.querySelector(".nav__container");

window.addEventListener("scroll", () => {
  if(stickyContainer) {
    stickyContainer.classList.toggle("sticky__cont", window.scrollY > 150);
  }

  if(stickyNavbar) {
    stickyNavbar.classList.toggle("sticky__navbar", window.scrollY > 150);
  }
});

//Service Slider
const allServices = document.querySelector(".our__services");
const services = document.querySelectorAll(".service__item");
const dots = document.querySelectorAll(".circle");

if(allServices && services.length && dots.length) {
  let currentIndex = 0;
  let startX = 0;
  let endX = 0;
  const swipe = 50;

  function displayCards() {
    if(window.innerWidth >= 992) return 3;
    if(window.innerHeight >= 768) return 2;
    return 1;
  }

  function showService(index) {
    const theCards = displayCards();
    const totalCards = services.length - theCards;

    if(index < 0) index = 0;
    if(index > totalCards) index = totalCards;

    const serviceWidth = services[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(allServices).gap);
    const moveX = index * (serviceWidth + gap);

    allServices.style.transform = 
    `translateX(-${moveX}px)`;
    dots.forEach(dot => dot.classList.remove("active"));
    if(dots[index]) dots[index].classList.add("active");

    currentIndex = index;
  }

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      showService(Number(dot.dataset.index));
    });
  });

  allServices.addEventListener("touchstart", e => startX = e.touches[0].clientX);
  allServices.addEventListener("touchmove", e => endX = e.touches[0].clientX);

  allServices.addEventListener("touchend", () => {
    const distance = startX - endX;
    if(Math.abs(distance) > swipe) {
      if(distance > 0) showService(currentIndex + 1);
      if(distance < 0) showService(currentIndex - 1);
    }
    startX = endX = 0;
  });
  window.addEventListener("resize", () => showService(currentIndex));
}

//Project Filter
const projectBtn = document.querySelectorAll(".project-btn");
const projectIMG = document.querySelectorAll(".project__item");

projectBtn.forEach(btns => {
  btns.addEventListener("click", () => {
    projectBtn.forEach(btn => btn.classList.remove("active"));
    btns.classList.add("active");

    const filter = btns.dataset.filter.toLowerCase();

    const firstPOS = new Map();
    projectIMG.forEach(img => {
      firstPOS.set(img, img.getBoundingClientRect());
    });

    projectIMG.forEach(img => {
      const category = img.dataset.category.toLowerCase();
      const displayIMG = filter === "all" || category === filter;

      if(!displayIMG) {
        img.classList.add("hidden");
      }
    });

    setTimeout(() => {
      projectIMG.forEach(img => {
        const category = img.dataset.category.toLowerCase();
        const displayIMG = filter === "all" || category === filter;

        if(displayIMG) {
          img.style.display = "block";
          img.classList.add("hidden");
        } else {
          img.style.display = "none";
        }
      });

      projectIMG.forEach(img => {
        if(img.style.display === "none") return;

        const last = img.getBoundingClientRect();
        const first = firstPOS.get(img);

        const dx = first.left - last.left;
        const dy = first.top - last.top;

        img.style.transform = `translate(${dx}px, ${dy}px)`;

        img.offsetHeight;
        img.style.transform = `translate(0, 0)`;
      });

      requestAnimationFrame(() => {
        projectIMG.forEach(img => {
          if(img.style.display !== "none") {
            img.classList.remove("hidden");
          }
        });
      });
    }, 500);
  });
});

//Counter Animation onScroll
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".counter");

  if(!counters.length) return

  const formatNumber = (num) => {
    if(num >= 1000) {
      return Math.floor(num / 1000) + "K"
    }
    return num;
  }

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.target);
    const duration = 1500;
    const startTime = performance.now();

    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);

      counter.textContent = formatNumber(value);

      if(progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent - formatNumber(target);
      }
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px"
    }
  );
  counters.forEach(counter => observer.observe(counter));
});

const toggles = document.querySelectorAll(".faq-btn");
toggles.forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    const content = btn.nextElementSibling;
    if(content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

//Location Map 
const statusText = document.getElementById("status");

window.addEventListener("load", () => {
  if (!navigator.geolocation) {
    statusText.textContent = "Geolocation not supported.";
    return;
  }

  navigator.geolocation.getCurrentPosition(success, error);
});

function success(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  const map = L.map("map").setView([lat, lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup("You are here 📍")
    .openPopup();
}

function error() {
  statusText.textContent = "Location permission denied.";
}

// Page Transition Loader
const loader = document.querySelector(".page-loader");

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.classList.add("hide");
    document.body.classList.add("fade-in");
  }, 2000);
});

document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", function(e) {
    const href = this.getAttribute("href");
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      this.target === "_blank"
    ) return;

    e.preventDefault();

    loader.classList.remove("hide");

    document.body.classList.add("fade-out");

    setTimeout(() => {
      window.location.href = href;
    }, 400);
  });
});