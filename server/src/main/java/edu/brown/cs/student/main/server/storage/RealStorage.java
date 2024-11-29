package edu.brown.cs.student.main.server.storage;

import io.github.cdimascio.dotenv.Dotenv;
import java.sql.*;
import java.util.List;

public class RealStorage implements StorageInterface {

  private String DB_PW;
  private String DB_ENDPOINT;
  private String DB_KEY;
  private String JDBC;

  public RealStorage() {
    Dotenv dotenv = Dotenv.load();
    this.DB_PW = dotenv.get("DB_PASSWORD");
    this.DB_ENDPOINT = dotenv.get("DB_ENDPOINT");
    this.DB_KEY = dotenv.get("DB_KEY");
    this.JDBC = dotenv.get("JDBC");
  }

  public List<Listing> getListings(String category, float minPrice, float maxPrice, Sorter toSort) {
    return null;
  }

  public void createListing(
      Long sellerId,
      String title,
      boolean isAvailable,
      String description,
      float price,
      String category,
      String condition,
      String imageUrl) {

    // SQL parameterization
    String sql =
        "INSERT INTO listings (seller_id, title, available, description, price, category, "
            + "condition, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    System.out.println(sql);

    try {
      Connection connection = DriverManager.getConnection(this.JDBC);
      PreparedStatement statement = connection.prepareStatement(sql);

      statement.setLong(1, sellerId);
      statement.setString(2, title);
      statement.setBoolean(3, isAvailable);
      statement.setString(4, description);
      statement.setFloat(5, price);
      statement.setString(6, category);
      statement.setString(7, condition);
      statement.setString(8, imageUrl);

      if (statement.executeUpdate() > 0) {
        System.out.println("Listing created successfully");
      } else {
        System.out.println("Failed to create listing");
      }

    } catch (SQLException e) {
      System.err.println("Error connection to SQL Database: " + e.getMessage());
    }
  }

  public Listing getListingById() {
    return null;
  }

  public void updateListing() {}

  public void deleteListing() {}
}
