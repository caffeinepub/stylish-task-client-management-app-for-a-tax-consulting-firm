import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type ClientId = Nat;
  type TaskId = Nat;

  public type Client = {
    id : ClientId;
    name : Text;
    contactInfo : Text;
    projects : [Text];
    timestamp : Int;
  };

  public type Task = {
    id : TaskId;
    title : Text;
    description : Text;
    status : Text;
    clientId : ClientId;
    createdAt : Int;
    deadline : ?Int;
  };

  public type UserProfile = {
    name : Text;
  };

  let clients = Map.empty<Principal, Map.Map<ClientId, Client>>();
  let tasks = Map.empty<Principal, Map.Map<TaskId, Task>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextClientId = 0;
  var nextTaskId = 0;

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  func getClientStorage(caller : Principal) : Map.Map<ClientId, Client> {
    switch (clients.get(caller)) {
      case (?clientMap) { clientMap };
      case (null) {
        let newClientMap = Map.empty<ClientId, Client>();
        clients.add(caller, newClientMap);
        newClientMap;
      };
    };
  };

  func getTaskStorage(caller : Principal) : Map.Map<TaskId, Task> {
    switch (tasks.get(caller)) {
      case (?taskMap) { taskMap };
      case (null) {
        let newTaskMap = Map.empty<TaskId, Task>();
        tasks.add(caller, newTaskMap);
        newTaskMap;
      };
    };
  };

  public shared ({ caller }) func createClient(name : Text, contactInfo : Text, projects : [Text]) : async ClientId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let clientId = nextClientId;
    nextClientId += 1;

    let newClient : Client = {
      id = clientId;
      name;
      contactInfo;
      projects;
      timestamp = 0;
    };

    let clientStorage = getClientStorage(caller);
    clientStorage.add(clientId, newClient);
    clientId;
  };

  public shared ({ caller }) func updateClient(clientId : ClientId, name : Text, contactInfo : Text, projects : [Text]) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let clientStorage = getClientStorage(caller);
    switch (clientStorage.get(clientId)) {
      case (null) { Runtime.trap("Client does not exist") };
      case (?_) {
        let updatedClient : Client = {
          id = clientId;
          name;
          contactInfo;
          projects;
          timestamp = 0;
        };
        clientStorage.add(clientId, updatedClient);
      };
    };
  };

  public shared ({ caller }) func deleteClient(clientId : ClientId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let clientStorage = getClientStorage(caller);
    if (not clientStorage.containsKey(clientId)) {
      Runtime.trap("Client does not exist");
    };
    clientStorage.remove(clientId);
  };

  public query ({ caller }) func getClient(clientId : ClientId) : async ?Client {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let clientStorage = getClientStorage(caller);
    clientStorage.get(clientId);
  };

  public query ({ caller }) func getAllClients() : async [Client] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let clientStorage = getClientStorage(caller);
    clientStorage.values().toArray();
  };

  public shared ({ caller }) func createTask(title : Text, description : Text, clientId : ClientId, deadline : ?Int) : async TaskId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let clientStorage = getClientStorage(caller);
    if (not clientStorage.containsKey(clientId)) {
      Runtime.trap("Client does not exist");
    };

    let taskId = nextTaskId;
    nextTaskId += 1;

    let newTask : Task = {
      id = taskId;
      title;
      description;
      status = "pending";
      clientId;
      createdAt = 0;
      deadline;
    };

    let taskStorage = getTaskStorage(caller);
    taskStorage.add(taskId, newTask);
    taskId;
  };

  public shared ({ caller }) func updateTask(taskId : TaskId, title : Text, description : Text, status : Text, deadline : ?Int) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let taskStorage = getTaskStorage(caller);
    switch (taskStorage.get(taskId)) {
      case (null) { Runtime.trap("Task does not exist") };
      case (?existingTask) {
        let updatedTask : Task = {
          id = taskId;
          title;
          description;
          status;
          clientId = existingTask.clientId;
          createdAt = existingTask.createdAt;
          deadline;
        };
        taskStorage.add(taskId, updatedTask);
      };
    };
  };

  public shared ({ caller }) func deleteTask(taskId : TaskId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let taskStorage = getTaskStorage(caller);
    if (not taskStorage.containsKey(taskId)) {
      Runtime.trap("Task does not exist");
    };
    taskStorage.remove(taskId);
  };

  public query ({ caller }) func getTask(taskId : TaskId) : async ?Task {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let taskStorage = getTaskStorage(caller);
    taskStorage.get(taskId);
  };

  public query ({ caller }) func getAllTasks() : async [Task] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let taskStorage = getTaskStorage(caller);
    taskStorage.values().toArray();
  };

  public query ({ caller }) func getTasksByClient(clientId : ClientId) : async [Task] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let taskStorage = getTaskStorage(caller);
    let filteredTasks = List.empty<Task>();
    taskStorage.forEach(
      func(_id, task) {
        if (task.clientId == clientId) {
          filteredTasks.add(task);
        };
      }
    );
    filteredTasks.toArray();
  };
};
