export class User {
  constructor(
    public id: number = 0,
    public name: string = '',
    public first_name: string = '',
    public last_name: string = '',
    public email: string = '',
    public password: string = ''
  ) { }
}
