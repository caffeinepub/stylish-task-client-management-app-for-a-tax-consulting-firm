import type { Client, ClientId } from '../backend';

export interface ParsedClient {
  id: ClientId;
  name: string;
  email: string;
  phone: string;
  taxYears: string[];
  status: 'Active' | 'Inactive';
  notes: string;
}

// Client data encoding/decoding
// Format: contactInfo = "email|phone|notes"
// Format: projects = ["status:Active", "2024", "2023", ...]
export function parseClientData(client: Client): ParsedClient {
  const contactParts = client.contactInfo.split('|');
  const email = contactParts[0] || '';
  const phone = contactParts[1] || '';
  const notes = contactParts[2] || '';

  let status: 'Active' | 'Inactive' = 'Active';
  const taxYears: string[] = [];

  client.projects.forEach((project) => {
    if (project.startsWith('status:')) {
      status = project.substring(7) as 'Active' | 'Inactive';
    } else {
      taxYears.push(project);
    }
  });

  return {
    id: client.id,
    name: client.name,
    email,
    phone,
    taxYears,
    status,
    notes,
  };
}

export function encodeClientData(data: {
  email: string;
  phone: string;
  notes: string;
  status: 'Active' | 'Inactive';
  taxYears: string[];
}): { contactInfo: string; projects: string[] } {
  const contactInfo = `${data.email}|${data.phone}|${data.notes}`;
  const projects = [`status:${data.status}`, ...data.taxYears];
  return { contactInfo, projects };
}
