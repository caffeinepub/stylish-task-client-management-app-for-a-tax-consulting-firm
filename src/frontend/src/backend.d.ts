import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TaskInput {
    status?: string;
    subCategory: string;
    paymentStatus?: string;
    completionDate?: bigint;
    clientName: string;
    assignmentDate?: bigint;
    bill?: number;
    advanceReceived?: number;
    dueDate?: bigint;
    comment?: string;
    outstandingAmount?: number;
    taskCategory: string;
    assignedName?: string;
}
export interface PartialClientInput {
    pan?: string;
    name: string;
    gstin?: string;
    notes?: string;
}
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
export interface PartialAssigneeInput {
    name: string;
    captain?: string;
}
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
export interface Assignee {
    id: AssigneeId;
    name: string;
    captain?: string;
}
export interface Client {
    id: ClientId;
    pan?: string;
    name: string;
    gstin?: string;
    notes?: string;
    timestamp: bigint;
}
export type ClientId = bigint;
export interface UserProfile {
    name: string;
}
export type AssigneeId = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bulkCreateAssignees(assigneeInputs: Array<PartialAssigneeInput>): Promise<Array<AssigneeId>>;
    bulkCreateClients(clientInputs: Array<PartialClientInput>): Promise<Array<ClientId>>;
    bulkCreateTasks(taskInputs: Array<TaskInput>): Promise<Array<TaskId>>;
    bulkDeleteAssignees(assigneeIds: Array<AssigneeId>): Promise<void>;
    bulkDeleteClients(clientIds: Array<ClientId>): Promise<void>;
    bulkDeleteTasks(taskIds: Array<TaskId>): Promise<void>;
    bulkUpdateTasks(taskUpdates: Array<[TaskId, PartialTaskUpdate]>): Promise<void>;
    createAssignee(assignee: PartialAssigneeInput): Promise<AssigneeId>;
    createClient(client: PartialClientInput): Promise<ClientId>;
    createTask(clientName: string, taskCategory: string, subCategory: string): Promise<TaskId>;
    deleteAssignee(assigneeId: AssigneeId): Promise<void>;
    deleteClient(clientId: ClientId): Promise<void>;
    deleteTask(taskId: TaskId): Promise<void>;
    getAllAssignees(): Promise<Array<Assignee>>;
    getAllClients(): Promise<Array<Client>>;
    getAllTasks(): Promise<Array<Task>>;
    getAssignee(assigneeId: AssigneeId): Promise<Assignee | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClient(clientId: ClientId): Promise<Client | null>;
    getTask(taskId: TaskId): Promise<Task | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateAssignee(assigneeId: AssigneeId, assignee: PartialAssigneeInput): Promise<void>;
    updateClient(clientId: ClientId, client: PartialClientInput): Promise<void>;
    updateTask(taskId: TaskId, clientName: string, taskCategory: string, subCategory: string, status: string | null, comment: string | null, assignedName: string | null, dueDate: bigint | null, assignmentDate: bigint | null, completionDate: bigint | null, bill: number | null, advanceReceived: number | null, outstandingAmount: number | null, paymentStatus: string | null): Promise<void>;
}
