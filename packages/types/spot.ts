export type Spot = {
  id: string;
  userId: string;
  name: string;
  notes?: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  //catches: Catch[]; // assuming we have a Catch type defined
};
