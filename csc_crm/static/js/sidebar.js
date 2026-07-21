document.addEventListener("DOMContentLoaded", function () {

    const menuBtn = document.getElementById("menuToggle");
    const sidebar = document.querySelector(".sidebar");
    const wrapper = document.querySelector(".main-wrapper");
    const tabs = document.querySelector(".top-tabs");
    const overlay = document.querySelector(".sidebar-overlay");

    if (!menuBtn || !sidebar) return;

    menuBtn.addEventListener("click", function () {

        // Mobile
        if (window.innerWidth <= 768) {

            sidebar.classList.toggle("show");

            if (overlay) {
                overlay.classList.toggle("show");
            }

        }
        // Desktop
        else {

            sidebar.classList.toggle("collapsed");

            if (wrapper) {
                wrapper.classList.toggle("expanded");
            }

            if (tabs) {
                tabs.style.left = sidebar.classList.contains("collapsed")
                    ? "70px"
                    : "250px";
            }
        }

    });

    // Close sidebar  overlay 
    if (overlay) {

        overlay.addEventListener("click", function () {

            sidebar.classList.remove("show");
            overlay.classList.remove("show");

        });

    }

});