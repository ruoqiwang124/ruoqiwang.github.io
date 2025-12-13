// usc-portfolio-site/data/projects.js
export const projects = [
  {
    id: "four-years",
    title: "Tide of Memory",
    badge: "Featured",
    kicker: "Narrative runner • 4-year life loop • persistent world timeline",
    role: "Game Designer • Programmer",
    tools: ["Unity", "C#", "TextMeshPro"],

    shortDescription:
      "A healing runner where each life lasts four years. Replays reset the player, but the world timeline persists—choices reshape NPC fates and leave keepsakes.",

    thumbnail: "assets/img/dialogue.png",
    videoEmbedUrl: "https://youtu.be/Dxe_dfzl5zA",

    gallery: [
      { src: "assets/img/view_a.png",caption: "spirit sheet"},
      { src: "assets/img/map1.png", alt: "Macro loop", caption: "map design" },
      { src: "assets/img/dialogue.png", alt: "Timeline", caption: "dialogue" },
      { src: "assets/img/game_play.png", alt: "Runner", caption: "Runner scene" }
    ],

    pageBlocks: [
      {
        type: "section",
        title: "Logline",
        body: [
          {
            type: "p",
            text:
              'Four Years of Tide is a runner-driven healing narrative prototype where each “year” is a timed run. Players dodge hazards, collect stat-changing items, and trigger dialogue events—then return home to reflect and prepare. After four years, the ending is evaluated, while the world timeline persists across runs, allowing NPC stories to permanently conclude and leaving keepsakes as proof of shared moments.'
          }
        ]
      },

        {
          type: "section",
          title: "Core Experience Goals",
          body: [
            {
              type: "bullets",
              items: [
                "Rhythm of life: action → reflection → preparation, repeated four times as a “complete life”",
                "Meaningful replay: restarting is not “retrying,” but witnessing what remains and what’s gone",
                "Gentle consequence: choices shape NPC futures without punishing the player with hard failure"
              ]
            }
          ]
        },

      {
        type: "details",
        title: "Design Overview",
        open: true,
        body: [
          {
            type: "bullets",
            items: [
              "World: a sea-folk world with many species; the protagonist is a highly intelligent octopus protected by an ocean government.",
              "Theme: life is brief and ends inevitably, yet every connection and choice can still shine; legacy remains after absence.",
              "Core fantasy: live a complete life in four years; make choices that shape NPC futures; replay new lives while the world remembers."
            ]
          }
        ]
      },

      {
        type: "section",
        title: "Game Flow",
         body: [
        {
          type: "p",
          text:
            "Each run contains four timed “years”:"
        },
        {
          type: "bullets",
          items: [
            "Run Phase: timed runner segment; collect items; trigger events",
            "Year-End Summary: item counts + attribute/score changes",
            "Home Hub (planned expansion): shop, gifts, relationship progression",
            "Repeat until Year 4 → ending evaluation"
          ]
         },
          { type: "image",
            src: "assets/img/game_flow.png",
            alt: "Four Years of Tide macro loop diagram",
          },
        ]
      },


      {
        type: "section",
        title: "Timeline",
        body: [
      {
        type: "p",
        text:
          "Unlike typical roguelike resets, the global world timeline does not restart:"
      },
      {
        type: "bullets",
        items: [
          "NPCs can age, resolve their arcs, or permanently leave",
          "Choices can create delayed consequences across runs",
          "Keepsakes remain in the home as tangible narrative memory"
        ]
      },
      { type: "image",
            src: "assets/img/timeline.png",
            alt: "Four Years of Tide macro loop diagram",
      }
    ]
      },

      {
        type: "details",
        title: "NPC Arcs",
        open: true,
        body: [
          { type: "h3", text: "Lily — Orchid Octopus (Friendship & Farewell)" },
          {
            type: "p",
            text:
              "Dreams of getting a land-travel visa to watch sunrise on the beach. If the player is short on money in Year 3, Lily offers support and invites the player. At the end of the first four-year limit, Lily passes away during the sunrise trip. High affinity grants a keepsake ticket displayed at home; Lily will not appear in later runs."
          },
          { type: "image",
                src: "assets/img/lily.png",
                alt: "character",
          },
          { type: "image",
                src: "assets/img/sprite_sheet.png",
                alt: "character",
          },

          { type: "h3", text: "Elliot — Encouragement & Delayed Outcome" },
          {
            type: "p",
            text:
              "Starts as a restaurant server in the first run. With the player’s encouragement, they eventually publish a novel in later runs; the arc celebrates persistence over commercial success."
          },

          { type: "h3", text: "Aurelion Inkdeep — Long Life & Letters" },
          {
            type: "p",
            text:
              "A survivor of hunting who sends the player a letter every year until the global timeline reaches true completion."
          },
          { type: "image",
                src: "assets/img/character1.png",
                alt: "character",
          },
        ]
      },

      {
        type: "details",
        title: "Key Systems",
        open: true,
        body: [
          { type: "h3", text: "1) Runner Readability via Two-Lane Spawning" },
          {
            type: "p",
            text:
              "I built a two-lane probabilistic spawner with interval and pacing controls. Spawning is treated as a readability tool: items are spaced so players can react under speed."
          },
          {
            type: "code",
            explain: "Spawner pauses during dialogue and stops when the year ends.",
            code: `void Update()
      {
          if (Timer.I != null && Timer.I.IsFinished) return;
          if (DialogueManager.I != null && DialogueManager.I.IsRunning) return;

          _speedFactor += speedFactorIncreasePerSecond * Time.deltaTime;
          _speedFactor = Mathf.Min(_speedFactor, maxSpeedFactor);

          for (int i = 0; i < entries.Length; i++)
          {
              if (Time.time < _nextAt[i]) continue;
              Spawn(entries[i], laneIndex: i);
              _nextAt[i] = Time.time + GetNextInterval(entries[i]);
          }
      }`
          },

          { type: "divider" },

          { type: "h3", text: "2) Pickup Pipeline: Damage / Heal / Event" },
          {
            type: "p",
            text:
              "A single pickup handler applies effects, updates score/health, and increments item counters for the Year-End Summary. This keeps the gameplay loop consistent and testable."
          },
          {
            type: "code",
            explain: "Centralized collision entry point for item effects and telemetry.",
            code: `void OnTriggerEnter2D(Collider2D other)
      {
          if (!other.CompareTag("Player")) return;

          if (effect == EffectType.Damage) { ApplyDamage(); }
          else if (effect == EffectType.Heal) { ApplyHeal(); }
          else if (effect == EffectType.Event) { TriggerEvent(); }

          CountItem(itemID);
          Destroy(gameObject);
      }`
          },

          { type: "divider" },

          { type: "h3", text: "3) Event → Dialogue Gating (with Pause Rules)" },
          {
            type: "p",
            text:
              "Event pickups first try to trigger the next queued story beat. If none is available, they fall back to an item-specific dialogue asset. While dialogue runs, gameplay is paused to protect narrative clarity."
          },
          {
            type: "code",
            explain: "Event tries story queue first; otherwise dialogue fallback.",
            code: `bool triggeredStory = false;
      if (StoryEventManager.I != null)
      {
          triggeredStory = StoryEventManager.I.TryTriggerNextEvent();
      }

      if (!triggeredStory)
      {
          if (DialogueManager.I != null && dialogue != null)
              DialogueManager.I.StartDialogue(dialogue);
      }`
          },
          {
            type: "code",
            explain: "Other systems read IsRunning to pause spawning/scoring during dialogue.",
            code: `public bool IsRunning { get; private set; }

      public void StartDialogue(DialogueAsset asset)
      {
          IsRunning = true;
          // ... show lines ...
      }

      public void EndDialogue()
      {
          IsRunning = false;
      }`
          },

          { type: "divider" },

          { type: "h3", text: "4) Timer-Driven Year End + Results" },
          {
            type: "p",
            text:
              "Each year ends on a timer, then a results panel displays item counts and final score. The game freezes to shift players from action to reflection—matching the theme."
          },
          {
            type: "code",
            explain: "Ends the run and shows summary; timeScale=0 for review.",
            code: `if (time >= duration)
      {
          finished = true;
          resultPanel.SetActive(true);

          item0Text.text = ": " + ScrollPickup2D.count_item0;
          item1Text.text = ": " + ScrollPickup2D.count_item1;

          finalScoreText.text = "Final Score: " + ScoreUI.I.GetCurrentScore();
          Time.timeScale = 0f;
      }`
          },

          { type: "divider" },

          { type: "h3", text: "5) Persistence (One-Time Events)" },
          {
            type: "p",
            text:
              "To support the “world remembers” concept, key events are marked as completed so they do not repeat across runs. This is currently implemented as lightweight persistent flags."
          },
          {
            type: "code",
            explain: "Marks an event as completed so it won't repeat.",
            code: `if (usePersistentId && !string.IsNullOrEmpty(uniqueId))
      {
          string key = "OneTimeEvent_" + uniqueId;
          PlayerPrefs.SetInt(key, 1);
      }`
          }
        ]
      },

       {
          type: "section",
          title: "Design Decisions",
          body: [
            { type: "h3", text: "Why a timed “year”?" },
            {
              type: "p",
              text:
                "Time creates urgency without violence: it compresses a life into a readable unit and makes each year’s summary feel like memory."
            },

            { type: "h3", text: "Why pause gameplay during dialogue?" },
            {
              type: "p",
              text:
                "It protects narrative clarity. When the player is reading, spawning and scoring stop—reducing cognitive overload and making choices feel intentional."
            },

            { type: "h3", text: "Why persistent world timeline?" },
            {
              type: "p",
              text:
                "It turns replay into meaning. The player doesn’t just restart—they confront absence, legacy, and long-term consequence."
            }
          ]
        },
    ],

    // 下面这些继续保留，供 listFrom / codeFrom 使用
    summary: [
      "Logline: Play a highly intelligent octopus with only a four-year lifespan. Each year is a timed runner segment—dodge hazards, collect items, and trigger story events.",
      "Between years you return to a Home Hub for preparation (shop, gifts, relationship progress). After Year 4, endings are determined by stats and bonds.",
      "Key twist: the player life resets each run, but the world timeline persists—NPCs can permanently leave, and relics remain as keepsakes."
    ],

    systems: [
      "4-Year Macro Loop: Run → Year-End Summary → Home Hub → Next Year (x4) → Ending",
      "Event Items: pickups can trigger queued story dialogues; dialogue pauses gameplay and scoring for readability",
      "Persistent World: one-time events are tracked across runs; NPC availability changes over the global timeline",
      "Feedback & Telemetry: time-based score + pickup deltas + end-of-year item counters"
    ],

    technical: [
      "Two-lane probabilistic spawner (TwoLaneMultiSpawner in Assets/code/ItemSpawner.cs) with per-item interval/jitter and global speed scaling.",
      "Centralized pickup handler (ScrollPickup2D in Assets/code/ItemsControler.cs) applies Damage/Heal/Event effects and increments per-item counters.",
      "Story queue gating (Assets/code/StoryEventManager.cs): triggers the next DialogueAsset only when allowed (cooldown + not during dialogue).",
      "Dialogue pause gate (Assets/code/DialogueManager.cs): spawner/score/timer check IsRunning to pause updates during dialogue.",
      "Timer-driven year end (Assets/code/Timer.cs): displays results (item counts + final score) and freezes gameplay via Time.timeScale.",
      "Simple persistence layer for one-time events using PlayerPrefs keys (e.g., OneTimeEvent_<uniqueId>) to prevent repeating event pickups across runs."
    ],

    hideLinks: true,

    tags: ["Narrative", "Runner", "Choice & Consequence", "Persistent World", "Unity", "C#"]
  },

  {
    id: "pathforms",
    title: "PathForms",
    badge: "Research",
    kicker: "Interactive math visualization • Free-group operations • Graph transformations",
    role: "Developer (Graph UI + Interaction) • Research Collaboration",
    tools: ["React", "TypeScript", "D3 (Zoom/Pan)"],
    shortDescription:
      "A research-driven interactive visualization that helps learners explore free-group operations and graph-based transformations through step-by-step, puzzle-like interactions.",
    thumbnail: "assets/img/PathForms-方形模式.png",


    gallery: [
      {
        src: "assets/img/PathForms-square.png",
        alt: "Square Cayley graph UI",
        caption: "Square-layout Cayley graph with selectable vertices/edges."
      },
      {
        src: "assets/img/pathforms.png",
        alt: "Interaction + tutorial overlay",
        caption: "Learnability-first UI: guided interaction and readable state changes."
      }
    ],

    summary: [
      "PathForms is an interactive system designed to make abstract algebra (free groups / Nielsen-style transformations) learnable through visualization and guided interaction.",
      "The project provides multiple ranks (Rank 1–3) and a playable web build for exploration and education.",
      "My focus: implementing the graph interface and interaction layer—especially a square-layout Cayley-style graph that keeps transformations readable and consistent."
    ],

    systems: [
      "Puzzle loop: apply operations step-by-step, observe immediate visual consequences",
      "Graph interaction: select vertices/edges to inspect state and guide operations",
      "Square-layout Cayley-style graph view for clarity (grid-like directions and spacing)"
    ],

    technical: [
      "Deterministic transformation pipeline to keep tutorial + puzzle validation stable.",
      "Symbol → direction parsing (e.g., a, a^-1, b, b^-1) to map algebraic words to path geometry.",
      "Interactive rendering with zoom/pan support; UI state drives highlight + selection styling.",
      "Lightweight correctness helpers (reduction / inverse) to maintain consistent game states."
    ],

    codeHighlights: [
      {
        title: "Word reduction / cancellation (deterministic)",
        explain:
          "Core cancellation logic keeps the state stable for puzzles and step-by-step teaching (adjacent inverse pairs cancel).",
        code: `function reduceSymbolArray(symbols) {
    const stack = [];
    for (let s of symbols) {
      const top = stack[stack.length - 1];
      if (top === "a" && s === "a-") stack.pop();
      else if (top === "a-" && s === "a") stack.pop();
      else if (top === "b" && s === "b-") stack.pop();
      else if (top === "b-" && s === "b") stack.pop();
      else stack.push(s);
    }
    return stack;
  }`
      },
      {
        title: "Square-layout Cayley graph generation",
        explain:
          "Builds a grid-like Cayley-style tree using consistent up/down/left/right steps to keep layouts readable.",
        code: `const dirs = [
    { dir: "up",    dx: 0,  dy: -1 },
    { dir: "down",  dx: 0,  dy:  1 },
    { dir: "left",  dx: -1, dy:  0 },
    { dir: "right", dx: 1,  dy:  0 }
  ];

  function buildCayleyTree(node, depth, x, y, step) {
    if (depth === 0) return;
    node.children = [];
    for (const d of dirs) {
      node.children.push({
        name: node.name + "-" + d.dir + "-" + depth,
        x: x + d.dx * step,
        y: y + d.dy * step
      });
    }
    node.children.forEach(c => buildCayleyTree(c, depth - 1, c.x, c.y, step * 0.5));
  }`
      },
      {
        title: "Symbol → direction parsing for path geometry",
        explain:
          "Turns algebraic tokens into geometric movement so the player can ‘see’ the word as a path on the graph.",
        code: `function parsePathBySymbols(symbols) {
    const directionMap = { a: "up", "a-": "down", b: "right", "b-": "left" };
    return symbols.map(s => directionMap[s]).filter(Boolean);
  }`
      }
    ],

    // ✅ 更稳的 links key（避免空格/特殊字符导致渲染器不兼容）
    links: {
      projectPage: "https://mineyev.web.illinois.edu/PathForms/",
      playableBuild: "https://play.math.illinois.edu/PathForms/"
    },

    tags: ["Visualization", "Research", "Puzzle UX", "React", "TypeScript", "D3"],

    pageBlocks: [
      {
        type: "section",
        title: "Overview",
        body: [
          { type: "p", text: "PathForms is a research-driven interactive visualization that helps learners explore free-group ideas through a puzzle-like workflow. The project offers Rank 1–3 experiences and a public playable web build." }
        ]
      },

      {
        type: "section",
        title: "Summary",
        body: [
          { type: "bullets", items: [
            "PathForms visualizes free-group operations and graph-based transformations through guided, puzzle-like interaction.",
            "Multiple ranks (Rank 1–3) + a public playable build support gradual learning and exploration.",
            "My focus: implementing the graph UI/interaction layer—especially a square-layout Cayley-style graph for readability."
          ] }
        ]
      },

      {
        type: "section",
        title: "My Contribution",
        body: [
          { type: "bullets", items: [
            "Implemented the interactive graph layer (square-layout Cayley-style graph) to make transformations visually readable.",
            "Built core helpers that support stable, step-by-step transformations (reduction / inverse / parsing).",
            "Focused on learnability: clear state transitions, selection/highlighting feedback, and deterministic updates."
          ] }
        ]
      },

      {
        type: "section",
        title: "Key Systems",
        body: [
          { type: "bullets", items: [
            "Puzzle loop: apply operations step-by-step, observe immediate visual consequences",
            "Graph interaction: select vertices/edges to inspect state and guide operations",
            "Square-layout Cayley-style graph view for clarity (grid-like directions and spacing)"
          ] }
        ]
      },

      {
        type: "details",
        title: "Technical Implementation",
        open: true,
        body: [
          { type: "bullets", items: [
            "Deterministic transformation pipeline to keep tutorial + puzzle validation stable.",
            "Symbol → direction parsing (a, a^-1, b, b^-1) to map algebraic words to path geometry.",
            "UI state drives highlight + selection styling; supports zoom/pan for inspection.",
            "Lightweight correctness helpers (reduction / inverse) to keep game states consistent."
          ] }
        ]
      },

      {
        type: "details",
        title: "Key Systems",
        open: true,
        body: [
          { type: "h3", text: "1) Square-layout Cayley Graph (Readability-first)" },
          { type: "p", text: "I used a grid-like direction system (up/down/left/right) with consistent spacing so learners can visually track how a word becomes a path. The tree expands recursively while reducing step size to preserve readability at deeper layers." },
          {
            type: "code",
            title: "CayleyTree.tsx — square expansion + spacing (concept excerpt)",
            explain: "Directional expansion + recursive layout step scaling.",
            code: `const dirs = [
      { dir: "up", dx: 0, dy: -1 },
      { dir: "down", dx: 0, dy: 1 },
      { dir: "left", dx: -1, dy: 0 },
      { dir: "right", dx: 1, dy: 0 }
    ];

    function buildCayleyTree(node, depth, x, y, step){
      if(depth===0) return;
      node.children = dirs.map(d => ({
        name: node.name + "-" + d.dir + "-" + depth,
        x: x + d.dx * step,
        y: y + d.dy * step
      }));
      node.children.forEach(c => buildCayleyTree(c, depth-1, c.x, c.y, step*0.5));
    }`
          },

          { type: "divider" },

          { type: "h3", text: "2) Deterministic Simplification (Cancellation)" },
          { type: "p", text: "To keep puzzles and tutorials stable, simplification is deterministic: adjacent inverse pairs cancel using a stack-based pass. This prevents inconsistent outcomes and makes the UI easier to explain." },
          {
            type: "code",
            title: "CayleyTree.tsx — reduction pass (concept excerpt)",
            explain: "Adjacent inverse cancellation via stack pass.",
            code: `function reduceSymbolArray(symbols){
      const stack = [];
      for (let s of symbols){
        const top = stack[stack.length-1];
        if(top==="a"  && s==="a-") stack.pop();
        else if(top==="a-" && s==="a") stack.pop();
        else if(top==="b"  && s==="b-") stack.pop();
        else if(top==="b-" && s==="b") stack.pop();
        else stack.push(s);
      }
      return stack;
    }`
          },

          { type: "divider" },

          { type: "h3", text: "3) Symbol → Geometry (Path Parsing)" },
          { type: "p", text: "Tokens map into movement directions so the user experiences an algebraic word as a geometric path. This bridges math meaning and visual intuition." },
          {
            type: "code",
            title: "CayleyTree.tsx — parsePathBySymbols() (concept excerpt)",
            explain: "Maps tokens to up/down/left/right movement.",
            code: `function parsePathBySymbols(symbols){
      const m = { a:"up", "a-":"down", b:"right", "b-":"left" };
      return symbols.map(s => m[s]).filter(Boolean);
    }`
          }
        ]
      },

      {
        type: "section",
        title: "Links",
        body: [
          { type: "bullets", items: [
            "Project Page: https://mineyev.web.illinois.edu/PathForms/",
            "Playable Build: https://play.math.illinois.edu/PathForms/"
          ] }
        ]
      }
    ]

  },


  // {
  //   id: "nlp-calendar",
  //   title: "NLP Task Calendar",
  //   badge: "Full-stack",
  //   kicker: "Natural language → structured events • Mobile-first",
  //   role: "Full-stack Developer",
  //   tools: ["FastAPI", "React Native", "SQLite"],
  //   shortDescription:
  //     "A calendar app that parses natural language tasks into structured events and syncs the workflow into a mobile-friendly monthly UI.",
  //   thumbnail: "assets/img/project-calendar.svg",
  //   videoEmbedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
  //   localVideo: null,
  //   gallery: [
  //     { src: "assets/img/gallery-3.svg", alt: "Calendar view", caption: "Month view UI (placeholder)" }
  //   ],
  //   summary: [
  //     "This project explores building a data flow from a backend database to a mobile calendar UI.",
  //     "Users create tasks in natural language; the system extracts time/location/participants and stores structured events.",
  //     "Focus: practical UX and reliable data wiring across the stack."
  //   ],
  //   systems: [
  //     "Event schema: task + participants + time + location",
  //     "Month view UI: tap date → expand event list",
  //     "Backend API: CRUD events"
  //   ],
  //   technical: [
  //     "FastAPI endpoints for event creation and retrieval.",
  //     "React Native calendar UI with expandable day cells and event popups.",
  //     "Local persistence + predictable state updates."
  //   ],
  //   codeHighlights: [
  //     {
  //       title: "FastAPI: create event (sketch)",
  //       explain: "Endpoint accepts parsed fields and stores them for month-view rendering.",
  //       code: `# (placeholder) @app.post("/events")\nasync def create_event(...):\n    ...`
  //     }
  //   ],
  //   links: {
  //     GitHub: "https://github.com/yourname/nlp-task-calendar"
  //   },
  //   tags: ["Mobile", "FastAPI", "Product Design", "NLP", "Calendar"]
  // }
];
