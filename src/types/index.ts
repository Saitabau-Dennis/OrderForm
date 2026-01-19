export type User = {
  id: string;
  email: string;
  name?: string;
};

export type Store = {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  storeId: string;
};
