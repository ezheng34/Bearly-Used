package edu.brown.cs.student.main.server.storage;

import java.util.List;

public class MockStorage implements StorageInterface {

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
      String imageUrl) {}

  @Override
  public Listing getListingById() {
    return null;
  }

  @Override
  public void updateListing() {}

  @Override
  public void deleteListing() {}
}
