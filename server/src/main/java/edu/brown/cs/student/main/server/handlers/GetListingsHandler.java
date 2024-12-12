package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.classes.Listing;
import edu.brown.cs.student.main.server.storage.Sorter;
import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import spark.Request;
import spark.Response;
import spark.Route;

public class GetListingsHandler implements Route {

  public StorageInterface dbHandler;

  public GetListingsHandler(StorageInterface dbHandler) {
    this.dbHandler = dbHandler;
  }

  @Override
  public Object handle(Request request, Response response) {
    Map<String, Object> responseMap = new HashMap<>();

    /*
      public List<Listing> getListings(
      Optional<String> category,
      Optional<Float> minPrice,
      Optional<Float> maxPrice,
      Optional<String> tag,
      Optional<Sorter> sorter) {
     */
    try {
      Long listingId = validateListingId(request.queryParams("listing_id"));

      String title = request.queryParams("category");
      Float minPrice = Float.parseFloat(request.queryParams("minPrice"));
      Float maxPrice = Float.parseFloat(request.queryParams("maxPrice"));
      String tagsParam = request.queryParams("tags");
      String sorterStr = request.queryParams("sorter");

      validatePrice(String.valueOf(minPrice));
      validatePrice(String.valueOf(maxPrice));
      List<String> tagsList = parseTags(tagsParam);


      Sorter sorter = null;

      if (sorterStr.equals("PRICE_ASC")) {
        sorter = Sorter.PRICE_ASC;
      } else if (sorterStr.equals("PRICE_DESC")){
        sorter = Sorter.PRICE_DESC;
      } else if (!sorterStr.isEmpty()){
        throw new IllegalArgumentException("Invalid input for sorter. It is either PRICE_ASC or PRICE_DESC");
      }

      List<Listing> res = this.dbHandler.getListings(
          Optional.of(title),
          Optional.of(minPrice),
          Optional.of(maxPrice),
          Optional.of(tagsList),
          Optional.of(sorter));

      responseMap.put("response_type", "success");
      responseMap.put("result", res);

    } catch (IllegalArgumentException e) {
      responseMap.put("response_type", "failure");
      responseMap.put("error", "Invalid input: " + e.getMessage());
    } catch (Exception e) {
      responseMap.put("response_type", "failure");
      responseMap.put("error", "Unexpected error: " + e.getMessage());
    }

    return Utils.toMoshiJson(responseMap);
  }

  // validate inputs
  private Long validateListingId(String listingIdStr) {
    if (listingIdStr == null || listingIdStr.isEmpty()) {
      throw new IllegalArgumentException("Listing ID is required");
    }
    return Long.parseLong(listingIdStr);
  }

  private String validateTitle(String title) {
    return title.trim();
  }

  private String validateDescription(String description) {
    return description.trim();
  }

  private float validatePrice(String priceStr) {
    float price = Float.parseFloat(priceStr);
    if (price < 0) {
      throw new IllegalArgumentException("Price cannot be negative");
    }
    return price;
  }

  private String validateCategory(String category) {
    return category.trim();
  }

  private String validateCondition(String condition) {
    return condition.trim();
  }

  private String validateImageUrl(String imageUrl) {
    return imageUrl.trim();
  }

  private List<String> parseTags(String tagsParam) {
    if (tagsParam == null || tagsParam.trim().isEmpty()) {
      return List.of();
    }
    return Arrays.stream(tagsParam.split(","))
        .map(String::trim)
        .filter(tag -> !tag.isEmpty())
        .toList();
  }
}
