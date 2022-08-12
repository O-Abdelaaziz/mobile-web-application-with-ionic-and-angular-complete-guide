export class Booking {
  constructor(
    public id: string,
    public placeId: string,
    public placeTitle: string,
    public guestNumber: number,
    public userId: string,
  ) {
  }
}
