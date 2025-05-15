import { trpc } from './trpc';

const counterValueElement = document.getElementById('counter-value') as HTMLSpanElement;
const incrementButton = document.getElementById('increment-button') as HTMLButtonElement;
const decrementButton = document.getElementById('decrement-button') as HTMLButtonElement;

let currentPostId: string | null = null;

async function fetchInitialCount() {
  const [count, { postId }] = await Promise.all([trpc.counter.get.query(), trpc.init.query()]);

  counterValueElement.textContent = count.toString();
  if (postId) {
    currentPostId = postId;
  }
}

async function updateCounter(action: 'increment' | 'decrement') {
  if (!currentPostId) {
    console.error('Cannot update counter: postId is not initialized.');
    // Optionally, you could try to re-initialize or show an error to the user.
    return;
  }

  if (action === 'increment') {
    const increment = await trpc.counter.increment.mutate({ amount: 2 });
    counterValueElement.textContent = increment.toString();
  } else {
    const decrement = await trpc.counter.decrement.mutate({ amount: -2 });
    counterValueElement.textContent = decrement.toString();
  }
}

incrementButton.addEventListener('click', () => updateCounter('increment'));
decrementButton.addEventListener('click', () => updateCounter('decrement'));

// Fetch the initial count when the page loads
fetchInitialCount();
