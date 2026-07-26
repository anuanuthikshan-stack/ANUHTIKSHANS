document.addEventListener('DOMContentLoaded', () => {
  // Animate counter numbers
  const counters = document.querySelectorAll('.stat-number');
  
  const animateCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      let count = 0;
      const speed = target / 50;

      const updateCount = () => {
        count += speed;
        if (count < target) {
          counter.innerText = Math.ceil(count) + suffix;
          setTimeout(updateCount, 30);
        } else {
          counter.innerText = target + suffix;
        }
      };

      updateCount();
    });
  };

  // Trigger counters on scroll into view
  let animated = false;
  const statsSection = document.querySelector('.stats-grid');
  
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animated) {
        animateCounters();
        animated = true;
      }
    }, { threshold: 0.5 });
    
    observer.observe(statsSection);
  }

  // Interactive mouse glow tilt effect on feature cards
  const cards = document.querySelectorAll('.feature-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  console.log('🚀 ANUHTIKSHANS Web Application ready for Vercel deployment!');
});
