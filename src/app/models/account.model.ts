export interface Account {
  id: string;
  name: string;
  balance: number;
  ownerId: string;
  editorIds: string[];
  familyId: string;
  isIncludedInFamilyTotal: boolean;
  createdAt: Date;
}
