import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  type OldTask = {
    id : Nat;
    title : Text;
    description : Text;
    status : Text;
    clientId : Nat;
    createdAt : Int;
    deadline : ?Int;
  };

  type NewTask = {
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
    tasks : Map.Map<Principal, Map.Map<Nat, OldTask>>;
  };

  type NewActor = {
    tasks : Map.Map<Principal, Map.Map<Nat, NewTask>>;
  };

  public func run(old : OldActor) : NewActor {
    let newTasks = old.tasks.map<Principal, Map.Map<Nat, OldTask>, Map.Map<Nat, NewTask>>(
      func(_principal, oldTaskMap) {
        oldTaskMap.map<Nat, OldTask, NewTask>(
          func(_taskId, oldTask) {
            {
              id = oldTask.id;
              clientName = "";
              taskCategory = "";
              subCategory = "";
              status = null;
              comment = null;
              assignedName = null;
              dueDate = null;
              assignmentDate = null;
              completionDate = null;
              bill = null;
              advanceReceived = null;
              outstandingAmount = null;
              paymentStatus = null;
              createdAt = oldTask.createdAt;
            };
          }
        );
      }
    );
    { tasks = newTasks };
  };
};
