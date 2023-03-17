const scrollButton = document.querySelector(".scroll-down");
const scrollContent = document.querySelector(".scroll-content");

let scrollPosition = 0;

scrollButton.addEventListener("click", () => {
  scrollPosition += 400;
  scrollContent.style.transform = `translateY(-${scrollPosition}px)`;
});