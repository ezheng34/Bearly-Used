package edu.brown.cs.student.main.server.storage;

import edu.brown.cs.student.main.server.classes.Listing;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface StorageInterface {

  Long createUser(String email, String name, String phoneNumber, String school)
      throws IllegalArgumentException, SQLException;

  // all-purpose to get either all listings or filtered listings
  List<Listing> getListings(
      String category, Float minPrice, Float maxPrice, List<String> tags, Sorter sorter);

  Long createListing(
      Long sellerId,
      String title,
      boolean isAvailable,
      String description,
      float price,
      String category,
      String condition,
      String imageUrl,
      List<String> tags)
      throws IllegalArgumentException, SQLException;

  Optional<Listing> getListingById(Long listingId);

  boolean updateListing(Long listingId, Listing updatedListing);

  boolean deleteListing(Long listingId);

  Map<String, Object> getUser(long userId) throws Exception;

  List<Map<String, Object>> getListingsBySellerId(long sellerId) throws Exception;

  //  void addDocument(String uid, String collection_id, String doc_id, Map<String, Object> data);
  //
  //  List<Map<String, Object>> getCollection(String uid, String collection_id)
  //      throws InterruptedException, ExecutionException;
  //
  //  void clearUser(String uid) throws InterruptedException, ExecutionException;
  //
  //  List<Map<String, Object>> getCollectionForAllUsers(String collection)
  //      throws ExecutionException, InterruptedException;
}
