/**
 * @tooey/server adapter types
 *
 * common interfaces for server adapters
 */

import type { AdapterRequest, AdapterResponse } from '../types.js';

/**
 * adapter interface
 * converts between platform-specific request/response and tooey's format
 */
export interface Adapter {
  /** adapter name */
  name: string;
  /** convert platform request to adapter request */
  toRequest(req: unknown): AdapterRequest | Promise<AdapterRequest>;
  /** convert adapter response to platform response */
  toResponse(res: AdapterResponse, platformRes?: unknown): unknown;
}

/**
 * request handler type
 * adapters wrap this to create platform-specific handlers
 */
export type RequestHandler = (req: AdapterRequest) => Promise<AdapterResponse>;

/**
 * create adapter handler
 * wraps a tooey request handler with adapter conversion
 */
export function createHandler(
  adapter: Adapter,
  handler: RequestHandler
): (req: unknown, res?: unknown) => Promise<unknown> {
  return async (platformReq, platformRes) => {
    const req = await adapter.toRequest(platformReq);
    const response = await handler(req);
    return adapter.toResponse(response, platformRes);
  };
}
