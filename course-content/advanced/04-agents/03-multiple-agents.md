---
title: Using multiple agents, and when it is the right move
duration: 9
summary: Two or three agents working in parallel can finish a job in a fraction of the time. Or they can tangle each other up. Here is how to tell which you will get.
---

Claude Code can run more than one agent at a time. Each runs in its own context, on its own slice of the work, and reports back.

This is powerful. It is also the single place people overreach. This lesson covers when multi-agent is genuinely faster, when it is actively worse, and how to set one up well.

## The core idea

Some tasks split cleanly.

- **Read 200 PDFs and find every mention of our new product.** You can send 4 agents, each takes 50 PDFs, and they come back in a quarter of the time.
- **Research four competitors in parallel.** One agent per competitor, each builds a profile independently.

Some tasks do not split at all.

- **Write a blog post.** A single thread of thought. Splitting across agents produces a patchwork.
- **Refactor a tangled codebase.** Agents working in parallel will step on each other's changes.

Multi-agent is **parallelism**. It helps where work is genuinely independent. It hurts where the pieces need to agree with each other.

## The three rules for multi-agent

Before you kick off a multi-agent job, check all three.

### 1. The work splits cleanly

You can write down the split in one sentence. "Agent A does folder 1, Agent B does folder 2." If you cannot cleanly divide the work, do not try to parallelise it.

### 2. The agents do not need to talk to each other

Each agent's work is independent. No agent needs the output of another agent to finish its own task. If they do, you have a dependency chain, not parallel work.

### 3. The outputs combine easily

At the end, you have a clear way to gather the results. "Each agent writes to its own file, I merge at the end." "Each agent returns a list, I concatenate." Not "each agent rewrites the same document in a different way".

<div class="callout callout-example">
  <span class="callout-icon">🎯</span>
  <div>
    <strong>Good multi-agent splits.</strong>
    <ul>
      <li><strong>Research in parallel.</strong> 4 agents, each reads one of four competitor websites and writes a short brief. Main chat collates.</li>
      <li><strong>Bulk analysis.</strong> 3 agents, each takes a third of a folder of CSVs and pulls out the same metric. Main chat stitches.</li>
      <li><strong>Independent drafts.</strong> 3 agents, each writes one of three different landing-page variants from the same brief. Main chat picks or blends.</li>
    </ul>
    <p><strong>Bad multi-agent splits.</strong></p>
    <ul>
      <li>"One agent writes, one edits, one fact-checks" on the same document. They will tangle.</li>
      <li>"Two agents independently fix bugs in the same file." Merge conflicts.</li>
      <li>"Three agents each do a different step of one task in sequence." That is not parallel, that is a pipeline. Run them in order, not at once.</li>
    </ul>
  </div>
</div>

## How many agents is the right number?

For most real work, **two to four**.

- **One agent:** the default. Use this most of the time.
- **Two to four:** the sweet spot for parallel tasks. Measurable speed gain, manageable coordination cost.
- **Five or more:** rare. You usually want it for research-style jobs where each agent does a cheap, self-contained task. The coordination overhead of more than five is rarely worth the parallelism.

There is a real cost to every agent you add: each one consumes its own budget and adds to what you have to review when it comes back. More agents is not free.

## A multi-agent prompt template

```
I want to run this in parallel. Split the work into N independent
pieces. Spawn one agent per piece. Each agent should:
  - Work in its own conversation.
  - Produce a single output file at a named path.
  - Not read or write what any other agent is doing.

When all agents are done, collate the outputs into [final format].
Do not start any agent that depends on another agent's output.
```

Adjust to your task. The important thing is you have **explicitly** separated the pieces, named the outputs, and told Claude Code not to let the agents interfere.

