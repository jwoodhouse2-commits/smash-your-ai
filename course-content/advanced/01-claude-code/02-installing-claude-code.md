---
title: Installing Claude Code on macOS and Windows
duration: 10
summary: A step-by-step install guide for non-developers. Covers the terminal, Node.js, your API key, and the common gotchas.
---

This lesson gets Claude Code running on your computer. No prior terminal experience needed.

We will cover:

1. What you need before you start.
2. Installing on macOS.
3. Installing on Windows.
4. Logging in.
5. The three things that go wrong most often.

You only need to do each step once. Total time, about ten minutes.

## What you need before you start

Two things.

**A terminal.** This is already on your computer. It is the app that lets you type commands. On macOS it is called **Terminal** (in Applications → Utilities). On Windows 11, it is called **Windows Terminal** or **PowerShell**, both come pre-installed.

**A Node.js install.** Claude Code is built on Node.js, which is a programming runtime. You probably do not have it, and that is fine, we will install it in a moment. You only ever need to do this once.

You will also need either a **Claude Pro subscription** (so you can log in with your Anthropic account, which is the easiest route) or an **Anthropic API key** (pay-as-you-go, cheaper if you are not a heavy user).

<div class="callout callout-tip">
  <span class="callout-icon">💡</span>
  <div>
    <strong>Which to pick?</strong> If you already pay for Claude Pro, use that. Login takes one click. If not, an API key is fine and costs pennies per task. You can always swap later.
  </div>
</div>

## Installing on macOS

Open **Terminal** (press Cmd+Space, type "terminal", hit Enter).

### 1. Install Node.js

The easiest way is via the official installer. In your browser, go to [nodejs.org](https://nodejs.org), click the big green **LTS** button, download the macOS installer, and run it. Click through the defaults.

When it finishes, go back to Terminal and type:

```
node --version
```

You should see something like `v20.11.0`. If you do, Node is installed.

### 2. Install Claude Code

In Terminal, type:

```
npm install -g @anthropic-ai/claude-code
```

Press Enter. You will see a few lines of text scroll by. When it stops, Claude Code is installed.

### 3. Start it

```
claude
```

The first time you run this, Claude Code will ask you to log in. Follow the prompts.

## Installing on Windows

Windows is a little different. The smoothest route is to use **PowerShell** (pre-installed, just search for it in the Start menu).

### 1. Install Node.js

In your browser, go to [nodejs.org](https://nodejs.org), click the big green **LTS** button, download the Windows installer, run it, accept the defaults.

When it finishes, open PowerShell and type:

```
node --version
```

You should see `v20.11.0` or similar.

### 2. Install Claude Code

In PowerShell:

```
npm install -g @anthropic-ai/claude-code
```

### 3. Start it

```
claude
```

<div class="callout callout-example">
  <span class="callout-icon">🎯</span>
  <div>
    <strong>Advanced Windows: WSL.</strong> If you ever plan to write code or do anything heavier with Claude Code, installing **Windows Subsystem for Linux (WSL)** gives you a much smoother experience. It runs a tiny Linux inside Windows. Open PowerShell as administrator and run <code>wsl --install</code>. Restart, and from then on you use WSL as your terminal. Not required for most people; nice to have.
  </div>
</div>

## Logging in

The first time you run `claude`, it will print a URL to the screen or open your browser.

- **If you have Claude Pro:** pick "Log in with Claude". You will see your normal Claude login page. Approve it. Done.
- **If you have an API key:** pick "Use API key". Paste your key when prompted. Done.

You will only need to do this once. After that, `claude` opens straight into the prompt.

<div class="callout callout-try">
  <span class="callout-icon">⚡</span>
  <div>
    <strong>Try this now.</strong> Once you are logged in, type this into the Claude prompt:
    <p><code>what version of Claude Code is this, and what directory am I in?</code></p>
    <p>It will tell you the version and show you the folder your terminal is currently pointed at. That proves the install works and Claude can see your filesystem.</p>
  </div>
</div>

## The three things that go wrong most often

Ninety per cent of install problems are one of these.

### 1. "command not found: npm"

Means Node.js is not installed, or was installed but the terminal has not noticed yet. **Close Terminal completely and reopen it**, then try `node --version` again. If that still fails, reinstall Node.

### 2. "permission denied" during npm install

Means your terminal is not allowed to install global packages. On macOS, the fix is to run the install without `sudo`, but re-configure npm to use a folder you own:

```
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
```

Then reinstall. On Windows this error is rare; if it appears, try running PowerShell as administrator.

### 3. "claude: command not found" after install

The install worked but your terminal cannot find the binary. The fix is to close and reopen the terminal. If that does not fix it, run:

```
npm root -g
```

That tells you where global packages live. You may need to add that folder to your PATH, but it is an edge case. Search the Anthropic docs for your exact error message if you hit this.

## Checking it really works

With `claude` running, type this:

```
list the files in my Documents folder
```

It will ask permission to read your Documents folder. Say yes. You should see a list of your files. If so, you are fully up and running.

## What is next

You have Claude Code installed. The next lesson gets you through your first three real commands, so the tool starts paying for itself.

<div class="quiz" data-quiz-title="Quick check">
  <div class="quiz-q" data-answer="1">
    <p class="quiz-prompt">What do you need to install before Claude Code?</p>
    <button class="quiz-option">Python</button>
    <button class="quiz-option">Node.js</button>
    <button class="quiz-option">Docker</button>
    <button class="quiz-option">VS Code</button>
    <p class="quiz-explain">Claude Code runs on Node.js. You install it once from nodejs.org, then install Claude Code with a single npm command.</p>
  </div>
  <div class="quiz-q" data-answer="0">
    <p class="quiz-prompt">What is the command to install Claude Code once Node is ready?</p>
    <button class="quiz-option">npm install -g @anthropic-ai/claude-code</button>
    <button class="quiz-option">brew install claude</button>
    <button class="quiz-option">download claude.exe from Anthropic</button>
    <button class="quiz-option">pip install claude-code</button>
    <p class="quiz-explain">The <code>-g</code> makes it global so you can run <code>claude</code> from anywhere. Same command on macOS and Windows.</p>
  </div>
  <div class="quiz-q" data-answer="2">
    <p class="quiz-prompt">You type <code>claude</code> and get "command not found" just after installing. First thing to try?</p>
    <button class="quiz-option">Reinstall Node.js</button>
    <button class="quiz-option">Restart your computer</button>
    <button class="quiz-option">Close and reopen the terminal</button>
    <button class="quiz-option">Buy a Claude Pro subscription</button>
    <p class="quiz-explain">Nine times out of ten, the terminal just has not refreshed its list of commands. Closing and reopening it fixes the problem.</p>
  </div>
</div>

Next: [your first three commands](/course/advanced/claude-code/first-three-commands).
