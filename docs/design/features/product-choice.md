# Product choice and comparable evidence

稳定 ID：product-choice；范围：/iphone/, /mac/, /watch/, /osprey/。

## 目标与来源

让访客先选定产品类别和使用情境，再依据可比较的型号、配置、价格及官方来源作选择。

依据：[现有 Wish](../../wish/LATEST.md)、[现有 Design](../../dev/SITE_STANDARDS.md)，2026-11-26 按原仓库内容整理；不宣称获得新的用户批准。

## 保护的体验与语义

四类产品入口独立，型号和地区价格比较必须有配置、日期、币种、税费和汇率假设。Osprey 系列、用途、容量和价格来源不混淆，不虚构本地售价或适配保证。历史选购结论不冒充当前建议。

允许更优布局、交互和技术实现；新目标须记录来源及时间，不把当前实现不足变成降低意图的理由。

## 实现与验收

[现有页面](../../../src/pages/osprey/index.astro) · [Design](../../dev/SITE_STANDARDS.md) · [Dev / 验收入口](../../dev/README.md)。

按现有页面和验证入口检查品类导航、配置可比性、官方链接、带日期的来源、移动端与键盘操作；不更新任何实际购买建议或价格。

状态：意图来源已核对；本次只接入文档，不改变网站代码或重新验收生产功能。未验证项保持明确。

**守正出新 / Preserve the purpose, improve the design.** 保留有来源的目标、已确认的必要能力和重要约束；主动审视新的用户意图、更好的技术、智能、表达方式与成熟参考，比较现有方案和更优候选，并用真实验收验证改进。旧布局和实现不是上限；不能把推测冒充确认，或悄悄降低已确认的目标。

## 2026-11-26 evolution — Hong Kong Hikelite inventory

The merged [Hong Kong stock-map PR #33](https://github.com/suiyue77/product-selection/pull/33) and [current Wish design](../../wish/DESIGN.md) define the actual geographic decision surface. Preserve 26/28 L Raven Black identity, region and stock filters, dated source evidence, separate online and in-store availability, grouped same-building map markers and independent contact/source links. An advertised offer is not a verified checkout discount or confirmed in-store stock. No automatic orders, messages, polling or publication. The [map page](../../../src/pages/osprey/hong-kong/index.astro), [single dated snapshot](../../../src/data/osprey-hk-stock.json) and [validator](../../../scripts/validate_site.py) own mutable facts and validation. Better realization is encouraged; do not copy prices into Design. PR #34 is separate active investigation, not a merged finding.
