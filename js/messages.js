document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('messagesGrid');
  if (!grid) return;

  // Show loading with gold accent
  grid.innerHTML = `<p style="color: #D4B26A; text-align: center;">Loading...</p>`;

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      grid.innerHTML = `<p class="empty-state">No birthday wishes yet. Be the first to leave one ❤️</p>`;
      return;
    }

    grid.innerHTML = '';
    data.forEach(msg => {
      const card = document.createElement('div');
      card.className = 'message-card-item reveal';

      // Random avatar color
      const colors = ['#D4B26A','#E88D7A','#A6B7A1','#F4EEF5','#C7C0CC','#6b5f6e'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const initial = msg.name ? msg.name.charAt(0).toUpperCase() : '?';

      const time = new Date(msg.created_at).toLocaleDateString();

      card.innerHTML = `
        <div class="message-meta">
          <span class="message-avatar" style="background:${color}">${initial}</span>
          <span class="message-name">${escapeHtml(msg.name)}</span>
          <span class="message-time">${time}</span>
        </div>
        <div class="message-text-item">${escapeHtml(msg.message)}</div>
      `;
      grid.appendChild(card);
    });

    // Re-run observer for new cards
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.message-card-item.reveal').forEach(el => observer.observe(el));

  } catch (err) {
    console.error('Error loading messages:', err);
    // Error shown with coral accent
    grid.innerHTML = `<p style="color: #E88D7A; text-align: center;">Could not load messages. Please try again later.</p>`;  }
});

// Simple escape to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}