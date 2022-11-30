import { Request, Response } from 'express';

class User {
  async createUser(request: Request, response: Response) {
    const {name, email, password, confimPassword} = request.body;

    if(!name) {
      return response.status(422).json({'error': 'Name is required'});
    }
  }
}

export default new User();
