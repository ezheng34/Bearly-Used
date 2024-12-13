package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class GetUserHandler implements Route {

  private StorageInterface dbHandler;

  public GetUserHandler(StorageInterface dbHandler) {
    this.dbHandler = dbHandler;
  }

  @Override
  public Object handle(Request request, Response response) {
    Map<String, Object> responseMap = new HashMap<>();

    try {
      String userIdParam = request.queryParams("id");
      // validate id here
      if (userIdParam == null || userIdParam.trim().isEmpty()) {
        throw new IllegalArgumentException("User ID is required");
      }

      long userId = Long.parseLong(userIdParam);
      Map<String, Object> userData = this.dbHandler.getUser(userId);

      if (userData == null || userData.isEmpty()) {
        responseMap.put("response_type", "failure");
        responseMap.put("error", "User not found");
      } else {
        responseMap.put("response_type", "success");
        responseMap.put("user_data", userData);
      }
    } catch (NumberFormatException e) {
      responseMap.put("response_type", "failure");
      responseMap.put("error", "Invalid user ID format");
    } catch (IllegalArgumentException e) {
      responseMap.put("response_type", "failure");
      responseMap.put("error", "Invalid input: " + e.getMessage());
    } catch (Exception e) {
      responseMap.put("response_type", "failure");
      responseMap.put("error", "Unexpected error: " + e.getMessage());
    }

    return Utils.toMoshiJson(responseMap);
  }
}
