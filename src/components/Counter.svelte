<script>
  import { writable } from "svelte/store";

  // Creating a writable store
  export const counter = writable(0);

  function increment() {
    counter.update((n) => n + 1);
  }
</script>

<!-- Using the store -->
<button on:click={increment}>Increment</button>
<p>Count: {$counter}</p>
