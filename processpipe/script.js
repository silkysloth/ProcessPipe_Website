// ================================
// MENU TOGGLE
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".primary-nav");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = menuToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", isOpen);
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        navMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", false);
      });
    });

    document.addEventListener("click", (event) => {
      const clickedInsideMenu =
        navMenu.contains(event.target) || menuToggle.contains(event.target);

      if (!clickedInsideMenu) {
        menuToggle.classList.remove("active");
        navMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", false);
      }
    });
  }
});

// ================================
// SCROLL ANIMATIONS
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const scrollElements = document.querySelectorAll(".animate-on-scroll");

  const elementInView = (el, offset = 0) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <=
      (window.innerHeight || document.documentElement.clientHeight) - offset
    );
  };

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 100)) {
        el.classList.add("scroll-visible");
      } else {
        el.classList.remove("scroll-visible");
      }
    });
  };

  window.addEventListener("scroll", handleScrollAnimation);
  handleScrollAnimation();
});

// ================================
// MOBILE DROPDOWN
// ================================
document.querySelectorAll(".dropdown-toggle").forEach((toggle) => {
  toggle.addEventListener("click", function (e) {
    if (window.innerWidth <= 900) {
      e.preventDefault();
      const parent = this.parentElement;

      document.querySelectorAll(".dropdown.open").forEach((drop) => {
        if (drop !== parent) drop.classList.remove("open");
      });

      parent.classList.toggle("open");
    }
  });
});

// ================================
// NAVBAR PAGE SEARCH
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector(".nav-search");
  const searchInput = document.getElementById("site-search");
  const resultsContainer = document.getElementById("search-results");

  if (!searchForm || !searchInput || !resultsContainer) return;

  const siteContent = [
    {
      title: "Home",
      url: "index.html",
      keywords: "home process pipe company pipes fittings flanges",
    },
    {
      title: "About Us",
      url: "pages/about.html",
      keywords: "about process pipe company history products services",
    },
    {
      title: "Products - Pipes",
      url: "pages/pipes.html",
      keywords: "pipes carbon steel mild steel seamless welded",
    },
    {
      title: "Products - Fittings",
      url: "pages/fittings.html",
      keywords: "fittings pipe connectors",
    },
    {
      title: "Products - Flanges",
      url: "pages/flanges.html",
      keywords: "flanges plate forged ANSI BS SANS",
    },
    { title: "Blog", url: "pages/blog.html", keywords: "blog news insights tips articles" },
    {
      title: "Contact Us",
      url: "pages/contact.html",
      keywords: "contact address phone email office branches",
    },
  ];

  function performSearch(query) {
    resultsContainer.innerHTML = "";
    resultsContainer.classList.remove("active");

    if (!query) return;

    const results = siteContent.filter((page) =>
      page.keywords.toLowerCase().includes(query.toLowerCase())
    );

    if (results.length === 0) {
      resultsContainer.innerHTML = `<p>No results found for "<strong>${query}</strong>".</p>`;
    } else {
      resultsContainer.innerHTML = results
        .map(
          (page) => `
          <div class="search-result-item">
            <a href="${page.url}">${page.title}</a>
          </div>
        `
        )
        .join("");
    }

    resultsContainer.classList.add("active");
  }

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    performSearch(searchInput.value.trim());
  });

  searchInput.addEventListener("input", () => {
    performSearch(searchInput.value.trim());
  });

  document.addEventListener("click", (e) => {
    if (!searchForm.contains(e.target) && !resultsContainer.contains(e.target)) {
      resultsContainer.classList.remove("active");
    }
  });
});

// ================================
// PRODUCT CATALOGUE SEARCH (CLICKABLE)
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const productSearchInput = document.getElementById("product-search");
  const productResults = document.getElementById("product-results");

  if (!productSearchInput || !productResults) return;

  let products = [];

  // Make paths work whether you're on /index.html or /pages/anything.html
  const isInPagesFolder = window.location.pathname.includes("/pages/");
  const dataPath = isInPagesFolder ? "../data/search-index.json" : "data/search-index.json";
  const productPagePath = isInPagesFolder ? "product.html" : "pages/product.html";

  const asaPath = isInPagesFolder ? "../data/reference/asa-pipe-schedules.json" : "data/reference/asa-pipe-schedules.json";

  function slugifyNps(nps) {
    return String(nps || "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  function buildAsaIndexItems(asaJson) {
    const pipes = asaJson?.pipes || [];
    const scheduleOrder = asaJson?.schedule_order || [];

    return pipes.map((p) => {
      const nps = p.nps;
      const od = p.od_mm;
      const schedules = p.schedules || {};

      const presentSchedules = Object.keys(schedules).filter((k) => schedules[k]);
      const scheduleKeywords = (scheduleOrder.length ? scheduleOrder : presentSchedules)
        .map((k) => `sch ${k}`)
        .join(" ");

      const npsKeywords = [
        nps,
        String(nps || "").replaceAll('"', " inch"),
        String(nps || "").replaceAll('"', "in"),
        String(nps || "").replaceAll('"', "inch"),
      ].filter(Boolean).join(" ");

      return {
        id: `asa-${slugifyNps(nps) || Math.random().toString(36).slice(2)}` ,
        type: "asa_schedule",
        standard: asaJson?.standard || "ASA / ASME Pipe Schedules",
        description: "Pipe schedules (reference)",
        nps,
        od_mm: od,
        schedules,
        keywords: `asa asme ansi b36 pipe schedule schedules ${npsKeywords} od ${od} ${scheduleKeywords} ${presentSchedules.join(" ")} ${String(od || "")}`.toLowerCase(),
      };
    });
  }

  Promise.all([
    fetch(dataPath).then((res) => res.json()),
    fetch(asaPath).then((res) => res.json()).catch(() => null),
  ])
    .then(([catalogue, asaJson]) => {
      products = catalogue || [];
    })
    .catch((err) => console.error("Failed to load catalogue:", err));

  function renderResults(results) {
    if (results.length === 0) {
      productResults.innerHTML = "<p>No products found.</p>";
      return;
    }

    productResults.innerHTML = results
      .map((p) => {
        const size = p.size || p["nominal bore"] || p["nominal diameter"] || "N/A";
        const href = `${productPagePath}?id=${encodeURIComponent(p.id)}`;

        return `
          <a class="product-result" href="${href}">
            <strong>${p.standard}</strong> ${p.description}<br>
            Size: ${size}
          </a>
        `;
      })
      .join("");
  }

  function searchProducts(query) {
    if (!query) {
      productResults.innerHTML = "";
      return;
    }

    const q = query.toLowerCase();
    const results = products.filter((p) =>
      String(p.keywords || "").toLowerCase().includes(q)
    );

    renderResults(results);
  }

  productSearchInput.addEventListener("input", (e) => {
    searchProducts(e.target.value.trim());
  });
});