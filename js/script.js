document.addEventListener("DOMContentLoaded", () => {
    const possibleTextIds = ["startText", "omOssText", "menyText", "kontaktText", "handlaText"];
    possibleTextIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("fade-in");
    });

    const dropdown = document.querySelector(".dropdown");
    const dropdownContent = document.querySelector(".dropdown-content");
    if (dropdown && dropdownContent) {
        dropdown.addEventListener("mouseenter", () => {
            dropdownContent.style.maxHeight = "12.5rem";
            dropdownContent.style.opacity = "1";
        });
        dropdown.addEventListener("mouseleave", () => {
            dropdownContent.style.maxHeight = "0";
            dropdownContent.style.opacity = "0";
        });
    }

    const elements = document.querySelectorAll(".scroll-fade");
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.2
    });
    elements.forEach(el => observer.observe(el));

    const arrow = document.querySelector(".header-arrow");
    const termsContainer = document.querySelector(".terms-container");
    if (arrow && termsContainer) {
        const caretIcon = arrow.querySelector("i");
        arrow.addEventListener("click", () => {
            termsContainer.classList.toggle("visible");
            if (caretIcon) caretIcon.classList.toggle("rotated");
        });
    }
});