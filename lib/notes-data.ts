export interface Note {
  id: string;
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  body: NoteSection[];
  layout?: "default" | "gradient";
  color?: "grey" | "color";
}

export interface NoteSection {
  type: "paragraph" | "heading" | "list";
  content: string;
  items?: string[];
}

export const NOTES: Note[] = [
  {
    id: "1",
    slug: "why-visual-storytelling-matters",
    tag: "Blog",
    title: "Why Visual Storytelling Matters More Than Ever for Modern Brands",
    excerpt:
      "In a world saturated with content, the brands that break through are the ones that make you feel something.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=85",
    date: "May 2026",
    readTime: "4 min read",
    layout: "default",
    color: "color",
    body: [
      {
        type: "paragraph",
        content:
          "Commerce as a film often has different characters — a confident friend, a mentor, a deeply movement, emotional Persons, and various objectives. we often find ourselves imagining the stories behind these figures and what drove them to create something so compelling.",
      },
      {
        type: "heading",
        content: "It begins with understanding the brief",
      },
      {
        type: "paragraph",
        content:
          "Commercial films start with a conversation. The client arrives with a vision — sometimes crystal clear, sometimes only half-formed. Our job as storytellers is to excavate the emotion underneath the brief.",
      },
      {
        type: "heading",
        content: "Pre-production is where most of the work happens",
      },
      {
        type: "paragraph",
        content:
          "The most significant decisions in production are made before a single light is set or a camera rolls.",
      },
      {
        type: "list",
        content: "",
        items: [
          "Script development",
          "Location scouting",
          "Casting",
          "Costume design",
          "Storyboarding",
          "Director of Photography briefing",
        ],
      },
      {
        type: "heading",
        content: "Shoot days are fast-paced and highly coordinated",
      },
      {
        type: "paragraph",
        content:
          "When the day of the shoot arrives, every single person on set has a role. From the production assistant managing the call sheet to the gaffer rigging the lights, it is a symphony of coordinated performance.",
      },
      {
        type: "heading",
        content: "Post-production is bringing the story together",
      },
      {
        type: "paragraph",
        content:
          "Once the cameras stop rolling, a new kind of artistry begins. The editor, the colorist, and the sound designer each add invisible layers that transform footage into cinema.",
      },
    ],
  },
  {
    id: "2",
    slug: "what-really-happens-behind-a-commercial-shoot",
    tag: "Blog",
    title: "What really happens behind a commercial shoot",
    excerpt:
      "The camera sees the polished final cut. We lived through every unpredictable, beautiful, chaotic moment that made it happen.",
    image:
      "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=900&q=85",
    date: "Apr 2026",
    readTime: "5 min read",
    layout: "gradient",
    color: "grey",
    body: [
      {
        type: "paragraph",
        content:
          "Commerce as a film often has different characters — a confident friend, a mentor, a deeply movement, emotional Persons, and various objectives. We often find ourselves imagining the stories behind these figures and what drove them to create something so compelling.",
      },
      {
        type: "heading",
        content: "It begins with understanding the brief",
      },
      {
        type: "paragraph",
        content:
          "Every shoot starts long before the cameras arrive. It begins in a room — sometimes a boardroom, sometimes a rooftop — where client and creator sit across from each other and try to close the gap between idea and execution.",
      },
      {
        type: "heading",
        content: "Pre-production is where most of the work happens",
      },
      {
        type: "paragraph",
        content:
          "The most important decisions in any production are made before a single light is placed. Pre-production is the unglamorous, indispensable engine that keeps everything from falling apart on the day.",
      },
      {
        type: "list",
        content: "",
        items: [
          "Script development",
          "Location scouting",
          "Casting",
          "Costume design",
          "Storyboarding",
          "Director of Photography briefing",
        ],
      },
      {
        type: "heading",
        content: "Shoot days are fast-paced and highly coordinated",
      },
      {
        type: "paragraph",
        content:
          "When the day finally arrives, the set is a controlled ecosystem of moving parts. Everyone has a role, and everyone depends on everyone else doing theirs with precision.",
      },
      {
        type: "paragraph",
        content:
          "Scheduling is everything. Even small delays ripple outward — affecting lighting continuity, actor availability, location access windows. A good production manager anticipates these small fires before they become infernos.",
      },
      {
        type: "heading",
        content: "Post-production is bringing the story together",
      },
      {
        type: "paragraph",
        content:
          "Once the final frame is captured, the story moves into a different kind of craftsmanship. The edit suite becomes the new set — where rhythm, pacing, and narrative clarity are sculpted from raw footage.",
      },
      {
        type: "heading",
        content: "Good commercial content is never accidental",
      },
      {
        type: "paragraph",
        content:
          "Behind every 60-second brand film that makes you stop scrolling is an invisible iceberg — months of planning, dozens of decisions, and a team of people who gave everything to make it feel effortless.",
      },
    ],
  },
  {
    id: "3",
    slug: "what-makes-hospitality-content-feel-truly-premium",
    tag: "Blog",
    title: "What Makes Hospitality Content Feel Truly Premium",
    excerpt:
      "Hospitality brands live and die by atmosphere. The camera has to capture what no description can fully convey.",
    image:
      "https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=900&q=85",
    date: "Apr 2026",
    readTime: "3 min read",
    layout: "default",
    color: "color",
    body: [
      {
        type: "paragraph",
        content:
          "There's a feeling you get when you walk into a truly exceptional hotel or restaurant — a quiet confidence in every detail, a sense that someone thought deeply about how this moment would feel. Our job as visual storytellers is to capture that intangible quality and make it live inside a screen.",
      },
      {
        type: "heading",
        content: "Atmosphere is the product",
      },
      {
        type: "paragraph",
        content:
          "In hospitality, you're not selling a bed or a meal. You're selling the feeling of arriving, the silence of a private suite, the way light falls across a table at golden hour. The visual language has to match the promise.",
      },
      {
        type: "heading",
        content: "Restraint is a creative choice",
      },
      {
        type: "paragraph",
        content:
          "The most powerful hospitality films often say less. They trust the space, the light, and the moment. Over-explaining kills the mystery. Great content leaves room for the viewer to place themselves inside the frame.",
      },
    ],
  },
  {
    id: "4",
    slug: "from-concept-to-screen-commercial-production",
    tag: "Blog",
    title: "From Concept to Screen: The Process Behind a Commercial Production",
    excerpt:
      "Walk through every phase — from the first brief to final delivery — of how we bring a brand film to life.",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=900&q=85",
    date: "Mar 2026",
    readTime: "6 min read",
    layout: "default",
    color: "grey",
    body: [
      {
        type: "paragraph",
        content:
          "The process of making a commercial film is rarely linear. It is iterative, collaborative, and often humbling. But when it works — when the final cut lands exactly as you imagined, or better — the process reveals itself to have been the point all along.",
      },
      {
        type: "heading",
        content: "Discovery: Understanding what actually needs to be said",
      },
      {
        type: "paragraph",
        content:
          "Most clients arrive with a brief, but briefs are often descriptions of outputs rather than definitions of purpose. Our first job is to ask the harder questions: What does this brand stand for? Who is the viewer? What should they feel 30 seconds after they stop watching?",
      },
      {
        type: "heading",
        content: "Development: Turning a feeling into a script",
      },
      {
        type: "paragraph",
        content:
          "Once we have clarity on the emotional territory, the creative work begins. We develop multiple conceptual directions — each rooted in a different insight — before arriving at the approach that best serves the brand's truth.",
      },
    ],
  },
  {
    id: "5",
    slug: "chaos-creativity-collaboration-production-days",
    tag: "Blog",
    title: "The chaos, creativity, and collaboration behind production days",
    excerpt:
      "No two shoot days are alike. Here's what actually goes on behind the scenes when a production team comes together.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=85",
    date: "Mar 2026",
    readTime: "4 min read",
    layout: "gradient",
    color: "color",
    body: [
      {
        type: "paragraph",
        content:
          "Ask anyone who's been on set — the energy on a production day is unlike anything else. It is focused chaos. It is disciplined improvisation. It is thirty people all pushing in the same direction, even when the direction changes mid-morning.",
      },
      {
        type: "heading",
        content: "The call sheet is sacred",
      },
      {
        type: "paragraph",
        content:
          "The call sheet is the document that holds the production together. It lists every shot, every crew member, every equipment requirement, and every contingency. A well-written call sheet can save a shoot. A poorly written one can sink it.",
      },
      {
        type: "heading",
        content: "What nobody talks about: the quiet moments",
      },
      {
        type: "paragraph",
        content:
          "Between setups — between the strike of one scene and the build of the next — there are these strange pockets of quiet on set. The crew breathes. The DP checks their monitor. The director stares at their notes. These moments are where the best ideas happen.",
      },
    ],
  },
  {
    id: "6",
    slug: "meet-the-team-behind-the-stories-we-create",
    tag: "Blog",
    title: "Meet the team behind the stories we create",
    excerpt:
      "Great productions are built by great people. An inside look at the Megamind crew and what drives them.",
    image:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=900&q=85",
    date: "Feb 2026",
    readTime: "3 min read",
    layout: "gradient",
    color: "grey",
    body: [
      {
        type: "paragraph",
        content:
          "Every film we make carries the fingerprints of the team that made it. The camera operator who chose the angle nobody else saw. The gaffer who pushed for one more light. The director who asked the talent to try it one more time — not because it was wrong, but because it could be more right.",
      },
      {
        type: "heading",
        content: "A crew is not just a team",
      },
      {
        type: "paragraph",
        content:
          "The best production crews develop a shared language over time. They know each other's rhythms, anticipate each other's needs, and create the kind of environment where performance — from everyone — becomes possible.",
      },
      {
        type: "heading",
        content: "What we believe in",
      },
      {
        type: "paragraph",
        content:
          "We believe that the best work comes from teams who give a damn. Not just about the shot — but about the story behind it, the brand it serves, and the audience it reaches.",
      },
    ],
  },
   {
    id: "7",
    slug: "why-visual-storytelling-matters",
    tag: "Blog",
    title: "Why Visual Storytelling Matters More Than Ever for Modern Brands",
    excerpt:
      "In a world saturated with content, the brands that break through are the ones that make you feel something.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=85",
    date: "May 2026",
    readTime: "4 min read",
    layout: "default",
    body: [
      {
        type: "paragraph",
        content:
          "Commerce as a film often has different characters — a confident friend, a mentor, a deeply movement, emotional Persons, and various objectives. we often find ourselves imagining the stories behind these figures and what drove them to create something so compelling.",
      },
      {
        type: "heading",
        content: "It begins with understanding the brief",
      },
      {
        type: "paragraph",
        content:
          "Commercial films start with a conversation. The client arrives with a vision — sometimes crystal clear, sometimes only half-formed. Our job as storytellers is to excavate the emotion underneath the brief.",
      },
      {
        type: "heading",
        content: "Pre-production is where most of the work happens",
      },
      {
        type: "paragraph",
        content:
          "The most significant decisions in production are made before a single light is set or a camera rolls.",
      },
      {
        type: "list",
        content: "",
        items: [
          "Script development",
          "Location scouting",
          "Casting",
          "Costume design",
          "Storyboarding",
          "Director of Photography briefing",
        ],
      },
      {
        type: "heading",
        content: "Shoot days are fast-paced and highly coordinated",
      },
      {
        type: "paragraph",
        content:
          "When the day of the shoot arrives, every single person on set has a role. From the production assistant managing the call sheet to the gaffer rigging the lights, it is a symphony of coordinated performance.",
      },
      {
        type: "heading",
        content: "Post-production is bringing the story together",
      },
      {
        type: "paragraph",
        content:
          "Once the cameras stop rolling, a new kind of artistry begins. The editor, the colorist, and the sound designer each add invisible layers that transform footage into cinema.",
      },
    ],
  },
];

export function getNoteBySlug(slug: string): Note | undefined {
  return NOTES.find((n) => n.slug === slug);
}