<div class="callout callout-scenario">
  <span class="callout-icon">🎬</span>
  <div>
    <strong>A competitor research session.</strong>
    <p>You want profiles of four competitors for a Monday morning meeting. In a single agent, that is a 40-minute slog: 10 minutes per competitor, sequential, context gets crowded.</p>
    <p>Multi-agent: kick off four agents, one per competitor, each with the same brief and a different URL. Each writes to /competitors/acme.md, /competitors/globex.md, etc. You go for a 15-minute walk. Come back: four clean profiles, no cross-contamination, ready to skim.</p>
    <p>Same work, a quarter of the elapsed time, and the thinking on each competitor stays uncontaminated by the other three.</p>
  </div>
</div>

## The two failure modes to watch for

### 1. Agents disagreeing

If two agents produce contradictory answers on the same thing ("Competitor A's pricing is £30/mo" vs "£50/mo"), you now have a tiebreaker job. Decide upfront how to resolve disagreements. Often the answer is "check the source yourself", not "run a third agent".

### 2. Phantom speed-up

Running four agents when they are each waiting on the same slow MCP server is no faster than running one. Parallelism only helps when the bottleneck is compute or reading, not a single upstream service.

<div class="callout callout-warning">
  <span class="callout-icon">⚠️</span>
  <div>
    <strong>Never parallelise destructive operations.</strong> "Two agents deleting different files at the same time" is a recipe for losing something important. Deletes, renames, and file moves should run in one place, sequentially, with a plan you approved.
  </div>
</div>

## The mental shortcut

Before going multi-agent, ask yourself: **if I had two capable humans and an hour, could I split this work cleanly between them with a two-line brief?**

If yes, multi-agent will help.

If you would need to pair them up, have a stand-up halfway, and reconcile their output, it is not really parallel work. Do it in one agent instead.

<div class="callout callout-try">
  <span class="callout-icon">⚡</span>
  <div>
    <strong>Try this now.</strong> Pick a research task you can split four ways. Competitors, customer testimonials from four folders, four years of reports, four draft pitches. Write one brief, spawn four parallel agents, and merge the outputs.
    <p>Time the elapsed minutes. Compare to how long it would take sequentially. That gap is the measurable win of understanding when multi-agent fits.</p>
  </div>
</div>

<div class="quiz" data-quiz-title="Quick check">
  <div class="quiz-q" data-answer="2">
    <p class="quiz-prompt">Which is a good fit for a multi-agent workflow?</p>
    <button class="quiz-option">Drafting a single long blog post in three voices</button>
    <button class="quiz-option">Two agents fixing bugs in the same file</button>
    <button class="quiz-option">Four agents each reading one competitor website and writing a brief</button>
    <button class="quiz-option">Three agents sharing one document to edit at the same time</button>
    <p class="quiz-explain">The competitor research splits cleanly, has no cross-agent dependencies, and the outputs combine easily (four files). The others all introduce coordination problems.</p>
  </div>
  <div class="quiz-q" data-answer="0">
    <p class="quiz-prompt">What is the sweet spot for number of agents?</p>
    <button class="quiz-option">Two to four</button>
    <button class="quiz-option">Twenty</button>
    <button class="quiz-option">One, always</button>
    <button class="quiz-option">Ten or more</button>
    <p class="quiz-explain">Two to four is where the speed-up is noticeable and the coordination overhead is still manageable. More than that, and the cost of reviewing what each agent did outweighs the time saved.</p>
  </div>
  <div class="quiz-q" data-answer="1">
    <p class="quiz-prompt">You want to refactor a tangled codebase. Should you run multiple agents in parallel?</p>
    <button class="quiz-option">Yes, it will be faster</button>
    <button class="quiz-option">No, they will step on each other's changes</button>
    <button class="quiz-option">Only if you use more than five</button>
    <button class="quiz-option">Only if each agent uses Opus</button>
    <p class="quiz-explain">Refactoring a single tangled codebase is not independent work. Agents working in parallel on the same files will create conflicts you then have to untangle.</p>
  </div>
</div>

Next: [when NOT to use Claude Code](/course/advanced/agents/when-not-to-use).
