from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


index_path = Path("index.html")
styles_path = Path("styles.css")
index = index_path.read_text(encoding="utf-8")
styles = styles_path.read_text(encoding="utf-8")

# Display headings and short editorial lines: remove decorative trailing full stops.
replacements = {
    '<span>Building the future</span> <span>with code &amp; intelligence.</span>': '<span>Building the future</span> <span>with code &amp; intelligence</span>',
    '<span class="about-title-line">Building through practice.</span>': '<span class="about-title-line">Building through practice</span>',
    '<span class="journey-title-line">to intelligent systems.</span>': '<span class="journey-title-line">to intelligent systems</span>',
    '<h2 id="projects-title">Building real projects.</h2>': '<h2 id="projects-title">Building real projects</h2>',
    '<span class="contact-title-line">can start anywhere.</span>': '<span class="contact-title-line">can start anywhere</span>',
    '<h2 id="closing-title"><span>Thank you</span><span>for being here.</span></h2>': '<h2 id="closing-title"><span>Thank you</span><span>for being here</span></h2>',
    '<h1 id="workshop-title" class="display-stack"><span>Knowledge shaped</span><span>through practice.</span></h1>': '<h1 id="workshop-title" class="display-stack"><span>Knowledge shaped</span><span>through practice</span></h1>',
    '<h2 id="foundation-title">Concepts that shape the path.</h2>': '<h2 id="foundation-title">Concepts that shape the path</h2>',
    '<h2 id="practice-title">Knowledge used in real workflows.</h2>': '<h2 id="practice-title">Knowledge used in real workflows</h2>',
    '<span class="current-title-line">step at a time.</span>': '<span class="current-title-line">step at a time</span>',
}
for old, new in replacements.items():
    index = replace_once(index, old, new, f"Heading copy: {old[:42]}")

# Homepage prose: keep useful commas, remove unnecessary Oxford commas and terminal dots on short standalone copy.
prose_replacements = {
    '<span class="about-lead-line about-lead-line-growth">Alongside my work in the private sector, I’m developing a practical foundation in Python, algorithms, machine learning, and modern AI technologies.</span>': '<span class="about-lead-line about-lead-line-growth">Alongside my work in the private sector, I’m developing a practical foundation in Python, algorithms, machine learning and modern AI technologies</span>',
    '<p class="about-body">My approach is grounded in clarity and consistency: understand each concept carefully, apply it through hands-on practice, and turn steady progress into useful, responsible AI projects.</p>': '<p class="about-body">My approach is grounded in clarity and consistency: understand each concept carefully, apply it through hands-on practice and turn steady progress into useful, responsible AI projects</p>',
    '<p>Each stage builds the foundation for the next.</p>': '<p>Each stage builds the foundation for the next</p>',
    '<p>Learning Python fundamentals, functions, data structures, classes, and objects.</p>': '<p>Learning Python fundamentals, functions, data structures, classes and objects</p>',
    '<p>Exploring NumPy, Pandas, data cleaning, preprocessing, and clear visualization.</p>': '<p>Exploring NumPy, Pandas, data cleaning, preprocessing and clear visualization</p>',
    '<p>Understanding classification, regression, model training, and evaluation.</p>': '<p>Understanding classification, regression, model training and evaluation</p>',
    '<p>Exploring neural networks, hidden layers, and computer vision foundations.</p>': '<p>Exploring neural networks, hidden layers and computer vision foundations</p>',
    '<p>Learning language processing, knowledge retrieval, and intelligent agent systems.</p>': '<p>Learning language processing, knowledge retrieval and intelligent agent systems</p>',
    '<span class="workshop-entry-copy">A dedicated space for structured notes, hands-on practice, and the projects that turn learning into real progress.</span>': '<span class="workshop-entry-copy">A dedicated space for structured notes, hands-on practice and the projects that turn learning into real progress</span>',
    '<p>Future projects shaped by each stage of the journey.</p>': '<p>Future projects shaped by each stage of the journey</p>',
    '<p>Preparing patient health data and training a classification model to recognize patterns associated with possible heart disease.</p>': '<p>Preparing patient health data and training a classification model to recognize patterns associated with possible heart disease</p>',
    '<p>A predictive model that learns from property features to estimate or classify house prices.</p>': '<p>A predictive model that learns from property features to estimate or classify house prices</p>',
    '<p>A future vision system designed to identify traffic violations from street and camera footage.</p>': '<p>A future vision system designed to identify traffic violations from street and camera footage</p>',
    '<p>A future machine learning system designed to recognize suspicious patterns in financial transactions.</p>': '<p>A future machine learning system designed to recognize suspicious patterns in financial transactions</p>',
    '<p>An advanced multilingual assistant designed to retrieve trusted knowledge, answer questions across languages, and evolve into a personal AI agent.</p>': '<p>An advanced multilingual assistant designed to retrieve trusted knowledge, answer questions across languages and evolve into a personal AI agent</p>',
    '<p>I’m always open to learning, sharing ideas, and connecting with people interested in technology and AI.</p>': '<p>I’m always open to learning, sharing ideas and connecting with people interested in technology and AI</p>',
}
for old, new in prose_replacements.items():
    index = replace_once(index, old, new, f"Homepage prose: {old[:42]}")

