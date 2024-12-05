package edu.brown.cs.student.main.server.storage;

import edu.brown.cs.student.main.server.classes.Listing;
import java.sql.SQLException;
import java.util.List;

public interface StorageInterface {

  public void createUser(String email, String name, String phoneNumber, String school)
      throws SQLException;

  // all-purpose to get either all listings or filtered listings
  List<Listing> getListings(String category, float minPrice, float maxPrice, Sorter toSort);

  void createListing(
      Long sellerId,
      String title,
      boolean isAvailable,
      String description,
      float price,
      String category,
      String condition,
      String imageUrl,
      List<String> tags) throws SQLException;

  Listing getListingById();

  void updateListing();

  void deleteListing();

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
