package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;
import spark.Request;
import spark.Response;
import spark.Route;

public class AddUserHandler implements Route {

  public StorageInterface dbHandler;

  public AddUserHandler(StorageInterface dbHandler) {
    this.dbHandler = dbHandler;
  }

  @Override
  public Object handle(Request request, Response response) {
    Map<String, Object> responseMap = new HashMap<>();

    try {
      String clerkId = request.queryParams("clerk_id");
      String email = validateEmail(request.queryParams("email"));
      String name = validateName(request.queryParams("name"));
      String phoneNumber = validatePhoneNumber(request.queryParams("phone_number"));
      String school = validateSchool(request.queryParams("school"));

      // TODO: error checking

      // EXAMPLE QUERY:
      // http://localhost:3232/add-user?clerk_id=12345&email=abc@gmail.com&name=bob&phone_number=1234567890&school=brown

      Long userId = this.dbHandler.createUser(clerkId, email, name, phoneNumber, school);

      responseMap.put("response_type", "success");
      responseMap.put("user_id", userId);
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

  // validation for user input
  private String validateEmail(String email) {
    if (email == null || email.trim().isEmpty()) {
      throw new IllegalArgumentException("Email is required");
    }

    // Basic email validation regex
    if (!Pattern.matches("^[A-Za-z0-9+_.-]+@(.+)$", email)) {
      throw new IllegalArgumentException("Invalid email format");
    }

    return email.trim();
  }

//  private String validateUserId(String userIdStr) {
//    int userId = Integer.parseInt(userIdStr);
//    if (userId < 0) {
//      throw new IllegalArgumentException("Invalid user id inputted");
//    }
//    return userIdStr;
//  }

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
