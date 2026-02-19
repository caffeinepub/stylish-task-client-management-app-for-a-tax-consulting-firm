import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
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

  type OldActor = {
    clients : Map.Map<Principal, Map.Map<Nat, { id : Nat; name : Text; gstin : ?Text; pan : ?Text; notes : ?Text; timestamp : Int }>>;
    tasks : Map.Map<Principal, Map.Map<Nat, OldTask>>;
    assignees : Map.Map<Principal, Map.Map<Nat, { id : Nat; name : Text; captain : ?Text }>>;
    todos : Map.Map<Principal, Map.Map<Nat, { id : Nat; title : Text; description : ?Text; completed : Bool; dueDate : ?Int; priority : ?Nat; createdAt : Int; updatedAt : Int }>>;
    userProfiles : Map.Map<Principal, { name : Text }>;
    nextClientId : Nat;
    nextTaskId : Nat;
    nextAssigneeId : Nat;
    nextTodoId : Nat;
  };

  public func run(old : OldActor) : OldActor {
    old;
  };
};
