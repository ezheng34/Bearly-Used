package edu.brown.cs.student;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.server.handlers.AddListingHandler;
import edu.brown.cs.student.main.server.handlers.AddUserHandler;
import edu.brown.cs.student.main.server.handlers.DeleteListingHandler;
import edu.brown.cs.student.main.server.handlers.GetListingsByIdHandler;
import edu.brown.cs.student.main.server.handlers.GetListingsHandler;
import edu.brown.cs.student.main.server.handlers.GetUserHandler;
import edu.brown.cs.student.main.server.handlers.GetUserListingsHandler;
import edu.brown.cs.student.main.server.handlers.UpdateListingHandler;
import edu.brown.cs.student.main.server.handlers.UpdateUserHandler;
import edu.brown.cs.student.main.server.storage.RealStorage;
import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.io.IOException;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import okio.Buffer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import spark.Spark;

public class APITests {
  static StorageInterface dbHandler;

  @BeforeAll
  public static void setupOnce() {
    Spark.port(0);
    Logger.getLogger("").setLevel(Level.WARNING);
    dbHandler = new RealStorage();
  }

  private final Type mapStringObject =
      Types.newParameterizedType(Map.class, String.class, Object.class);
  private JsonAdapter<Map<String, Object>> adapter;

  private static HttpURLConnection tryRequest(String apiCall) throws IOException {
    // Configure the connection (but don't actually send the request yet)
    URL requestURL = new URL("http://localhost:" + Spark.port() + "/" + apiCall);
    HttpURLConnection clientConnection = (HttpURLConnection) requestURL.openConnection();

    // The default method is "GET", which is what we're using here.
    // If we were using "POST", we'd need to say so.
    clientConnection.setRequestMethod("GET");

    clientConnection.connect();
    return clientConnection;
  }

  @BeforeEach
  public void setup() {
    Spark.get("add-listing", new AddListingHandler(dbHandler));
    Spark.get("add-user", new AddUserHandler(dbHandler));
    Spark.get("delete-listing", new DeleteListingHandler(dbHandler));
    Spark.get("get-listing-by-id", new GetListingsByIdHandler(dbHandler));
    Spark.get("get-listings", new GetListingsHandler(dbHandler));
    Spark.get("get-user", new GetUserHandler(dbHandler));
    Spark.get("get-user-listings", new GetUserListingsHandler(dbHandler));
    Spark.get("update-listing", new UpdateListingHandler(dbHandler));
    Spark.get("update-user", new UpdateUserHandler(dbHandler));

    Spark.init();
    Spark.awaitInitialization(); // don't continue until the server is listening
    Moshi moshi = new Moshi.Builder().build();
    adapter = moshi.adapter(mapStringObject);
  }

  @AfterEach
  public void teardown() {
    Spark.unmap("/add-listing");
    Spark.unmap("/add-user");
    Spark.unmap("/add-delete-listing");
    Spark.unmap("/get-listing-by-id");
    Spark.unmap("/get-listings");
    Spark.unmap("/get-user");
    Spark.unmap("/get-user-listings");
    Spark.unmap("/update-listing");
    Spark.unmap("/update-user");
    Spark.stop();
    Spark.awaitStop();
  }

  /* =================================== AddListingHandler tests ==============================================*/
  // testing successful api call for AddListing endpoint
  @Test
  public void testAddListingSuccess() throws IOException {
    // sellerId, title, available, description, price, category, condition, imageUrl, tags)
    HttpURLConnection loadConnection =
        tryRequest(
            "add-listing?seller_id=100&title=pencil&available=true&description=yellow+pencil&price=0.01&category=other&condition=New&image_url=book.jpg&tags=fiction,thriller");

    assertEquals(200, loadConnection.getResponseCode());
    Map<String, Object> responseBody =
        adapter.fromJson(new Buffer().readFrom(loadConnection.getInputStream()));
    assert responseBody != null;
    assertEquals("success", responseBody.get("response_type"));
  }

  // testing unsuccessful api call for AddListing endpoint bc params blank
  @Test
  public void testAddListingParamsEmpty() throws IOException {
    // sellerId, title, available, description, price, category, condition, imageUrl, tags)
    HttpURLConnection loadConnection =
        tryRequest(
            "add-listing?seller_id=&title=&available=&description=descriptionnnnn&price=69.69&category=&condition=&image_url=&tags=");

    assertEquals(200, loadConnection.getResponseCode());
    Map<String, Object> responseBody =
        adapter.fromJson(new Buffer().readFrom(loadConnection.getInputStream()));
    assert responseBody != null;
    assertEquals("failure", responseBody.get("response_type"));
    assertEquals("Invalid input: Seller ID is required", responseBody.get("error"));
  }

  // testing unsuccessful api call for AddListing endpoint bc wrong input type
  @Test
  public void testAddListingWrongInput() throws IOException {
    // sellerId, title, available, description, price, category, condition, imageUrl, tags)
    HttpURLConnection loadConnection =
        tryRequest(
            "add-listing?seller_id=6&title=titleeeeee&available=&description=descriptionnnnn&price=s&category=&condition=&image_url=&tags=");

    assertEquals(200, loadConnection.getResponseCode());
    Map<String, Object> responseBody =
        adapter.fromJson(new Buffer().readFrom(loadConnection.getInputStream()));
    assert responseBody != null;
    assertEquals("failure", responseBody.get("response_type"));
    assertEquals("Invalid input: For input string: \"s\"", responseBody.get("error"));
  }
}
