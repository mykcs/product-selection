# Product Selection 全站排版与年月日统一

> Implementation candidate · local source checks PASS · formal browser acceptance NOT RUN
> PR #22 remains pending review, exact-candidate browser evidence, merge and deployment.

## 目标与来源

2026年11月20日维护者要求本站所有网页实际消费统一字体、字号、字重、行距、间距与年月日标准；各网站独立保留风格。实现、验收和合并 main 全部完成才交付。

## 事实与唯一归属

原始 10 个 HTML 路由分别维护样式，9 个内联 style 和 trade-in guide 独立 CSS；多套 hero/heading/spacing，日期包含点号、连字符和中文。

现在 `assets/site.css` 为单一 owner，10 个 HTML 均真实链接并消费其角色；重复 body/hero/shell 定义已移除，923 处原始声明收敛到有限字号/字重/行距/间距与宽度角色。全部路由由既有 `scripts/validate_site.py` 调用新的源码/date guard 检查。完整维护规则见 [SITE_STANDARDS.md](../dev/SITE_STANDARDS.md)。

## 实施和验收

- [x] 全站共用一个语义 typography/spacing owner；重复活动定义真正迁移，必要例外按正文/图表/代码/演示/打印等角色记录。
- [ ] 真实 build 或路由清单覆盖每个页面/视图；不仅查链接存在，还检查生效字体、字号和间距。新增漏接页面必须使检查失败。
- [x] 完整日期按年月日：中文 YYYY年M月D日，英文 YYYY-MM-DD；仅年/月精度不得补造。本站当前无需要转换的可见 timestamp；机器字段/URL/代码/证据保持原样。
- [x] 价格、汇率、型号、优惠截至日和现有科学/购买事实不变；日期转换只改网页日期的显示，不改变快照来源、URL、代码与机器数据。
- [ ] python3 scripts/validate_site.py；node scripts/test_iphone_tradein.js；10/10 路由桌面+440×956；Price and route validation 必要门禁；Vercel Preview/Production 身份分别核实。
- [ ] 现有功能/隐私/科学门禁保持有效；加入漏接样式/非标准日期负例；当前候选证据通过后 Ready 并合并 main，读回 SHA。
- [ ] 发布状态和源码合并分别核实，不拿 PR 创建或 provider READY 代替页面验收。

## 执行与恢复

单一写入者，按总优先级逐站推进；已获实现、验证和合并授权。保留本站 provider 与访问保护。下一步发布此候选并执行正式验收；通过后 Ready、合并 main 并分别核实 Production。回退为本 PR 的逆向变更。

## 证据

本地工作树证据（未冒领提交、浏览器或发布结果）：

- `python3 scripts/validate_site.py` PASS：10 HTML、2595 个局部 CSS/inline 声明、835 个文本/时间节点；既有型号、价格、汇率、交易和内部路由校验全部保持。
- `node scripts/test_iphone_tradein.js` PASS；`node scripts/test_calendar_date.cjs` PASS；`python3 scripts/test_design_contract.py` 6 项 PASS；新浏览器和动态 Osprey 脚本语法检查 PASS。
- 独立前后比对：10 页可见源文本经同一日历显示投影后相同（忽略文档头尾新增的标签空白）；91 个购买/导航/证据链接、5 个内联业务脚本保持相同；catalog、到店 model/ui/app 及两份历史证据共 6 个源文件逐字节相同。
- 这是直接发布的静态站，无框架 build。正式 Chromium/WebKit 80 基础渲染、交互状态、截图与干预/恢复测量入口已落盘，尚未执行；必须在准确候选 SHA 上通过，证据见工作流 artifacts。
- 源码负例覆盖漏接页面、新增未登记路由、独立字体/行距/间距/宽度、错误日期与机器值不一致。浏览器负例使用同一验收函数拒绝“页头接入而 main 正文独立覆盖”。

验收与交付待补：正式 CI run、截图复核、合并 SHA、对应 Vercel Preview/Production 身份与真实 URL。
