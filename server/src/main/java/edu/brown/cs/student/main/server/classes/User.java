package edu.brown.cs.student.main.server.classes;

public class User {
  public int id;
  public String name;
  public String phoneNumber;
  public String school;

  public User(int id, String name, String phoneNumber, String school) {
    this.id = id;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.school = school;
  }

  public int getId() {
    return this.id;
  }

  public String getName() {
    return this.name;
  }

  public String getPhoneNumber() {
    return this.phoneNumber;
  }

  public String getSchool() {
    return this.school;
  }
}
