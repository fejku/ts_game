export class User {
  socketId: string;
  hash: string;
  name: string;
}

enum Access { PUBLIC, PRIVATE };

abstract class Room {
  users: User[];

  constructor(private _space: number, private _access: Access = Access.PUBLIC) {
    this.users = [];
  }

  get space(): number {
    return this._space;
  }
}

class KolkoIKrzyzykRoom extends Room {
  constructor() {
    super(2);    
  }
}

export class KolkoIKrzyzykRooms {
  rooms: KolkoIKrzyzykRoom[];

  constructor() {
    this.rooms = [];
    //test
    this.addNewRoom();
    const user = new User();
    user.name = 'asd';
    this.rooms[0].users.push(user);
    this.addNewRoom();
    this.addNewRoom();
  }

  addNewRoom(): Room {
    const room = new KolkoIKrzyzykRoom();
    this.rooms.push(room);

    return room;
  }

  
}

export class SocketManager {
  private users: User[]; 

  kolkoIKrzyzykRooms: KolkoIKrzyzykRooms;

  constructor() {
    this.users = [];

    this.kolkoIKrzyzykRooms = new KolkoIKrzyzykRooms();
  }

  private getUser(userHash: string): User {
    return this.users.find(user => user.hash === userHash);
  }

  addUser(socketId: string, userHash: string): User {
    const user = new User();
    user.socketId = socketId;
    user.hash = userHash;
    this.users.push(user);

    return user;
  }

  updateUser(socketId: string, userHash: string): User {
    const user = this.getUser(userHash);
    if (user)
      user.socketId = socketId;
    return user;
  }

  setUsername(userHash: string, username: string): void {
    const user = this.getUser(userHash);
    if (user)
      user.name = username;    
  }

  getUserBySocketId(socketId: string): User {
    return this.users.find(user => user.socketId === socketId);
  };

  get Users(): User[] {
    return this.users;
  }

  addUserToWaitingRoom(userHash: string): Room[] {
    const user = this.users.find(user => user.hash === userHash);
    if (user) {
      

      return this.kolkoIKrzyzykRooms.rooms;
    }
  }

  getRoomList(): Room[] {
    return this.kolkoIKrzyzykRooms.rooms;
  }
}