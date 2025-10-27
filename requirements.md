# 🧩 Mini-Project Challenge — Redis + PUML Edition

Thank you for your interest in joining our team!
As a first step, we’d like you to take on a small but meaningful challenge.

The goal is to show how you connect a modern web app’s pieces — **frontend**, **backend**, **realtime communication**, **typed contracts**, **persistence**, and **third-party APIs** — while keeping the scope tight and **local-only**.

---

## 🧠 Overview

Build a tiny web app with **two frontends** and **one backend** where:

* A **Reviewer** speaks a short list of items.
* A **Participant** hears polite clarifying questions generated from that list.

You will also illustrate the **architecture and data flow** by creating a PlantUML (`.puml`) file diagram that clearly shows:

1. Frontend–Backend–Redis interactions
2. Pub/Sub and Stream flows
3. WebSocket event flow between clients and the server
4. OpenAI API integration point

This diagram should be stored at:
`/docs/architecture.puml`

---

## 🖥️ Frontend A: Reviewer (React + TypeScript)

**UI:**

* Mic button
* Optional text fallback

**Voice Capture:**

* Use the **Browser SpeechRecognition (Web Speech API)** or a **stubbed recorder**.
* Text input fallback is acceptable.

**Normalization:**

* Split input on commas
* Trim whitespace
* Drop empty entries

**Action:**

* Send the normalized list to the server over **WebSocket**

**Status Display:**

* Show simple *sending* and *acknowledged* states

---

## 🎧 Frontend B: Participant (React + TypeScript)

**Realtime:**

* Subscribe over **WebSocket**

**Display:**

* Render generated clarifying questions in a lightweight chat or feed

**Speech:**

* Use **Speech Synthesis** to speak the received questions aloud
* Ensure there is **no overlapping playback**

**Reconnect Handling:**

* When reconnecting, request missed messages from the backend using **Redis Stream IDs**

---

## ⚙️ Backend: Node.js (Fastify) + WebSockets + Redis

**Endpoints:**

* `GET /health` → returns `{ ok: true }`

**WebSocket Events:**

* `followup:create` — list of items from Reviewer
* `agent:questions` — generated text returned to Participant

**Redis Usage:**

* **Streams:**

  * Store ordered follow-ups (`followups:stream`)
  * Store generated questions (`questions:stream`)
* **Pub/Sub:**

  * Broadcast questions in real-time (`questions:live`)
* **Rate Limits & Deduplication:**

  * Use simple counters and hash keys to reject spam or duplicate requests
* **Replay Logic:**

  * When a Participant reconnects, send missed messages since their last Stream ID

**OpenAI Integration:**

* On `followup:create`, call the **Chat Completions API** with a fixed system prompt that turns the item list into **2–4 concise, polite clarifying questions**.
* Preserve **message order** and **avoid duplicates**.

**TypeScript Contracts:**

* Share strict TypeScript types (no `any`).

---

## 🧩 Shared Types

Located in `/packages/shared`:

```typescript
type FollowUpPayload = {
  items: string[];
  createdAt: number;
};

type AgentQuestions = {
  text: string;
  createdAt: number;
  streamId?: string;
};

interface ClientToServerEvents {
  "followup:create": (payload: FollowUpPayload) => void;
}

interface ServerToClientEvents {
  "agent:questions": (data: AgentQuestions) => void;
}
```

---

## ⚙️ Environment / Configuration

In the server `.env` file:

```
OPENAI_API_KEY=...
REDIS_URL=redis://localhost:6379
```

Validation rules:

* Reject empty lists
* Cap items (e.g., 8 maximum)
* Cap total character length (e.g., 300 characters)

---

## 🏗️ Hosting / Deployment (Local Only)

All services should run on **localhost**:

| Service     | Port | URL                                            |
| ----------- | ---- | ---------------------------------------------- |
| Reviewer    | 5173 | [http://localhost:5173](http://localhost:5173) |
| Participant | 5174 | [http://localhost:5174](http://localhost:5174) |
| API / WS    | 3000 | [http://localhost:3000](http://localhost:3000) |

Optionally, provide a `docker-compose.yml` for **one-command local setup** (include Redis).

---

## 📦 Deliverables

Your GitHub repository should include:

✅ Monorepo structure
  `/apps/reviewer`, `/apps/participant`, `/services/server`, `/packages/shared`

✅ Setup & scripts (pnpm or yarn workspaces recommended)
✅ `.env.example`
✅ Instructions for local run (Reviewer, Participant, Server)
✅ Brief note on OpenAI usage (model, prompt, token limits)
✅ Redis integration for ordering, replay, and rate limiting
✅ `docs/architecture.puml` PlantUML diagram showing system flow
✅ A **60–90 second** screen capture showing the acceptance test

---

## 🧪 Acceptance Test (Happy Path)

1. Start **Redis**, the **server**, and both **frontends** on localhost.
2. Open **Participant** — it auto-connects and shows *“ready.”*
3. Open **Reviewer** — press Mic and say:

   > “latency, retry logic, error states.”
4. The **server** calls OpenAI and broadcasts results.
5. **Participant** displays and speaks:

   > “Sorry to circle back — could you help me clarify latency, retry logic, and error states?”
6. Send a second list quickly — messages should play **in order**, **without overlap**.
7. Close and reopen Participant — missed messages should **replay in correct order** (from Redis Stream).
8. Include the `.puml` architecture diagram in your submission to visualize this flow.
