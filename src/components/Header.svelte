<script>
  import { onMount } from "svelte";

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
    visible = false;

    setTimeout(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      currentPhrase = phrases[phraseIndex];
      visible = true;
      setTimeout(animateText, 3000);
    }, 1000);
  }

  onMount(() => {
    currentPhrase = phrases[0];
    visible = true;
    setTimeout(animateText, 3000);
  });
</script>

<header class="hero">
  <p class="hero-kicker">Priority Studio</p>
  <h1>
    <span class="static-text">What is your next&nbsp;</span>
    <span class="animated-text" class:visible>
      {currentPhrase}
    </span>
  </h1>
  <p class="hero-subtitle">
    Add your options, compare them head-to-head, and get a clear order in
    minutes.
  </p>
</header>

<style>
  .hero {
    margin-top: 1.6rem;
    padding: 1rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.65rem;
  }

  .hero-kicker {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    font-size: 0.73rem;
    font-weight: 700;
    color: rgba(8, 51, 68, 0.7);
    background: rgba(255, 255, 255, 0.72);
    border: 1px solid rgba(8, 51, 68, 0.12);
    border-radius: 999px;
    padding: 0.35rem 0.8rem;
  }

  h1 {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 900;
    letter-spacing: 0.03em;
    text-align: center;
    flex-wrap: wrap;
    width: 100%;
    margin: 0;
    line-height: 1.05;
    color: #083344;
  }

  .animated-text {
    transition: opacity 0.9s ease, transform 0.9s ease;
    display: inline-block;
    font-weight: 900;
    min-width: 300px;
    text-align: left;
    color: #0d9488;
    opacity: 0;
    transform: translateX(18px);
    text-shadow: 0 8px 20px rgba(13, 148, 136, 0.22);
  }

  .animated-text.visible {
    opacity: 1;
    transform: translateX(0);
  }

  .static-text {
    display: inline-block;
    font-weight: 900;
    color: #083344;
  }

  .hero-subtitle {
    margin: 0;
    max-width: 680px;
    font-size: clamp(1rem, 1.7vw, 1.15rem);
    line-height: 1.55;
    color: rgba(8, 51, 68, 0.78);
  }

  @media (max-width: 768px) {
    h1 {
      flex-direction: column;
      gap: 0.25rem;
    }

    .animated-text {
      min-width: 235px;
      text-align: center;
    }
  }

  @media (max-width: 480px) {
    .hero {
      margin-top: 0.4rem;
      padding: 0.35rem;
      gap: 0.4rem;
    }

    h1 {
      width: 100%;
      padding: 0 4px;
    }

    .animated-text {
      min-width: auto;
      width: 100%;
    }
  }

  @media (max-width: 320px) {
    h1 {
      padding: 0;
    }
  }
</style>
