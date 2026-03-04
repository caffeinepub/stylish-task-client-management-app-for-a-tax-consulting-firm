import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

interface TaskListSkeletonProps {
  rows?: number;
  showCheckbox?: boolean;
}

export default function TaskListSkeleton({
  rows = 15,
  showCheckbox = true,
}: TaskListSkeletonProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {showCheckbox && <TableHead className="w-12" />}
            <TableHead>Client Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Sub-Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Assignment Date</TableHead>
            <TableHead>Completion Date</TableHead>
            <TableHead>Bill</TableHead>
            <TableHead>Advance</TableHead>
            <TableHead>Outstanding</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Comment</TableHead>
            {showCheckbox && <TableHead className="w-12" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows have no stable id
            <TableRow key={index}>
              {showCheckbox && (
                <TableCell>
                  <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                </TableCell>
              )}
              <TableCell>
                <div className="h-4 bg-muted rounded w-32 animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-4 bg-muted rounded w-24 animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-4 bg-muted rounded w-28 animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-6 bg-muted rounded w-20 animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-4 bg-muted rounded w-28 animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-4 bg-muted rounded w-24 animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-4 bg-muted rounded w-24 animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-4 bg-muted rounded w-24 animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-4 bg-muted rounded w-20 animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-4 bg-muted rounded w-20 animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-4 bg-muted rounded w-20 animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-4 bg-muted rounded w-24 animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-4 bg-muted rounded w-40 animate-pulse" />
              </TableCell>
              {showCheckbox && (
                <TableCell>
                  <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
