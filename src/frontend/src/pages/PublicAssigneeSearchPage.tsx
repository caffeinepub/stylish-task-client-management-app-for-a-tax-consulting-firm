import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckSquare, Search, Users } from "lucide-react";
import { useState } from "react";
import { PublicTasksTable } from "../components/publicSearch/PublicTasksTable";
import {
  usePublicAggregatedAssignees,
  usePublicAssigneeTasks,
} from "../hooks/publicAssigneeSearch";

export default function PublicAssigneeSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);

  const { data: assignees, isLoading: assigneesLoading } =
    usePublicAggregatedAssignees(searchTerm);
  const { data: tasks, isLoading: tasksLoading } =
    usePublicAssigneeTasks(selectedAssignee);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setSelectedAssignee(null);
  };

  const handleSelectAssignee = (assigneeName: string) => {
    setSelectedAssignee(assigneeName);
  };

  const handleBack = () => {
    setSelectedAssignee(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-4">
      <div className="container mx-auto max-w-6xl py-8">
        {/* Header with Logo */}
        <div className="mb-8 text-center">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-2xl" />
            <img
              src="/assets/generated/cswa-logo-new.dim_800x200.png"
              alt="CSWA Group of Companies"
              className="h-20 mx-auto relative"
            />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-highlight bg-clip-text text-transparent mb-2">
            Assignee Search
          </h1>
          <p className="text-muted-foreground">
            Search for assignees and view their tasks
          </p>
        </div>

        {/* Search Section */}
        {!selectedAssignee && (
          <Card className="mb-8 border-2 border-primary/20 shadow-glow-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Search Assignees
              </CardTitle>
              <CardDescription>
                Enter an assignee name to search for their tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="assignee-search"
                    className="text-base font-medium"
                  >
                    Assignee Name
                  </Label>
                  <Input
                    id="assignee-search"
                    type="text"
                    placeholder="Type assignee name..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="h-12 text-base"
                    autoFocus
                  />
                  <p className="text-sm text-muted-foreground">
                    Start typing to see matching assignees
                  </p>
                </div>

                {/* Results */}
                {assigneesLoading && (
                  <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Searching...
                    </p>
                  </div>
                )}

                {!assigneesLoading &&
                  searchTerm &&
                  assignees &&
                  assignees.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        No assignees found matching "{searchTerm}"
                      </p>
                    </div>
                  )}

                {!assigneesLoading && assignees && assignees.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Found {assignees.length} assignee
                      {assignees.length !== 1 ? "s" : ""}
                    </p>
                    <div className="grid gap-3">
                      {assignees.map((item) => (
                        <Card
                          key={item.assignee.id}
                          className="cursor-pointer hover:border-primary/40 transition-all hover:shadow-glow-primary"
                          onClick={() =>
                            handleSelectAssignee(item.assignee.name)
                          }
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {item.assignee.name}
                                </h3>
                                {item.assignee.captain && (
                                  <p className="text-sm text-muted-foreground">
                                    Captain: {item.assignee.captain}
                                  </p>
                                )}
                              </div>
                              <Badge
                                variant="secondary"
                                className="text-base px-3 py-1"
                              >
                                {item.taskCount.toString()}{" "}
                                {item.taskCount === 1n ? "task" : "tasks"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tasks Section */}
        {selectedAssignee && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Search
              </Button>
              <div>
                <h2 className="text-2xl font-bold">
                  Tasks for {selectedAssignee}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Viewing all tasks assigned to this team member
                </p>
              </div>
            </div>

            {tasksLoading && (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <div className="inline-block h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Loading tasks...
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {!tasksLoading && tasks && tasks.length === 0 && (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      No tasks found for this assignee
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {!tasksLoading && tasks && tasks.length > 0 && (
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle>Tasks ({tasks.length})</CardTitle>
                  <CardDescription>
                    All tasks assigned to {selectedAssignee}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PublicTasksTable tasks={tasks} />
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
