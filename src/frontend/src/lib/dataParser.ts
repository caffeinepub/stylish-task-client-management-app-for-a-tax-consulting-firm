// This file is no longer needed for client parsing since the new Client model
// uses explicit fields (name, gstin, pan, notes) without encoding.
// Keeping the file for backward compatibility but marking functions as deprecated.

export interface ParsedClient {
  id: bigint;
  name: string;
  gstin?: string;
  pan?: string;
  notes?: string;
  timestamp: bigint;
}

/**
 * @deprecated Client data is now stored directly without encoding.
 * Use the Client type from backend directly.
 */
export function parseClientData(client: any): ParsedClient {
  return {
    id: client.id,
    name: client.name,
    gstin: client.gstin,
    pan: client.pan,
    notes: client.notes,
    timestamp: client.timestamp,
  };
}

/**
 * @deprecated Client data is now stored directly without encoding.
 * Use PartialClientInput type from backend directly.
 */
export function encodeClientData(data: any): any {
  return {
    name: data.name,
    gstin: data.gstin,
    pan: data.pan,
    notes: data.notes,
  };
}
