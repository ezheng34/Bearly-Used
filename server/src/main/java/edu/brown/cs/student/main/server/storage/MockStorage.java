package edu.brown.cs.student.main.server.storage;

import edu.brown.cs.student.main.server.classes.Listing;
import java.util.List;
import java.util.Optional;

/** Mocked storage */
public class MockStorage implements StorageInterface {

  @Override
  public Long createUser(String email, String name, String phoneNumber, String school) {
    return null;
  }

  @Override
  public List<Listing> getListings(
      Optional<String> category,
      Optional<Float> minPrice,
      Optional<Float> maxPrice,
      Optional<String> tag,
      Optional<Sorter> sorter) {
    return null;
  }

  @Override
  public Long createListing(
      Long sellerId,
      String title,
      boolean isAvailable,
      String description,
      float price,
      String category,
      String condition,
      String imageUrl,
      List<String> tags) {
    return null;
  }

  @Override
  public Optional<Listing> getListingById(Long listingId) {
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
}
