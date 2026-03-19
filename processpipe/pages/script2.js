document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.primary-nav');

    // Open / Close menu when clicking the hamburger
    menuToggle.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from closing immediately
        const isOpen = menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', false);
        });
    });

    // Close menu when clicking anywhere outside of it
    document.addEventListener('click', (event) => {
        const clickedInsideMenu = navMenu.contains(event.target) || menuToggle.contains(event.target);

        if (!clickedInsideMenu) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', false);
        }
    });

});

// Animate sections on scroll
document.addEventListener('DOMContentLoaded', () => {
    const scrollElements = document.querySelectorAll('.animate-on-scroll');

    const elementInView = (el, offset = 0) => {
        const elementTop = el.getBoundingClientRect().top;
        return elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset;
    };

    const displayScrollElement = (el) => {
        el.classList.add('scroll-visible');  // matches CSS now
    };

    const hideScrollElement = (el) => {
        el.classList.remove('scroll-visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 100)) {  
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation(); // run on load
});

// ---- MOBILE DROPDOWN BEHAVIOR ---- //
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', function (e) {

        // Only apply on mobile
        if (window.innerWidth <= 900) {
            e.preventDefault(); // stop it from opening the parent link

            const parent = this.parentElement;

            // Close any other open dropdowns
            document.querySelectorAll('.dropdown.open').forEach(drop => {
                if (drop !== parent) {
                    drop.classList.remove('open');
                }
            });

            // Toggle current dropdown
            parent.classList.toggle('open');
        }
    });
});

// ---- Search function ---- //
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.nav-search');
    const searchInput = document.getElementById('site-search');
    const resultsContainer = document.getElementById('search-results');

    const siteContent = [
        { title: "Home", url: "../index.html", keywords: "home process pipe company pipes fittings flanges" },
        { title: "About Us", url: "about.html", keywords: "about process pipe company history products services" },
        { title: "Products - Pipes", url: "pipes.html", keywords: "pipes carbon steel mild steel seamless welded" },
        { title: "Products - Fittings", url: "fittings.html", keywords: "fittings pipe connectors" },
        { title: "Products - Flanges", url: "flanges.html", keywords: "flanges plate forged ANSI BS SANS" },
        { title: "Blog", url: "blog.html", keywords: "blog news insights tips articles" },
        { title: "Contact Us", url: "contact.html", keywords: "contact address phone email office branches" },
    ];

    function performSearch(query) {
        resultsContainer.innerHTML = ''; // Clear previous results
        resultsContainer.classList.remove('active'); // Hide by default

        if (!query) return;

        const results = siteContent.filter(page =>
            page.keywords.toLowerCase().includes(query.toLowerCase())
        );

        if (results.length === 0) {
            resultsContainer.innerHTML = `<p>No results found for "<strong>${query}</strong>".</p>`;
        } else {
            const resultsHTML = results.map(page => `
                <div class="search-result-item">
                    <a href="${page.url}">${page.title}</a>
                </div>
            `).join('');
            resultsContainer.innerHTML = resultsHTML;
        }

        resultsContainer.classList.add('active'); // Show results
    }

    // Handle form submission
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        performSearch(query);
    });

    // Hide results if user clicks outside
    document.addEventListener('click', (e) => {
        if (!searchForm.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.classList.remove('active');
        }
    });

    // Optional: live search while typing
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        performSearch(query);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".product-item");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add("slide-in");
            }
        });
    }, {
        threshold: 0.6 // trigger when 20% visible
    });

    items.forEach(item => observer.observe(item));
});
