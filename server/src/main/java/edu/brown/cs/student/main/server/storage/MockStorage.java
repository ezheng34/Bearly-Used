package edu.brown.cs.student.main.server.storage;

import edu.brown.cs.student.main.server.classes.Listing;
import edu.brown.cs.student.main.server.classes.User;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/** Mocked storage */
public class MockStorage implements StorageInterface {

  @Override
  public Long createUser(
      String clerkId, String email, String name, String phoneNumber, String school) {
    return null;
  }

  @Override
  public boolean updateUser(String clerkId, User updatedUser) {
    return false;
  }

  @Override
  public List<Listing> getListings(
      String title,
      String category,
      Float minPrice,
      Float maxPrice,
      List<String> tags,
      Sorter sorter) {
    return null;
  }

  @Override
  public Long createListing(
      String sellerId,
      String title,
      boolean isAvailable,
      String description,
      float price,
      String category,
      String condition,
      String imageUrl,
      List<String> tags) {
    Map<String, Object> responseMap = new HashMap<>();
    responseMap.put("response_type", "success");
    responseMap.put("sellerId", sellerId);
    responseMap.put("title", title);
    responseMap.put("available", isAvailable);
    responseMap.put("description", description);
    responseMap.put("price", price);
    responseMap.put("category", category);
    responseMap.put("condition", condition);
    responseMap.put("imageUrl", imageUrl);
    responseMap.put("tags", tags);

    Long listingId =
        Long(sellerId, title, isAvailable, description, price, category, condition, imageUrl, tags);

    return responseMap;
  }

  @Override
  public Optional<Listing> getListingById(Long listingId) {
    return null;
  }

  @Override
  public Listing obtainListing(Long listingId) {
    return null;
  }

  @Override
  public boolean updateListing(Long listingId, Listing updatedListing) {
    return false;
  }

  @Override
  public boolean deleteListing(Long listingId) {
    return false;
  }

  @Override
  public Map<String, Object> getUser(String clerkId) throws Exception {
    return null;
  }

  @Override
  public List<Map<String, Object>> getListingsBySellerId(String sellerId) throws Exception {
    return null;
  }
}
