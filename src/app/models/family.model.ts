export interface Family {
  id: string;
  name: string;
  ownerId: string;
  admins: string[];
  members: string[];
  createdAt: Date;
}
