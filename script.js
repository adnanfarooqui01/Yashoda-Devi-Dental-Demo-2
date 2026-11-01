const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-navigation");

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
    primaryNav.classList.toggle("is-open", !isExpanded);
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      primaryNav.classList.remove("is-open");
    }
  });
}

const year = document.querySelector("#current-year");
if (year) {
  year.textContent = String(new Date().getFullYear());
}

const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
const heroDots = Array.from(document.querySelectorAll(".hero-dots button"));

function showHeroSlide(index) {
  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === index);
  });
  heroDots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === index;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-pressed", String(isActive));
  });
}

heroDots.forEach((dot, index) => {
  dot.addEventListener("click", () => showHeroSlide(index));
});

const appointmentForm = document.querySelector("#appointment-form");
const bookingStatus = document.querySelector("#booking-status");

if (appointmentForm instanceof HTMLFormElement && bookingStatus) {
  const dateInput = appointmentForm.querySelector("#booking-date");
  if (dateInput instanceof HTMLInputElement) {
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
      .toISOString()
      .slice(0, 10);
    dateInput.min = localDate;
  }

  appointmentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!appointmentForm.reportValidity()) return;

    const formData = new FormData(appointmentForm);
    const message = [
      "Appointment request - Yashoda Devi Dental Clinic",
      `Name: ${formData.get("name")}`,
      `Phone: ${formData.get("phone")}`,
      `Preferred date: ${formData.get("date")}`,
      `Visit reason: ${formData.get("service")}`,
      formData.get("message") ? `Message: ${formData.get("message")}` : "",
    ].filter(Boolean).join("\n");
    const whatsappUrl = `https://wa.me/917499346438?text=${encodeURIComponent(message)}`;
    const whatsappWindow = window.open(whatsappUrl, "_blank");

    if (!whatsappWindow) {
      bookingStatus.textContent = "Your browser blocked the new tab. ";
      bookingStatus.classList.add("is-error");
      const link = document.createElement("a");
      link.href = whatsappUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Open WhatsApp to send your request.";
      bookingStatus.append(link);
      return;
    }

    whatsappWindow.opener = null;
    bookingStatus.textContent = "Your request is ready in WhatsApp. Review it and press send to contact the clinic.";
    bookingStatus.classList.remove("is-error");
  });
}
