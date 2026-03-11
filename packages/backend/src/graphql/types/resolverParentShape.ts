type IdOnly<T> =
  T extends readonly (infer U)[] ? readonly IdOnly<U>[] :
    T extends (infer U)[] ? IdOnly<U>[] :
      T extends null | undefined ? T :
        T extends { id: unknown } ? Pick<T, 'id'> :
          never

export type ResolverParentShape<
  TSchema,
  TOmit extends keyof TSchema = never,
  TIdOnly extends keyof Omit<TSchema, TOmit> = never,
> = Omit<TSchema, TOmit | TIdOnly> & {
  [K in TIdOnly]: IdOnly<Omit<TSchema, TOmit>[K]>
}
