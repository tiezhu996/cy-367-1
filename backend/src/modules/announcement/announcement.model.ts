import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database";

export interface AnnouncementAttributes {
  id: number;
  title: string;
  content: string;
  isPinned: boolean;
  validFrom: string;
  validTo: string;
  status: "draft" | "published" | "archived";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type AnnouncementCreationAttributes = Optional<
  AnnouncementAttributes,
  "id" | "createdAt" | "updatedAt" | "createdBy" | "isPinned" | "status"
>;

export class Announcement
  extends Model<AnnouncementAttributes, AnnouncementCreationAttributes>
  implements AnnouncementAttributes
{
  public id!: number;
  public title!: string;
  public content!: string;
  public isPinned!: boolean;
  public validFrom!: string;
  public validTo!: string;
  public status!: "draft" | "published" | "archived";
  public createdBy!: string;
  public readonly createdAt!: string;
  public readonly updatedAt!: string;
}

Announcement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_pinned",
    },
    validFrom: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "valid_from",
    },
    validTo: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "valid_to",
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: "draft",
    },
    createdBy: {
      type: DataTypes.STRING(80),
      defaultValue: "admin",
      field: "created_by",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    sequelize,
    modelName: "Announcement",
    tableName: "announcements",
    timestamps: false,
  }
);
