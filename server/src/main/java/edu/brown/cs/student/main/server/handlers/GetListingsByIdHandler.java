package edu.brown.cs.student.main.server.handlers;

import com.google.gson.Gson;
import edu.brown.cs.student.main.server.classes.Listing;
import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class GetListingsByIdHandler implements Route {
  public StorageInterface dbHandler;
  private Gson gson;

  public GetListingsByIdHandler(StorageInterface dbHandler) {
    this.dbHandler = dbHandler;
    this.gson = new Gson();
  }

  @Override
  public Object handle(Request request, Response response) {
    Map<String, Object> responseMap = new HashMap<>();

    try {
      Long listingId = validateListingId(request.queryParams("listing_id"));

      // EXAMPLE QUERY:
      // http://localhost:3232/get-listing-by-id?listing_id=2

      Listing listing = this.dbHandler.obtainListing(listingId);

      if (listing != null) {
        responseMap.put("response_type", "success");
        responseMap.put("listing", listing);

        // Manual serialization to JSON
        String jsonResponse = gson.toJson(responseMap);
        response.status(200); // Set the HTTP status code
        response.type("application/json"); // Set the response type to JSON
        return jsonResponse; // Return the serialized JSON string
      } else {
        responseMap.put("response_type", "failure");
        responseMap.put("error", "Listing not found");
        return gson.toJson(responseMap);
      }

      //         String idParam = request.params(":id");
      //         Long id = validateListingId(idParam);

      //         Listing listing = dbHandler.getListingById(id);

      //         if (listing != null) {
      //                 responseMap.put("response_type", "success");
      //                 responseMap.put("listing", listing);
      //             } else {
      //                 responseMap.put("response_type", "failure");
      //                 responseMap.put("error", "Listing not found");
      // } catch (IllegalArgumentException e) {
      //   responseMap.put("response_type", "failure");
      //   responseMap.put("error", "Invalid input: " + e.getMessage());
      // } catch (Exception e) {
      //   responseMap.put("response_type", "failure");
      //   responseMap.put("error", "Unexpected error: " + e.getMessage());
      // }

      //     return Utils.toMoshiJson(responseMap);
      //   }
    } catch (Exception e) {
      responseMap.put("response_type", "failure");
      responseMap.put("error", "Unexpected error: " + e.getMessage());
      return gson.toJson(responseMap);
    }
  }

  private Long validateListingId(String listingIdStr) {
    if (listingIdStr == null || listingIdStr.isEmpty()) {
      throw new IllegalArgumentException("Listing ID is required");
    }
    return Long.parseLong(listingIdStr);
  }

  //   // validate inputs
  //   private Long validateListingId(String listingIdStr) {
  //     Long listingId = Long.parseLong(listingIdStr);
  //     if (listingId < 0) {
  //       throw new IllegalArgumentException("Listing ID is required");
  //     }
  //     return listingId;

}
