export function HomePage() {
  return (
    <div className="page__content--fixed">
      <div>
        <h1>Ukraine History</h1>
        <h2>Interactive Library</h2>
        <p>An open-source, crowdsourced interactive library of Ukrainian history featuring a timeline-synchronized map visualization.</p>
        <div>
          <a href="/history/map">Explore the Map</a>
          <a href="/history/about">Learn More</a>
        </div>
      </div>

      <div>
        <div>
          <h3>Interactive Map</h3>
          <p>Canvas-based map of Europe with modern Ukraine's border always visible and historical territories overlay.</p>
        </div>
        <div>
          <h3>Timeline Navigation</h3>
          <p>Era selector with a slider for fine-grained navigation from prehistoric times to present day.</p>
        </div>
        <div>
          <h3>Open Source</h3>
          <p>Community-driven content with contributions from historians and volunteers worldwide.</p>
        </div>
      </div>
    </div>
  );
}
