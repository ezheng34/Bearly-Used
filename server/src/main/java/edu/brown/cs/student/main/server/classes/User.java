package edu.brown.cs.student.main.server.classes;

public class User {

  public int clerkId;
  public String name;
  public String phoneNumber;
  public String school;

  public User(String clerkid, String name, String phoneNumber, String school) {
    this.clerkId = clerkId;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.school = school;
  }

  public int getId() {
    return this.clerkId;
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
