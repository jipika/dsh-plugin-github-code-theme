# dsh-plugin-github-code-theme

把 DSH Web UI 的代码语法配色换成 **GitHub Light / GitHub Dark**（VS Code 的
github 官方主题色板）。作用于侧边栏文件预览、markdown 代码块、会话里一切
shiki 高亮面——因为它们共用同一套变量。

## 原理

DSH 用 shiki 的 `theme:"css-variables"` 高亮：token 颜色全部输出为
`var(--shiki-token-*)`，真正的色板由 `@deepseek-ai/dsh-client-ui-theme`
定义在 11 个 CSS 变量上（亮色 `:root`、暗色 `body[data-ds-dark-theme]`）。
本插件用更高特异性（`html:root` / `html body[data-ds-dark-theme]`）覆盖
这 9 个 token 色，不需要 `!important`，不碰任何 DOM。

前景/背景**刻意不动**（继续走 `--dsw-alias-label-primary` /
`--dsw-alias-markdown-code-block`）：代码块的底色必须跟 UI 主题一致，
只换语法色调。亮暗切换自动跟随 shell 的 `data-ds-dark-theme`。

## 色板对照

| Token | GitHub Light | GitHub Dark |
| --- | --- | --- |
| keyword | `#cf222e` | `#ff7b72` |
| function | `#8250df` | `#d2a8ff` |
| string | `#0a3069` | `#a5d6ff` |
| constant | `#0550ae` | `#79c0ff` |
| parameter | `#953800` | `#ffa657` |
| comment | `#6e7781` | `#8b949e` |
| punctuation | `#24292f` | `#c9d1d9` |
| link | `#0550ae` | `#79c0ff` |

## 想只作用于文件预览？

默认全局统一（消息里的代码块也变 GitHub，观感一致）。若只想改文件预览，
把 client.js 里两个选择器换成预览容器的稳定钩子（CSS 变量局部覆盖会自动
级联到容器内所有 shiki span）。

## 回滚

删掉 `~/.dsh/profiles/desktop/cordis.patch.yml` 里的
`dsh-plugin-github-code-theme` insert 段 + 重启应用。
