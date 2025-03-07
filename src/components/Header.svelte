<script>
  import { onMount } from "svelte";

  // List of phrases to animate through
  const phrases = [
    "goal?",
    "book to read?",
    "project?",
    "milestone?",
    "adventure?",
    "challenge?",
    "achievement?",
    "destination?",
    "skill to learn?",
    "opportunity?",
    "discovery?",
    "passion?",
    "lesson?",
    "experience?",
    "expedition?",
    "creation?",
    "innovation?",
    "journey?",
    "inspiration?",
    "ambition?",
    "success story?",
    "chapter?",
    "big idea?",
    "resolution?",
    "dream to pursue?",
    "habit to build?",
    "victory?",
    "accomplishment?",
    "objective?",
    "mission?",
    "quest?",
    "target?",
    "vision?",
    "endeavor?",
    "hobby?",
    "obsession?",
    "move?",
    "trip?",
    "language to learn?",
    "recipe to try?",
    "workout?",
    "meditation?",
    "podcast to listen?",
    "course to take?",
    "story to write?",
    "app to build?",
    "video to watch?",
    "step forward?",
  ];

  let currentPhrase = "";
  let phraseIndex = 0;
  let visible = true;

  function animateText() {
    // Start hiding current phrase
    visible = false;

    setTimeout(() => {
      // Update to next phrase
      phraseIndex = (phraseIndex + 1) % phrases.length;
      currentPhrase = phrases[phraseIndex];

      // Show new phrase
      visible = true;

      // Schedule next animation
      setTimeout(animateText, 3000); // Keep phrase visible for 3 seconds
    }, 1000); // Wait 1 second for exit animation
  }

  onMount(() => {
    // Initialize with first phrase
    currentPhrase = phrases[0];
    visible = true;

    // Start animation cycle after 3 seconds
    setTimeout(animateText, 3000);
  });
</script>

<header>
  <h1>
    <span class="static-text">What is your next </span>
    <span
      class="animated-text"
      class:visible
      class:hidden={!visible}
      style="color: #14abe3; {visible
        ? 'opacity: 1; transform: translateX(0)'
        : 'opacity: 0; transform: translateX(20px)'}"
    >
      {currentPhrase}
    </span>
  </h1>
</header>

<style>
  header {
    margin-top: 100px;
    padding: 1rem;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  h1 {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: 900;
    letter-spacing: 0.05em;
    text-align: center;
    flex-wrap: wrap; /* Allow wrapping on small screens */
  }

  .animated-text {
    transition: all 1s ease-in-out;
    display: inline-block;
    font-weight: 900;
    min-width: 300px; /* Fixed width for animated text container */
    text-align: left; /* Align text to the left within the container */
  }

  .static-text {
    display: inline-block;
    font-weight: 900;
  }

  /* Responsive adjustments for different screen sizes */
  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
      flex-direction: column;
      gap: 0.3rem;
    }

    .animated-text {
      min-width: 240px;
      text-align: center;
    }
  }

  @media (max-width: 480px) {
    header {
      margin-top: 50px;
    }

    h1 {
      font-size: 1.5rem;
    }

    .animated-text {
      min-width: 200px;
    }
  }

  @media (max-width: 320px) {
    h1 {
      font-size: 1.2rem;
    }

    .animated-text {
      min-width: 150px;
    }
  }
</style>
