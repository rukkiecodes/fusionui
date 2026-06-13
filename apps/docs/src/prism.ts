// Shared Prism instance for the docs. Registers the languages used in fenced
// markdown code blocks so those samples get the same highlighting as the
// <Example>/<Markup> source panels (which the .markup token theme styles).
import Prism from 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-scss'

// Vue SFC samples (```vue) highlight with the HTML (markup) grammar — same as
// the <Example> source panels.
Prism.languages.vue = Prism.languages.markup

// Tokenize the fenced code blocks rendered by markdown-it (which emits plain
// <pre><code class="language-x"> with no highlighting). Excludes <Markup>'s
// own panels (class `markup`), which are already highlighted via v-html.
export function highlightMarkdown(root?: ParentNode): void {
  if (typeof document === 'undefined') return
  const scope = root ?? document
  scope
    .querySelectorAll<HTMLElement>('.markdown-body pre:not(.markup) code[class*="language-"]')
    .forEach(el => Prism.highlightElement(el))
}

export default Prism
