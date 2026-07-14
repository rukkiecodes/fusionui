<script setup lang="ts">
import { computed, ref } from 'vue'

// Every coding agent reads its project instructions from a different place. The
// FusionUI skill is one markdown file, so "installing" it is really just putting
// that file where your agent already looks — this picks the path for you.
//
// The `AGENTS.md` convention is shared by several tools (Codex, OpenCode, Jules,
// Factory…), which is why they collapse into one option rather than pretending
// each needs something bespoke.

const SKILL_URL = 'https://rukkiecodes.github.io/fusionui/ai/fusionui-skill.md'
const LLMS_URL = 'https://rukkiecodes.github.io/fusionui/llms.txt'

interface Agent {
  id: string
  name: string
  /** Where this tool looks for project instructions. */
  path: string
  /** Why that path — shown under the command. */
  note: string
  command: string
}

const curl = (dest: string) => `curl -fsSL ${SKILL_URL} \\\n  -o ${dest}`

const agents: Agent[] = [
  {
    id: 'claude',
    name: 'Claude Code',
    path: '.claude/skills/fusionui/SKILL.md',
    note: 'Claude Code loads Agent Skills from .claude/skills/. The file already carries the name/description frontmatter a skill needs, so it works as-is. Claude pulls it in only when the task is actually about FusionUI, so it costs you nothing the rest of the time.',
    command: `mkdir -p .claude/skills/fusionui && \\\n${curl('.claude/skills/fusionui/SKILL.md')}`,
  },
  {
    id: 'codex',
    name: 'Codex / AGENTS.md',
    path: 'AGENTS.md',
    note: 'AGENTS.md is the shared convention — OpenAI Codex, OpenCode, Jules, Factory and others all read it. Appending keeps whatever instructions you already had.',
    command: `${curl('/tmp/fusionui-skill.md')} && \\\ncat /tmp/fusionui-skill.md >> AGENTS.md`,
  },
  {
    id: 'cursor',
    name: 'Cursor',
    path: '.cursor/rules/fusionui.mdc',
    note: 'Cursor reads project rules from .cursor/rules/. Open the file afterwards and set `description` and `globs: ["**/*.vue"]` in its frontmatter so the rule attaches to Vue files.',
    command: `mkdir -p .cursor/rules && \\\n${curl('.cursor/rules/fusionui.mdc')}`,
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    path: '.windsurf/rules/fusionui.md',
    note: 'Windsurf reads workspace rules from .windsurf/rules/.',
    command: `mkdir -p .windsurf/rules && \\\n${curl('.windsurf/rules/fusionui.md')}`,
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    path: '.github/copilot-instructions.md',
    note: 'Copilot applies repository custom instructions from this one file, so append rather than overwrite.',
    command: `mkdir -p .github && \\\n${curl('/tmp/fusionui-skill.md')} && \\\ncat /tmp/fusionui-skill.md >> .github/copilot-instructions.md`,
  },
  {
    id: 'cline',
    name: 'Cline',
    path: '.clinerules/fusionui.md',
    note: 'Cline reads every file in .clinerules/.',
    command: `mkdir -p .clinerules && \\\n${curl('.clinerules/fusionui.md')}`,
  },
  {
    id: 'zed',
    name: 'Zed',
    path: '.rules',
    note: 'Zed reads a single .rules file at the repository root.',
    command: `${curl('/tmp/fusionui-skill.md')} && \\\ncat /tmp/fusionui-skill.md >> .rules`,
  },
  {
    id: 'other',
    name: 'Anything else',
    path: '(paste the URL)',
    note: 'No file needed. Most agents will fetch a URL if you give them one — point yours at the skill, or at the llms.txt index if it can crawl.',
    command: `# Give your agent this, and it can read the rest itself:\n${SKILL_URL}\n\n# Full docs index (every page as raw markdown):\n${LLMS_URL}`,
  },
]

const selected = ref<string>('claude')
const agent = computed(() => agents.find(a => a.id === selected.value) ?? agents[0])

const copied = ref(false)
async function copy() {
  await navigator.clipboard.writeText(agent.value.command)
  copied.value = true
  setTimeout(() => (copied.value = false), 1600)
}
</script>

<template>
  <div class="skill">
    <div class="skill__tabs" role="tablist" aria-label="Choose your coding agent">
      <button
        v-for="a in agents"
        :key="a.id"
        class="skill__tab"
        :class="{ 'skill__tab--active': a.id === selected }"
        role="tab"
        :aria-selected="a.id === selected"
        @click="selected = a.id"
      >
        {{ a.name }}
      </button>
    </div>

    <div class="skill__panel">
      <div class="skill__path">
        <span class="skill__label">Installs to</span>
        <code>{{ agent.path }}</code>
      </div>

      <div class="skill__code">
        <button class="skill__copy" :aria-label="copied ? 'Copied' : 'Copy command'" @click="copy">
          <f-icon :icon="copied ? 'check' : 'copy'" size="small" />
          {{ copied ? 'Copied' : 'Copy' }}
        </button>
        <pre><code>{{ agent.command }}</code></pre>
      </div>

      <p class="skill__note">{{ agent.note }}</p>
    </div>
  </div>
</template>

<style scoped>
.skill {
  margin: 24px 0;
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.12);
  border-radius: 16px;
  overflow: hidden;
  background: rgb(var(--fui-theme-surface));
}

.skill__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  border-bottom: 1px solid rgba(var(--fui-theme-on-surface), 0.1);
  background: rgba(var(--fui-theme-on-surface), 0.03);
}

.skill__tab {
  padding: 7px 13px;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(var(--fui-theme-on-surface), 0.65);
  background: transparent;
  border: 0;
  border-radius: 9px;
  cursor: pointer;
  transition: var(--fui-transition);
}
.skill__tab:hover {
  background: rgba(var(--fui-theme-on-surface), 0.06);
  color: rgb(var(--fui-theme-on-surface));
}
.skill__tab--active {
  background: rgb(var(--fui-theme-primary));
  color: rgb(var(--fui-theme-on-primary));
}
.skill__tab:focus-visible {
  outline: 2px solid rgb(var(--fui-theme-primary));
  outline-offset: 2px;
}

.skill__panel {
  padding: 18px;
}

.skill__path {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.skill__label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: rgba(var(--fui-theme-on-surface), 0.45);
}
.skill__path code {
  font-family: var(--fui-font-family-mono);
  font-size: 0.85rem;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(var(--fui-theme-primary), 0.1);
  color: rgb(var(--fui-theme-primary));
}

.skill__code {
  position: relative;
  border-radius: 12px;
  background: #1a1b26;
  overflow: hidden;
}
.skill__code pre {
  margin: 0;
  padding: 18px;
  overflow-x: auto;
}
.skill__code code {
  font-family: var(--fui-font-family-mono);
  font-size: 0.83rem;
  line-height: 1.7;
  color: #c0caf5;
  white-space: pre;
}

.skill__copy {
  position: absolute;
  top: 10px;
  right: 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  font: inherit;
  font-size: 0.75rem;
  color: #c0caf5;
  background: rgba(255, 255, 255, 0.08);
  border: 0;
  border-radius: 7px;
  cursor: pointer;
}
.skill__copy:hover {
  background: rgba(255, 255, 255, 0.16);
}

.skill__note {
  margin: 14px 0 0;
  font-size: 0.88rem;
  line-height: 1.6;
  color: rgba(var(--fui-theme-on-surface), 0.62);
}

@media (prefers-reduced-motion: reduce) {
  .skill__tab {
    transition: none;
  }
}
</style>
