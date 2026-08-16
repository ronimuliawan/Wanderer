---
name: skill-library
description: Searchable router and catalog for off-stack, specialized, and domain-specific ECC skills retained in the global library without loading into daily workspace context.
---

# ECC Skill Library Router

This workspace (`Wanderer`) uses an evidence-backed **DAILY** install set tailored specifically for its Tauri 2 + Rust + React 19 + TypeScript + SQLite + ONNX stack.

All other skills are maintained in the central ECC Library at `/home/ron/Projects/ECC/skills/` and can be consulted on-demand when relevant needs arise.

---

## Skill Categories & Triggers

### 1. Alternative Backend & Database Stacks
- **PostgreSQL / MySQL / Redis / ClickHouse / Prisma / NestJS / Bun**:
  - `postgres-patterns`, `mysql-patterns`, `redis-patterns`, `clickhouse-io`, `prisma-patterns`, `backend-patterns`, `nestjs-patterns`, `bun-runtime`
  - *Location*: `/home/ron/Projects/ECC/skills/<skill-name>/`

### 2. Python, Django, FastAPI & Machine Learning
- **Python / Django / Celery / FastAPI / PyTorch / MLE**:
  - `python-patterns`, `python-testing`, `django-patterns`, `django-celery`, `django-security`, `django-tdd`, `django-verification`, `fastapi-patterns`, `pytorch-patterns`, `mle-workflow`
  - *Location*: `/home/ron/Projects/ECC/skills/<skill-name>/`

### 3. Mobile, Multiplatform & Other Languages
- **Flutter / Dart / Android / Swift / SwiftUI / Kotlin / Java / Go / C++ / C# / .NET / F# / PHP / Vue / Angular / Nuxt**:
  - `dart-flutter-patterns`, `flutter-dart-code-review`, `android-clean-architecture`, `swiftui-patterns`, `swift-concurrency-6-2`, `swift-actor-persistence`, `swift-protocol-di-testing`, `kotlin-patterns`, `kotlin-testing`, `kotlin-coroutines-flows`, `kotlin-exposed-patterns`, `kotlin-ktor-patterns`, `java-coding-standards`, `jpa-patterns`, `springboot-patterns`, `springboot-security`, `springboot-tdd`, `quarkus-patterns`, `golang-patterns`, `golang-testing`, `cpp-coding-standards`, `cpp-testing`, `csharp-testing`, `dotnet-patterns`, `fsharp-testing`, `php-patterns`, `laravel-patterns`, `laravel-security`, `laravel-tdd`, `vue-patterns`, `angular-developer`, `nuxt4-patterns`, `react-native-patterns`, `compose-multiplatform-patterns`
  - *Location*: `/home/ron/Projects/ECC/skills/<skill-name>/`

### 4. Enterprise, Infrastructure & Cloud Ops
- **Docker / Kubernetes / Environments / CI / Observability**:
  - `docker-patterns`, `kubernetes-patterns`, `flox-environments`, `canary-watch`, `uncloud`, `deployment-patterns`, `production-audit`
  - *Location*: `/home/ron/Projects/ECC/skills/<skill-name>/`

### 5. Media Creation, Video & 3D
- **Video Editing / Motion Graphics / Blender**:
  - `video-editing`, `videodb`, `manim-video`, `remotion-video-creation`, `fal-ai-media`, `blender-motion-state-inspection`
  - *Location*: `/home/ron/Projects/ECC/skills/<skill-name>/`

### 6. Domain-Specific (Healthcare, Homelab, Web3, Trade, Marketing)
- **Healthcare**: `healthcare-cdss-patterns`, `healthcare-emr-patterns`, `healthcare-eval-harness`, `healthcare-phi-compliance`, `hipaa-compliance`
- **Homelab & Networking**: `homelab-network-setup`, `homelab-network-readiness`, `homelab-pihole-dns`, `homelab-vlan-segmentation`, `homelab-wireguard-vpn`, `cisco-ios-patterns`, `netmiko-ssh-automation`, `network-bgp-diagnostics`, `network-config-validation`, `network-interface-health`
- **Web3 & Trading**: `defi-amm-security`, `evm-token-decimals`, `prediction-market-oracle-research`, `prediction-market-risk-review`, `llm-trading-agent-security`
- **Business Ops & Marketing**: `customer-billing-ops`, `finance-billing-ops`, `customs-trade-compliance`, `energy-procurement`, `inventory-demand-planning`, `logistics-exception-management`, `returns-reverse-logistics`, `marketing-campaign`, `social-publisher`, `social-graph-ranker`, `seo`, `lead-intelligence`, `investor-materials`, `investor-outreach`
- **Scientific Research**: `scientific-db-pubmed-database`, `scientific-db-uspto-database`, `scientific-pkg-gget`, `scientific-thinking-literature-review`, `scientific-thinking-scholar-evaluation`

---

## How to Load a Library Skill

When working on a specialized task requiring one of these capabilities:
1. Locate the skill instructions at `/home/ron/Projects/ECC/skills/<skill-name>/SKILL.md`.
2. Review its guidelines and referenced patterns.
3. If the skill is permanently needed in this repo, promote it using `agent-sort` or copy it into `.agents/skills/<skill-name>/`.
