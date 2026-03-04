import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TaskWithCaptain {
    captainName?: string;
    task: Task;
}
export interface TaskTypeUpdate {
    id: TaskTypeId;
    name?: string;
    subtypes?: Array<string>;
}
export type AssigneeId = bigint;
export interface AssigneeWithTaskCount {
    assignee: Assignee;
    taskCount: bigint;
}
export interface TaskTypeInput {
    name: string;
    subtypes: Array<string>;
}
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
export interface PartialTodoInput {
    title: string;
    completed: boolean;
    dueDate?: bigint;
    description?: string;
    priority?: bigint;
}
export interface TaskType {
    id: TaskTypeId;
    name: string;
    subtypes: Array<string>;
}
export type TodoId = bigint;
export interface PartialClientInput {
    pan?: string;
    name: string;
    gstin?: string;
    notes?: string;
}
export interface PartialTaskUpdate {
    id: TaskId;
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
export interface Todo {
    id: TodoId;
    title: string;
    createdAt: bigint;
    completed: boolean;
    dueDate?: bigint;
    description?: string;
    updatedAt: bigint;
    priority?: bigint;
}
export type ClientId = bigint;
export interface UserProfile {
    name: string;
}
export type TaskTypeId = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bulkUpdateTasks(updates: Array<PartialTaskUpdate>): Promise<void>;
    createAssignee(assignee: PartialAssigneeInput): Promise<AssigneeId>;
    createClient(client: PartialClientInput): Promise<ClientId>;
    createTask(clientName: string, taskCategory: string, subCategory: string): Promise<TaskId>;
    createTaskType(input: TaskTypeInput): Promise<TaskTypeId>;
    createTodo(todo: PartialTodoInput): Promise<TodoId>;
    deleteAssignee(assigneeId: AssigneeId): Promise<void>;
    deleteClient(clientId: ClientId): Promise<void>;
    deleteTask(taskId: TaskId): Promise<void>;
    deleteTaskTypes(taskTypeIds: Array<TaskTypeId>): Promise<void>;
    deleteTodo(todoId: TodoId): Promise<void>;
    getAggregatedAssignees(searchString: string): Promise<Array<AssigneeWithTaskCount>>;
    getAllAssignees(): Promise<Array<Assignee>>;
    getAllClients(): Promise<Array<Client>>;
    getAllTaskTypes(): Promise<Array<TaskType>>;
    getAllTasks(): Promise<Array<Task>>;
    getAllTasksWithCaptain(): Promise<Array<TaskWithCaptain>>;
    getAllTodos(): Promise<Array<Todo>>;
    getAssignee(assigneeId: AssigneeId): Promise<Assignee | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClient(clientId: ClientId): Promise<Client | null>;
    getDistinctSubtypesForTaskType(parentTaskTypeId: TaskTypeId): Promise<Array<string>>;
    getDistinctSubtypesForTaskTypeAndPrefix(parentTaskTypeId: TaskTypeId, prefix: string): Promise<Array<string>>;
    getTask(taskId: TaskId): Promise<Task | null>;
    getTaskType(taskTypeId: TaskTypeId): Promise<TaskType | null>;
    getTaskTypesByPrefix(prefix: string): Promise<Array<TaskType>>;
    getTasksByAssignee(assigneeName: string): Promise<Array<Task>>;
    getTodo(todoId: TodoId): Promise<Todo | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateAssignee(assigneeId: AssigneeId, assignee: PartialAssigneeInput): Promise<void>;
    updateClient(clientId: ClientId, client: PartialClientInput): Promise<void>;
    updateTask(taskId: TaskId, clientName: string, taskCategory: string, subCategory: string, status: string | null, comment: string | null, assignedName: string | null, dueDate: bigint | null, assignmentDate: bigint | null, completionDate: bigint | null, bill: number | null, advanceReceived: number | null, outstandingAmount: number | null, paymentStatus: string | null): Promise<void>;
    updateTaskType(update: TaskTypeUpdate): Promise<void>;
    updateTodo(todoId: TodoId, todo: PartialTodoInput): Promise<void>;
}
