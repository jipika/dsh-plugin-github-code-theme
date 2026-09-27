/**
 * dsh-plugin-github-code-theme — GitHub Light / GitHub Dark syntax palette
 * for the dsh Web UI.
 *
 * The shell highlights code with shiki's `theme: "css-variables"`, so every
 * token span gets `color:var(--shiki-token-*)` and the actual palette lives
 * in 11 CSS variables defined by @deepseek-ai/dsh-client-ui-theme
 * (`:root` for light, `body[data-ds-dark-theme]` for dark).
 *
 * This plugin overrides exactly those variables with the official
 * github/vscode-github-theme palettes:
 *
 *   GitHub Light           GitHub Dark (default)
 *     keyword    #cf222e      keyword    #ff7b72
 *     function   #8250df      function   #d2a8ff
 *     string     #0a3069      string     #a5d6ff
 *     constant   #0550ae      constant   #79c0ff
 *     parameter  #953800      parameter  #ffa657
 *     comment    #6e7781      comment    #8b949e
 *     punctuation#24292f      punctuation#c9d1d9
 *
 * Foreground and background stay on the shell's own alias tokens on
 * purpose: code blocks must keep living inside the surrounding UI theme;
 * only the syntax hues become GitHub. Dark follows the shell's existing
 * `data-ds-dark-theme` flag — no theme plumbing of our own.
 *
 * Specificity: `html:root` and `html body[data-ds-dark-theme]` outrank the
 * theme package's `:root` / `body[data-ds-dark-theme]` regardless of
 * injection order, so no !important is needed.
 *
 * ── ② dsh-code-nav (sidebar file preview) ─────────────────────────────
 * The sidebar preview does NOT use shiki: dsh-code-nav ships its own
 * tokenizer and paints with its own `--cn-*` variables, which it writes as
 * an INLINE style on `.cn-root` (PALETTES.light / PALETTES.dark in
 * node_modules/dsh-code-nav/lib/client.js). Two consequences, fixed here:
 *
 *   a) overriding `--shiki-*` never touched the sidebar — it stayed on
 *      VS Code's palette while markdown blocks turned GitHub.
 *   b) its dark/light probe reads `--dsw-alias-bg-primary` / `-bg-base` /
 *      `-bg-strong` and, when all three are undefined (they are, in the
 *      current shell), falls back to `getComputedStyle(document.body)
 *      .backgroundColor`. A theme that makes the shell background
 *      translucent yields `rgba(0,0,0,0)` → the parser drops alpha → RGB
 *      (0,0,0) → luminance 0 → **a light UI is judged dark**, so the code
 *      is painted `#d4d4d4` on a near-white surface (~1.2:1 contrast,
 *      effectively invisible).
 *
 * Fix: drive those variables from the shell's authoritative
 * `data-ds-dark-theme` flag instead, with `!important` so the declaration
 * beats the element's inline style (per CSS cascading, an important
 * declaration outranks a non-important inline one). No third-party file is
 * patched, and the probe at (b) stops mattering.
 */
