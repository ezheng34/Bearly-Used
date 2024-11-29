package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class AddListingHandler implements Route {

  public StorageInterface dbHandler;

  public AddListingHandler(StorageInterface dbHandler) {
    this.dbHandler = dbHandler;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    Map<String, Object> responseMap = new HashMap<>();

    try {
      // TODO: probably need to take an email instead and convert that to the id
      Long sellerId = Long.valueOf(request.queryParams("seller_id"));
      String title = request.queryParams("title");
      boolean available = Boolean.parseBoolean(request.queryParams("available"));
      System.out.println("hi!!!");
      String description = request.queryParams("available");
      float price = Float.parseFloat(request.queryParams("price"));
      System.out.println("hi!!!");
      String category = request.queryParams("available");
      String condition = request.queryParams("available");
      String imageUrl = request.queryParams("available");

      //"http://localhost:3232/add-listing?seller_id=1&title=test&available=true&description=test&price=1.20&category=test&condition=bruh&image_url=test"

      System.out.println("hi");
      this.dbHandler.createListing(
          sellerId, title, available, description, price, category, condition, imageUrl);

      responseMap.put("response_type", "success");
    } catch (Exception e) {
      responseMap.put("response_type", "failure");
      responseMap.put("error", e.getMessage());
    }

    return Utils.toMoshiJson(responseMap);
  }
}