# Closing note: three semantic paragraphs in the user's requested wording.
old_closing = '<p class="closing-message"><span>This is where I document what I learn, build, and improve: one concept and one project at a time.</span> <span>I hope it grows into a home for my work, future projects, and meaningful collaborations with people, companies, and organizations in Iraq and around the world.</span> <span>Enjoy the journey, and come back to see what is built next.</span></p>'
new_closing = '''<div class="closing-message">
          <p>This is where I document what I learn, build and improve: one concept and one project at a time</p>
          <p>I hope it grows into a home for my work, future projects and meaningful collaborations with people, companies and organizations in Iraq and around the world</p>
          <p>Enjoy the journey and come back to see what is built next.</p>
        </div>'''
index = replace_once(index, old_closing, new_closing, "Closing note structure")

# Workshop prose and cards.
workshop_replacements = {
    '<p class="workshop-intro">A structured record of the concepts I study, the exercises I complete, and the projects I build as my AI engineering skills continue to grow.</p>': '<p class="workshop-intro">A structured record of the concepts I study, the exercises I complete and the projects I build as my AI engineering skills continue to grow</p>',
    '<p class="workshop-block-description">Core ideas that build a clear foundation for everything ahead.</p>': '<p class="workshop-block-description">Core ideas that build a clear foundation for everything ahead</p>',
    '<article class="workshop-card workshop-accent-teal"><h3>AI Foundations</h3><p>AI types, supervised learning, features, labels, classification, regression, and the role of data.</p></article>': '<article class="workshop-card workshop-accent-teal"><h3>AI Foundations</h3><p>AI types, supervised learning, features, labels, classification, regression and the role of data</p></article>',
    '<article class="workshop-card workshop-accent-steel"><h3>Data Foundations</h3><p>Structured and unstructured data, collection, labeling, quality, missing values, and cleaning.</p></article>': '<article class="workshop-card workshop-accent-steel"><h3>Data Foundations</h3><p>Structured and unstructured data, collection, labeling, quality, missing values and cleaning</p></article>',
    '<article class="workshop-card workshop-accent-indigo"><h3>Algorithms</h3><p>Inputs, processing, outputs, pseudocode, flowcharts, efficiency, and an introduction to Big O.</p></article>': '<article class="workshop-card workshop-accent-indigo"><h3>Algorithms</h3><p>Inputs, processing, outputs, pseudocode, flowcharts, efficiency and an introduction to Big O</p></article>',
    '<article class="workshop-card workshop-accent-bronze"><h3>LLMs &amp; Chatbots</h3><p>Tokens, context windows, temporary memory, hallucinations, bias, limitations, and tool support.</p></article>': '<article class="workshop-card workshop-accent-bronze"><h3>LLMs &amp; Chatbots</h3><p>Tokens, context windows, temporary memory, hallucinations, bias, limitations and tool support</p></article>',
    '<p class="workshop-block-description">Turning learned concepts into practical, useful experience.</p>': '<p class="workshop-block-description">Turning learned concepts into practical and useful experience</p>',
    '<article class="workshop-card workshop-card-featured workshop-accent-teal"><h3>Prompt Engineering</h3><p>Using clear instructions, roles, context, examples, and structured reasoning to guide AI tools toward accurate and useful results.</p></article>': '<article class="workshop-card workshop-card-featured workshop-accent-teal"><h3>Prompt Engineering</h3><p>Using clear instructions, roles, context, examples and structured reasoning to guide AI tools toward accurate and useful results</p></article>',
    '<article class="workshop-card workshop-accent-steel"><h3>AI Automation</h3><p>Building connected workflows that move information between AI tools, computers, and applications to complete practical tasks.</p></article>': '<article class="workshop-card workshop-accent-steel"><h3>AI Automation</h3><p>Building connected workflows that move information between AI tools, computers and applications to complete practical tasks</p></article>',
    '<article class="workshop-card workshop-accent-indigo"><h3>AI Design &amp; Digital Creation</h3><p>Designing and building websites, creating digital visuals, and producing images and videos with AI tools through clear prompting, thoughtful iteration, and careful refinement.</p></article>': '<article class="workshop-card workshop-accent-indigo"><h3>AI Design &amp; Digital Creation</h3><p>Designing and building websites, creating digital visuals and producing images and videos with AI tools through clear prompting, thoughtful iteration and careful refinement</p></article>',
    '<p class="workshop-block-description workshop-block-description-current">Building confidence through logic, practice, and small programs that turn each new concept into real progress.</p>': '<p class="workshop-block-description workshop-block-description-current">Building confidence through logic, practice and small programs that turn each new concept into real progress</p>',
    '<div><span class="workshop-state current">Studying now</span><h3>Python Programming</h3><p>A practical path through Python fundamentals, focused on steady progress, hands-on practice, and building clear programming solutions.</p></div>': '<div><span class="workshop-state current">Studying now</span><h3>Python Programming</h3><p>A practical path through Python fundamentals, focused on steady progress, hands-on practice and building clear programming solutions</p></div>',
}
for old, new in workshop_replacements.items():
    index = replace_once(index, old, new, f"Workshop prose: {old[:42]}")

