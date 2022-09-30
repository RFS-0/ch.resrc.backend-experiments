// NOTE: for simplicity's sake this is not really a proper value object representation
export interface Authentication {
  userId: string
  token: string
  tokenExpiresAfter: Date
}
