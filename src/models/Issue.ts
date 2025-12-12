import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./User";
import { IProject } from "./Project";

export type IssueStatus = "BACKLOG" | "IN_PROGRESS" | "REVIEW" | "DONE";
export type IssuePriority = "LOW" | "MEDIUM" | "HIGH";

export interface IIssue extends Document {
  title: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  project: IProject["_id"];
  reporter: IUser["_id"];
  assignee?: IUser["_id"];
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const IssueSchema = new Schema<IIssue>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["BACKLOG", "IN_PROGRESS", "REVIEW", "DONE"],
      default: "BACKLOG",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignee: { type: Schema.Types.ObjectId, ref: "User" },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

const Issue: Model<IIssue> = mongoose.models.Issue || mongoose.model<IIssue>("Issue", IssueSchema);

export default Issue;
