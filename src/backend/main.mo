import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type ClientId = Nat;
  type TaskId = Nat;
  type AssigneeId = Nat;

  public type Client = {
    id : ClientId;
    name : Text;
    gstin : ?Text;
    pan : ?Text;
    notes : ?Text;
    timestamp : Int;
  };

  public type Task = {
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

  public type Assignee = {
    id : AssigneeId;
    name : Text;
    captain : ?Text;
  };

  public type PartialTaskUpdate = {
    clientName : ?Text;
    taskCategory : ?Text;
    subCategory : ?Text;
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
  };

  public type UserProfile = {
    name : Text;
  };

  public type TaskInput = {
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
  };

  public type PartialClientInput = {
    name : Text;
    gstin : ?Text;
    pan : ?Text;
    notes : ?Text;
  };

  public type PartialAssigneeInput = {
    name : Text;
    captain : ?Text;
  };

  let clients = Map.empty<Principal, Map.Map<ClientId, Client>>();
  let tasks = Map.empty<Principal, Map.Map<TaskId, Task>>();
  let assignees = Map.empty<Principal, Map.Map<AssigneeId, Assignee>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextClientId = 0;
  var nextTaskId = 0;
  var nextAssigneeId = 0;

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

  func getAssigneeStorage(caller : Principal) : Map.Map<AssigneeId, Assignee> {
    switch (assignees.get(caller)) {
      case (?assigMap) { assigMap };
      case (null) {
        let newAssigMap = Map.empty<AssigneeId, Assignee>();
        assignees.add(caller, newAssigMap);
        newAssigMap;
      };
    };
  };

  // ===== ASSIGNEE CRUD OPERATIONS =====

  public shared ({ caller }) func createAssignee(assignee : PartialAssigneeInput) : async AssigneeId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let assigneeId = nextAssigneeId;
    nextAssigneeId += 1;

    let newAssignee : Assignee = {
      id = assigneeId;
      name = assignee.name;
      captain = assignee.captain;
    };

    let assigneeStorage = getAssigneeStorage(caller);
    assigneeStorage.add(assigneeId, newAssignee);
    assigneeId;
  };

  public shared ({ caller }) func updateAssignee(assigneeId : AssigneeId, assignee : PartialAssigneeInput) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let assigneeStorage = getAssigneeStorage(caller);
    switch (assigneeStorage.get(assigneeId)) {
      case (null) { Runtime.trap("Assignee does not exist") };
      case (?_) {
        let updatedAssignee : Assignee = {
          id = assigneeId;
          name = assignee.name;
          captain = assignee.captain;
        };
        assigneeStorage.add(assigneeId, updatedAssignee);
      };
    };
  };

  public shared ({ caller }) func deleteAssignee(assigneeId : AssigneeId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let assigneeStorage = getAssigneeStorage(caller);
    if (not assigneeStorage.containsKey(assigneeId)) {
      Runtime.trap("Assignee does not exist");
    };
    assigneeStorage.remove(assigneeId);
  };

  public query ({ caller }) func getAssignee(assigneeId : AssigneeId) : async ?Assignee {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };
    let assigneeStorage = getAssigneeStorage(caller);
    assigneeStorage.get(assigneeId);
  };

  public query ({ caller }) func getAllAssignees() : async [Assignee] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view data, please sign in to continue");
    };

    let assigneeStorage = getAssigneeStorage(caller);
    assigneeStorage.values().toArray();
  };

  // ===== ASSIGNEE BULK OPERATIONS =====

  public shared ({ caller }) func bulkCreateAssignees(assigneeInputs : [PartialAssigneeInput]) : async [AssigneeId] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create assignees");
    };

    let assigneeStorage = getAssigneeStorage(caller);
    let createdAssigneeIds = List.empty<AssigneeId>();

    for (input in assigneeInputs.values()) {
      let assigneeId = nextAssigneeId;
      nextAssigneeId += 1;

      let newAssignee : Assignee = {
        id = assigneeId;
        name = input.name;
        captain = input.captain;
      };

      assigneeStorage.add(assigneeId, newAssignee);
      createdAssigneeIds.add(assigneeId);
    };

    createdAssigneeIds.toArray();
  };

  public shared ({ caller }) func bulkDeleteAssignees(assigneeIds : [AssigneeId]) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let assigneeStorage = getAssigneeStorage(caller);
    for (assigneeId in assigneeIds.values()) {
      if (assigneeStorage.containsKey(assigneeId)) {
        assigneeStorage.remove(assigneeId);
      };
    };
  };

  // ===== CLIENT CRUD OPERATIONS =====

  public shared ({ caller }) func createClient(client : PartialClientInput) : async ClientId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let clientId = nextClientId;
    nextClientId += 1;

    let newClient : Client = {
      id = clientId;
      name = client.name;
      gstin = client.gstin;
      pan = client.pan;
      notes = client.notes;
      timestamp = Time.now();
    };

    let clientStorage = getClientStorage(caller);
    clientStorage.add(clientId, newClient);
    clientId;
  };

  public shared ({ caller }) func updateClient(clientId : ClientId, client : PartialClientInput) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let clientStorage = getClientStorage(caller);
    switch (clientStorage.get(clientId)) {
      case (null) { Runtime.trap("Client does not exist") };
      case (?_) {
        let updatedClient : Client = {
          id = clientId;
          name = client.name;
          gstin = client.gstin;
          pan = client.pan;
          notes = client.notes;
          timestamp = Time.now();
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

  public shared ({ caller }) func bulkCreateClients(clientInputs : [PartialClientInput]) : async [ClientId] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create clients");
    };

    let clientStorage = getClientStorage(caller);
    let createdClientIds = List.empty<ClientId>();

    for (input in clientInputs.values()) {
      let clientId = nextClientId;
      nextClientId += 1;

      let newClient : Client = {
        id = clientId;
        name = input.name;
        gstin = input.gstin;
        pan = input.pan;
        notes = input.notes;
        timestamp = Time.now();
      };

      clientStorage.add(clientId, newClient);
      createdClientIds.add(clientId);
    };

    createdClientIds.toArray();
  };

  public shared ({ caller }) func bulkDeleteClients(clientIds : [ClientId]) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let clientStorage = getClientStorage(caller);
    for (clientId in clientIds.values()) {
      if (clientStorage.containsKey(clientId)) {
        clientStorage.remove(clientId);
      };
    };
  };

  // ===== TASK CRUD OPERATIONS =====

  public shared ({ caller }) func createTask(
    clientName : Text,
    taskCategory : Text,
    subCategory : Text
  ) : async TaskId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let taskId = nextTaskId;
    nextTaskId += 1;

    let newTask : Task = {
      id = taskId;
      clientName;
      taskCategory;
      subCategory;
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
      createdAt = Time.now();
    };

    let taskStorage = getTaskStorage(caller);
    taskStorage.add(taskId, newTask);
    taskId;
  };

  public shared ({ caller }) func updateTask(
    taskId : TaskId,
    clientName : Text,
    taskCategory : Text,
    subCategory : Text,
    status : ?Text,
    comment : ?Text,
    assignedName : ?Text,
    dueDate : ?Int,
    assignmentDate : ?Int,
    completionDate : ?Int,
    bill : ?Float,
    advanceReceived : ?Float,
    outstandingAmount : ?Float,
    paymentStatus : ?Text
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let taskStorage = getTaskStorage(caller);
    switch (taskStorage.get(taskId)) {
      case (null) { Runtime.trap("Task does not exist") };
      case (?existingTask) {
        let updatedTask : Task = {
          id = taskId;
          clientName;
          taskCategory;
          subCategory;
          status;
          comment;
          assignedName;
          dueDate;
          assignmentDate;
          completionDate;
          bill;
          advanceReceived;
          outstandingAmount;
          paymentStatus;
          createdAt = existingTask.createdAt;
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

  public shared ({ caller }) func bulkCreateTasks(taskInputs : [TaskInput]) : async [TaskId] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let taskStorage = getTaskStorage(caller);
    let createdTaskIds = List.empty<TaskId>();

    for (taskInput in taskInputs.values()) {
      let taskId = nextTaskId;
      nextTaskId += 1;

      let newTask : Task = {
        id = taskId;
        clientName = taskInput.clientName;
        taskCategory = taskInput.taskCategory;
        subCategory = taskInput.subCategory;
        status = taskInput.status;
        comment = taskInput.comment;
        assignedName = taskInput.assignedName;
        dueDate = taskInput.dueDate;
        assignmentDate = taskInput.assignmentDate;
        completionDate = taskInput.completionDate;
        bill = taskInput.bill;
        advanceReceived = taskInput.advanceReceived;
        outstandingAmount = taskInput.outstandingAmount;
        paymentStatus = taskInput.paymentStatus;
        createdAt = Time.now();
      };

      taskStorage.add(taskId, newTask);
      createdTaskIds.add(taskId);
    };

    createdTaskIds.toArray();
  };

  public shared ({ caller }) func bulkDeleteTasks(taskIds : [TaskId]) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let taskStorage = getTaskStorage(caller);
    for (taskId in taskIds.values()) {
      if (taskStorage.containsKey(taskId)) {
        taskStorage.remove(taskId);
      };
    };
  };

  public shared ({ caller }) func bulkUpdateTasks(taskUpdates : [(TaskId, PartialTaskUpdate)]) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let taskStorage = getTaskStorage(caller);
    for ((taskId, updates) in taskUpdates.values()) {
      switch (taskStorage.get(taskId)) {
        case (null) {};
        case (?existingTask) {
          let updatedTask : Task = {
            id = taskId;
            clientName = switch (updates.clientName) {
              case (null) { existingTask.clientName };
              case (?newValue) { newValue };
            };
            taskCategory = switch (updates.taskCategory) {
              case (null) { existingTask.taskCategory };
              case (?newValue) { newValue };
            };
            subCategory = switch (updates.subCategory) {
              case (null) { existingTask.subCategory };
              case (?newValue) { newValue };
            };
            status = switch (updates.status) {
              case (null) { existingTask.status };
              case (?newValue) { ?newValue };
            };
            comment = switch (updates.comment) {
              case (null) { existingTask.comment };
              case (?newValue) { ?newValue };
            };
            assignedName = switch (updates.assignedName) {
              case (null) { existingTask.assignedName };
              case (?newValue) { ?newValue };
            };
            dueDate = switch (updates.dueDate) {
              case (null) { existingTask.dueDate };
              case (?newValue) { ?newValue };
            };
            assignmentDate = switch (updates.assignmentDate) {
              case (null) { existingTask.assignmentDate };
              case (?newValue) { ?newValue };
            };
            completionDate = switch (updates.completionDate) {
              case (null) { existingTask.completionDate };
              case (?newValue) { ?newValue };
            };
            bill = switch (updates.bill) {
              case (null) { existingTask.bill };
              case (?newValue) { ?newValue };
            };
            advanceReceived = switch (updates.advanceReceived) {
              case (null) { existingTask.advanceReceived };
              case (?newValue) { ?newValue };
            };
            outstandingAmount = switch (updates.outstandingAmount) {
              case (null) { existingTask.outstandingAmount };
              case (?newValue) { ?newValue };
            };
            paymentStatus = switch (updates.paymentStatus) {
              case (null) { existingTask.paymentStatus };
              case (?newValue) { ?newValue };
            };
            createdAt = existingTask.createdAt;
          };
          taskStorage.add(taskId, updatedTask);
        };
      };
    };
  };
};
