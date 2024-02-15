import { faker } from "@faker-js/faker/locale/en";
import { UserModel } from "../models/user.model";

export class UserFactory {
  getRandomUserData(): UserModel {
    const userData: UserModel = {
      userName: faker.person.firstName().replace(/[^A-Za-z]/g, ""),
      userAddress: faker.location.streetAddress(),
      userEmail: faker.internet.email(),
    };

    return userData;
  }
}
