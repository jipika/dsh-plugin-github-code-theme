<div align="center">
  <img src="assets/icon.svg" width="72" alt="dsh-plugin-github-code-theme icon">
</div>

# dsh-plugin-github-code-theme

> **拥有**：11 个 `--shiki-token-*` 变量 + `dsh-code-nav` 的 24 个 `--cn-*`
> 变量（GitHub Light / Dark 色板）。
> **冲突时**：任何其它改这两套配色的插件都与此互斥（当前无）；前景/背景保持
> `dsw-alias` token 与页面底色，以便与皮肤层共存。
> **回滚**：从 `dsh.profile.bundles` 去掉 + 重启应用；只想恢复 code-nav 自带的
> 外壳配色，删掉 client.js 里的 ③ 段即可。

把 DSH Web UI 的代码配色换成 **GitHub Light / GitHub Dark**（VS Code 的
github 官方主题色板）。作用于侧边栏文件预览、markdown 代码块、会话里一切
高亮面。

## 两套高亮，各改各的

| 面 | 渲染者 | 颜色来源 | 本插件改的变量 |
| --- | --- | --- | --- |
| markdown 代码块 / 会话内代码 | shiki（`theme: "css-variables"`） | `@deepseek-ai/dsh-client-ui-theme` 定义的 `--shiki-token-*` | 第 1、2 块 |
| 侧栏文件预览（代码预览导航 tab） | `dsh-code-nav` 自带 tokenizer | 它写在 `.cn-root` **inline style** 上的 `--cn-*`（源码里的 `PALETTES.light/dark`） | ② ③ 段 |

两者**没有**共用变量：只覆盖 `--shiki-*` 时，markdown 会变 GitHub，而侧栏
预览仍是 VS Code 色板。

## 原理

**shiki 侧**：token 颜色全部输出为 `var(--shiki-token-*)`，色板由主题包定义在
11 个 CSS 变量上（亮色 `:root`、暗色 `body[data-ds-dark-theme]`）。本插件用
更高特异性（`html:root` / `html:root[data-ds-dark-theme], html
body[data-ds-dark-theme]`）覆盖其中 9 个，不需要 `!important`。

**code-nav 侧**：变量是**行内**写在 `.cn-root` 上的，CSS 规则想赢过它必须
`!important`（重要声明优先于行内普通声明）。选择器同时兼容深色标志落在
`html` 或 `body` 两种情形；浅色段用 `:not()` 双重否定，把自己限定在「两处都
没有该属性」时。

前景/背景**刻意不动**（继续走 `--dsw-alias-*` 与页面底色）：代码块的底色必须
跟 UI 主题一致，只换语法色调。亮暗切换自动跟随 shell 的 `data-ds-dark-theme`。

## 为什么必须带 code-nav 段（2026-09-27 修复）

`dsh-code-nav` 的 `detectDark()` 依次读 `--dsw-alias-bg-primary` /
`--dsw-alias-bg-base` / `--dsw-alias-bg-strong`；这三者在当前 shell 里都是
**未定义**，于是它回落到 `getComputedStyle(document.body).backgroundColor`，
再用正则取 RGB、**丢掉 alpha** 算亮度。把外壳背景做成半透明的主题（body 的
`backgroundColor` = `rgba(0, 0, 0, 0)`）会让它算出亮度 0 → **浅色 UI 被判成
深色** → 代码用 `#d4d4d4` 画在近白底上，对比度约 1.2:1，肉眼近乎不可见。

本插件改为由 shell 的 `data-ds-dark-theme` 决定配色，不再依赖那个亮度探测：
哪怕 body 背景透明，侧栏代码仍是 GitHub Light。实测：把 body 背景改成
`rgba(0,0,0,0)` 后 code-nav 自己仍给 `--cn-plain:#d4d4d4`，而实际渲染是
`#24292f`（GitHub Light 正文色）。

## 色板对照

| Token | GitHub Light | GitHub Dark |
| --- | --- | --- |
| keyword | `#cf222e` | `#ff7b72` |
| function | `#8250df` | `#d2a8ff` |
| string | `#0a3069` | `#a5d6ff` |
| constant / number | `#0550ae` | `#79c0ff` |
| parameter / type | `#953800` | `#ffa657` |
| comment | `#6e7781` | `#8b949e` |
| punctuation / 正文 | `#24292f` | `#c9d1d9` |
| link | `#0550ae` | `#79c0ff` |

## 想只作用于文件预览？

默认全局统一（消息里的代码块也变 GitHub，观感一致）。若只想改文件预览，
删掉 client.js 里 `--shiki-*` 的两个块，只留 ② ③ 段（它们只作用于
`.cn-root`）。
