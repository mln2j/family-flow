export interface Family {
  id: string;
  name: string;
  ownerId: string;
  admins: string[];
  members: string[];
  joinRequests: string[];
  createdAt: Date;
}
