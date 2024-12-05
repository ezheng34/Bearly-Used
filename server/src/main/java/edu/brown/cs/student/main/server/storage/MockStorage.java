package edu.brown.cs.student.main.server.storage;

import edu.brown.cs.student.main.server.classes.Listing;
import java.util.List;

/** Mocked storage */
public class MockStorage implements StorageInterface {

  @Override
  public void createUser(String email, String name, String phoneNumber, String school) {}

  @Override
  public List<Listing> getListings(String category, float minPrice, float maxPrice, Sorter toSort) {
    return null;
  }

  @Override
  public void createListing(
      Long sellerId,
      String title,
      boolean isAvailable,
      String description,
      float price,
      String category,
      String condition,
      String imageUrl,
      List<String> tags) {}

  @Override
  public Listing getListingById() {
    return null;
  }

  @Override
  public void updateListing() {}

  @Override
  public void deleteListing() {}
}
