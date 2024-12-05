package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
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
  public Object handle(Request request, Response response) {
    Map<String, Object> responseMap = new HashMap<>();

    try {
      // TODO: probably need to take an email instead and convert that to the id
      Long sellerId = Long.valueOf(request.queryParams("seller_id"));
      String title = request.queryParams("title");
      boolean available = Boolean.parseBoolean(request.queryParams("available"));
      String description = request.queryParams("description");
      float price = Float.parseFloat(request.queryParams("price"));
      String category = request.queryParams("category");
      String condition = request.queryParams("condition");
      String imageUrl = request.queryParams("image_url");

      // parse tags
      String tagsParam = request.queryParams("tags");
      List<String> tags = Arrays.asList(tagsParam.split(","));

      // EXAMPLE QUERY:
      // http://localhost:3232/add-listing?seller_id=1&title=Book&available=true&description=Great+book
      // &price=15.0&category=Books&condition=New&image_url=book.jpg&tags=[%22fiction%22,%22thriller%22]

      this.dbHandler.createListing(
          sellerId, title, available, description, price, category, condition, imageUrl, tags);

      responseMap.put("response_type", "success");
    } catch (Exception e) {
      responseMap.put("response_type", "failure");
      responseMap.put("error", e.getMessage());
    }

    return Utils.toMoshiJson(responseMap);
  }
}
