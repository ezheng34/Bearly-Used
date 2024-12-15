package edu.brown.cs.student.main.server.classes;

import java.util.List;

/** Represents a listing */
public class Listing {
  public Long id;
  public String seller_id;
  public String title;
  public String description;
  public Float price;
  public String category;
  public String condition;
  public String image_url;
  public List<String> tags;

  public boolean available;

  public Listing(
      Long id,
      String seller_id,
      String title,
      String description,
      Float price,
      String category,
      String condition,
      String img,
      List<String> tags,
      boolean avail) {
    this.id = id;
    this.seller_id = seller_id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.category = category;
    this.condition = condition;
    this.image_url = img;
    this.tags = tags;
    this.available = avail;
  }

  public Float getPrice() {
    return this.price;
  }

  public String getSellerId() {
    return this.seller_id;
  }

  public String getTitle() {
    return this.title;
  }

  public String getDescription() {
    return this.description;
  }

  public String getCategory() {
    return this.category;
  }

  public String getCondition() {
    return this.condition;
  }

  public String getImageUrl() {
    return this.image_url;
  }

  public boolean getAvailable() {
    return this.available;
  }

  public List<String> getTags() {
    return this.tags;
  }
}
