import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  // Define types to match persistent data structures in main actor
  type ClientId = Nat;
  type TaskId = Nat;
  type AssigneeId = Nat;
  type TodoId = Nat;

  type OldActor = {
    clients : Map.Map<Principal, Map.Map<ClientId, { id : ClientId; name : Text; gstin : ?Text; pan : ?Text; notes : ?Text; timestamp : Int }>>;
    tasks : Map.Map<Principal, Map.Map<TaskId, { id : TaskId; clientName : Text; taskCategory : Text; subCategory : Text; status : ?Text; comment : ?Text; assignedName : ?Text; dueDate : ?Int; assignmentDate : ?Int; completionDate : ?Int; bill : ?Float; advanceReceived : ?Float; outstandingAmount : ?Float; paymentStatus : ?Text; createdAt : Int }>>;
    assignees : Map.Map<Principal, Map.Map<AssigneeId, { id : AssigneeId; name : Text; captain : ?Text }>>;
    todos : Map.Map<Principal, Map.Map<TodoId, { id : TodoId; title : Text; description : ?Text; completed : Bool; dueDate : ?Int; priority : ?Nat; createdAt : Int; updatedAt : Int }>>;
    userProfiles : Map.Map<Principal, { name : Text }>;
    nextClientId : Nat;
    nextTaskId : Nat;
    nextAssigneeId : Nat;
    nextTodoId : Nat;
  };

  type NewActor = {
    clients : Map.Map<Principal, Map.Map<ClientId, { id : ClientId; name : Text; gstin : ?Text; pan : ?Text; notes : ?Text; timestamp : Int }>>;
    tasks : Map.Map<Principal, Map.Map<TaskId, { id : TaskId; clientName : Text; taskCategory : Text; subCategory : Text; status : ?Text; comment : ?Text; assignedName : ?Text; dueDate : ?Int; assignmentDate : ?Int; completionDate : ?Int; bill : ?Float; advanceReceived : ?Float; outstandingAmount : ?Float; paymentStatus : ?Text; createdAt : Int }>>;
    assignees : Map.Map<Principal, Map.Map<AssigneeId, { id : AssigneeId; name : Text; captain : ?Text }>>;
    todos : Map.Map<Principal, Map.Map<TodoId, { id : TodoId; title : Text; description : ?Text; completed : Bool; dueDate : ?Int; priority : ?Nat; createdAt : Int; updatedAt : Int }>>;
    userProfiles : Map.Map<Principal, { name : Text }>;
    nextClientId : Nat;
    nextTaskId : Nat;
    nextAssigneeId : Nat;
    nextTodoId : Nat;
  };

  // Migration function called by the main actor via the with-clause
  public func run(old : OldActor) : NewActor {
    old;
  };
};
