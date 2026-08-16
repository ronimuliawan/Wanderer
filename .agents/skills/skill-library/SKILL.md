---
name: skill-library
description: Searchable router and catalog for off-stack, specialized, and domain-specific ECC skills retained in the global library without loading into daily workspace context.
---

# ECC Skill Library Router

This workspace (`Wanderer`) uses a lean, stack-aligned **DAILY** install set tailored specifically for its **Tauri 2 + Rust + React 19 + TypeScript + SQLite + ONNX** desktop architecture.

All other agents, skills, and workflows are retained in the central ECC repository at `/home/ron/Projects/ECC/` and can be consulted on-demand when relevant needs arise.

---

## 1. Off-Stack Language & Framework Surfaces
*Location*: `/home/ron/Projects/ECC/`

### Python, Django, FastAPI & Machine Learning
- **Skills**: `python-patterns`, `python-testing`, `django-patterns`, `django-celery`, `django-security`, `django-tdd`, `fastapi-patterns`, `pytorch-patterns`, `mle-workflow`
- **Agents**: `python-reviewer.md`, `django-reviewer.md`, `django-build-resolver.md`, `fastapi-reviewer.md`, `pytorch-build-resolver.md`, `mle-reviewer.md`, `rag-pipeline-reviewer.md`
- **Workflows**: `python-review.md`, `fastapi-review.md`

### Go
- **Skills**: `golang-patterns`, `golang-testing`
- **Agents**: `go-reviewer.md`, `go-build-resolver.md`
- **Workflows**: `go-build.md`, `go-review.md`, `go-test.md`

### Java, Kotlin, Spring & Quarkus
- **Skills**: `java-coding-standards`, `jpa-patterns`, `kotlin-patterns`, `kotlin-testing`, `kotlin-coroutines-flows`, `kotlin-exposed-patterns`, `kotlin-ktor-patterns`, `springboot-patterns`, `springboot-security`, `springboot-tdd`, `quarkus-patterns`, `quarkus-security`, `quarkus-tdd`
- **Agents**: `java-reviewer.md`, `java-build-resolver.md`, `kotlin-reviewer.md`, `kotlin-build-resolver.md`
- **Workflows**: `kotlin-build.md`, `kotlin-review.md`, `kotlin-test.md`, `gradle-build.md`

### C++, C#, .NET & F#
- **Skills**: `cpp-coding-standards`, `cpp-testing`, `csharp-testing`, `dotnet-patterns`, `fsharp-testing`
- **Agents**: `cpp-reviewer.md`, `cpp-build-resolver.md`, `csharp-reviewer.md`, `fsharp-reviewer.md`
- **Workflows**: `cpp-build.md`, `cpp-review.md`, `cpp-test.md`

### Swift, iOS, Flutter, Dart & HarmonyOS
- **Skills**: `swiftui-patterns`, `swift-concurrency-6-2`, `swift-actor-persistence`, `swift-protocol-di-testing`, `dart-flutter-patterns`, `flutter-dart-code-review`, `android-clean-architecture`
- **Agents**: `swift-reviewer.md`, `swift-build-resolver.md`, `flutter-reviewer.md`, `dart-build-resolver.md`, `harmonyos-app-resolver.md`
- **Workflows**: `flutter-build.md`, `flutter-review.md`, `flutter-test.md`

### Vue, Nuxt, Angular, PHP, Laravel & Ruby
- **Skills**: `vue-patterns`, `nuxt4-patterns`, `angular-developer`, `php-patterns`, `laravel-patterns`, `laravel-security`, `laravel-tdd`, `perl-patterns`, `ruby-patterns`
- **Agents**: `vue-reviewer.md`, `php-reviewer.md`
- **Workflows**: `vue-review.md`

---

## 2. Specialized Domain Surfaces

### Healthcare & Life Sciences
- **Skills**: `healthcare-cdss-patterns`, `healthcare-emr-patterns`, `healthcare-eval-harness`, `healthcare-phi-compliance`, `hipaa-compliance`
- **Agents**: `healthcare-reviewer.md`

### Homelab & Network Automation
- **Skills**: `homelab-network-setup`, `homelab-network-readiness`, `homelab-pihole-dns`, `homelab-vlan-segmentation`, `homelab-wireguard-vpn`, `cisco-ios-patterns`, `netmiko-ssh-automation`, `network-bgp-diagnostics`, `network-config-validation`, `network-interface-health`
- **Agents**: `homelab-architect.md`, `network-architect.md`, `network-config-reviewer.md`, `network-troubleshooter.md`

### Web3, Crypto & Finance Ops
- **Skills**: `defi-amm-security`, `evm-token-decimals`, `prediction-market-oracle-research`, `prediction-market-risk-review`, `llm-trading-agent-security`, `customer-billing-ops`, `finance-billing-ops`

### Media Creation & External Generative Services
- **Skills**: `video-editing`, `videodb`, `manim-video`, `remotion-video-creation`, `fal-ai-media`, `blender-motion-state-inspection`

### Logistics & International Trade
- **Skills**: `customs-trade-compliance`, `energy-procurement`, `inventory-demand-planning`, `logistics-exception-management`, `returns-reverse-logistics`, `visa-doc-translate`

---

## 3. Meta & Multi-Model Orchestration Surfaces
- **Skills**: `council`, `council-multi-model`, `dev-team`, `santa-method`, `plankton-code-quality`, `openclaw-persona-forge`, `nanoclaw-repl`, `dmux-workflows`, `ito-*`
- **Agents**: `agent-evaluator.md`, `chief-of-staff.md`, `code-explorer.md`, `comment-analyzer.md`, `conversation-analyzer.md`, `gan-*`, `harness-optimizer.md`, `loop-operator.md`, `spec-miner.md`
- **Workflows**: `multi-*`, `orch-*`, `epic-*`, `gan-*`, `instinct-*`, `prp-*`, `santa-loop.md`, `sessions.md`, `pm2.md`, `jira.md`

---

## How to Load a Library Surface

When working on a task requiring one of these capabilities:
1. Locate the instructions or agent definition at `/home/ron/Projects/ECC/<skills|agents|commands>/`.
2. Review its guidelines and referenced patterns.
3. If a component becomes permanently needed in this repo, promote it using `agent-sort` into `.agents/`.
