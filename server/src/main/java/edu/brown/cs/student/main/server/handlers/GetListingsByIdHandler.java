// package edu.brown.cs.student.main.server.handlers;

// import edu.brown.cs.student.main.server.classes.Listing;
// import edu.brown.cs.student.main.server.storage.Sorter;
// import edu.brown.cs.student.main.server.storage.StorageInterface;
// import java.util.Arrays;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;
// import spark.Request;
// import spark.Response;
// import spark.Route;

// public class GetListingsByIdHandler implements Route {
//     public StorageInterface dbHandler;

//     public GetListingsByIdHandler(StorageInterface dbHandler) {
//     this.dbHandler = dbHandler;

//   @Override
//   public Object handle(Request request, Response response) {
//     Map<String, Object> responseMap = new HashMap<>();

//     try {

//         String idParam = request.params(":id");
//         Long id = validateListingId(idParam);

//         Listing listing = dbHandler.getListingById(id);

//         if (listing != null) {
//                 responseMap.put("response_type", "success");
//                 responseMap.put("listing", listing);
//             } else {
//                 responseMap.put("response_type", "failure");
//                 responseMap.put("error", "Listing not found");
//             }

//     } catch (IllegalArgumentException e) {
//       responseMap.put("response_type", "failure");
//       responseMap.put("error", "Invalid input: " + e.getMessage());
//     } catch (Exception e) {
//       responseMap.put("response_type", "failure");
//       responseMap.put("error", "Unexpected error: " + e.getMessage());
//     }

//     return Utils.toMoshiJson(responseMap);
//   }
// }

//   // validate inputs
//   private Long validateListingId(String listingIdStr) {
//     Long listingId = Long.parseLong(listingIdStr);
//     if (listingId < 0) {
//       throw new IllegalArgumentException("Listing ID is required");
//     }
//     return listingId;
//   }

// }
