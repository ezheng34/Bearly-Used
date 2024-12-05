package edu.brown.cs.student.main.server.classes;

import java.util.List;

/** Represents a listing */
public class Listing {
  public int id;
  public String title;
  public String description;
  public Float price;
  public String category;
  public String condition;
  public String ImageUrl;
  public List<String> tags;

  public boolean available;
}
