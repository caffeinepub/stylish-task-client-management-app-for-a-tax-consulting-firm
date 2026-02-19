import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";

module {
  type OldClient = {
    id : Nat;
    name : Text;
    gstin : ?Text;
    pan : ?Text;
    notes : ?Text;
    timestamp : Int;
  };

  type OldTask = {
    id : Nat;
    clientName : Text;
    taskCategory : Text;
    subCategory : Text;
    status : ?Text;
    comment : ?Text;
    assignedName : ?Text;
    dueDate : ?Int;
    assignmentDate : ?Int;
    completionDate : ?Int;
    bill : ?Float;
    advanceReceived : ?Float;
    outstandingAmount : ?Float;
    paymentStatus : ?Text;
    createdAt : Int;
  };

  type OldAssignee = {
    id : Nat;
    name : Text;
    captain : ?Text;
  };

  type OldTodo = {
    id : Nat;
    title : Text;
    description : ?Text;
    completed : Bool;
    dueDate : ?Int;
    priority : ?Nat;
    createdAt : Int;
    updatedAt : Int;
  };

  type OldUserProfile = {
    name : Text;
  };

  type OldActor = {
    clients : Map.Map<Principal, Map.Map<Nat, OldClient>>;
    tasks : Map.Map<Principal, Map.Map<Nat, OldTask>>;
    assignees : Map.Map<Principal, Map.Map<Nat, OldAssignee>>;
    todos : Map.Map<Principal, Map.Map<Nat, OldTodo>>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    nextClientId : Nat;
    nextTaskId : Nat;
    nextAssigneeId : Nat;
    nextTodoId : Nat;
  };

  // New types (should be identical to current actor's types)
  type ClientId = Nat;
  type TaskId = Nat;
  type AssigneeId = Nat;
  type TodoId = Nat;

  type NewClient = {
    id : ClientId;
    name : Text;
    gstin : ?Text;
    pan : ?Text;
    notes : ?Text;
    timestamp : Int;
  };

  type NewTask = {
    id : TaskId;
    clientName : Text;
    taskCategory : Text;
    subCategory : Text;
    status : ?Text;
    comment : ?Text;
    assignedName : ?Text;
    dueDate : ?Int;
    assignmentDate : ?Int;
    completionDate : ?Int;
    bill : ?Float;
    advanceReceived : ?Float;
    outstandingAmount : ?Float;
    paymentStatus : ?Text;
    createdAt : Int;
  };

  type NewAssignee = {
    id : AssigneeId;
    name : Text;
    captain : ?Text;
  };

  type NewTodo = {
    id : TodoId;
    title : Text;
    description : ?Text;
    completed : Bool;
    dueDate : ?Int;
    priority : ?Nat;
    createdAt : Int;
    updatedAt : Int;
  };

  type NewUserProfile = {
    name : Text;
  };

  type NewActor = {
    clients : Map.Map<Principal, Map.Map<ClientId, NewClient>>;
    tasks : Map.Map<Principal, Map.Map<TaskId, NewTask>>;
    assignees : Map.Map<Principal, Map.Map<AssigneeId, NewAssignee>>;
    todos : Map.Map<Principal, Map.Map<TodoId, NewTodo>>;
    userProfiles : Map.Map<Principal, NewUserProfile>;
    nextClientId : Nat;
    nextTaskId : Nat;
    nextAssigneeId : Nat;
    nextTodoId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      clients = old.clients;
      tasks = old.tasks;
      assignees = old.assignees;
      todos = old.todos;
      userProfiles = old.userProfiles;
      nextClientId = old.nextClientId;
      nextTaskId = old.nextTaskId;
      nextAssigneeId = old.nextAssigneeId;
      nextTodoId = old.nextTodoId;
    };
  };
};
