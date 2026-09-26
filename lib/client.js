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
			"html body[data-ds-dark-theme]{"
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
