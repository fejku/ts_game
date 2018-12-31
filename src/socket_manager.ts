class User {
  socketId: string;
  hash: string;
  name: string;
}

class Room {
  users: User[];

  constructor(private _space: number) {
    this.users = [];
  }

  get space(): number {
    return this._space;
  }
}

export class SocketManager {
  private users: User[]; 
  private rooms: Room[];

  constructor() {
    this.users = [];
    this.rooms = [];  
    
    this.addEmptyRoom();
  }

  private getUser(userHash: string): User {
    return this.users.find(user => user.hash === userHash);
  }

  addUser(socketId: string, userHash: string): string {
    const user = new User();
    user.socketId = socketId;
    user.hash = userHash;
    this.users.push(user);

    return userHash;
  }

  updateUser(socketId: string, userHash: string): void {
    const user = this.getUser(userHash);
    if (user)
      user.socketId = socketId;
  }

  setUsername(userHash: string, username: string): void {
    const user = this.getUser(userHash);
    if (user)
      user.name = username;    
  }

  get Users(): User[] {
    return this.users;
  }

  private addEmptyRoom(): Room {
    const room = new Room(4);
    this.rooms.push(room);

    return room;
  }

  private canRoomBeAdded(room: Room, userHash: string): boolean {
    return (room.users.length !== room.space) && !(room.users.map(user => user.hash).includes(userHash));
  }

  addUserToRoom(userHash: string): void {
    const user = this.users.find(user => user.hash === userHash);
    if (user) {
      const emptyRoom = this.rooms.find(room => room.users.length !== room.space);
      if (emptyRoom) {      
        emptyRoom.users.push(user);
      } else {
        const room = this.addEmptyRoom();
        room.users.push(user);
      }
    }

    for (const room of this.rooms) {
      console.dir(room);
    }
  }
}