# 🎯 Beginner-Friendly Gameplan

**Your Mission:** Build a working real-time messaging app with AI, step by step.

**Key Principle:** Build one piece at a time, test it, then move to the next. You'll learn by doing!

---

## **Day 1: Get Everything Talking to Each Other**

### ✅ Step 1: Create the folder structure (30 min)
- [ ] Create main project folder: `redis-puml-miniapp`
- [ ] Create these subfolders:
```
redis-puml-miniapp/
├── apps/
│   ├── reviewer/          (one React app)
│   └── participant/       (another React app)
├── services/
│   └── server/            (Node.js backend)
├── packages/
│   └── shared/            (TypeScript types both apps use)
└── docs/                  (for diagram later)
```

**What you're doing:** Just making folders. That's it.

---

### ✅ Step 2: Install Redis (30 min)
- [ ] Download and install Docker Desktop
- [ ] Create `docker-compose.yml` in project root:
```yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```
- [ ] Run: `docker-compose up -d`
- [ ] **Test:** Redis is now running on your computer

**Stuck?** Google: "install docker desktop windows"

---

### ✅ Step 3: Create the shared types (30 min)
- [ ] Navigate to `/packages/shared/`
- [ ] Run: `npm init -y`
- [ ] Create `src/types.ts` and paste:
```typescript
export type FollowUpPayload = {
  items: string[];
  createdAt: number;
};

export type AgentQuestions = {
  text: string;
  createdAt: number;
  streamId?: string;
};

export interface ClientToServerEvents {
  "followup:create": (payload: FollowUpPayload) => void;
}

export interface ServerToClientEvents {
  "agent:questions": (data: AgentQuestions) => void;
}
```
- [ ] Create `src/index.ts`:
```typescript
export * from './types';
```

**What you're doing:** Creating a shared language so your frontend and backend understand each other.

---

### ✅ Step 4: Create a basic Node.js server (1-2 hours)
- [ ] Navigate to `/services/server/`
- [ ] Run: `npm init -y`
- [ ] Install packages: `npm install fastify @fastify/websocket socket.io redis openai dotenv`
- [ ] Install dev tools: `npm install -D typescript @types/node tsx`
- [ ] Create `.env` file:
```
OPENAI_API_KEY=your-key-here
REDIS_URL=redis://localhost:6379
```
- [ ] Create `server.ts`:
```typescript
import Fastify from 'fastify';

const app = Fastify({ logger: true });

app.get('/health', async () => {
  return { ok: true };
});

const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('✅ Server running on http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
```
- [ ] Add to `package.json` scripts:
```json
"scripts": {
  "dev": "tsx watch server.ts"
}
```
- [ ] Run: `npm run dev`
- [ ] Visit http://localhost:3000/health in browser
- [ ] **Test:** You should see `{"ok":true}`

**End of Day 1 Goal:** ✅ You have folders, Redis running, and a basic server that says "I'm alive"

---

## **Day 2: Make the Reviewer App Send Messages**

### ✅ Step 5: Create Reviewer React app (1 hour)
- [ ] Navigate to `/apps/reviewer/`
- [ ] Run: `npm create vite@latest . -- --template react-ts`
- [ ] Run: `npm install`
- [ ] Install Socket.IO: `npm install socket.io-client`
- [ ] Run: `npm run dev`
- [ ] Visit http://localhost:5173
- [ ] **Test:** You should see the default Vite page

---

### ✅ Step 6: Add a simple form (1-2 hours)
- [ ] Replace `src/App.tsx` with a basic form:
```typescript
import { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSend = () => {
    setStatus('sent');
    console.log('Sending:', input);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Reviewer</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="apple, banana, orange"
        style={{ width: '300px', padding: '10px' }}
      />
      <button onClick={handleSend} style={{ marginLeft: '10px', padding: '10px' }}>
        Send
      </button>
      <p>Status: {status}</p>
    </div>
  );
}

export default App;
```
- [ ] **Test:** Type something and click Send. Should show "Status: sent"

