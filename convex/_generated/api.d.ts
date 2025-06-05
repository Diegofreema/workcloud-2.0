/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as chat from "../chat.js";
import type * as connection from "../connection.js";
import type * as conversation from "../conversation.js";
import type * as http from "../http.js";
import type * as message from "../message.js";
import type * as organisation from "../organisation.js";
import type * as request from "../request.js";
import type * as reviews from "../reviews.js";
import type * as servicePoints from "../servicePoints.js";
import type * as staff from "../staff.js";
import type * as suggestions from "../suggestions.js";
import type * as users from "../users.js";
import type * as worker from "../worker.js";
import type * as workspace from "../workspace.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  chat: typeof chat;
  connection: typeof connection;
  conversation: typeof conversation;
  http: typeof http;
  message: typeof message;
  organisation: typeof organisation;
  request: typeof request;
  reviews: typeof reviews;
  servicePoints: typeof servicePoints;
  staff: typeof staff;
  suggestions: typeof suggestions;
  users: typeof users;
  worker: typeof worker;
  workspace: typeof workspace;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
