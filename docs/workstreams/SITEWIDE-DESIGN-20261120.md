# Product Selection 全站排版与年月日统一

> Draft · TASK SPEC ONLY · Implementation: NOT DONE
> Size: M · Confidence: medium

## 目标与来源

2026年11月20日维护者要求本站所有网页实际消费统一字体、字号、字重、行距、间距与年月日标准；各网站独立保留风格。实现、验收和合并 main 全部完成才交付。

## 事实与唯一归属

10 个 HTML 路由分别维护样式，9 个内联 style 和 trade-in guide 独立 CSS；多套 hero/heading/spacing，日期包含点号、连字符和中文。无开放 PR。

新增一个本站共享 CSS owner，迁移10个 HTML 的真实消费者；页面只保留业务布局；由既有 scripts/validate_site.py 检查所有路由。

## 实施和验收

- [ ] 全站共用一个语义 typography/spacing owner；重复活动定义真正迁移，必要例外按正文/图表/代码/演示/打印等角色记录。
- [ ] 真实 build 或路由清单覆盖每个页面/视图；不仅查链接存在，还检查生效字体、字号和间距。新增漏接页面必须使检查失败。
- [ ] 完整日期按年月日：中文 YYYY年M月D日，英文 YYYY-MM-DD；仅年/月精度不得补造；timestamp 带明确时区。机器字段/URL/代码/证据保持原样。
- [ ] 价格、汇率、型号、优惠截至日和现有科学/购买事实不变；日期转换只改完整可见日期的显示，不改变快照来源、URL、代码与机器数据。
- [ ] python3 scripts/validate_site.py；node scripts/test_iphone_tradein.js；10/10 路由桌面+440×956；Price and route validation 必要门禁；Vercel Preview/Production 身份分别核实。
- [ ] 现有功能/隐私/科学门禁保持有效；加入漏接样式/非标准日期负例；当前候选证据通过后 Ready 并合并 main，读回 SHA。
- [ ] 发布状态和源码合并分别核实，不拿 PR 创建或 provider READY 代替页面验收。

## 执行与恢复

单一写入者，按总优先级逐站推进；已获实现、验证和合并授权。保留本站 provider 与访问保护。下一步读取真实 source owner、依赖和生成输出。回退为本 PR 的逆向变更。

## 证据

仅合同已创建；实现 NOT DONE；构建/浏览器 NOT RUN。实施完成后补命令、结果、覆盖数及真实证据链接。
