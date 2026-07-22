document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('messageForm');
  const card = document.getElementById('messageFormCard');
  const thankYou = document.getElementById('thankYouCard');
  const feedback = document.getElementById('formFeedback');
  const sendBtn = document.getElementById('sendButton');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.textContent = '';

    const name = document.getElementById('senderName').value.trim();
    const message = document.getElementById('messageText').value.trim();

    if (!name || !message) {
      feedback.textContent = 'Please fill in all fields.';
      return;
    }

    // Basic client-side validation
    if (name.length > 25) {
      feedback.textContent = 'Name must be 25 characters or less.';
      return;
    }
    if (message.length > 300) {
      feedback.textContent = 'Message must be 300 characters or less.';
      return;
    }
    // Prevent HTML/links (basic)
    if (/<[^>]*>/.test(message) || /https?:\/\/|www\./i.test(message)) {
      feedback.textContent = 'Please avoid HTML or links.';
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{ name, message }]);

      if (error) throw error;

      // Success
      card.style.display = 'none';
      thankYou.style.display = 'block';
    } catch (err) {
      console.error(err);
      feedback.textContent = 'Something went wrong. Please try again later.';
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send Message';
    }
  });
});