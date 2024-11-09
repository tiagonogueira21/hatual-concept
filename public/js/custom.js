function updateSvgAttributes(viewBox, maskValue) {
    const icon = document.querySelector("#logo-div");
    if (icon) {
        const logoHolder = icon.querySelector("#logo-holder");
        const svg = icon.querySelector("#logo-animado");

        if (logoHolder) {
            if (maskValue === null) {
                logoHolder.removeAttribute("mask");
            } else {
                logoHolder.setAttribute("mask", maskValue);
            }
        }

        if (svg) {
            svg.setAttribute("viewBox", viewBox);
        }
    }
}

function handleScroll() {
    const logo_div = document.getElementById("logo-div");
    if (window.scrollY > 200) {
        if (!logo_div.classList.contains("icon")) {
            logo_div.classList.add("icon");
            updateSvgAttributes("0 0 40 40", null); // Apply changes when scrolling down
        }
    } else {
        if (logo_div.classList.contains("icon")) {
            logo_div.classList.remove("icon");
            updateSvgAttributes("0 0 166 44", "url(#mask)"); // Revert changes when scrolling up
        }
    }
}

// Attach scroll event listener
window.addEventListener("scroll", handleScroll);

// Initial setup on page load
document.addEventListener("DOMContentLoaded", function () {
    handleScroll(); // Ensure proper state on page load
});
