package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.util.HashMap;
import java.util.Map;
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

      // "INSERT INTO users (email, name, phoneNumber, school) VALUES (? ? ? ?)";

      String email = request.queryParams("email");
      String name = request.queryParams("name");
      String phoneNumber = request.queryParams("phone_number");
      String school = request.queryParams("school");
      // EXAMPLE QUERY:
      // http://localhost:3232/add-user?email=abc@gmail.com&name=bob&phone-number=123&school=brown

      this.dbHandler.createUser(email, name, phoneNumber, school);

      responseMap.put("response_type", "success");
    } catch (Exception e) {
      responseMap.put("response_type", "failure");
      responseMap.put("error", e.getMessage());
    }

    return Utils.toMoshiJson(responseMap);
  }
}
