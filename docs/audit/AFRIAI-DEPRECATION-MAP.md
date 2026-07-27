# AfriAI Deprecation Map

## Canonical Runtime

ACTIVE:
src/afriai/runtime/AfriAIRuntime.js

## Active Pipeline

Frontend / Channels
→ AfriAIChannelGateway
→ AfriAIConversationOrchestrator
→ AfriAIRuntime
→ Provider Layer

## Candidates For Review

src/afriai/services/AfriAIService.js
Reason:
Duplicate orchestration path.

modules/afriai/runtime/AfriAIRuntime.js
Reason:
Duplicate runtime declaration.

src/legacy/ai/*
Reason:
Legacy intelligence adapters.

src/legacy/routes/whatsapp.afriai.routes.js
Reason:
Legacy WhatsApp AI route.

## Rule

No deletion until import graph confirmation.
