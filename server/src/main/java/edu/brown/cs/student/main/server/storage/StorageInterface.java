package edu.brown.cs.student.main.server.storage;

import java.util.List;

public interface StorageInterface {

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
      String imageUrl);

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
