import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Principal "mo:core/Principal";

module {
  public type ClientId = Nat;
  public type TaskId = Nat;

  public type OldClient = {
    id : ClientId;
    name : Text;
    contactInfo : Text;
    projects : [Text];
    timestamp : Int;
  };

  public type NewClient = {
    id : ClientId;
    name : Text;
    gstin : ?Text;
    pan : ?Text;
    notes : ?Text;
    timestamp : Int;
  };

  public type OldTask = {
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

  public type OldUserProfile = {
    name : Text;
  };

  public type OldActor = {
    clients : Map.Map<Principal, Map.Map<ClientId, OldClient>>;
    tasks : Map.Map<Principal, Map.Map<TaskId, OldTask>>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    nextClientId : Nat;
    nextTaskId : Nat;
  };

  public type NewActor = {
    clients : Map.Map<Principal, Map.Map<ClientId, NewClient>>;
    tasks : Map.Map<Principal, Map.Map<TaskId, OldTask>>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    nextClientId : Nat;
    nextTaskId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newClients = old.clients.map<Principal, Map.Map<ClientId, OldClient>, Map.Map<ClientId, NewClient>>(
      func(_principal, clientMap) {
        clientMap.map<ClientId, OldClient, NewClient>(
          func(_id, oldClient) {
            {
              oldClient with
              gstin = null;
              pan = null;
              notes = ?oldClient.contactInfo;
            };
          }
        );
      }
    );
    {
      old with
      clients = newClients
    };
  };
};
