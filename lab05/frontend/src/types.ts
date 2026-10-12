export interface Orchid {
  orchidId: number;
  orchidName: string;
  natural: boolean;
  orchidDescription: string | null;
  orchidCategory: string | null;
  attractive: boolean;
  orchidURL: string | null;
}

export type OrchidDraft = Omit<
  Orchid,
  "orchidId" | "orchidDescription" | "orchidCategory" | "orchidURL"
> & {
  orchidDescription: string;
  orchidCategory: string;
  orchidURL: string;
};

export function isValidId(id: string | undefined): id is string {
  return (
    !!id &&
    /^\d+$/.test(id) &&
    Number.isSafeInteger(Number(id)) &&
    Number(id) > 0 &&
    Number(id) <= 2147483647
  );
}