**Don't worry about WebSockets yet. Just make the form work.**

---

### ✅ Step 7: Connect to the server with WebSockets (1-2 hours)
- [ ] Update `src/App.tsx` to connect to server
- [ ] Update server to support WebSockets
- [ ] **Test:** Open browser console, you should see "✅ Connected to server!"

---

### ✅ Step 8: Send data to the server (1 hour)
- [ ] Update Reviewer's `handleSend` function to emit WebSocket events
- [ ] Update server to receive and log messages
- [ ] **Test:** Type "apple, banana, orange" in Reviewer - should see it in server console

**End of Day 2 Goal:** ✅ Reviewer can send messages to server

---

## **Day 3: Make the Participant App Receive Messages**

### ✅ Step 9: Create Participant React app (1 hour)
- [ ] Same as Step 5, but use port 5174
- [ ] Edit `vite.config.ts` to set port to 5174

---

### ✅ Step 10: Listen for messages (1-2 hours)
- [ ] Create basic UI with message display
- [ ] Listen for `agent:questions` events
- [ ] Display messages on screen

---

### ✅ Step 11: Make the server pass messages between them (2-3 hours)
- [ ] Update server to broadcast messages from Reviewer to all Participants
- [ ] **Test:** Messages sent from Reviewer appear in Participant

**End of Day 3 Goal:** ✅ Messages flow from Reviewer → Server → Participant

---

## **Day 4: Add OpenAI (the smart part)**

### ✅ Step 12: Get OpenAI working (2-3 hours)
- [ ] Add OpenAI integration to server
- [ ] Call OpenAI API when receiving `followup:create`
- [ ] Send AI-generated questions to Participants
- [ ] **Test:** AI generates questions based on input

**End of Day 4 Goal:** ✅ OpenAI generates real questions

---

## **Day 5: Add Redis (for saving messages)**

### ✅ Step 13: Connect to Redis (1 hour)
- [ ] Add Redis client to server
- [ ] Test connection

---

### ✅ Step 14: Save messages to Redis Streams (1-2 hours)
- [ ] Save follow-ups to `followups:stream`
- [ ] Save questions to `questions:stream`
- [ ] Publish to `questions:live` Pub/Sub channel

---

### ✅ Step 15: Replay old messages when Participant reconnects (2-3 hours)
- [ ] Add `request:replay` event handler
- [ ] Use Redis XREAD to get missed messages
- [ ] Update Participant to track last stream ID
- [ ] **Test:** Close/reopen Participant - missed messages appear

**End of Day 5 Goal:** ✅ Messages are saved and replayed on reconnect

---

## **Day 6: Final Polish**

### ✅ Step 16: Add text-to-speech (1 hour)
- [ ] Add Speech Synthesis to Participant
- [ ] Implement queue to prevent overlap

---

### ✅ Step 17: Create PlantUML diagram (1 hour)
- [ ] Create `/docs/architecture.puml`
- [ ] Show all flows and interactions

---

### ✅ Step 18: Record demo video (30-60 min)
- [ ] Record acceptance test (60-90 seconds)
- [ ] Save as demo.mp4 or upload to Loom

---

### ✅ Step 19: Write README (30 min)
- [ ] Setup instructions
- [ ] How to run locally
- [ ] OpenAI usage notes
- [ ] Redis integration details

---

### ✅ Step 20: Final checks
- [ ] .env.example created
- [ ] All services run correctly
- [ ] Video demonstrates acceptance test
- [ ] No TypeScript `any` types

**End of Day 6 Goal:** ✅ Project complete and ready to submit!

---

## 💡 Tips for Success

**When stuck:**
- Google the error message
- Check official docs
- Ask ChatGPT/Claude
- Take a break

**Stay organized:**
- Update PROGRESS.md daily
- Check off tasks as you complete them
- Celebrate small wins!

You've got this! 🚀
