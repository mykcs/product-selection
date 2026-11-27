# Wish design — Product selection

The project is intentionally small and covers Osprey backpacks, Apple Watch, iPhone and Mac. [README](../../README.md) owns the current scope and route list.

Each product route should explain the relevant choice: intended use, model/configuration, or practical purchase implication. Regional purchase comparisons should state their configuration, currency, tax and dated exchange-rate assumptions; Osprey routes support use-case selection and series browsing without inventing fit guarantees or local prices.

Wish holds the durable decision goal. Current Apple and Osprey facts belong in the route/source evidence and must be refreshed when guidance changes. Dated evidence remains a snapshot; Osprey catalogue prices have one owner, `osprey/series/catalog.json`. Dev explains how the static site is maintained.

## Open-ended interaction-quality wish (2026-11-20)

Product comparisons should make choices effortless to scan and operate. Links, filters, decision controls and expandable buying evidence need coherent hover, focus, touch and selected-state feedback; icon size, alignment, tap area and relative spacing should help users compare **like-for-like** rather than signal unverified superiority or hide price/tax assumptions.

**Current illustrative reference:** [nuro.dev](https://nuro.dev/) for restrained hover response, consistent icon proportions and layout rhythm, as observed on 2026-11-20. This is *not* a design to copy, a vendor/framework choice, a pixel or animation contract, or a permanent ceiling. Adopt more suitable existing patterns when better evidence emerges.

When implementing later, keep all ten static product routes independent where appropriate, reuse the actual route/design owners, and validate real desktop hover, keyboard focus, 440px phone touch, no overflow/layout shifts, and accurate visible purchase assumptions. **No comparison data, buying recommendation, or production UI changes in this Wish-only PR.**

## Hong Kong Hikelite inventory map (2026-11-26)

Owner goal: replace scattered buying research with one geographic decision surface for 2026 S26 Raven Black 26 L and 28 L. Preserve the prior official dealer addresses, contacts, independent region/station filters and MTR navigation. Map plus compact per-store comparison should answer where to go, what the selected model costs and what evidence exists; group same-building stores at their actual common coordinate. The dated HKD snapshot is owned by `src/data/osprey-hk-stock.json`, distinct from the US series catalogue; public variant/page evidence, not generic product availability, supports each offer. Online stock never implies physical-store stock, no unsupported quantity or discount, and no automatic messages, checkout, polling or production publication. New research should update the single snapshot rather than duplicate prices in prose. Validate the chosen model, availability/region filters, empty results, grouped marker popups, mobile readability and existing contact links.


Evidence intake: external Agent reports are leads, not stock authority. Cross-check exact model generation, colour and barcode where available against the merchant's original variant or visible page. Preserve authoritative product links and dated evidence in the existing stock snapshot; keep official price baselines and other-version / uncertain leads distinct from verified target offers. Store pickup rules should use merchant policy rather than an unverified time guarantee. Do not change map stock status or minimum price based on an unrelated variant.


Promotion evidence: keep the ordinary listed price, conditional single-item discount and multi-item allocation separate. A verified guest cart is not a paid order. A product with the exact requested color selectable and addable but without verified barcode is a distinct candidate (orange on the map), not a confirmed green offer. Keep source links, membership/payment conditions and no-order boundary; expired or unverified offers must not count toward confirmed stock or unconditional lowest price.


Backpack decision constraints: a city-use pack need not look businesslike or have a dedicated laptop compartment; test the laptop in its own protective sleeve. Support, genuine airflow and loaded fit take priority. The current Hong Kong shortlist is ordinary black Hikelite 26 / 28; a limited black edition is no longer required. Preserve the general use-case chooser as exploration, not a final personal recommendation. A purchase decision is not complete until actual fit, model, payment and pickup are confirmed.


Filter refinement (2026-11-26): the current owner wants an exact Hikelite 28 L black view, with better tag filtering. Keep the surveyed S26 ordinary Raven Black series/colour as explicit fixed scope, not fake options for unresearched products. Combine independently selected capacity, stock evidence state and district/station; show contextual distinct-store counts, removable active tags, reset and a URL-restorable selection. List rows, map markers/popups and result counts must use the same matching predicate. Green confirmed web stock and orange cart-addable barcode-pending offers remain separate. Preserve other store/merchant evidence and the full-market price reference; distinguish it from filtered results. No change to repository visibility, deployment protection or production release is authorized by this refinement.

Purchase-first refinement (2026-11-26): owner sets four initial choices in order: Osprey, Hikelite, 28 L, Raven Black. Brand, series and colour expose only surveyed scope; capacity defaults to 28 L, can switch to 26 L or both. Default stock view shows confirmed web stock and separate barcode-pending addable candidates, confirmed first. Lead with compact product selector, comparable price and promotion conditions, address/station and product/contact/navigation actions; map beside results on desktop, below on mobile. Preserve details, original sources and MTR evidence through disclosures, stock/region filters and URL state. Reset restores the exact default. No publication or access protection change. This supersedes the dense facet wall and map-before-offers layout.


## 香港抓绒衣选购与 lululemon 全港地图（2026-11-27）

用户希望将全港 lululemon 门店标在地图上，并比较 Sojourn 拉绒内里针织夹克与 Patagonia 系列，遵循现有站点标准。目标是快速决定买哪件、去哪里试穿，而不是百科目录。保留目标 Bone / L，按用途比较男款全拉链代表型号，颜色与尺码库存分开核实；默认先展示日常使用建议，同时可切换徒步、防风、保暖与轻便预算。全港门店地图包含普通门店、Outlet 和机场禁区店，地图位置来自官方导航链接。门店库存与折扣未知时明确标记；不把官网售罄视为全港无货。


### 选购品质与设计价值：后续深化意图（2026-11-27）

**原始状态（PR #36）：已由用户提出，待未来调研与网页实现。** 当时仅保存意图。随后用户要求继续完成可独立完成的事项；本次新增初步标准证据与试穿比较，未锁定最终审美、评分或购买决定。

**用户确认的原始意图：** 选购抓绒衣的标准是“真材实料、设计好看、价格合理”。希望理解抓绒衣相关国际、美国、法国、日本、欧洲等标准及其含金量，区分真正有技术价值的标准与可能受商业赞助或利益影响的宣传，并考察实际剪裁设计是否符合个人喜好。当前没有时间继续设计与深究；未来应从本记录出发拓展研究和网页，而不是把当前按用途比较的初步实现当成最终设计。

**未来研究问题（Agent 拆解，不是已确认的评分规则）：**

- 真材实料：核查纤维成分、织物/抓绒结构、面料与成衣工艺，以及保暖、透气、排汗、耐磨、抗起球、洗涤耐久等适用性能。区分材料克重与整件重量、实验指标与真实穿着体验；不凭厚度、品牌或单一材料名推定质量。
- 标准及含金量：先调查实际适用的国际及各地区标准、测试方法和认证体系（包括美国、法国、日本及欧洲，不假定每个地区都有专门抓绒衣标准）。核对正式标准编号、版本、范围、测量对象、试验条件、阈值或分级、制定及治理机构、强制/自愿属性、检测机构独立性及资质、资助/利益冲突、公开可查性。区分测试方法、法规要求、性能合格标准、第三方认证、行业自愿标签与品牌专有营销主张；商业资助本身不证明标准无效，知名标志也不证明某件成衣品质优越。
- 证据与可比性：优先官方标准文本和标准机构、适用的独立检测报告/认证登记、可靠同行研究，再核对品牌原始技术资料；区分面料、工厂、品牌和具体型号的认证或试验范围。不将不同方法、条件或版本的数字直接排名。缺证据标记未知；不要制造认证、性能数值或相对优势。
- 剪裁与审美：比较肩线、袖型、衣长、腰身与松量、领口、口袋、拉链、颜色、外表质感、整体比例；通过同角度真实产品图和条件允许时的试穿记录验证。结合身体尺寸、叠穿和活动空间判断合身；尺码标记不能跨品牌直接等同。审美由用户最终确认，不能把 Agent 偏好、技术性能或品牌名声替代个人喜好。
- 合理价格：对照具体型号、颜色、尺码、市场、日期、实际到手价及优惠条件，把有证据的材料、工艺、性能、耐用性和设计价值与价格一起考虑；不默认最低价最好，也不将品牌溢价视为已经证明的质量。

**未来网页实现及验收方向（候选，待用户继续设计）：** 在现有 /fleece/ 基础上，先形成可追溯的标准与证据调研，再选择适用比较指标，展示真实剪裁/外观参考与可核实的价格；将客观性能证据、标准可信度、主观审美和购买条件分开表达。保留当前 Sojourn 与 Patagonia 比较和香港门店线索，但允许依据新研究扩展品牌、款式及界面；不把当前默认用途、已有款式或旧界面锁死。不要未经用户确认就制定固定评分权重、绝对排名或替用户确定最终款式。未来实现继续遵循现有全站设计标准，验收证据可追溯性、同条件可比性、未知状态表达以及真实桌面/手机阅读体验。

**续做入口：** 先读本段、[现有抓绒衣实施记录](../dev/DESIGN.md#fleece-comparison-and-hong-kong-lululemon-directory) 和 `src/pages/fleece/index.astro`，再开展上述调研。用户有时间继续设计时，以本意图为起点，先研究而非直接重做页面。


## 全站逐页面 Design Intent 索引（2026-11-27）

本索引补齐当前 14 条路由的意图入口。标注“候选解释”的内容来自现有页面，不冒称用户逐条确认；未来需要用户修订时守正出新。既有详细记录仍是原有意图唯一权威，索引只提供定位和验收概要，不复制价格等可变事实。

| 路由 | 页面 | 来源 / 确认边界 | 设计意图 | 后续验收方向 |
| --- | --- | --- | --- | --- |
| `/` | 首页 | 已有 README / 首页原文 | 优先可继续的选购任务，保留已完成的决策；不要把首页变成复杂百科。 | 五品类入口、未决/完成语义、移动端与清晰导航。 |
| `/fleece/` | 抓绒衣 | 用户明确，见本文件既有抓绒意图 | 材料真、设计好看、价格合理；按用途比较但不预设最终品牌或审美。 | 保留同配置价格、证据等级、来源、未知标记及试穿核对；不虚构认证。 |
| `/fleece/hong-kong/` | lululemon 香港门店 | 用户明确，见本文件既有抓绒地图意图 | 把全部品牌门店位置及购买线索集中，门店状态不得由网店状态推断。 | 门店全集、筛选/地图一致、导航、Outlet 与机场禁区区别。 |
| `/osprey/` | 小鹰选购 | 用户明确，见本文件 Hikelite 段 | 承重、通风、实际背负优先；普通黑 Hikelite 28 默认，保留不同用途探索。 | 固定默认目标和按用途选择；不擅自把商务外观/电脑仓列成必需。 |
| `/osprey/series/` | 小鹰系列 | README、系列价格决策记录 | 浏览代表系列及用途差异，产品目录为精选而非全部 SKU。 | 系列/型号检索、来源/日期/美元参考价；不混淆港币。 |
| `/osprey/hong-kong/` | 小鹰香港购买 | 用户明确，见本文件 Hikelite 段 | 先看购买证据、再看地图；普通黑 28 L 默认，可切换 26/28；确认网店与待核码候选区分。 | 列表/筛选/地图/计数同源，优惠条件、港铁、门店不冒称现货。 |
| `/watch/` | Apple Watch | README、现有页面；已完成决定 | 保留 46 mm 原色钛金属已定结论及陶瓷对比理由。 | 保留历史语义、地区比较条件；不重新打开已决定的购买目标。 |
| `/iphone/` | iPhone | README、既有购买决策 | 仅 18 Pro Max 256GB；区分地区、SIM、支付、折抵和真实已购状态。 | 不同地区同配置、汇率/税与折抵假设明确，保留已购结局。 |
| `/iphone/trade-in-guide/` | iPhone 换机 | README、两份既有 decision | 现场可照念的话术，真实回答引导下一步；实际路线与模拟分开。 | 五种回答与不同付款/退款情境、保留真实结局；不把未确认折抵说成已返款。 |
| `/mac/` | Mac 选购 | README、现有页面；候选解释 | 围绕实际任务瓶颈和现售机器分流到各工具。 | 型号与芯片事实有出处；任务需求与硬件指标分开。 |
| `/mac/macbook-pro/` | MacBook Pro | 现有页面；候选解释 | 先选机身，再按瓶颈和预算比较芯片；不要只按型号大小升级。 | 14/16 英寸可用配置、可比较指标、价格和证据；未来型号不冒充现售。 |
| `/mac/mac-mini/` | Mac mini | README、现有页面；部分用户明确 | 先判断实际远程工作及 Passkey 流程，再比较芯片与内存。 | 区分本地/附近 iPhone/远程无人值守；已验证和未知配置分开。 |
| `/mac/storage/` | SSD | 现有页面；候选解释 | 分清容量、介质和缓存/速度；按实际负载与容量判断。 | 不把 1TB 当作速度开关；区分实测和规格或未验证推断。 |
| `/agent/` | Agent 阅读 | 既有 Reader 规约和实现 | 提供通用品类索引，不能导出个人购买、财务、账户、私有资料。 | 严格 allowlist、只读、复制回退、登录保护边界、不绕过。 |

全站通用：继承 [全站排版与日期规范](../dev/SITE_STANDARDS.md)，先研究实际目标和现状，再改善表现与交互；不因旧实现冻结设计。原始目标可追溯，审美及未确认偏好由用户最终判断。页面/用途比较不是购买或成交；当前商品事实由官方来源和日期化数据维护。
