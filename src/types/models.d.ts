type ObjectID = {
  _id: string;
};

export type User = ObjectID & {
  name: string;
  email: string;
  available: boolean;
};
export type Mentor = User & {};
export type Application = ObjectID & {};
