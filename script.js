const stripe = Stripe('pk_test_51Qm0kgAYknGrVrwwOStQAN1dzQ92LCFBfGdW0R6unDedcogNpYAM6yaIZ3ncQY8HLi50IR82kFBeiTq9ie0O2Ks8000LSFXuVn');

const menuToggle = document.getElementById('menu-toggle');
const nav = document.querySelector('.nav');
menuToggle.addEventListener('click', () => nav.classList.toggle('open'));

const buyButtons = document.querySelectorAll('.buy-button');
const btn = document.querySelector('.buy-button');
btn.addEventListener('touchstart', () => btn.classList.add('pressed'));
btn.addEventListener('touchend',   () => btn.classList.remove('pressed'));


buyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const name = button.dataset.name;       // ahora existe
    const amount = parseInt(button.dataset.amount);   // ahora existe
    const currency = button.dataset.currency || 'usd';
    const productId = button.dataset.id;     // ahora existe

    if (!name || isNaN(amount)) {
      alert('Error: faltan datos del producto.');
      return;
    }

    try {
      const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          amount, 
          currency,
          productId
        })
      });

      const data = await response.json();

      if (data.sessionId) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        alert('No se pudo iniciar el proceso de compra: ' + (data.error || 'Error desconocido'));
      }
    } catch (err) {
      console.error('Error en fetch /create-checkout-session:', err);
      alert('Error al conectar con el servidor. Revisa la consola.');
    }
  });
});
