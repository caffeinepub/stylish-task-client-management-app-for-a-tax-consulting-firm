import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PartialTaskUpdate {
    status?: string;
    subCategory?: string;
    paymentStatus?: string;
    completionDate?: bigint;
    clientName?: string;
    assignmentDate?: bigint;
    bill?: number;
    advanceReceived?: number;
    dueDate?: bigint;
    comment?: string;
    outstandingAmount?: number;
    taskCategory?: string;
    assignedName?: string;
}
export type TaskId = bigint;
export interface Task {
    id: TaskId;
    status?: string;
    subCategory: string;
    paymentStatus?: string;
    completionDate?: bigint;
    clientName: string;
    assignmentDate?: bigint;
    bill?: number;
    advanceReceived?: number;
    createdAt: bigint;
    dueDate?: bigint;
    comment?: string;
    outstandingAmount?: number;
    taskCategory: string;
    assignedName?: string;
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
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bulkCreateTasks(taskInputs: Array<[string, string, string]>): Promise<Array<TaskId>>;
    bulkDeleteTasks(taskIds: Array<TaskId>): Promise<void>;
    bulkUpdateTasks(taskUpdates: Array<[TaskId, PartialTaskUpdate]>): Promise<void>;
    createClient(name: string, contactInfo: string, projects: Array<string>): Promise<ClientId>;
    createTask(clientName: string, taskCategory: string, subCategory: string): Promise<TaskId>;
    deleteClient(clientId: ClientId): Promise<void>;
    deleteTask(taskId: TaskId): Promise<void>;
    getAllClients(): Promise<Array<Client>>;
    getAllTasks(): Promise<Array<Task>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClient(clientId: ClientId): Promise<Client | null>;
    getTask(taskId: TaskId): Promise<Task | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateClient(clientId: ClientId, name: string, contactInfo: string, projects: Array<string>): Promise<void>;
    updateTask(taskId: TaskId, clientName: string, taskCategory: string, subCategory: string, status: string | null, comment: string | null, assignedName: string | null, dueDate: bigint | null, assignmentDate: bigint | null, completionDate: bigint | null, bill: number | null, advanceReceived: number | null, outstandingAmount: number | null, paymentStatus: string | null): Promise<void>;
}
