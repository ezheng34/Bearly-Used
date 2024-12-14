package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.classes.User;
import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;
import spark.Request;
import spark.Response;
import spark.Route;

// USER cant update their tags yet
// should user be allowed to switch their schools maybe not,

public class UpdateUserHandler implements Route {
  public StorageInterface dbHandler;

  public UpdateUserHandler(StorageInterface dbHandler) {
    this.dbHandler = dbHandler;
  }

  @Override
  public Object handle(Request request, Response response) {
    System.out.println("Received request to update user");
    Map<String, Object> responseMap = new HashMap<>();

    try {

      int userId = validateUserId(request.queryParams("user_id"));

      String name = request.queryParams("name");
      String phoneNumber = request.queryParams("phone_number");
      String school = request.queryParams("school");

      // EXAMPLE QUERY:
      // http://localhost:3232/update-user?user_id=9&name=robbie&phone_number=123-444-3333&school=risd

      User newUser =
          new User(
              userId,
              name != null ? validateName(name) : null,
              phoneNumber != null ? validatePhoneNumber(phoneNumber) : null,
              school != null ? validateSchool(school) : null);

      boolean updated = this.dbHandler.updateUser(userId, newUser);

      if (updated) {
        responseMap.put("response_type", "success");
        responseMap.put("message", "User updated successfully");
      } else {
        responseMap.put("response_type", "failure");
        responseMap.put("error", "User could not be updated");
      }
    } catch (IllegalArgumentException e) {
      // Handle input validation errors
      responseMap.put("response_type", "failure");
      responseMap.put("error", "Invalid input: " + e.getMessage());
    } catch (Exception e) {
      responseMap.put("response_type", "failure");
      responseMap.put("error", "Unexpected error: " + e.getMessage());
    }

    return Utils.toMoshiJson(responseMap);
  }

  // handlers to validate user input
  private int validateUserId(String userIdStr) {
    int userId = Integer.parseInt(userIdStr);
    if (userId < 0) {
      throw new IllegalArgumentException("Invalid user id inputted");
    }
    return userId;
  }

  private String validateName(String name) {
    if (name == null || name.trim().isEmpty()) {
      throw new IllegalArgumentException("Name is required");
    }
    if (name.trim().length() < 2) {
      throw new IllegalArgumentException("Name must be at least 2 characters long");
    }

    return name.trim();
  }

  private String validatePhoneNumber(String phoneNumber) {
    if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
      throw new IllegalArgumentException("Phone number is required");
    }
    // Regex for various formats:
    // (123) 456-7890, 123-456-7890, 1234567890
    if (!Pattern.matches(
        "^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$",
        phoneNumber.replaceAll("\\s", ""))) {
      throw new IllegalArgumentException("Invalid phone number format");
    }

    return phoneNumber.trim();
  }

  private String validateSchool(String school) {
    if (school == null || school.trim().isEmpty()) {
      throw new IllegalArgumentException("School is required");
    }
    if (!(school.equalsIgnoreCase("brown") || school.equalsIgnoreCase("RISD"))) {
      throw new IllegalArgumentException("School must be Brown or RISD");
    }

    return school.trim();
  }
}
