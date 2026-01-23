import { RowDataPacket } from "mysql2";

export interface Student extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  age: number;
  created_at: Date;
}
