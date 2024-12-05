package edu.brown.cs.student.main.server.storage;

import edu.brown.cs.student.main.server.classes.Listing;
import io.github.cdimascio.dotenv.Dotenv;
import java.sql.*;
import java.util.List;

/** A handler for the Postgres database */
public class RealStorage implements StorageInterface {
  private String JDBC;

  public RealStorage() {
    Dotenv dotenv = Dotenv.load();
    this.JDBC = dotenv.get("JDBC");
  }

  /* USER FUNCTIONS */

  // Creates a user
  public void createUser(String email, String name, String phoneNumber, String school)
      throws SQLException {
    // SQL parameterization
    String sql = "INSERT INTO users (email, name, phone_number, school) VALUES (?, ?, ?, ?)";

    try {
      Connection connection = DriverManager.getConnection(this.JDBC);
      PreparedStatement statement = connection.prepareStatement(sql);

      statement.setString(1, email);
      statement.setString(2, name);
      statement.setString(3, phoneNumber);
      statement.setString(4, school);

      if (statement.executeUpdate() > 0) {
        System.out.println("User created successfully");
      } else {
        System.out.println("Failed to create user");
      }

    } catch (SQLException e) {
      System.err.println("Error connection to SQL Database: " + e.getMessage());
      throw e;
    }
  }

  /* LISTING FUNCTIONS */

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
      String imageUrl,
      List<String> tags) throws SQLException {

    // SQL parameterization
    String sql =
        "INSERT INTO listings (seller_id, title, available, description, price, category, "
            + "condition, image_url, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

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
      statement.setArray(9, connection.createArrayOf("TEXT", tags.toArray()));

      if (statement.executeUpdate() > 0) {
        System.out.println("Listing created successfully");
      } else {
        System.out.println("Failed to create listing");
      }

    } catch (SQLException e) {
      System.err.println("Error connection to SQL Database: " + e.getMessage());
      throw e;
    }
  }

  public Listing getListingById() {
    return null;
  }

  public void updateListing() {}

  public void deleteListing() {}
}
