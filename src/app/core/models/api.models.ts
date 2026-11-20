/* ── API types (generated) ──────────────────────────────────────── */
// Types are generated from the backend OpenAPI schema by `npm run gen:api-types`.
// Do not edit these shapes by hand — regenerate (or fix the backend schema).
import type { components } from './api.gen';

export type HealthResponse = components['schemas']['HealthResponse'];
export type ProcessDocumentResponse = components['schemas']['ProcessDocumentResponse'];
export type CollectionStatsResponse = components['schemas']['CollectionStatsResponse'];
export type DeleteDocumentResponse = components['schemas']['DeleteDocumentResponse'];
export type DocumentMetadata = components['schemas']['DocumentMetadata'];
export type ChunkResult = components['schemas']['ChunkResult'];
export type SearchResponse = components['schemas']['SearchResponse'];
export type AskRequest = components['schemas']['AskRequest'];
export type AskResponse = components['schemas']['AskResponse'];
export type AgentRequest = components['schemas']['AgentRequest'];
export type AgentResponse = Omit<components['schemas']['AgentResponse'], 'tool_calls'> & { tool_calls: AgentToolCall[] };

/** One tool call of the agent, as recorded in the response and in the audit log. */
export interface AgentToolCall {
  tool: string;
  arguments: Record<string, unknown>;
  queries?: { sql: string; params: Record<string, string>; rows: number }[];
  error?: string;
}

// The `/search/` request body is the backend's QueryRequest schema. Keep the
// frontend-facing name the service and components import.
export type SearchRequest = components['schemas']['QueryRequest'];
