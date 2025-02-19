const scrollBtn = document.querySelector("span");

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    scrollBtn.style.opacity = 1;
  } else {
    scrollBtn.style.opacity = 0;
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});