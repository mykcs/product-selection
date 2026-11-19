# 全站排版与日期标准

本站使用原生静态 HTML、CSS 和现有业务脚本。所有 10 个页面链接 `/assets/site.css`；此文件是字体、字号、字重、行距、字距、间距和内容宽度的唯一活动定义。页面自己的样式负责产品布局、颜色、边框和图形几何，并引用共享角色。新增页面必须进入现有路由清单和全路由验收。

## 有限角色

| 内容 | 唯一归属与规则 |
|---|---|
| 正文字体 | `--font-body`：现有系统无衬线字体及中文回退；代码使用 `--font-code` |
| 字号 | caption 13、small 14、body 16、lead 18、title 20、card 24、section 32、price 40 CSS px，使用对应 rem token；hero 44–76，现场工具标题 36–56，保留响应式变化 |
| 字重 | body 400、medium 500、strong 600、heading 700；普通 strong/b/th 明确消费 heading，避免嵌套 UA `bolder` |
| 行距 | tight 1.15、heading 1.3、control 1.4、body 1.65、reading 1.75；使用无单位比例，随真实字号缩放 |
| 间距 | 2、4、8、12、16、24、32、48、64、80、96 CSS px 的 rem 尺度；panel、section、stack、control、gutter 使用语义别名。普通局部值收敛到该有限尺度，没有为旧的每一个数值新增 token |
| 页面宽度 | 普通页面 `--width-content:72rem`；到店工具 `--width-tool:52rem`；统一 gutter 桌面 24、手机 16 CSS px |
| 阅读宽度 | 普通段落和 lead `--width-reading:68ch`；短决策摘要 44ch；标题 22ch |
| 表格和控件 | 横向比较表最小宽度 52rem，超出时在 `.matrix` 内滚动；选择控件有 13rem/8rem 两个角色 |

页面不再各自定义 body 字体、hero 字号/行距、`.wrap` 宽度和 gutter。所有普通 margin/padding/gap，包括 HTML 内联样式，都消费共享尺度。`0`、`auto`、网格的百分比、分支连线、条形图的数据宽度、图标尺寸、边框和固定图形位置保留其布局含义；它们不被描述为正文尺度。没有目录级或整页豁免。

## 日期与事实边界

`assets/calendar-date.js` 是纯日历格式器，不调用 `Date`，不推测时区或补造日期精度。

- 完整中文展示为 `2026年10月13日`，英文为 `2026-10-13`；只到月时保留 `2026年10月` / `2026-10`。只有年份、`9月22日` 或季节的原始精度不补齐。
- 静态日期用 `<time datetime="2026-10-13">2026年10月13日</time>`；展示与机器值必须相符。源码审计调用同一格式器，拒绝连字符、点号、带空格中文或英文月名混入中文展示。
- Osprey 动态标题从唯一目录 `catalog.checkedAt` 生成 `<time>`，不再复制另一个日期事实。
- 价格、汇率、产品配置、交易结果、源 JSON、代码、URL、文件名、证据日期和 ID 保持各自原始事实。本次只改变网页日期的呈现，不刷新价格快照或购买结论。

## 可执行验收

默认 PR 门禁仍是轻量 `Price and route validation`，没有浏览器依赖安装或部署副作用：

```sh
python3 scripts/validate_site.py
node scripts/test_iphone_tradein.js
node scripts/test_calendar_date.cjs
python3 scripts/test_design_contract.py
```

源码检查动态发现全部 HTML，并与价格验证的路由清单比较；漏页、漏接 owner、局部 token 重定义、独立排版数值、未知 token 和展示日期不一致都会失败。负例明确覆盖未接入页面、新增未登记页面、`calc(18px)`、隐藏在负 margin 旁的独立间距、坏正文与机器日期混淆。

正式浏览器验收通过同一 `Repository CI` 的手动入口执行：`browser=true`，`expected_sha` 为完整已审查提交，dispatch 分支必须正好指向该 SHA。该入口使用固定 Playwright 镜像及驱动，超时 20 分钟，证据保留 3 天，不变更部署或分支保护。

- Chromium 和 WebKit × 桌面 1440×1000 / 手机 440×956（3×）× 明暗主题 × 全部 10 页面，共 80 个基础渲染。
- 检查真实 main 标题和正文的字体、字号、字重、行距；扰动 panel、section、gap、gutter 及实际页面/阅读宽度。设置和恢复后各等待两帧；要求宽度真实改变，恢复后的测量也必须匹配。
- 通过真实操作打开 disclosure，覆盖 Osprey 四场景、18 系列/36 产品及空搜索，iPhone A/B 与保障时点、付款渠道，五种到店对话和两条购买结果，MacBook 两尺寸与 Mac mini 比较选择。
- 同时检查可见字体最小值、行距角色、溢出、日期、运行错误，并上传全部页面截图和候选 SHA 绑定的测量 JSON。手机上下文保持 3×，长页截图按 CSS 像素导出以控制证据体积。正确页头无法掩盖坏正文的负例必须失败。

静态验证通过只说明源文件合同成立。正式浏览器结果、人工截图复核、PR 合并与 Vercel Production 对应提交需要分别记录，不能互相替代。

## 采用的标准方法

共享变量按 [W3C CSS Custom Properties](https://www.w3.org/TR/css-variables-1/) 的继承和级联机制连接真实消费者；日期使用 [HTML `<time>`](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-time-element) 的机器值/显示值边界；验收采用 [Playwright viewport 和 colorScheme](https://playwright.dev/docs/emulation) 的真实渲染。本站继续采用现有静态架构。
