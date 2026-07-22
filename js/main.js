document.addEventListener("DOMContentLoaded", () => {
  // Reveal animations for cards
  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.2 },
  );
  reveals.forEach((el) => observer.observe(el));

  // Staggered product review bars
  const reviewSection = document.querySelector(".review-section");
  if (reviewSection) {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bars = reviewSection.querySelectorAll(".bar-fill");
            bars.forEach((bar, index) => {
              const target = Number(bar.dataset.width);
              setTimeout(() => {
                bar.style.width = `${target}%`;
              }, index * 120);
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );
    barObserver.observe(reviewSection);
  }
});
