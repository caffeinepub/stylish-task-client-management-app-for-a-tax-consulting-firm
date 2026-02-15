import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Task {
    id: TaskId;
    status: string;
    title: string;
    clientId: ClientId;
    createdAt: bigint;
    description: string;
    deadline?: bigint;
}
export interface Client {
    id: ClientId;
    contactInfo: string;
    projects: Array<string>;
    name: string;
    timestamp: bigint;
}
export type ClientId = bigint;
export interface UserProfile {
    name: string;
}
export type TaskId = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createClient(name: string, contactInfo: string, projects: Array<string>): Promise<ClientId>;
    createTask(title: string, description: string, clientId: ClientId, deadline: bigint | null): Promise<TaskId>;
    deleteClient(clientId: ClientId): Promise<void>;
    deleteTask(taskId: TaskId): Promise<void>;
    getAllClients(): Promise<Array<Client>>;
    getAllTasks(): Promise<Array<Task>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClient(clientId: ClientId): Promise<Client | null>;
    getTask(taskId: TaskId): Promise<Task | null>;
    getTasksByClient(clientId: ClientId): Promise<Array<Task>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateClient(clientId: ClientId, name: string, contactInfo: string, projects: Array<string>): Promise<void>;
    updateTask(taskId: TaskId, title: string, description: string, status: string, deadline: bigint | null): Promise<void>;
}
