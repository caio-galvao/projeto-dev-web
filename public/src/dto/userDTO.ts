export class UserDTO {
    id: string;
    name: string;
    type: string;
    
    constructor(user: any) {
      this.id = user.id;
      this.name = user.name;
      this.type = user.type;
    }
  }
  