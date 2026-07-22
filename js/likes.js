// This is a placeholder – you can extend with Supabase likes table
// For now, just a demo of liking a message
document.addEventListener('click', (e) => {
  const likeBtn = e.target.closest('.like-btn');
  if (likeBtn) {
    const id = likeBtn.dataset.id;
    // In a real app, you'd update the likes count in Supabase
    alert(`Liked message ${id}`);
  }
});