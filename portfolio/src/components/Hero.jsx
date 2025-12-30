export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <p className="hero-label">PORTFOLIO</p>

        <h1 className = "hero-name">
          HARMEET SINGH
        </h1>

        <p className="hero-title">
          CS Honors Student @ UCI <br />
          Aspiring Full-Stack and ML Engineer
        </p>

        <div className="hero-actions">
          <a href = "#projects" className ="btn primary">View Work</a>
          <a href ="https://github.com/har-m33t" target ="_blank" className = "btn outline">GitHub</a>
          <a href="#about-me" className = "btn about-me">About Me</a>
    
        </div>
      </div>
    </section>
  );
}