window.__ModuleLoader__.load({
	id: "dsh-plugin-github-code-theme",
	factory: (require) => {
		const module = { exports: {} };

		const CSS = [
			/* ---- GitHub Light ------------------------------------------ */
			"html:root{"
			+ "--shiki-token-keyword:#cf222e;"          /* keyword, storage, operators */
			+ "--shiki-token-function:#8250df;"         /* entity.name.function        */
			+ "--shiki-token-string:#0a3069;"           /* string values               */
			+ "--shiki-token-string-expression:#0a3069;"
			+ "--shiki-token-constant:#0550ae;"         /* constants, numbers, tags-as-values */
			+ "--shiki-token-parameter:#953800;"        /* parameters, plain variables */
			+ "--shiki-token-comment:#6e7781;"          /* comments                    */
			+ "--shiki-token-punctuation:#24292f;"      /* punctuation, brackets       */
			+ "--shiki-token-link:#0550ae;"             /* links, urls                 */
			+ "}",

			/* ---- GitHub Dark (default) --------------------------------- */
			"html:root[data-ds-dark-theme], html body[data-ds-dark-theme]{"
			+ "--shiki-token-keyword:#ff7b72;"
			+ "--shiki-token-function:#d2a8ff;"
			+ "--shiki-token-string:#a5d6ff;"
			+ "--shiki-token-string-expression:#a5d6ff;"
			+ "--shiki-token-constant:#79c0ff;"
			+ "--shiki-token-parameter:#ffa657;"
			+ "--shiki-token-comment:#8b949e;"
			+ "--shiki-token-punctuation:#c9d1d9;"
			+ "--shiki-token-link:#79c0ff;"
			+ "}",

			/* ---- ② GitHub Light · dsh-code-nav syntax tokens ------------ */
			"html:not([data-ds-dark-theme]) body:not([data-ds-dark-theme]) .cn-root{"
			+ "--cn-fg:#24292f!important;"
			+ "--cn-plain:#24292f!important;"
			+ "--cn-ident:#24292f!important;"
			+ "--cn-comment:#6e7781!important;"
			+ "--cn-string:#0a3069!important;"
			+ "--cn-kw:#cf222e!important;"
			+ "--cn-type:#953800!important;"
			+ "--cn-num:#0550ae!important;"
			+ "--cn-fn:#8250df!important;"
			+ "--cn-ln:#8c959f!important;"
			+ "--cn-dim:#6e7781!important;"
			+ "--cn-dim3:#8c959f!important;"
			+ "}",

			/* ---- ② GitHub Dark · dsh-code-nav syntax tokens ------------- */
			"html[data-ds-dark-theme] .cn-root, html body[data-ds-dark-theme] .cn-root{"
			+ "--cn-fg:#e6edf3!important;"
			+ "--cn-plain:#c9d1d9!important;"
			+ "--cn-ident:#c9d1d9!important;"
			+ "--cn-comment:#8b949e!important;"
			+ "--cn-string:#a5d6ff!important;"
			+ "--cn-kw:#ff7b72!important;"
			+ "--cn-type:#ffa657!important;"
			+ "--cn-num:#79c0ff!important;"
			+ "--cn-fn:#d2a8ff!important;"
			+ "--cn-ln:#6e7681!important;"
			+ "--cn-dim:#8b949e!important;"
			+ "--cn-dim3:#6e7681!important;"
			+ "}",

			/* ---- ③ dsh-code-nav chrome (chips / badge / popup / search) --
			 * Only so the widget's own surface colours agree with the theme we
			 * just forced; drop this block alone if the widget should keep its
			 * built-in chrome. Neither block touches match-highlight colours
			 * (`--cn-match-bg` / `--cn-match-cur`) or the code surface itself.
			 */
			"html:not([data-ds-dark-theme]) body:not([data-ds-dark-theme]) .cn-root{"
			+ "--cn-border:#d0d7de!important;"
			+ "--cn-accent:#0969da!important;"
			+ "--cn-accent-bg:rgba(9,105,218,.1)!important;"
			+ "--cn-badge-bg:rgba(9,105,218,.08)!important;"
			+ "--cn-badge-fg:#0969da!important;"
			+ "--cn-input-bg:rgba(0,0,0,.03)!important;"
			+ "--cn-line-hover:rgba(0,0,0,.045)!important;"
			+ "--cn-pop-bg:#ffffff!important;"
			+ "--cn-warn:#9a6700!important;"
			+ "--cn-warn-bg:rgba(154,103,0,.1)!important;"
			+ "--cn-flash:rgba(9,105,218,.14)!important;"
			+ "--cn-flash-strong:rgba(9,105,218,.32)!important;"
			+ "}",

			"html[data-ds-dark-theme] .cn-root, html body[data-ds-dark-theme] .cn-root{"
			+ "--cn-border:#30363d!important;"
			+ "--cn-accent:#4493f8!important;"
			+ "--cn-accent-bg:rgba(68,147,248,.14)!important;"
			+ "--cn-badge-bg:rgba(68,147,248,.1)!important;"
			+ "--cn-badge-fg:#79c0ff!important;"
			+ "--cn-input-bg:rgba(255,255,255,.05)!important;"
			+ "--cn-line-hover:rgba(255,255,255,.05)!important;"
			+ "--cn-pop-bg:#161b22!important;"
			+ "--cn-warn:#d29922!important;"
			+ "--cn-warn-bg:rgba(210,153,34,.12)!important;"
			+ "--cn-flash:rgba(68,147,248,.18)!important;"
			+ "--cn-flash-strong:rgba(68,147,248,.4)!important;"
			+ "}",
		].join("\n");

		let styled = false;
		function ensureStyles() {
			if (styled || typeof document === "undefined") return;
			const el = document.createElement("style");
			el.setAttribute("data-dsh-github-code", "");
			el.textContent = CSS;
			document.head.appendChild(el);
			styled = true;
		}

		function apply() {
			ensureStyles();
			module.exports.apply = apply;
			module.exports.inject = [];
			return module.exports;
		}

		apply();
		return module.exports;
	}
});
