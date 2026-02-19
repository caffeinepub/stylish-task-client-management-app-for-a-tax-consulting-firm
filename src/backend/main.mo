import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Type definitions
  type ClientId = Nat;
  type TaskId = Nat;
  type AssigneeId = Nat;
  type TodoId = Nat;

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

  public type Todo = {
    id : TodoId;
    title : Text;
    description : ?Text;
    completed : Bool;
    dueDate : ?Int;
    priority : ?Nat;
    createdAt : Int;
    updatedAt : Int;
  };

  public type PartialTaskUpdate = {
    id : TaskId;
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

  public type PartialTodoInput = {
    title : Text;
    description : ?Text;
    completed : Bool;
    dueDate : ?Int;
    priority : ?Nat;
  };

  public type TaskWithCaptain = {
    task : Task;
    captainName : ?Text;
  };

  // Persistent data structures
  let clients = Map.empty<Principal, Map.Map<ClientId, Client>>();
  let tasks = Map.empty<Principal, Map.Map<TaskId, Task>>();
  let assignees = Map.empty<Principal, Map.Map<AssigneeId, Assignee>>();
  let todos = Map.empty<Principal, Map.Map<TodoId, Todo>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextClientId = 0;
  var nextTaskId = 0;
  var nextAssigneeId = 0;
  var nextTodoId = 0;

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
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

  func getTodoStorage(caller : Principal) : Map.Map<TodoId, Todo> {
    switch (todos.get(caller)) {
      case (?todoMap) { todoMap };
      case (null) {
        let newTodoMap = Map.empty<TodoId, Todo>();
        todos.add(caller, newTodoMap);
        newTodoMap;
      };
    };
  };

  // ===== CRUD OPERATIONS =====

  // Assignees
  public shared ({ caller }) func createAssignee(assignee : PartialAssigneeInput) : async AssigneeId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let assigneeStorage = getAssigneeStorage(caller);
    if (not assigneeStorage.containsKey(assigneeId)) {
      Runtime.trap("Assignee does not exist");
    };
    assigneeStorage.remove(assigneeId);
  };

  public query ({ caller }) func getAssignee(assigneeId : AssigneeId) : async ?Assignee {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };
    let assigneeStorage = getAssigneeStorage(caller);
    assigneeStorage.get(assigneeId);
  };

  public query ({ caller }) func getAllAssignees() : async [Assignee] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view data, please sign in to continue");
    };

    let assigneeStorage = getAssigneeStorage(caller);
    assigneeStorage.values().toArray();
  };

  // Clients
  public shared ({ caller }) func createClient(client : PartialClientInput) : async ClientId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let clientStorage = getClientStorage(caller);
    if (not clientStorage.containsKey(clientId)) {
      Runtime.trap("Client does not exist");
    };
    clientStorage.remove(clientId);
  };

  public query ({ caller }) func getClient(clientId : ClientId) : async ?Client {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };
    let clientStorage = getClientStorage(caller);
    clientStorage.get(clientId);
  };

  public query ({ caller }) func getAllClients() : async [Client] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };
    let clientStorage = getClientStorage(caller);
    clientStorage.values().toArray();
  };

  // Tasks
  public shared ({ caller }) func createTask(
    clientName : Text,
    taskCategory : Text,
    subCategory : Text
  ) : async TaskId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let taskStorage = getTaskStorage(caller);
    switch (taskStorage.get(taskId)) {
      case (null) { Runtime.trap("Task does not exist") };
      case (?existingTask) {
        // Set assignmentDate if assignedName is updated with new value and assignmentDate is not provided
        let finalAssignmentDate = if (assignedName != null) {
          let isPreviouslyUnassigned = switch (existingTask.assignedName) {
            case (null) { true };
            case (?"") { true };
            case (_) { false };
          };

          if (
            isPreviouslyUnassigned and (assignedName != null) and (switch assignedName { case (?value) { value != "" }; case (null) { false } })
          ) {
            ?Time.now();
          } else {
            assignmentDate;
          };
        } else {
          assignmentDate;
        };

        // Set completionDate if status is set to "Completed" and completionDate is not provided
        let finalCompletionDate = switch (status, completionDate) {
          // If status is not provided, keep the existing completion date
          case (null, _) { completionDate };
          // If completionDate is already provided, use it regardless of status
          case (_, ?_) { completionDate };
          // Set completionDate only if status is "Completed" and no completionDate is provided
          case (?"Completed", null) {
            ?Time.now();
          };
          // All other cases, keep the existing completion date
          case (_, null) { null };
        };

        let updatedTask : Task = {
          id = taskId;
          clientName;
          taskCategory;
          subCategory;
          status;
          comment;
          assignedName;
          dueDate;
          assignmentDate = finalAssignmentDate;
          completionDate = finalCompletionDate;
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

  public shared ({ caller }) func bulkUpdateTasks(updates : [PartialTaskUpdate]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let taskStorage = getTaskStorage(caller);

    for (update in updates.values()) {
      switch (taskStorage.get(update.id)) {
        case (null) {}; // Ignore non-existent tasks
        case (?existingTask) {
          let updatedTask : Task = {
            id = existingTask.id;
            clientName = switch (update.clientName) {
              case (null) { existingTask.clientName };
              case (?value) { value };
            };
            taskCategory = switch (update.taskCategory) {
              case (null) { existingTask.taskCategory };
              case (?value) { value };
            };
            subCategory = switch (update.subCategory) {
              case (null) { existingTask.subCategory };
              case (?value) { value };
            };
            status = switch (update.status) {
              case (null) { existingTask.status };
              case (?value) { ?value };
            };
            comment = switch (update.comment) {
              case (null) { existingTask.comment };
              case (?value) { ?value };
            };
            assignedName = switch (update.assignedName) {
              case (null) { existingTask.assignedName };
              case (?value) { ?value };
            };
            dueDate = switch (update.dueDate) {
              case (null) { existingTask.dueDate };
              case (?value) { ?value };
            };
            assignmentDate = switch (update.assignmentDate) {
              case (null) { existingTask.assignmentDate };
              case (?value) { ?value };
            };
            completionDate = switch (update.completionDate) {
              case (null) { existingTask.completionDate };
              case (?value) { ?value };
            };
            bill = switch (update.bill) {
              case (null) { existingTask.bill };
              case (?value) { ?value };
            };
            advanceReceived = switch (update.advanceReceived) {
              case (null) { existingTask.advanceReceived };
              case (?value) { ?value };
            };
            outstandingAmount = switch (update.outstandingAmount) {
              case (null) { existingTask.outstandingAmount };
              case (?value) { ?value };
            };
            paymentStatus = switch (update.paymentStatus) {
              case (null) { existingTask.paymentStatus };
              case (?value) { ?value };
            };
            createdAt = existingTask.createdAt;
          };
          taskStorage.add(update.id, updatedTask);
        };
      };
    };
  };

  public shared ({ caller }) func deleteTask(taskId : TaskId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };

    let taskStorage = getTaskStorage(caller);
    if (not taskStorage.containsKey(taskId)) {
      Runtime.trap("Task does not exist");
    };
    taskStorage.remove(taskId);
  };

  public query ({ caller }) func getTask(taskId : TaskId) : async ?Task {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };
    let taskStorage = getTaskStorage(caller);
    taskStorage.get(taskId);
  };

  public query ({ caller }) func getAllTasks() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };
    let taskStorage = getTaskStorage(caller);
    taskStorage.values().toArray();
  };

  public query ({ caller }) func getAllTasksWithCaptain() : async [TaskWithCaptain] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Please sign in to continue");
    };
    let taskStorage = getTaskStorage(caller);
    let assigneeStorage = getAssigneeStorage(caller);

    let resultList = List.empty<TaskWithCaptain>();

    for (task in taskStorage.values()) {
      let captainName = switch (task.assignedName) {
        case (null) { null };
        case (?assignedName) {
          let filteredAssignees = assigneeStorage.filter(
            func(_id, assignee) { assignee.name == assignedName }
          );
          if (filteredAssignees.size() > 0) {
            switch (filteredAssignees.values().toArray()[0].captain) {
              case (null) { null };
              case (?name) { ?name };
            };
          } else {
            null;
          };
        };
      };

      resultList.add({ task; captainName });
    };

    resultList.toArray();
  };

  // Todos
  public shared ({ caller }) func createTodo(todo : PartialTodoInput) : async TodoId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create todos");
    };

    let todoId = nextTodoId;
    nextTodoId += 1;

    let newTodo : Todo = {
      id = todoId;
      title = todo.title;
      description = todo.description;
      completed = todo.completed;
      dueDate = todo.dueDate;
      priority = todo.priority;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    let todoStorage = getTodoStorage(caller);
    todoStorage.add(todoId, newTodo);
    todoId;
  };

  public shared ({ caller }) func updateTodo(todoId : TodoId, todo : PartialTodoInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update todos");
    };

    let todoStorage = getTodoStorage(caller);
    switch (todoStorage.get(todoId)) {
      case (null) { Runtime.trap("Todo does not exist") };
      case (?existingTodo) {
        let updatedTodo : Todo = {
          id = todoId;
          title = todo.title;
          description = todo.description;
          completed = todo.completed;
          dueDate = todo.dueDate;
          priority = todo.priority;
          createdAt = existingTodo.createdAt;
          updatedAt = Time.now();
        };
        todoStorage.add(todoId, updatedTodo);
      };
    };
  };

  public shared ({ caller }) func deleteTodo(todoId : TodoId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete todos");
    };

    let todoStorage = getTodoStorage(caller);
    if (not todoStorage.containsKey(todoId)) {
      Runtime.trap("Todo does not exist");
    };
    todoStorage.remove(todoId);
  };

  public query ({ caller }) func getTodo(todoId : TodoId) : async ?Todo {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view todos");
    };
    let todoStorage = getTodoStorage(caller);
    todoStorage.get(todoId);
  };

  public query ({ caller }) func getAllTodos() : async [Todo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view todos");
    };
    let todoStorage = getTodoStorage(caller);
    todoStorage.values().toArray();
  };
};
