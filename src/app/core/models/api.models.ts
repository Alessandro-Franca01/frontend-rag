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

// The `/search/` request body is the backend's QueryRequest schema. Keep the
// frontend-facing name the service and components import.
export type SearchRequest = components['schemas']['QueryRequest'];