# Closing-note layout for desktop and mobile.
old_closing_css = '''.closing-note-copy > p:last-child {
  max-width: 760px;
  margin: 22px auto 0;
  color: #9dafb6;
  font-size: 0.96rem;
  line-height: 1.86;
}
'''
new_closing_css = '''.closing-message {
  max-width: 780px;
  margin: 22px auto 0;
  display: grid;
  justify-items: center;
  gap: 14px;
  text-align: center;
}

.closing-message p {
  max-width: 100%;
  margin: 0;
  color: #9dafb6;
  font-size: 0.96rem;
  line-height: 1.86;
  text-wrap: balance;
}

.closing-message p:nth-child(2) {
  max-width: 760px;
}

.closing-message p:last-child {
  margin-top: 2px;
  color: #bcc9ce;
  font-weight: 560;
}
'''
styles = replace_once(styles, old_closing_css, new_closing_css, "Closing note desktop CSS")

old_mobile_closing = '''  .closing-note-copy > p:last-child {
    max-width: 38ch;
    font-size: 0.9rem;
    line-height: 1.82;
    text-wrap: balance;
  }
  .closing-message span { display: block; margin-top: 10px; }
  .closing-message span:first-child { margin-top: 0; }'''
new_mobile_closing = '''  .closing-message {
    max-width: 38ch;
    gap: 12px;
  }
  .closing-message p {
    max-width: 100%;
    font-size: 0.9rem;
    line-height: 1.82;
  }
  .closing-message p:nth-child(2) {
    max-width: 36ch;
  }
  .closing-message p:last-child {
    margin-top: 1px;
  }'''
styles = replace_once(styles, old_mobile_closing, new_mobile_closing, "Closing note mobile CSS")

# Match mobile pseudo-heading copy to the real punctuation-free headings.
mobile_title_replacements = {
    '--mobile-title-copy: "Learning with direction\\A Building through\\A practice.";': '--mobile-title-copy: "Learning with direction\\A Building through\\A practice";',
    '--mobile-title-copy: "From foundations\\A to intelligent systems.";': '--mobile-title-copy: "From foundations\\A to intelligent systems";',
    '--mobile-title-copy: "Building real projects.";': '--mobile-title-copy: "Building real projects";',
    '--mobile-title-copy: "Good\\A conversations\\A can start anywhere.";': '--mobile-title-copy: "Good\\A conversations\\A can start anywhere";',
    '--mobile-title-copy: "Thank you\\A for being here.";': '--mobile-title-copy: "Thank you\\A for being here";',
    '--mobile-title-copy: "Knowledge shaped\\A through practice.";': '--mobile-title-copy: "Knowledge shaped\\A through practice";',
    '--mobile-title-copy: "Concepts that\\A shape the path.";': '--mobile-title-copy: "Concepts that\\A shape the path";',
    '--mobile-title-copy: "Knowledge used\\A in real workflows.";': '--mobile-title-copy: "Knowledge used\\A in real workflows";',
    '--mobile-title-copy: "Python, one\\A practical step at a time.";': '--mobile-title-copy: "Python, one\\A practical step at a time";',
}
for old, new in mobile_title_replacements.items():
    styles = replace_once(styles, old, new, f"Mobile heading copy: {old[:42]}")

# Structural and punctuation guards for the edited visible copy.
if index.count('class="closing-message"') != 1:
    raise SystemExit("Closing message validation failed")
if index.count('class="about-lead-line') != 3:
    raise SystemExit("About introduction validation failed")
if '<span class="closing-message"' in index or '.closing-message span' in styles:
    raise SystemExit("Legacy closing-message structure remains")
if styles.count("{") != styles.count("}"):
    raise SystemExit("CSS brace balance validation failed")

index_path.write_text(index, encoding="utf-8")
styles_path.write_text(styles, encoding="utf-8")
print("Visible site copy and punctuation polished successfully.")
