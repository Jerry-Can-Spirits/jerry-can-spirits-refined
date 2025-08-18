document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cocktailCards = document.querySelectorAll('.cocktail-card');

  if (filterButtons.length === 0 || cocktailCards.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      if (!filter) return;
      
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      cocktailCards.forEach(card => {
        const cardElement = card;
        const difficultyBadge = cardElement.querySelector('.difficulty-badge');
        const difficulty = difficultyBadge ? difficultyBadge.textContent?.toLowerCase().trim() : null;

        if (filter === 'all' || filter === difficulty) {
          cardElement.style.display = 'block';
        } else {
          cardElement.style.display = 'none';
        }
      });
    });
  });
});