import type { Client, Task, ClientId, TaskId } from '../backend';

export interface ParsedClient {
  id: ClientId;
  name: string;
  email: string;
  phone: string;
  taxYears: string[];
  status: 'Active' | 'Inactive';
  notes: string;
}

export interface ParsedTask {
  id: TaskId;
  title: string;
  description: string;
  status: string;
  priority: string;
  clientId: ClientId;
  deadline: bigint | null;
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

// Task data encoding/decoding
// Format: description = "priority:Medium|actualDescription"
// Format: status = "To Do" (also encodes status)
export function parseTaskData(task: Task): ParsedTask {
  const descParts = task.description.split('|');
  let priority = 'Medium';
  let description = task.description;

  if (descParts[0]?.startsWith('priority:')) {
    priority = descParts[0].substring(9);
    description = descParts.slice(1).join('|');
  }

  return {
    id: task.id,
    title: task.title,
    description,
    status: task.status,
    priority,
    clientId: task.clientId,
    deadline: task.deadline || null,
  };
}

export function encodeTaskData(data: {
  description: string;
  priority: string;
  status: string;
}): { description: string; status: string } {
  const description = `priority:${data.priority}|${data.description}`;
  return { description, status: data.status };
}
