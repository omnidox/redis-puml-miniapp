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
  "request:replay": (lastStreamId: string | null) => void;
}

export interface ServerToClientEvents {
  "agent:questions": (data: AgentQuestions) => void;
}